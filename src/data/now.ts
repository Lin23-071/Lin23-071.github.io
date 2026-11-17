/**
 * Now —— 主页 03 区块的内容：会过期的近期事项。
 * 判据：半年后还成立的（性格、审美、长期兴趣）放 04 / About；
 * 带日期、过一阵就要换的放这里。
 * 想更新这一栏，只改这个文件（NOW_UPDATED 记得一起改）。
 */

export const NOW_UPDATED = '2026.11.15'

export const NOW_LINE = '最近刚结束和正在做的一些事项'

export interface NowItem {
  no: string
  tag: string
  title: string
  note: string
}

export const NOW_ITEMS: NowItem[] = [
  {
    no: '01',
    tag: 'PROJECT / 在做',
    title: '合鸣 HandBand · FPGA 音乐盒',
    note: '11月初结束，待归档，后续考虑继续开发',
  },
  {
    no: '02',
    tag: 'REVIEW / 复盘',
    title: '复盘前三个月',
    note: '整理前三个月的比赛内容与结果，顺手把个人站点更新了一遍。',
  },
  {
    no: '03',
    tag: 'THESIS / 毕设',
    title: '毕设前期准备',
    note: '前期准备中，最近在和老师沟通。',
  },
]
