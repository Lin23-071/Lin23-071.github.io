/** 按「做出来的形态」分类，不按技术栈或奖项——后者是档案页的视角 */
export type WorkCategory = 'made' | 'built' | 'imagined'

export const CATEGORY_ORDER: WorkCategory[] = ['made', 'built', 'imagined']

export const CATEGORY_LABEL: Record<WorkCategory, string> = {
  made: 'MADE / 成品',
  built: 'BUILT / 系统',
  imagined: 'IMAGINED / 构想',
}

/** 无截图项目的文字封面：排版占位，不假装是缺图 */
export interface WorkCover {
  kicker: string
  big: string
  foot: string
}

export interface Work {
  id: string
  title: string
  /** 角色 / 时间 / 一句话定位 */
  subtitle: string
  description: string
  /** 列表页的两行短摘要；详情页用 description */
  summary?: string[]
  /** 详情页里的核心工作要点 */
  points: string[]
  tags: string[]
  /** AI 能力定位：标签列首位的高亮胶囊 */
  aiTag?: string
  href?: string
  image?: string
  /** 灯箱里可翻页的图集（首图与 image 一致） */
  images?: string[]
  imageAlt?: string
  /** 右上角的高亮事实（分数、名次、规模） */
  highlight?: string
  /** 信息待补：不显示外链，标「整理中」 */
  draft?: boolean
  /** 主次：featured 走整行展示，其余收进分类索引 */
  featured?: boolean
  /** 精选区内的展示顺序（1 起） */
  order?: number
  cover?: WorkCover
  /** 详情页底部的相关链接（笔记、论文、附件） */
  links?: { label: string; href: string }[]
  /** 外链按钮文案（默认「访问项目」）；指向论文时可写「论文 PDF」 */
  hrefLabel?: string
  /**
   * 演示视频：把 mp4 放进 public/videos/，在条目里填
   * video: { src: '/videos/xxx.mp4', poster: '/works/xxx.jpg', caption: '…' }
   * 详情页会渲染带封面的 <video controls preload="none">，不拖慢首屏。
   */
  video?: {
    src: string
    poster?: string
    caption?: string
  }
  category: WorkCategory
}

/** 分类、主次、顺序集中在这里改，不动下面的原始档案 */
const CLASSIFY: Record<string, {
  category: WorkCategory
  featured?: boolean
  order?: number
  cover?: WorkCover
}> = {
  mcm: { category: 'built', featured: true, order: 1 },
  fanke: { category: 'made', featured: true, order: 2 },
  lizhu: { category: 'made', featured: true, order: 3 },
  guaihaha: { category: 'made', featured: true, order: 4 },
  'fpga-music-box': { category: 'built', featured: true, order: 5 },
  cushion: { category: 'made' },
  pawprint: { category: 'made' },
  'mia-box': { category: 'built' },
  hongjiang: { category: 'imagined' },
  spotlight: { category: 'imagined' },
  cardgaming: {
    category: 'built',
    cover: { kicker: 'HACKATHON / 工作台', big: 'CardGaming', foot: '五模块闭环 · 文件即事实源' },
  },
  clivigil: {
    category: 'made',
    cover: { kicker: 'CLIENT WORK / 科研官网', big: 'CliVigil', foot: '零构建 · 8 区块 · 断网可跑' },
  },
}

type RawWork = Omit<Work, 'category'>

/**
 * 作品档案 —— 依据简历、时间线梳理文档与《作品部分展示》整理。
 * 图片在 public/works/；相关笔记与论文附件见各条目的 links。
 */
