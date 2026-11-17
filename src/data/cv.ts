/**
 * 档案页事实源：只放可核验的履历信息。
 * 项目列表直接复用 works.ts，避免同一件事维护两份。
 * TOOLKIT 供主页 About 使用；CV_SKILLS 是档案页专用的分类技能清单。
 */

export const CV_UPDATED = '2026.11'

/** 主页 About 使用 */
export const TOOLKIT = [
  'Python', 'JavaScript / HTML / CSS', 'Three.js', 'FastAPI / Supabase',
  'LLM API / Prompt', 'BLE / PCB 联调', 'Pandas / NumPy', 'LaTeX / Git',
]

/** 同一赛事 / 评选体系下的多级结果 */
export interface CvSub {
  label: string
  note?: string
}

export interface CvItem {
  when: string
  title: string
  note?: string
  points?: string[]
  /** 按时间倒序排列，最亮的结果在前 */
  subs?: CvSub[]
}

export const EDUCATION: CvItem[] = [
  {
    when: '2024.09 — 在读',
    title: '哈尔滨工业大学（深圳）· 工科试验班（计算机与电子通信）',
    note: '计算机科学与技术· GPA 3.3 / 4.0 · 经济学（辅）',
    points: [
      '主修课程：机器学习、软件构造、数据结构等',
      '辅修课程：微观 / 宏观经济学、基础计量经济学（Stata）',
      '语言：CET-4、CET-6',
    ],
  },
]

export const AWARDS: CvItem[] = [
  {
    when: '2026.07 — 09',
    title: '腾讯云黑客松 · 游戏开发挑战赛',
    note: '番客：银信之海',
    subs: [
      { label: '全球总决赛 · 优胜奖' },
      { label: '华南赛区第 3 名', note: '769 分 / 1232 支队伍 · 晋级路演' },
    ],
  },
  {
    when: '2026.05',
    title: '中国大学生计算机设计大赛 · 省级三等奖',
    note: '粒筑千相 · 已转化为大创项目《智筑千相》持续推进',
  },
  {
    when: '2026',
    title: '第八届黑龙江省大学生网络文化影像创意汇 · 二等奖',
    note: '短片《对白——德化白瓷的时光对话》· 创作与监制',
  },
  {
    when: '2026.02',
    title: '美国大学生数学建模竞赛 C 题 · Outstanding Winner（O 奖）',
    note: '队长 · 团队唯一代码背景成员 · 独立完成 5 个 task 与 27 页英文论文 · 全球前 1%',
  },
  {
    when: '2025.11',
    title: '大一年度项目一等奖',
    note: 'MIA-box · 综合评分第 1 / 66',
  },
  {
    when: '2025.09',
    title: '哈工深暑期社会实践',
    subs: [
      { label: '校「十佳团队」' },
      { label: '校「十佳项目」' },
      { label: '个人「优秀个人」' },
    ],
  },
  {
    when: '2024.12 — 2025.05',
    title: '哈工深辩论赛',
    note: '队长',
    subs: [
      { label: '第十八届校辩论赛 · 冠军', note: '全程最佳辩手' },
      { label: '新生杯 · 季军' },
    ],
  },
  {
    when: '2025 — 2026',
    title: '哈工深本科生学业奖学金（单项奖）· 优秀学生 · 优秀团员',
    note: '本科在读期间获评',
  },
]

export const INTERNSHIP: CvItem[] = [
  {
    when: '2026.03 — 09',
    title: '上海宏茂供应链 · AI 技术探索实习',
    note: '技术探索与自动化运营',
    points: [
      '宠物行业多元信息自动化采集 Pipeline：Python + LLM 结构化抽取、清洗与去重，支撑业务分析与决策',
      '业务流程智能化调研：多源信息流程优化、追踪雷达产品迭代与 GEO 方向探索，输出多项可落地提效方案',
      '宠物友好品牌官网从 0 到 1 开发与部署：纯静态架构，含内容组织、信息层级与视觉呈现',
    ],
  },
]

/** 校园与社会实践：项目之外、可核验的长期投入 */
export const CAMPUS: CvItem[] = [
  {
    when: '2024 — 2025',
    title: '紫丁香辩论队',
    note: '成员 / 校赛队长 · 2025 年后任新生教练',
    points: [
      '新生杯季军（队长）→ 第十八届校辩论赛冠军 & 全程最佳辩手（队长）',
    ],
  },
  {
    when: '2025',
    title: '「釉见青春」思政实践队',
    note: '核心成员 · 校「十佳团队」「十佳项目」+ 个人「优秀个人」· 福建省「扬帆计划」官方认证',
    points: [
      '短片《对白——德化白瓷的时光对话》创作与监制，获省级二等奖',
      '宣传网页搭建、超万字图文材料产出',
    ],
  },
  {
    when: '2024 — 2026',
    title: '国旗护卫队 / 赛会志愿服务',
    note: '国旗护卫队成员（重大仪式任务）· 十五运暨残特奥赛会志愿者，服务超 100 小时',
  },
]

/** 项目分组：优先类型，组内按时间倒序 */
export interface CvProjectGroup {
  label: string
  ids: string[]
}

export const PROJECT_GROUPS: CvProjectGroup[] = [
  { label: '游戏 / 互动', ids: ['spotlight', 'cardgaming', 'fanke'] },
  { label: '软硬件一体', ids: ['fpga-music-box', 'cushion'] },
  { label: 'AI 与 Web 产品', ids: ['lizhu', 'clivigil', 'guaihaha', 'pawprint'] },
  { label: '课设 / 竞赛', ids: ['mcm', 'hongjiang', 'mia-box'] },
]

export interface CvSkillGroup {
  label: string
  items: string[]
}

export const CV_SKILLS: CvSkillGroup[] = [
  { label: '编程 / 语言', items: ['Python', 'C', 'JavaScript / HTML / CSS', 'C#（了解）'] },
  { label: '前端 / 全栈', items: ['React / Vite', 'Three.js', 'Chart.js', 'FastAPI', 'Supabase', 'Web Bluetooth'] },
  { label: '游戏 / 互动', items: ['Godot 4', 'Unity（了解）', '卡牌状态机 / 多分支叙事', '粒子点云'] },
  { label: '硬件 / 嵌入式', items: ['Verilog / FPGA（Gowin）', 'ESP32 / MSPM0', 'BLE 协议设计', 'PCB 焊接与电路调试', 'I2S 音频链路'] },
  { label: 'AI / 数据 / 工具', items: ['LLM API / Prompt', 'ASR / TTS', 'Pandas / NumPy', 'Matplotlib / Seaborn', 'Stata', 'LaTeX / Git / Markdown'] },
]

export interface CvContact {
  label: string
  value: string
  href?: string
}

export const CV_CONTACTS: CvContact[] = [
  { label: 'GITHUB', value: '@Lin23-071', href: 'https://github.com/Lin23-071' },
  { label: 'EMAIL', value: '2024311515@stu.hit.edu.cn', href: 'mailto:2024311515@stu.hit.edu.cn' },
  { label: 'QQ', value: '2236659454' },
  { label: 'WECHAT', value: 'L13376987385' },
]
