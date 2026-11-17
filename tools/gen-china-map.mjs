/**
 * 生成 hero 点阵中国地图的数据。
 *
 * 用法：
 *   1. 下载省级边界（582 KB）：
 *      Invoke-WebRequest "https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json" -OutFile china.json
 *   2. node tools/gen-china-map.mjs china.json
 *
 * 产物：src/data/china-map.ts（静态内嵌，运行时零请求）
 */
import fs from 'node:fs'

/** 可传多个文件：主文件不含港澳，需另附 810000.json / 820000.json */
const SRCS = process.argv.slice(2)
if (!SRCS.length) SRCS.push('china.json')
const OUT = 'src/data/china-map.ts'
const W = 460
const H = 460
const STEP = 3.6 // 越小越密；3.6 约 5000 点，小省（京沪津）才看得见
const FOCUS = new Set(['福建省', '广东省'])
const LIT = new Set(['福建省', '广东省', '湖北省', '上海市', '北京市', '河北省', '云南省', '江苏省', '湖南省'])

const feats = SRCS.flatMap((p) => JSON.parse(fs.readFileSync(p, 'utf8')).features || []).filter(
  (f) => f.geometry && f.properties?.name && !/南海诸岛/.test(f.properties.name),
)

/** 墨卡托投影：经度保持线性，纬度按 tan 拉伸 */
const project = (lon, lat) => [
  lon,
  (Math.log(Math.tan(Math.PI / 4 + (lat * Math.PI) / 360)) * 180) / Math.PI,
]

const polysOf = (g) =>
  g.type === 'Polygon' ? [g.coordinates] : g.type === 'MultiPolygon' ? g.coordinates : []

let minX = Infinity
let maxX = -Infinity
let minY = Infinity
let maxY = -Infinity
for (const f of feats) {
  for (const poly of polysOf(f.geometry)) {
    for (const ring of poly) {
      for (const c of ring) {
        if (!c || c.length < 2) continue
        const [x, y] = project(c[0], c[1])
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }
}

const scale = Math.min(W / (maxX - minX), H / (maxY - minY))
const ox = (W - (maxX - minX) * scale) / 2
const oy = (H - (maxY - minY) * scale) / 2

const toPt = (lon, lat) => {
  const [x, y] = project(lon, lat)
  return [(x - minX) * scale + ox, (maxY - y) * scale + oy]
}

const regions = feats.map((f) => {
  const polys = polysOf(f.geometry).map((poly) =>
    poly
      .map((ring) => ring.filter((c) => c && c.length >= 2).map((c) => toPt(c[0], c[1])))
      .filter((ring) => ring.length >= 3),
  )
  let x0 = Infinity
  let x1 = -Infinity
  let y0 = Infinity
  let y1 = -Infinity
  for (const poly of polys) {
    for (const ring of poly) {
      for (const [x, y] of ring) {
        if (x < x0) x0 = x
        if (x > x1) x1 = x
        if (y < y0) y0 = y
        if (y > y1) y1 = y
      }
    }
  }
  const c = f.properties.centroid || f.properties.center
  return {
    name: f.properties.name,
    adcode: f.properties.adcode ?? 0,
    polys,
    bbox: [x0, y0, x1, y1],
    centroid: c ? toPt(c[0], c[1]) : null,
    pts: [],
  }
})

/** 射线法：点是否在环内 */
function inRing(px, py, ring) {
  let inside = false
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const [xi, yi] = ring[i]
    const [xj, yj] = ring[j]
    if (yi > py !== yj > py && px < ((xj - xi) * (py - yi)) / (yj - yi) + xi) inside = !inside
  }
  return inside
}

/** 支持多边形与孔洞 */
function inPoly(px, py, poly) {
  if (!inRing(px, py, poly[0])) return false
  for (let i = 1; i < poly.length; i++) if (inRing(px, py, poly[i])) return false
  return true
}

let total = 0
for (let gy = 0; gy <= H; gy += STEP) {
  for (let gx = 0; gx <= W; gx += STEP) {
    for (const r of regions) {
      const [x0, y0, x1, y1] = r.bbox
      if (gx < x0 || gx > x1 || gy < y0 || gy > y1) continue
      if (r.polys.some((poly) => inPoly(gx, gy, poly))) {
        r.pts.push(+gx.toFixed(1), +gy.toFixed(1))
        total += 1
        break
      }
    }
  }
}

// 香港 / 澳门小于一个格子，采样会 0 点；用质心补一个点，保证地图完整
for (const r of regions) {
  if (!r.pts.length && r.centroid) {
    r.pts.push(+r.centroid[0].toFixed(1), +r.centroid[1].toFixed(1))
    total += 1
  }
}

const body = regions
  .filter((r) => r.pts.length > 0)
  .map((r) => {
    const cx = +((r.bbox[0] + r.bbox[2]) / 2).toFixed(1)
    const cy = +((r.bbox[1] + r.bbox[3]) / 2).toFixed(1)
    const lit = LIT.has(r.name) ? 'true' : 'false'
    const focus = FOCUS.has(r.name) ? 'true' : 'false'
    return `  { name: '${r.name}', adcode: ${r.adcode}, cx: ${cx}, cy: ${cy}, lit: ${lit}, focus: ${focus}, pts: [${r.pts.join(',')}] },`
  })
  .join('\n')

const file = `/**
 * 自动生成，请勿手改。
 * 生成方式：node tools/gen-china-map.mjs china.json
 * 数据源：https://geo.datav.aliyun.com/areas_v3/bound/100000_full.json
 *
 * pts 为扁平坐标 [x0, y0, x1, y1, ...]，坐标系即 ${W}×${H} 的 viewBox（墨卡托投影后等比缩放）
 */
export const MAP_W = ${W}
export const MAP_H = ${H}

export interface MapRegion {
  name: string
  adcode: number
  /** 省域包围盒中心，用于挂标签 */
  cx: number
  cy: number
  /** 点到即亮 */
  lit: boolean
  /** 重点点亮（福建、广东） */
  focus: boolean
  pts: number[]
}

export const REGIONS: MapRegion[] = [
${body}
]
`

fs.writeFileSync(OUT, file)
console.log(`regions=${regions.filter((r) => r.pts.length).length} points=${total} bytes=${Buffer.byteLength(file)}`)
console.log(`lit=${LIT.size} focus=${FOCUS.size}`)