const RAW_WORKS: RawWork[] = [
  {
    id: 'fanke',
    title: '番客：银信之海',
    subtitle: '2026.06–07 · 技术负责人 · 约 70% 代码',
    description:
      '抗战时期闽南侨批文化背景的 AI 叙事卡牌游戏。纯前端实现 48 周游戏循环、卡牌状态机与多结局分支；DeepSeek API 实时生成与游戏状态耦合的家书。1232 支队伍中晋级路演，获华南赛区第 3 名，后续参加全球总决赛。',
    points: [
      '纯前端网页运行、不依赖游戏引擎：HTML/CSS/JS 搭出完整卡牌状态机与多结局分支。',
      '48 周游戏循环：打工 / 寄银 / 生活事务三类卡牌，银钱、体力、思乡值动态管理；南洋奋斗线与故乡线双线叙事。',
      'DeepSeek API 实时生成家书（发信 + 回信），定制 Prompt 与游戏状态深度耦合；API 抽象层可无缝切换混元 / 智谱。',
      'AI 原生工作流：概念 → AI 对齐 demo → CodeBuddy 生成完整方案 → 三天迭代到可路演版本。',
      '两次线下路演：武汉·腾讯城市会议、上海·WAIC 世界人工智能大会。',
    ],
    tags: ['hackathon', 'game', 'LLM', '#3'],
    aiTag: 'AI交互',
    href: 'http://e429b064a45ba02257346c9c458727e3.tch.qcdntest.cn',
    links: [
      { label: '小红书 · 下南洋题材卡牌游戏的开发手记', href: 'https://xhslink.cn/o/95LdAHpGNzx' },
    ],
    image: '/works/fanke-map.jpg',
    images: ['/works/fanke-map.jpg', '/works/fanke-title.jpg', '/works/fanke-roadshow.jpg'],
    imageAlt: '番客：银信之海的桌面地图、卡牌界面与腾讯城市峰会路演现场',
    highlight: '769 分 / 1232 队',
  },
  {
    id: 'lizhu',
    title: '粒筑千相 · 智筑千相',
    subtitle: '2025.11–至今 · 核心开发 · AI 语音交互导览',
    description:
      '面向博物馆场景的古建筑数字导览系统。Three.js 驱动 30 万粒子点云，语音指令可让粒子实时重组为建筑形态；集成 LLM 与 TTS 2.0，形成「唤醒 → 应答 → 粒子特效」闭环。获 2026 中国大学生计算机设计大赛省级三等奖，已转为大创项目。',
    points: [
      'Three.js 30 万粒子点云 + UnrealBloomPass 辉光；粒子挂载环境噪声，形成呼吸感与流转感。',
      '语音指令驱动粒子实时重组为古建筑形态，支持形态幻化与结构拆解。',
      '集成豆包 LLM 与火山引擎 TTS 2.0，构建「语音唤醒 → 智能响应 → 粒子特效联动」闭环。',
      '获 2026 中国大学生计算机设计大赛省级三等奖，已转化为大创项目《智筑千相》持续推进。',
    ],
    tags: ['Three.js', 'particles', 'LLM', '省三等奖'],
    aiTag: 'AI多态交互',
    href: '/videos/lizhu-demo.mp4',
    hrefLabel: '演示视频',
    video: {
      src: '/videos/lizhu-demo.mp4',
      poster: '/works/lizhu.jpg',
      caption: '粒筑千相 · 粒子重组与语音交互演示',
    },
    image: '/works/lizhu.jpg',
    images: ['/works/lizhu.jpg', '/works/lizhu-2.jpg', '/works/lizhu-3.jpg'],
    imageAlt: '粒筑千相的粒子点云古建筑可视化',
    highlight: '30 万粒子',
  },
  {
    id: 'cushion',
    title: '智能坐垫 WebApp',
    subtitle: '2026.04–06 · 产品设计 · 全栈开发 · 硬件联调',
    description:
      '软硬件一体的久坐健康监测系统。从 PCB 焊接、四路压力传感器到 BLE 通信协议（自定义 13 字段数据帧）全链路参与；独立开发 WebApp，实现姿态判定、压力指纹识别、90 天热力图与 AI 健康助手。课程优秀作品，后续转化为 ICAN 智能赛道产品。',
    points: [
      '硬件层：PCB 焊接调试、四路薄膜压力传感器安装、震动马达驱动电路（S8050 + 续流二极管）与标定按键、LED 指示电路。',
      '通信层：主导制定 BLE 协议（Service UUID 0000ffe0），TX 为 13 字段 DATA 帧，RX 为 MOTOR / SED / BAD / CALIB 命令集。',
      '应用层：Web Bluetooth 双向实时通信，四路压力可视化 + 3 秒抖动过滤姿态判定，压力指纹识别（4 维加权欧氏距离）。',
      '独立开发 5000 行单页应用：久坐计时三模式、90 天热力图、24 小时分布、数据导入导出、番茄钟与 AI 健康助手。',
    ],
    tags: ['Web Bluetooth', 'SPA', 'IoT', '优秀作品'],
    aiTag: 'AI&data',
    href: 'https://project-objyw.vercel.app/',
    image: '/works/cushion.jpg',
    images: ['/works/cushion.jpg', '/works/cushion-hardware.jpg', '/works/cushion-2.jpg'],
    imageAlt: '智能坐垫 WebApp 界面、四路压力传感器与 PCB 硬件实拍',
    highlight: '从 PCB 到 APP',
  },
  {
    id: 'pawprint',
    title: 'PawPrintSpace · 爪印',
    subtitle: '2026.04 · 队长 · 抖音 AI 创变者黑客松',
    description:
      '针对「视频收藏吃灰」的宠物垂类 AI 知识管理工具。ASR 转写 + LLM 生成知识卡片，串起「收藏 → AI 分类 → 知识空间 → 装备图鉴」闭环，并用多邻国式答题与图鉴收集对抗遗忘。几乎独立开发，极限时间内交付可路演 demo。',
    points: [
      '30 小时级极限交付，队长兼几乎全部开发与路演工作。',
      '产品闭环：视频收藏 → AI 分类 → 知识空间（答题复习）→ 装备图鉴 → 日常空间，并预留订阅、商城与社交路径。',
      'ASR 双 provider（Whisper / 火山引擎）+ LLM 知识生成：transcript 优先、title+description 回退、规则兜底。',
      '多邻国式答题 + 图鉴收集 + 遗忘曲线，针对「收藏吃灰」；界面里悬浮陪伴桌宠入口。',
    ],
    tags: ['hackathon', 'AI', 'Supabase', 'demo'],
    aiTag: 'AI&知识库&产品',
    href: 'https://traepet22j4.vercel.app/',
    image: '/works/pawprint.jpg',
    images: [
      '/works/pawprint.jpg', '/works/pawprint-2.jpg',
      '/works/pawprint-3.jpg', '/works/pawprint-4.jpg',
    ],
    imageAlt: 'PawPrintSpace 的桌宠与知识空间界面',
    highlight: '极限交付',
  },
  {
    id: 'mia-box',
    title: 'MIA-box',
    subtitle: '2024.11–2025.01 · 项目负责人 · 95% 代码',
    description:
      '评估 AI 模型隐私风险的全栈可视化平台。FastAPI + SSE 实现攻击进度实时推送，双模式架构集成多种模型反演攻击算法，完成「参数配置 → 实时监控 → 多维结果对比」完整工作流。大一年度项目一等奖（1/66）。',
    points: [
      'FastAPI 后端 + Vanilla JS / Chart.js 前端，SSE 长连接实时推送算法进度。',
      '设计「模拟攻击 / 真实攻击」双模式架构，集成 GMI 等多种模型反演攻击算法。',
      '完整可视化工作流：参数配置 → 实时监控 → 多维度结果对比。',
      '大一年度项目一等奖（同专业项目中综合评分第 1/66）',
    ],
    tags: ['FastAPI', 'SSE', '可视化', '1/66'],
    highlight: '一等奖 · 1/66',
    image: '/works/mia-box.jpg',
    images: [
      '/works/mia-box.jpg',
      '/works/mia-box-1.jpg',
      '/works/mia-box-2.jpg',
      '/works/mia-box-3.jpg',
      '/works/mia-box-4.jpg',
      '/works/mia-box-5.jpg',
    ],
    imageAlt: '大一立项答辩 PPT：封面、方法框架、GMI 攻击复现、创新点、界面设计与开发进程',
    links: [
      { label: '大一立项答辩 PPT · 深度模型反演攻击与防御工具库', href: '/works/mia-box-proposal.pptx' },
    ],
  },
  {
    id: 'guaihaha',
    title: '乖哈哈 · 宠物友好品牌官网',
    subtitle: '2026.08 · 实习期间 · 独立全栈开发',
    description:
      '在上海宏茂供应链实习期间从 0 到 1 搭建并部署的品牌官网，纯静态架构，独立完成内容组织、信息层级、视觉呈现与上线；同期还搭建了宠物行业多元信息自动化采集 Pipeline。',
    points: [
      '纯静态架构，独立完成品牌内容组织、信息层级设计与视觉呈现，并从 0 到 1 部署上线。',
      '页面覆盖品牌主张、场景案例墙与门店详情模块。',
      '同期独立设计宠物行业多元信息自动化采集 Pipeline：Python + LLM 工具链完成结构化抽取、清洗与去重。',
      '另主导业务流程智能化调研，输出多源信息自动化流程优化与 GEO 方向的可落地方案。',
    ],
    tags: ['brand site', 'static', 'internship'],
    href: 'https://www.guaihh.com/',
    image: '/works/guaihaha.jpg',
    images: ['/works/guaihaha.jpg', '/works/guaihaha-2.jpg', '/works/guaihaha-3.jpg'],
    imageAlt: '乖哈哈宠物友好品牌官网首页',
  },
  {
    id: 'clivigil',
    title: 'CliVigil · 疾病预警科研官网',
    subtitle: '2026.09 · 前端开发 · 南京大学 Team Climate Sentinels',
    description:
      '为南京大学「Team Climate Sentinels」的科研项目做的前端演示站：把 5,573 个巴西市镇的登革热风险预警、联邦学习架构与数据口径，组织成「问题 → 数据 → 演示 → 展望 → 投资」的叙事。零构建、零外部依赖，双击 index.html 即可在断网环境完整运行。',
    points: [
      '零构建交付：无 npm / 无打包 / 无 CDN，数据全部内联为 JS 变量，绕开 file:// 对 fetch 与 ES module 的拦截，断网双击即跑。',
      'Canvas 2D 粒子首屏：2,800 个点由官方 shapefile 的 5,573 个市镇质心按 1/√密度 抽样生成；全站共用一个 rAF 循环，页面隐藏自动暂停。',
      '数据可视化：27 州交互地图（选州镜头推近、市镇级悬浮卡、五年告警率趋势）与四阶段全屏流水线演示，数字全部来自真实回测产物。',
      '主题与兜底：body 独占背景 + 区块声明 data-theme 实现整页换肤；支持减少动效、#instant 直出与低端设备分档降级。',
    ],
    tags: ['零构建', 'Canvas', '数据可视化', '科研协作'],
    aiTag: 'AI工具个人实践',
    href: 'https://clivigil-web-v10.vercel.app/',
    highlight: '零构建 · 8 区块',
    image: '/works/clivigil.png',
    images: ['/works/clivigil.png', '/works/clivigil-2.png'],
    imageAlt: 'CliVigil 官网首屏的巴西粒子云字标与四阶段预报演示的州级交互地图',
  },
  {
    id: 'mcm',
    title: '2026 美赛 C 题 · O 奖',
    subtitle: '2026.01–02 · 队长 · 团队唯一代码背景成员',
    description:
      'Dancing with the Stars 全量数据分析。独立完成 5 个 task 的 Python 代码与 27 页英文论文：逆问题建模 + 约束满足、Tikhonov 正则化、蒙特卡洛不确定性量化、Cox 生存分析与线性混合模型，发现评委分与观众投票的结构性正交（ρ=0.13）。4 天 23 小时交付，全球前 1%。',
    points: [
      '4 天 23 小时，独立完成全部 5 个 task 的 Python 代码与 27 页英文论文（LaTeX / Overleaf）。',
      '方法：逆问题建模 + 约束满足（CSP）、Tikhonov 正则化、蒙特卡洛不确定性量化、自适应反馈控制。',
      '统计：Cox 比例风险模型（HR=0.61）+ 线性混合模型因素分解 + Pandas/NumPy 特征工程。',
      '核心发现：评委分与观众投票正交（ρ=0.13，95%CI 0.10–0.16），争议是节目结构性特征。',
    ],
    tags: ['modeling', 'Python', 'LaTeX', 'O 奖'],
    highlight: '全球前 1%',
    image: '/works/mcm-award.png',
    images: ['/works/mcm-award.png'],
    imageAlt: '2026 MCM/ICM C 题 Outstanding Winner 奖状',
    href: '/works/mcm-paper.pdf',
    hrefLabel: '论文 PDF',
  },
  {
    id: 'hongjiang',
    title: '商道诡局 · 洪江密卷',
    subtitle: '2025.03–05 · 核心策划 · 技术调研',
    description:
      '融合洪江古商城与商帮文化的 VR 文旅解谜游戏。拆解《锈湖》谜题逻辑与《孙美琪疑案》VR 交互，形成「文化驱动解谜」设计方法论，规划 IdeaXR + Meta Quest 全流程并产出交互原型与技术可行性方案。',
    points: [
      '竞品拆解：《锈湖》的谜题逻辑 +《孙美琪疑案》的 VR 交互范式。',
      '形成「文化驱动解谜」设计方法论，把商帮商业生态与古商城空间转成可玩的谜题结构。',
      '规划 IdeaXR 引擎 + Meta Quest 设备的开发全流程，产出核心交互原型与技术可行性方案。',
    ],
    tags: ['VR', 'game design', '文旅'],
  },
  {
    id: 'spotlight',
    title: '泡泡星の牧夫座',
    subtitle: '2026.10 · 聚光灯 GameJam · 规则设计 / Godot',
    description:
      '聚光灯 GameJam 作品「星尘牧羊人」。主题是涌现：睡不着的人数的羊落进泡泡里睡着，玩家是牧羊人，不能命令羊，只能撒泡泡、引路、哄睡。核心是一套康威生命游戏变体「呼吸法则」——诞生永远是 B3，环境只改存活规则；紫色暗尘羊会在黑洞染色区里自己长出来。Godot 4 实现 13 关，含星图流程、球面化棋盘与牧羊人引导。',
    points: [
      '世界观「长夜与梦」：人醒着羊在睡，羊醒着人在做梦；撒一颗泡泡，是某个人最后的清醒。',
      '规则：诞生恒为 B3，普通 S23 / 光照区 S123 / 浓密星云 S12；结算按同步快照数邻居 → 判存活 → 判诞生 → 环境结算。',
      '颜色涌现：黑洞 8 邻域染出紫羊（免疫吞噬），诞生颜色由三邻居多数决决定；不需要羊 ID，每格只记一个布尔值。',
      'Godot 4 落地 13 关：封面 → 星图 → 关卡的单向流程、结算面板、Z 键撤销；棋盘走径向球面化，HUD 跟随视口而非固定画布。',
    ],
    tags: ['Godot', 'gamejam', '涌现', '叙事解谜'],
    aiTag: 'AI-mcp&GODOT',
    highlight: '13 关 · 呼吸法则',
    image: '/works/paopao-cover.jpg',
    images: [
      '/works/paopao-cover.jpg',
      '/works/paopao-poster.jpg',
      '/works/paopao-log.jpg',
      '/works/spotlight-2026.jpg',
    ],
    imageAlt: '泡泡星の牧夫座的主视觉、竖版海报、工作日志与聚光灯 GameJam 留影',
    href: 'https://www.taptap.cn/app/976252',
    links: [
      { label: '小红书 · 上线倒计时 / 聚光灯 GameJam 作品', href: 'https://xhslink.cn/o/bXWJ2lP8Ht' },
    ],
  },
  {
    id: 'cardgaming',
    title: 'CardGaming · 卡牌游戏工作台',
    subtitle: '2026.09 · 路演：深圳企鹅岛腾讯云黑客松全球总决赛',
    description:
      '本地优先的卡牌游戏策划工作台：把「卡牌制作 → 世界观 → 剧情与机制 → 数值平衡 → 走查验证」串成一条可闭环的生产线。五大模块共用同一份 JSON 数据，AI 能力（生图 / LLM / 质检）与编码助手通过 MCP 读写同一批文件，天然双向同步；未配置 Key 时自动回落 Mock，流程不断联。',
    points: [
      '五大模块闭环：素材工坊、世界观、策划区、数值面板、沙盒预览，覆盖卡牌从概念到走查的全流程。',
      '文件即事实源：业务数据统一落在 workspace-data/*.json，UI 与 Agent 读写同一份文件，约 2 秒轮询双向同步。',
      'AI 可降级：未配置 Key 时自动回落 Mock 占位，生图 / LLM / 质检链路不断联；配置后走真实接口。',
      '零后端负担：BFF 内嵌 Vite 单进程单端口；自带 MCP Server，编码助手可直接改写工作台数据。',
    ],
    tags: ['hackathon', 'game', 'tooling', 'AI'],
    aiTag: 'AIGC&AI原生工作台',
    highlight: '全球总决赛产出',
    links: [
      { label: '小红书 · 做游戏最崩溃的不是没灵感，是灵感散在各处', href: 'https://xhslink.cn/o/2h0IQKGTiuG' },
    ],
  },
  {
    id: 'fpga-music-box',
    title: 'FPGA 音乐盒',
    subtitle: '2026.09–11 · 嵌入式竞赛 FPGA 赛道 · 核心开发 / 总装',
    description:
      '项目名「合鸣 HandBand」。全国大学生嵌入式芯片与系统设计竞赛 2026 · FPGA 创新设计赛道（高云）选题二作品。用纯 FPGA 硬件逻辑做一台电子乐器：双手手套传感 → 128bit 演奏事件 → 32 复音逐样本实时合成 → I2S → DAC 出声；另有一路 HDMI/TMDS 直出 1024×600 像素 UI 与 ESP32-S3 触屏 / 网页遥控。板卡 Sipeed Tang Mega 138K Pro Dock（Gowin GW5AST-138）。',
    points: [
      '纯硬件逐样本合成：禁止预录音频、禁止软核 / MCU 参与音频通路，动手到出声延迟目标 ≤10ms。',
      '32 复音 TDM 引擎：一套运算单元轮流服务 32 个声部（1.536MHz = 48kHz × 32），引擎设计含 ADSR、双音色与弯音，混音后软限幅。',
      '双手手套交互：食 / 中 / 无名三指 → 右手 5 个单音、左手 3 个和弦；128bit 事件字经异步 FIFO 跨时钟域送入引擎。',
      'FPGA 按像素坐标即时画 16 页 HDMI UI（MPI7002 1024×600），ESP32-S3 做 USB 触摸桥与 Wi-Fi 网页遥控。',
    ],
    tags: ['FPGA', 'Verilog', 'I2S', 'HDMI'],
    highlight: '32 复音 · 纯硬件',
    href: '/videos/handband-demo.mp4',
    hrefLabel: '演示视频',
    video: {
      src: '/videos/handband-demo.mp4',
      poster: '/works/handband.jpg',
      caption: '合鸣 HandBand · 上板实机演示',
    },
    image: '/works/handband.jpg',
    images: [
      '/works/handband.jpg',
      '/works/handband-ui.png',
      '/works/handband-webapp.png',
    ],
    imageAlt: '手套与 FPGA 板卡实拍、HDMI 屏幕 UI 十六页总览与 Web App 界面',
  },
]

/** 列表页只显示两行：一行讲「做了什么」，一行讲「结果是什么」 */
const SUMMARIES: Record<string, string[]> = {
  clivigil: [
    '为南大科研团队做的疾病预警官网：5,573 个市镇数据、27 州交互地图与四阶段演示',
    '结合AI工具快速产出交付美观前端网页尝试',
  ],
  fanke: [
    '侨批文化 × AI 叙事卡牌，48 周循环与多结局分支',
    '华南赛区top3（1232 支队伍），武汉腾讯城市会议、上海 WAIC 两场线下路演',
  ],
  lizhu: [
    '30 万粒子点云，语音驱动古建筑实时重组',
    '计算机设计大赛省三等奖，已转为大创项目',
  ],
  cushion: [
    '从 PCB、BLE 协议到 WebApp，一人打通软硬全链路',
    '姿态判定、压力指纹、90 天热力图与 AI 健康助手',
  ],
  pawprint: [
    '把「收藏吃灰」的宠物视频变成可复习的知识空间',
    'ASR + LLM + 图鉴收集，极限时间交付可路演 demo',
  ],
  'mia-box': [
    '评估模型隐私风险的全栈可视化平台，FastAPI + SSE',
    '大一年度项目一等奖（1/66）',
  ],
  guaihaha: [
    '实习期间从 0 到 1 搭建并部署的宠物友好品牌官网',
    '纯静态架构，内容层级与视觉呈现一手完成',
  ],
  mcm: [
    '5 个 task 与 27 页英文论文',
    '逆问题建模 / Cox / 蒙特卡洛，Outstanding winner',
  ],
  hongjiang: [
    '洪江古商城 × VR 文旅解谜，从竞品拆解到交互原型',
    '形成「文化驱动解谜」设计方法论',
  ],
  cardgaming: [
    '把卡牌制作 / 世界观 / 剧情机制 / 数值平衡 / 走查串成闭环的工作台',
    '全球总决赛路演产出，同一份 JSON 打通 AI 与编码助手',
  ],
  spotlight: [
    '「涌现」主题叙事解谜：一周内完成策划到可玩demo，0到1的无AI美术的游戏开发全流程落地',
    'Godot 4 落地 13 关，聚光灯 GameJam 作品',
  ],
  'fpga-music-box': [
    '纯 FPGA 逐样本合成：手套 → 32 复音 → I2S 出声',
    '2026 嵌入式竞赛 FPGA 赛道，11-04 完成提交',
  ],
}

export const WORKS: Work[] = RAW_WORKS.map((w) => ({
  ...w,
  summary: SUMMARIES[w.id] ?? [w.description],
  ...CLASSIFY[w.id],
}))
