# PIL 第五人格战术演练学习工具

PIL (Peking University Identity V League) Identity V Tactical Friend

官网入口：[二维战术演练](https://pkuidv.com/tactical-friend/) · [三维地图](https://pkuidv.com/tactical-friend/3d/) · [二维备用入口](https://pkuidv.com/zhanshuyanlian/)

本公有库统一维护和发布二维应用与已公开的三维运行文件。三维说明见 [maps-3d/README.md](maps-3d/README.md)；资源解析、重建及内部研究工具留在私有工具库。

官网发布工作流与本地构建说明见 [deploy/README.md](deploy/README.md)。

url:
https://www.bilibili.com/toy/pil-tactical-friend

url ( old ):
https://pil-tactical-friend.ok.kimi.link

这是一份面向初学者的项目说明。你不需要先掌握框架，也不需要把整个项目的代码都读完，只要先知道：**想改的内容属于文字、样式、数据还是交互，然后去对应文件修改。**

项目目前包含三个主要工作视图：

1. **战术面板**：放置角色和道具、绘制图形与文字、测距、计算移动时间、导出图片。
2. **区域选择**：选择求生者和监管者区域、切换密码机组、查看封禁密码机和距离分析。
3. **密码机推演**：手动标记点位有无密码机，根据地图规则推断剩余点位和可能的密码机布局。

项目使用原生 **HTML + CSS + JavaScript ES Modules**，没有 Vue、React、TypeScript 或第三方运行时依赖。地图、角色头像等图片主要来自外部 URL，因此部分资源需要联网加载。

---

## 目录

- [1. 先运行项目](#1-先运行项目)
- [2. 完整目录结构](#2-完整目录结构)
- [3. 最常用的“我要改哪里”速查表](#3-最常用的我要改哪里速查表)
- [4. 应用是怎样启动的](#4-应用是怎样启动的)
- [5. 根目录文件](#5-根目录文件)
- [6. 页面与样式](#6-页面与样式)
- [7. 入口和外壳模块](#7-入口和外壳模块)
- [8. 三个业务页面](#8-三个业务页面)
- [9. core：所有页面共用的基础能力](#9-core所有页面共用的基础能力)
- [10. data：地图、角色与坐标数据](#10-data地图角色与坐标数据)
- [11. 多语言系统](#11-多语言系统)
- [12. 本地存档](#12-本地存档)
- [13. 常见修改任务一步一步做](#13-常见修改任务一步一步做)
- [14. 命名和代码组织约定](#14-命名和代码组织约定)
- [15. 常见问题排查](#15-常见问题排查)
- [16. 修改后的检查清单](#16-修改后的检查清单)
- [17. 推荐阅读顺序](#17-推荐阅读顺序)

---

## 1. 先运行项目

### 1.1 环境要求

- 安装较新的 Node.js，推荐 Node.js 20.11 或更高版本。
- 项目没有第三方 npm 运行依赖，通常不需要执行 `npm install`。

### 1.2 启动

在项目根目录打开终端：

```bash
npm run dev
```

然后访问：

```text
http://localhost:7100/
```

需要换端口时：

```bash
npm run dev -- --port 7200
```

需要指定监听地址时：

```bash
npm run dev -- --host 127.0.0.1 --port 7200
```

### 1.3 为什么不建议直接双击 `index.html`

项目使用了：

- JavaScript ES Modules；
- 动态 `import()`；
- `fetch()` 加载 `locales/zh-CN.json`。

直接通过 `file://` 打开时，浏览器可能因安全策略阻止模块或语言包加载。因此，日常开发请使用 `npm run dev`，也可以在 VS Code 中用 Live Server 打开 `index.html`；后一种方式不需要 Node.js 或 npm。

### 1.4 自动化测试

本地预览无需安装第三方依赖；运行测试需要安装开发依赖及 Chromium：

```bash
npm ci
npx playwright install chromium
npm run verify
```

`npm test` 运行测算、旧存档恢复、书页范围的单元测试，以及开发服务器的 HTTP 集成测试；`npm run test:e2e` 运行浏览器回归测试，并自动启动本地服务器。Linux 首次安装浏览器时如缺少系统库，可使用 `npx playwright install --with-deps chromium`。

浏览器测试覆盖绘图、拖动、刷新、快速切页与切图、推演重置、折线编辑、固定速度、零长度测距、撤销，以及书页范围刷新和 PNG 导出。导出测试检查实际下载图片中的普通圈、排除圈及缩放平移后的裁剪位置。外部图片使用测试资源替代，不验证图片服务可用性或最新游戏数值。GitHub Actions 会在推送和 PR 时运行同一套检查。

---

## 2. 完整目录结构

下面的 `app/` 表示项目根目录；实际使用时，`index.html`、`package.json` 等文件直接位于项目根目录。

```text
app/
├── index.html                  ← 页面骨架：四个视图、卡片、按钮、弹窗
├── package.json               ← 项目信息、npm 启动与测试命令
├── package-lock.json          ← 测试依赖版本锁定
├── playwright.config.js       ← 浏览器回归测试配置
├── .gitignore                 ← 忽略依赖、测试产物和 *.local.md 文档
├── README.md                  ← 项目说明文档
│
├── .github/workflows/test.yml ← 推送与 PR 的自动化测试
├── tests/
│   ├── unit/                  ← 测算与存档恢复的单元测试
│   ├── server/                ← 开发服务器的 HTTP 集成测试
│   └── e2e/                   ← 浏览器交互与刷新回归测试
│
├── css/
│   └── style.css              ← 全部样式：布局、组件、地图标记、响应式
│
├── locales/
│   └── zh-CN.json             ← 简体中文语言包，集中保存中文文案
│
├── scripts/
│   └── dev-server.js          ← 零依赖本地静态服务器
│
└── js/
    ├── bootstrap.js           ← 真正的启动入口：先加载语言，再启动应用
    ├── main.js                ← 首页初始化：粒子背景、地图卡片
    ├── shell.js               ← 页签切换、标题切换、地图切换菜单
    ├── tactic.js              ← 战术面板完整交互与渲染，最大的业务文件
    ├── region.js              ← 区域选择、Canvas 绘制、密码机分析
    ├── deduce.js              ← 密码机推演引擎与推演界面
    │
    ├── core/
    │   ├── state.js           ← 跨页签共享状态，统一读写 S.xxx
    │   ├── dom.js             ← DOM 元素引用、toast 提示、少量共享 UI 状态
    │   ├── utils.js           ← $、数字显示、图片加载等通用工具
    │   ├── persist.js         ← localStorage 持久化与默认值
    │   ├── measurements.js    ← 折线配置恢复、编号和移动时间计算
    │   ├── treasure.js        ← 页面与导出共用的书页范围计算
    │   └── i18n.js            ← 多语言加载、翻译、插值、语言切换
    │
    └── data/
        ├── maps.js            ← 九图数据与推演规则
        ├── tactic-data.js     ← 角色、道具、加成、速度和默认常量
        └── geo.js             ← 像素坐标、相对坐标、区域中心与距离换算
```

### 2.1 可以怎样理解这些目录

| 目录 | 类比 | 应该放什么 |
|---|---|---|
| 根目录 | 应用的包装盒和说明书 | 页面入口、项目配置、说明文档 |
| `css/` | 外观和装修 | 颜色、尺寸、布局、动画、响应式 |
| `locales/` | 多语言词典 | 用户能看到的翻译文案 |
| `scripts/` | 开发辅助工具 | 本地启动脚本，不属于浏览器业务逻辑 |
| `tests/` | 回归检查 | 计算逻辑测试和浏览器交互测试 |
| `js/core/` | 公共工具箱 | 多页面共享的状态、DOM、存档、翻译、工具函数 |
| `js/data/` | 游戏资料库 | 地图、角色、道具、速度、坐标和规则数据 |
| 根级 `js/*.js` | 各页面的大脑 | 首页、外壳和三个业务页面的行为 |

---

## 3. 最常用的“我要改哪里”速查表

> 建议优先看这张表。表中的“搜索内容”可以直接复制到编辑器的文件内搜索框。

| 我想修改…… | 首先打开 | 搜索内容或位置 |
|---|---|---|
| 网站标题 | `locales/zh-CN.json` | `ui.application.title` |
| 某个按钮的中文 | `locales/zh-CN.json` | 直接搜索这段中文 |
| 地图中文名、点位名、提示文字 | `locales/zh-CN.json` | 直接搜索中文；键通常以 `maps.` 开头 |
| 角色或道具显示名 | `locales/zh-CN.json` | 搜索中文；键通常以 `characters.` 或 `items.` 开头 |
| 页面新增一块 HTML | `index.html` | 找到对应视图，如 `tacticView` |
| 页头、页脚、页签结构 | `index.html` | `appHeader`、`tabBar`、`footer` |
| 弹窗结构 | `index.html` | `tacHelpModal`、`tacTalentModal` 等 |
| 全局颜色、字体、背景 | `css/style.css` | `:root`、背景与相关组件类名 |
| 首页地图卡片样式 | `css/style.css` | `.home-card` |
| 手机端布局 | `css/style.css` | `@media` |
| 首页地图卡片图标和排列 | `js/main.js` | `initHomePage`、`icons` |
| 首页粒子背景数量和颜色 | `js/main.js` | `initParticles` |
| 页签标题和切换行为 | `js/shell.js` | `TAB_TITLES`、`switchTab` |
| 点击地图名后的换图菜单 | `js/shell.js` | `toggleMapSwitch`、`switchMap` |
| 换地图、换底图、改地图英文名 | `js/data/maps.js` | `MAPS_DATA`、目标地图的 `mapNameEn`、`mapImage` |
| 改区域名称或区域网格 | `js/data/maps.js` | `zoneNames`、`zonesInfo` |
| 改密码机名称或坐标 | `js/data/maps.js` | 目标地图的 `ciphers` |
| 改七台密码机组合 | `js/data/maps.js` | `cipherCombinations` |
| 改地窖或逃生门位置 | `js/data/maps.js` | `dungeons`、`escapeDoors` |
| 改地图实际宽度，用于米数换算 | `js/data/maps.js` | `widthM` |
| 改固定角色点位，如摄像机、鳞片 | `js/data/maps.js` | `fixedSpawns` |
| 改某地图推演规则 | `js/data/maps.js` | 目标地图的 `deduction`、`rules` |
| 改推演算法本身 | `js/deduce.js` | `deduce` |
| 改推演页标记和结果显示 | `js/deduce.js` | `renderDedMap`、`renderDedSteps`、`renderDedTopBar` |
| 改区域点击和阵营选择 | `js/region.js` | `handleMapClick`、`changeStates`、`toggleSide` |
| 改封禁密码机显示或分析面板 | `js/region.js` | `checkLock`、`updateDistancePanel` |
| 改封禁密码机的计算方式 | `js/data/geo.js` | `calculateLockCipher` |
| 新增角色 | `js/data/tactic-data.js` | `TAC_ROLES`，必要时同时改 `TAC_ITEM_TYPES` 和语言包 |
| 新增道具 | `js/data/tactic-data.js` | `TAC_ITEM_TYPES`，并加入拥有者的 `items` |
| 改角色基础速度或形态速度 | `js/data/tactic-data.js` | `TAC_MOVEMENT_SURVIVOR.states`、`TAC_MOVEMENT_SURVIVOR.roles`、`TAC_MOVEMENT_SURVIVOR.fixed`、`TAC_ROLES` |
| 改特质、天赋、其它加成 | `js/data/tactic-data.js` | `TAC_MOVEMENT_BUFFS.trait`、`TAC_MOVEMENT_BUFFS.talent`、`TAC_MOVEMENT_BUFFS.other` |
| 改战术面板放置、拖动、删除 | `js/tactic.js` | `tacMapWrap.addEventListener('pointerdown'` 及后续事件 |
| 改范围圈、箭头、测距线外观逻辑 | `js/tactic.js` | `shapeNode`、`measureNode`、`renderTacArrows` |
| 改移动时间计算 | `js/core/measurements.js`、`js/tactic.js` | `simulateMovement`、`tacSimLine`、`updateTacMeasureInfo` |
| 改导出图片 | `js/tactic.js` | `tacExportImage` |
| 改快捷键 | `js/tactic.js` | `window.addEventListener('keydown'` |
| 改默认图标大小、缩放范围 | `js/data/tactic-data.js` | `TAC_DISPLAY_DEFAULT`、`TAC_MANAGE_DEFAULT`、`TAC_ZOOM_MIN/MAX` |
| 改区域选择页默认图标大小 | `js/region.js` | `SEL_DISPLAY_DEFAULT` |
| 改本地存档内容 | `js/core/persist.js` | `tacSave`、`saveRegionSel`、`restoreRegionSel` |
| 增加一种语言 | `locales/` 和 `js/core/i18n.js` | 新增 JSON，并修改 `SUPPORTED_LOCALES` |

---

## 4. 应用是怎样启动的

启动顺序非常重要，因为数据文件也会在加载时调用翻译函数。

```text
浏览器打开 index.html
        │
        ▼
加载 js/bootstrap.js
        │
        ▼
initializeI18n()
读取语言偏好 → 请求 locales/zh-CN.json → 翻译静态 HTML
        │
        ▼
动态 import('./main.js')
        │
        ├── 加载 data/maps.js 和 data/tactic-data.js
        ├── 加载 region.js、shell.js、tactic.js、deduce.js 等模块
        └── 各模块注册事件并准备共享状态
        │
        ▼
main.js 执行
初始化粒子背景 → 绑定区域显示设置 → 生成九张首页地图卡片
        │
        ▼
用户点击地图
enterMap(mapId) → selectMap(mapId) → 默认进入战术面板
```

### 4.1 为什么不是直接加载 `main.js`

`maps.js` 和 `tactic-data.js` 中的名称、规则和提示也使用 `translate()`。如果语言包尚未加载就执行这些模块，会得到缺失翻译。因此，`bootstrap.js` 必须先把语言准备好，再动态加载 `main.js`。

新增启动逻辑时，通常：

- 与首页有关的初始化放在 `main.js`；
- 必须在所有业务模块之前执行的语言或环境准备放在 `bootstrap.js`；
- 不要随意把 `index.html` 的入口改回 `main.js`。

---

## 5. 根目录文件

### 5.1 `package.json`

主要负责：

- 记录项目名称 `pil-identity-v-tool`；
- 声明 `"type": "module"`，让 Node.js 启动脚本使用 ES Module；
- 提供 `npm run dev` 和自动化测试命令；
- 声明仅用于测试的 Playwright 开发依赖，网页运行不依赖 npm 包。

当前核心命令等价于：

```bash
node scripts/dev-server.js
```

如果只是想改页面，一般不需要修改这个文件。

### 5.2 `scripts/dev-server.js`

这是一个使用 Node.js 内置模块编写的静态文件服务器，负责：

- 默认监听 `0.0.0.0:7100`；
- 读取 `--host` 和 `--port` 参数；
- 把 `/` 映射到 `index.html`；
- 根据扩展名返回 HTML、CSS、JS、JSON、PNG、SVG 等内容；
- 禁止访问项目目录之外的文件；
- 对无法解析或解码的 URL 返回 400，保持服务器继续运行；
- 设置 `Cache-Control: no-cache`，减少开发时旧缓存干扰。

需要修改默认端口时，搜索 `7100`。需要支持新的本地静态文件类型时，修改 `mimeTypes`。

### 5.3 `README.md`

就是当前说明文档，用于帮助开发者理解结构和修改位置，不参与网页运行。

---

## 6. 页面与样式

## 6.1 `index.html`：页面骨架

这个文件负责“页面上有哪些元素”，不负责复杂行为。可以理解成先搭好房间，`region.js`、`deduce.js`、`tactic.js` 再让房间里的设备工作。

### 主要区域

| 区域 | 关键 ID | 用途 |
|---|---|---|
| 页头 | `appHeader` | 返回键、页签、主标题、英文副标题 |
| 首页 | `homeView` | 放置由 `main.js` 生成的地图卡片 |
| 战术面板 | `tacticView` | 地图、工具栏、角色、绘制、测算、设置等卡片 |
| 区域选择 | `selectView` | 区域地图、密码机组切换、阵营切换、分析面板 |
| 密码机推演 | `deduceView` | 推演地图、进度、结论、依据、布局和规律 |
| 页脚 | `footer` | 赛事链接、英文名称、版本和联系方式 |
| 轻提示 | `toastMessage` | 由 `showToast()` 显示短暂消息 |
| 各类弹窗 | `tacTalentModal` 等 | 天赋、特质、其它加成、自定义加成和帮助 |

### 战术面板中的重要控件

- `tacMapWrap`：战术地图及所有覆盖元素的容器。
- `tacArrowSvg`：箭头、图形和测距线的 SVG 层。
- `tacManageList`：选中角色或道具后的管理控件。
- `tacRolesSurvivor`、`tacRolesHunter`、`tacRolesOther`：角色按钮容器。
- `tacItems`：当前角色可用道具按钮。
- `tacBaseDetailBody`、`tacBuffDetailBody`：基础速度和加成明细。
- `tacResult`：距离与移动时间计算结果。
- `tacTextList`：已添加文字列表。

### 修改 HTML 时的注意事项

1. **不要随意改 ID。** JS 经常通过 `$('tacMapWrap')` 或 `document.getElementById()` 查找元素。
2. 如果确需改 ID，要同步修改 `core/dom.js` 或相关模块中的引用。
3. `data-tool`、`data-tab`、`data-shape`、`data-camp` 等 `data-*` 属性也参与逻辑，不只是说明文字。
4. 静态中文通过 `data-i18n` 绑定语言键，不要重新把中文写回 HTML。
5. 地图卡片、角色按钮、推演点位等内容是 JS 动态生成的，在 HTML 里找不到完整成品是正常的。

## 6.2 `css/style.css`：全部样式

所有页面共用这一份 CSS，主要包括：

- 全局颜色、背景、字体和基础布局；
- 页头、页签、首页地图卡片、页脚；
- 三个业务视图的左右栏与卡片；
- Canvas 和地图覆盖层；
- 推演点位、图例、规则、布局和矛盾提示；
- 战术角色、道具、范围圈、文字、图形和测距线；
- 弹窗、表格、滑杆、按钮和开关；
- 不同屏幕宽度下的响应式布局。

### 常见修改位置

| 需求 | 搜索选择器 |
|---|---|
| 首页卡片 | `.home-card`、`.home-map-grid` |
| 顶部标题和页签 | `.header`、`.tab-btn` |
| 右侧卡片 | `.ded-card`、`.ded-panel` |
| 区域选择地图 | `.map-wrapper`、`.map-canvas` |
| 推演点位 | `.ded-marker` |
| 推演矛盾提示 | `.ded-alert` |
| 战术角色标记 | `.tac-token` |
| 道具范围 | `.tac-item-circle` |
| 战术工具按钮 | `.tac-tool` |
| 结果表格 | `.tac-result`、`.tac-detail-tbl` |
| 弹窗 | `.tac-modal`、`.tac-modal-mask` |
| 手机或平板 | `@media` |

### CSS 修改建议

- 优先修改已有类，不要给每个元素写大量内联样式。
- 新增样式时，把选择器放在对应业务区域附近。
- 修改地图标记尺寸后，要同时检查桌面和手机效果。
- 有些尺寸由 JS 内联计算，例如相对地图宽度的角色图标大小；CSS 找不到时应去 `tactic.js` 或默认常量中查找。

---

## 7. 入口和外壳模块

## 7.1 `js/bootstrap.js`：真正的启动入口

职责非常单一：

1. 调用 `initializeI18n()`；
2. 等待语言包和静态 HTML 翻译完成；
3. 动态加载 `main.js`；
4. 启动失败时在控制台输出错误。

一般不需要修改，除非要调整整个应用的启动前置流程。

## 7.2 `js/main.js`：首页初始化

主要函数：

| 函数 | 用途 | 常见修改 |
|---|---|---|
| `initParticles()` | 生成背景粒子 | 数量、颜色、尺寸、动画时长 |
| `initHomePage()` | 按 `MAPS_DATA` 生成地图卡片 | 卡片结构、图标数组、点击行为 |

首页图标保存在 `icons` 数组中，顺序与 `MAPS_DATA` 一致：

```text
军工厂、圣心医院、红教堂、湖景村、月亮河公园、
里奥的回忆、永眠镇、唐人街、不归林
```

新增或调整地图顺序时，要同步检查这个数组。卡片本身的 HTML 模板位于语言键 `application.homeMapCard`，插值参数包括地图图片、地图名、图标和英文名。

## 7.3 `js/shell.js`：应用外壳

负责不专属于某个业务页面的公共导航。

| 函数或常量 | 用途 |
|---|---|
| `TAB_TITLES` | 三个页签对应的中英文标题 |
| `HOME_TITLE` | 首页标题 |
| `dedDataOf(mapId)` | 读取指定地图的推演数据 |
| `showView(view)` | 只显示一个视图，并回到页面顶部 |
| `switchTab(tab)` | 切换战术、区域、推演页签，并调用对应刷新逻辑 |
| `updateTabUi()` | 更新页签高亮、标题和 `has-tabs` 样式状态 |
| `toggleMapSwitch(anchor)` | 创建并定位地图切换菜单 |
| `switchMap(mapId)` | 在当前页签内换图，处理推演可用性和临时状态 |
| `closeMapSwitch()` | 关闭地图菜单 |

需要新增第四个主页面时，通常要同时改：

1. `index.html` 的新视图和页签；
2. `core/dom.js` 的 DOM 引用；
3. `core/state.js` 的页签状态；
4. `shell.js` 的标题和 `switchTab()`；
5. 新业务模块及对应 CSS。

---

## 8. 三个业务页面

## 8.1 `js/region.js`：区域选择

这是区域选择页的渲染和交互中心。

### 进入地图

- `enterMap(mapId)`：从首页进入地图，显示页签并默认进入战术面板。
- `backToHome()`：返回首页。
- `selectMap(mapId)`：初始化当前地图、选区状态、密码机组、提示和底图，并恢复本地存档。

### 图片与 Canvas

- `loadMapImage()`：加载区域选择底图。
- `initCanvas()`：初始化 Canvas 尺寸。
- `drawCanvas()`：绘制区域、角色选择、密码机、逃生门和高亮圈。
- `getImageDrawRect()`：计算图片在 Canvas 中的实际绘制区域。
- `drawRoleMark()`：绘制求生者或监管者标记。
- `drawCipherRing()`：绘制封禁或选中高亮圈。

### 区域和密码机交互

- `toggleSide()`：切换求生者、监管者阵营。
- `switchCipher(step)`：循环切换密码机组。
- `updateCipherText()`、`updateCipherDots()`：更新组号和圆点导航。
- `handleMapClick(e)`：处理地图点击。
- `changeStates(index)`：修改指定区域的选择状态。
- `resetSelection()`：重置当前地图选区。
- `updateSelectionInfo()`：更新已选区域数量。

### 封禁与分析

- `updateLockCipher()`：根据监管者区域计算封禁密码机。
- `checkLock()`：更新封禁状态。
- `updateDistancePanel()`：更新密码机列表、监管者位置、像素坐标和实际距离。

### 默认显示设置

搜索：

```js
SEL_DISPLAY_DEFAULT
```

这里控制区域选择页的角色、密码机和逃生门图标默认大小。`bindSelDisplay()` 负责把设置控件、持久化数据和画布刷新连接起来。

## 8.2 `js/deduce.js`：密码机推演

这个文件可以分成两部分：**推演算法**和**推演界面**。

### 推演算法

核心函数：

```js
deduce(map, marks)
```

输入：

- `map`：当前地图的 `deduction` 数据；
- `marks`：用户手动标记，格式类似 `{ 0: 'yes', 3: 'no' }`。

输出包括：

- `state`：每个点位的最终状态；
- `steps`：逐条推演依据；
- `contradiction`：矛盾说明，没有矛盾时为 `null`；
- `candidates`：仍符合当前标记的布局；
- `sources`：结论来自哪一步。

算法会反复执行规则传播和布局联立，直到不能产生新结论。修改“某张地图有哪些规律”通常不需要改这里，只需改 `maps.js` 中该图的 `rules`；只有修改通用推理方式时才改 `deduce()`。

### 推演界面

| 函数 | 用途 |
|---|---|
| `enterDeduce()` | 进入推演页，绑定地图并显示已恢复的标记 |
| `toggleDedMark(id)` | 在“有 → 无 → 取消”之间循环 |
| `renderDeduction()` | 一次完整刷新 |
| `renderDedTopBar()` | 更新进度和结论 |
| `renderDedMap()` | 绘制点位、连线和依据范围 |
| `renderDedSteps()` | 显示逐条推演依据 |
| `renderDedLayouts()` | 显示全部布局及候选状态 |
| `resetDedMarks()` | 清空手动标记并保存 |
| `markKind()` | 决定必刷、手动、推断、未知等标记类型 |
| `updateLawBtn()` | 更新教学链接按钮状态 |

## 8.3 `js/tactic.js`：战术面板

这是项目中最大、功能最多的文件。不要从头逐行硬读，按功能搜索函数名更有效。

### A. 地图、地标与设置

| 函数 | 用途 |
|---|---|
| `syncTacDisplayUI()` | 同步显示设置控件 |
| `syncTacImage()` | 同步当前地图底图 |
| `renderTacCiphers()` | 绘制密码机 |
| `renderTacZones()` | 绘制区域划分 |
| `renderTacLandmarks()` | 绘制地窖和逃生门 |
| `renderTacFixedSpawns()` | 绘制固定角色点位 |
| `renderTacTreasure()` | 绘制冒险家书页范围，隐藏密码机图标时仍随机组更新 |
| `switchTacCipher()`、`switchTacDungeon()` | 切换密码机组和地窖组 |
| `tacSnapTarget()`、`tacSnapLandmark()` | 计算绘图吸附目标 |

### B. 缩放和拖动地图

| 函数或状态 | 用途 |
|---|---|
| `tacZoomState` | 当前缩放倍数、平移量、拖动和锁定状态 |
| `tacSetZoomLock()` | 锁定或解锁地图操作 |
| `tacZoomTo()`、`tacZoomStep()` | 缩放到指定倍数或按步长缩放 |
| `tacSetPanMode()` | 开关地图拖动模式 |
| `tacApplyZoom()` | 把缩放和平移应用到地图 |
| `tacZoomReset()` | 恢复默认视图 |

缩放上下限不在这里，而在 `tactic-data.js` 的 `TAC_ZOOM_MIN`、`TAC_ZOOM_MAX`。

### C. 图形、道具范围和测距线

| 函数 | 用途 |
|---|---|
| `arrowNode()` | 创建箭头 |
| `circleNode()` | 创建虚线圈 |
| `rectNode()` | 创建虚线框 |
| `shapeNode()` | 按类型分发图形创建 |
| `measureNode()` | 创建测距线或折线段 |
| `chainTotalNode()` | 创建整条折线汇总 |
| `renderTacArrows()` | 刷新 SVG 图形层 |
| `tacLinkPartner()` | 计算同类道具的连线伙伴 |
| `tacClampLinkPos()` | 限制连线道具的最大距离 |

### D. 地图上的角色、道具和文字

| 函数 | 用途 |
|---|---|
| `renderTacBoard()` | 刷新整张战术板，并触发保存 |
| `renderTacManage()` | 生成角色或道具的管理面板 |
| `updateTacPanel()` | 根据当前工具更新右侧卡片 |
| `buildTacRoles()` | 按阵营生成角色按钮 |
| `buildTacItems()` | 生成角色道具按钮 |
| `onTacRoleClick()` | 选择要放置的角色 |
| `onTacItemClick()` | 选择要放置的道具 |
| `updateTacTextUi()` | 更新文字添加状态 |
| `renderTacTextList()` | 渲染已添加文字列表 |

### E. 移动速度与时间计算

| 函数 | 用途 |
|---|---|
| `tacNewLineCfg()` | 新建一条线的速度配置 |
| `tacSimLine()` | 将线段换算为米，调用 `simulateMovement()` 计算时间 |
| `tacBuffAppliesToBase()` | 判断加成是否适用于当前段的角色、形态与状态 |
| `tacBuildRoleOptions()` | 构建基础速度角色选项 |
| `tacSyncSpeedPanel()` | 同步速度设置面板 |
| `tacAddBuffEntry()` | 添加一条加成 |
| `tacApplyBaseInput()` | 应用基础速度修改 |
| `renderTacBaseDetail()` | 显示基础速度明细 |
| `renderTacBuffDetail()` | 显示加成明细 |
| `buildTacTraitList()` | 构建特质弹窗 |
| `buildTacTalentList()` | 构建天赋弹窗 |
| `buildTacOtherList()` | 构建其它加成弹窗 |
| `updateTacMeasureInfo()` | 显示距离、时间和分段结果 |

修改具体角色速度和加成数值，优先去 `tactic-data.js`，不要直接改计算函数。

### F. 导出、撤销、清空和快捷键

| 函数或事件 | 用途 |
|---|---|
| `tacExportImage()` | 将当前战术板与书页范围导出为 PNG，支持缩放后的视口裁剪 |
| `tacUndo()` | 根据操作记录撤销 |
| `tacClear()` | 清空当前地图战术板，可撤销 |
| `tacDeleteMeasureAt()` | 删除测距线段并处理折线配置 |
| `tacResetTransient()` | 换图时清理临时交互和撤销栈 |
| `tacMapWrap` 的指针事件 | 放置、选择、拖动、绘制和删除 |
| `window` 的 `keydown` 事件 | Esc、Delete、Backspace、Ctrl/Cmd+Z、WASD、方向键 |

---

## 9. core：所有页面共用的基础能力

## 9.1 `js/core/state.js`：跨页签共享状态

导出统一对象 `S`。需要多个模块读写的运行状态放在这里，避免直接修改 ES Module 的导入绑定。

主要字段：

| 字段 | 含义 |
|---|---|
| `currentMapId` | 当前地图下标 |
| `currentSide` | 当前阵营，`1` 为求生者，`-1` 为监管者 |
| `currentCipherIndex` | 当前密码机组下标 |
| `survivorState`、`hunterState` | 两个阵营的区域选择状态 |
| `chooseState` | 当前阵营状态副本 |
| `flagLock`、`lockCipherIndex` | 封禁状态与密码机下标 |
| `selectedCipherIndex` | 当前选中的密码机 |
| `currentTab` | 当前页签 |
| `dedMap`、`dedMarks`、`dedSelectedStep` | 推演页数据、标记和选中依据 |
| `tacDungeonIndex` | 战术面板当前地窖组 |

如果新增的状态只在一个函数或一个模块中使用，不必放进 `S`；真正需要跨模块共享时再添加。

## 9.2 `js/core/dom.js`：DOM 引用与 toast

这个文件把常用的 `document.getElementById()` 集中起来，例如：

```js
export const tacMapWrap = $('tacMapWrap');
export const dedSteps = $('dedSteps');
```

业务模块直接导入这些引用，避免到处重复查找 DOM。

`showToast(msg)` 用于显示底部短暂提示。新增一个需要跨模块使用的 HTML 元素时，可以在这里增加引用；只在一个模块使用的元素也可以继续通过 `$()` 获取。

## 9.3 `js/core/utils.js`：通用工具

| 导出 | 用途 |
|---|---|
| `$` | `document.getElementById()` 的简写 |
| `CN_NUM`、`cnNum()` | 中文数字显示，用于规则说明 |
| `mountImageOverlays()` | 给地图容器加入加载中和加载失败覆盖层 |
| `loadImageWithStatus()` | 预加载图片、显示状态、丢弃过期请求、失败后每 5 秒重试 |

它是偏底层的工具模块，不应放具体角色、地图或页面业务。

## 9.4 `js/core/persist.js`：本地持久化

负责：

- 保存每张地图的战术板；
- 保存战术显示设置和测算样式；
- 保存区域选择、密码机组、推演标记和地窖组；
- 进入地图时恢复区域状态、推演标记和地窖组；
- 通过约 400ms 防抖统一写入完整快照，页面隐藏或离开时写入待保存内容；
- 加载旧存档后恢复折线共享配置，并续接路线、配置和加成编号。

详细存档结构见[本地存档](#12-本地存档)。

## 9.5 `js/core/i18n.js`：多语言

负责语言包加载、翻译、参数插值、静态 HTML 翻译和语言切换。详细用法见[多语言系统](#11-多语言系统)。

## 9.6 `js/core/measurements.js`：测算与折线恢复

这个模块不依赖 DOM，可直接进行单元测试：

| 导出 | 用途 |
|---|---|
| `restoreMeasureReferences()` | 按地图和路线恢复 JSON 序列化丢失的共享配置引用 |
| `measureIdCounters()` | 从所有地图的存档中取得已使用的最大编号 |
| `measureBaseAt()` | 查找某一段的基础速度配置 |
| `simulateMovement()` | 按各段距离、速度、加成及持续时间计算移动结果 |

固定速度段不受加成影响；其它段通过 `tacBuffAppliesToBase()` 判断加成适用范围。限时加成从其起点开始计时，经过不适用的线段时仍会消耗持续时间。零长度段返回零距离、零时间，由结果面板显示。

## 9.7 `js/core/treasure.js`：书页范围计算

`getTreasureRings()` 根据当前地图、冒险家位置、密码机组和 `TAC_TREASURE_RULE`，返回范围圈的相对坐标、内外半径和排除状态。页面显示与 PNG 导出共用这份计算结果，避免切换机组或新增显示层时出现不一致。

函数不依赖 DOM 或密码机图标的加载状态。书页规则数值仍放在 `js/data/tactic-data.js`；显示样式由页面 CSS 和导出绘制代码处理。

---

## 10. data：地图、角色与坐标数据

## 10.1 `js/data/maps.js`：九图数据

最重要的导出是：

```js
MAPS_DATA
```

它是一个数组，数组顺序决定首页地图顺序和 `mapId`：

| `mapId` | 地图 |
|---:|---|
| 0 | 军工厂 |
| 1 | 圣心医院 |
| 2 | 红教堂 |
| 3 | 湖景村 |
| 4 | 月亮河公园 |
| 5 | 里奥的回忆 |
| 6 | 永眠镇 |
| 7 | 唐人街 |
| 8 | 不归林 |

### 每张地图的主要字段

| 字段 | 含义 |
|---|---|
| `mapId` | 地图数字下标，应与数组位置一致 |
| `mapName` | 当前语言地图名 |
| `mapNameEn` | 地图英文名 |
| `mapImage` | 底图 URL |
| `mapSize` | 底图原始像素尺寸 `[width, height]` |
| `zonesInfo` | 区域网格定义 |
| `zoneNames` | 区域名称，顺序必须与网格换算后的顺序一致 |
| `ciphers` | 所有密码机点位 |
| `cipherCombinations` | 每组实际出现的七个密码机 ID |
| `dungeons` | 地窖候选坐标 |
| `escapeDoors` | 逃生门与门锁坐标 |
| `widthM` | 地图横向对应的游戏内米数 |
| `fixedSpawns` | 角色固定点位，如摄像机、鳞片、零件 |
| `law_urls` | B 站和抖音教学链接 |
| `fixedHint` | 固定提示 |
| `hints` | 按密码机组或场景使用的提示 |
| `deduction` | 推演规则、布局和规律速查数据 |

### `zonesInfo` 的格式

```js
[x, y, zoneWidth, zoneHeight, columns, rows]
```

也就是：起点横坐标、起点纵坐标、单格宽、单格高、列数、行数。`geo.js` 会把这些像素值转换成 `0～1` 的相对坐标。

红教堂和永眠镇有特殊网格处理，所以修改地图顺序或 `mapId` 时要格外小心，不能只改数组而忽略 `geo.js` 中的特殊地图逻辑。

### `ciphers` 的格式

典型字段：

```js
{
  id: 'M_4',
  name: translate('maps.armsFactory.m4.name'),
  location: [284, 529],
  feature: translate('maps.armsFactory.m4.feature'),
  locked: true
}
```

- `id`：稳定编号，被密码机组合引用；
- `name`：显示名；
- `location`：基于 `mapSize` 的原始图片像素坐标；
- `feature`：分析面板中的刷机特点；
- `locked`：是否为必刷点，推演页不可手动标记。

### `cipherCombinations` 的格式

每个子数组是一组密码机 ID，例如：

```js
['M_4', 'M_1', 'M_3', 'W_4', 'W_1', 'E_2', 'E_4']
```

修改组合时，ID 必须存在于该图 `ciphers`，必要时也可由 `CIPHER_EXTRA` 补充。不要直接抄写另一张地图的 ID。

### `escapeDoors` 的顺序

当前数据按以下方式使用：

1. 前两个坐标：两扇门的中点；
2. 后两个坐标：对应的门锁位置。

如果地图没有单独门锁坐标，应参考已有地图的数据形式，不要随意改变数组语义。

### `fixedSpawns`

用于登记与角色相关的固定参考点。常见字段包括：

- `label`：设置面板显示名；
- `icon`：道具类型或图片 URL；
- `camera`：是否按摄像机类朝向标记处理；
- `points`：点位数组；
- 点位的 `p`：位置；
- 点位的 `d`：朝向向量；
- `rangeM`、`rangeScreenM`：特定角色的范围参数。

### 推演辅助函数

`dedHelpers(ciphers)` 返回一组规则构造函数，让地图数据可以用点位名称描述规则，而不是手写下标。

| 辅助函数 | 用途 |
|---|---|
| `fixed(names)` | 固定必刷点 |
| `region(name, min, max, names)` | 一组点位至少、至多出现多少台 |
| `exactly(n, names, name)` | 一组点位恰好出现 `n` 台 |
| `either(names)` | 两者恰好一个有 |
| `same(names)` | 两点同有同无 |
| `atLeast1(names)` | 至少一个有 |
| `atMost1(names, name)` | 至多一个有 |
| `chain(name, mode, cyclic, names, text)` | 相邻链互斥规则 |
| `chainRun(name, names, text)` | 长链连续点位规则 |
| `implies(name, pres, cons, text)` | 单向关联 |
| `allAbsent(pres, targets, text)` | 前件全无时后件全有 |
| `link(name, regionNames, marker, positive, text)` | 区域台数与标志点位联动 |

`makeDeduction()` 会把密码机 ID 组合转成推演引擎需要的点位下标，并通过 `dedRuleBook()` 生成规律速查。

### `CIPHER_EXTRA`

用于补充不属于常规点位列表、但需要参与坐标查找的密码机。普通修改优先改目标地图自己的 `ciphers`，只有确需额外点位时才使用这里。

## 10.2 `js/data/tactic-data.js`：角色、道具和常量

### 速度相关数据

| 常量 | 用途 |
|---|---|
| `TAC_MOVEMENT_SURVIVOR.states.run.speed` | 通用求生者跑动速度 |
| `TAC_MOVEMENT_SURVIVOR.states` | 跑、走、蹲、爬的基础速度 |
| `TAC_MOVEMENT_SURVIVOR.roles` | 角色或角色形态的基础速度 |
| `TAC_MOVEMENT_SURVIVOR.fixed` | 不允许继续添加加成的固定速度状态 |
| `TAC_MOVEMENT_SURVIVOR.stateNames` | 基础状态的显示名称 |

### 加成相关数据

| 常量 | 对应界面 |
|---|---|
| `TAC_MOVEMENT_BUFFS.trait` | 特质加成 |
| `TAC_MOVEMENT_BUFFS.talent` | 天赋加成 |
| `TAC_MOVEMENT_BUFFS.other` | 其它加成 |

常见字段：

- `key`：内部唯一标识；
- `name`：显示名；
- `role`：关联角色显示名或角色说明；
- `camp`：`survivor` 或 `hunter`；
- `mult`：固定乘算倍率，例如 `1.1` 表示增加 10%；
- `levels`：多档倍率，与 `mult` 二选一；
- `duration`：持续秒数，省略或为 `0` 通常表示不限时；
- `states`：仅对指定基础状态生效；
- `roles`、`forms`：限定角色或形态；
- `postMult`：是否在最后再次乘算；
- `extra`：添加时附带的额外加成。

### `TAC_ITEM_TYPES`：道具注册表

每个道具以稳定英文键登记，例如 `flashlight`、`fastMusicbox`。

常见字段：

| 字段 | 用途 |
|---|---|
| `name` | 显示名 |
| `icon` | 图标 URL |
| `ranges.modes` | 范围显示模式 |
| `render` | 渲染方式，如 `circle`、`link` |
| `color`、`fill`、`glow` | 范围颜色、填充和发光 |
| `linkToRole` | 自动连接的角色 |
| `linkMaxM` | 最大连线距离 |
| `linkColor`、`linkWidth` | 连线样式 |
| `pushable`、`pushes` | 推动机制 |

`size_m` 可以是：

- 数字：固定半径；
- `{ min, max }`：连续可调范围；
- `{ options, labels }`：离散档位及显示名。

### `TAC_ROLES`：角色注册表

常见字段：

- `name`：角色显示名；
- `camp`：`survivor`、`hunter` 或 `other`；
- `items`：该角色可放置的道具键数组；
- `icon`：头像 URL；
- `speed`：固定数值或按形态区分的速度对象；
- `ranges`：角色范围配置；
- `maxItems`：道具相关数量限制。

`items` 中的字符串必须能在 `TAC_ITEM_TYPES` 找到，否则道具无法正确显示。

### 其它默认常量

| 常量 | 用途 |
|---|---|
| `TAC_MEASURE_DEFAULT` | 直线和折线默认颜色、线宽 |
| `TAC_DISPLAY_DEFAULT` | 密码机、地窖、逃生门默认图标大小 |
| `TAC_MANAGE_DEFAULT` | 角色和道具默认显示大小 |
| `TAC_ZOOM_MIN`、`TAC_ZOOM_MAX` | 地图缩放范围 |
| `DUNGEON_ICON_URL` | 地窖图标 |
| `ESCAPE_DOOR_ICON_URL` | 逃生门图标 |
| `TAC_ZOOM_LOCK_ICONS` | 锁定和解锁 SVG |
| `TAC_ABYSS_MAX_M` | 水渊相关最大距离 |
| `TAC_SVG_NS` | SVG 命名空间，一般不用改 |

## 10.3 `js/data/geo.js`：坐标与距离

| 函数 | 用途 |
|---|---|
| `cipherOf(mapId, cipherId)` | 按 ID 查密码机，包含额外点位 |
| `calculateMapsZonesRelative()` | 把区域像素网格换算成相对坐标 |
| `calculateCiphersCoordsRelative()` | 把各组密码机坐标换算成相对坐标 |
| `calculateZoneCenters()` | 计算区域中心 |
| `calculateLockCipher()` | 找出离监管者位置最远的密码机 |

导出的 `mapsZonesRelative` 和 `ciphersCoordsRelative` 是预先计算好的数据，供区域和战术页面使用。

相对坐标通常是 `0～1`：无论图片在屏幕上被缩放到多大，都能把点位放回正确比例位置。修改坐标算法前，要先分清楚：

- 原始图片像素坐标；
- 屏幕显示像素坐标；
- `0～1` 相对坐标；
- 游戏内实际米数。

---

## 11. 多语言系统

## 11.1 文件分工

- `js/core/i18n.js`：翻译机制。
- `locales/zh-CN.json`：简体中文词典。
- `index.html`：通过 `data-i18n` 绑定静态文字。
- JS 和数据文件：通过 `translate()` 获取动态文字。

核心代码中不要重新写中文字符串。需要修改现有中文时，先在 `zh-CN.json` 搜索原文。

## 11.2 静态 HTML 文字

普通文本：

```html
<button data-i18n="ui.common.close"></button>
```

`title`、`placeholder`、`aria-label` 等属性通过 `data-i18n-attributes` 配置。初始化时，`translateDocument()` 会自动填充。

## 11.3 JavaScript 动态文字

无参数：

```js
translate('ui.common.settings')
```

有参数：

```js
translate('navigation.switchMap', { name: map.mapName })
```

语言包中对应：

```json
"navigation.switchMap": "已切换到「{name}」"
```

插值参数名要有意义，例如 `mapName`、`count`、`roleName`，不要使用 `value1`、`text2`。

## 11.4 翻译键命名

当前键按业务语境组织，例如：

```text
ui.application.title
application.homeMapCard
maps.armsFactory.mapName
characters.doctor.name
items.flashlight.name
numbers.one
```

新增键时建议保持同样风格：英语、语义明确、能看出来属于哪个模块。

## 11.5 新增一种语言

以英语为例：

1. 复制 `locales/zh-CN.json` 为 `locales/en-US.json`；
2. 保持所有键不变，只翻译值；
3. 在 `js/core/i18n.js` 中找到 `SUPPORTED_LOCALES`，加入 `'en-US'`；
4. 通过 `changeLocale('en-US')` 切换，或使用 `?lang=en-US` 测试；
5. 检查所有页面，尤其注意长文本、按钮换行和表格宽度。

不要删除某个语言包里的键；缺失时控制台会出现 `Missing translation`，界面可能直接显示键名。

---

## 12. 本地存档

浏览器业务存档键：

```text
idv5_tactic_v1
```

语言偏好使用另一个键：

```text
identityV.locale
```

### 12.1 战术板数据

`tacBoards` 按 `mapId` 分开保存。每张地图大致包含：

```js
{
  tokens: {},    // 角色标记
  arrows: [],   // 箭头和图形
  items: [],    // 道具
  measures: [], // 测距线及速度配置
  texts: []     // 地图文字
}
```

### 12.2 其它存档字段

| 字段 | 内容 |
|---|---|
| `v` | 存档版本 |
| `map` | 最近使用地图 |
| `boards` | 各地图战术板 |
| `display` | 战术显示设置 |
| `mstyle` | 直线和折线样式 |
| `regions` | 各地图阵营、选区和密码机组 |
| `dedMarks` | 各地图推演标记 |
| `dungeon` | 各地图地窖组 |
| `selDisplay` | 区域选择页显示设置 |

`saveRegionSel()` 会立即记录当前地图的选区、推演标记和地窖快照，再与 `tacSave()` 共用一个 400ms 防抖保存任务，一次写入全部待保存数据。切图从内存快照恢复，不必等待写入完成；页面隐藏或离开时立即写入尚未保存的修改。

仍使用 `idv5_tactic_v1` 和原有字段。加载旧存档时，`core/measurements.js` 会重建同一地图、同一折线各段共享的配置引用；新路线、配置及加成编号从已有存档的最大值继续分配。

### 12.3 清除存档排查问题

在浏览器开发者工具控制台执行：

```js
localStorage.removeItem('idv5_tactic_v1');
location.reload();
```

这会删除本工具保存的战术板、区域选择和推演标记，操作前请确认不再需要这些内容。

---

## 13. 常见修改任务一步一步做

## 13.1 修改按钮或说明文字

1. 打开 `locales/zh-CN.json`；
2. 搜索原文；
3. 只修改对应键的值，不要改键名；
4. 刷新页面。

如果新增文字：

- 静态 HTML 使用 `data-i18n`；
- JS 使用 `translate()`；
- 在 JSON 中添加相同键。

## 13.2 修改地图名称或底图

1. 中文地图名：在 `locales/zh-CN.json` 搜索旧名称；
2. 英文地图名：在 `maps.js` 找到目标地图的 `mapNameEn`；
3. 底图：修改同一块数据的 `mapImage`；
4. 如果换了尺寸不同的图片，同步修改 `mapSize`；
5. 检查所有点位是否仍与新底图对齐。

只换底图而不更新 `mapSize` 和点位，可能导致区域、密码机和道具位置全部偏移。

## 13.3 调整密码机位置或组合

1. 在 `maps.js` 找到目标地图；
2. 在 `ciphers` 中修改 `location`；
3. 坐标基于原始 `mapSize`，不是浏览器截图尺寸；
4. 如需改组合，修改 `cipherCombinations` 中的 ID；
5. 同时检查区域选择、推演页和战术面板。

## 13.4 修改推演规则

1. 在 `maps.js` 找到目标地图的 `deduction`；
2. 找到 `rules`；
3. 使用已有辅助函数增删规则；
4. 点位名称必须与 `ciphers` 的 `name` 完全一致；
5. 在推演页测试有、无、取消和矛盾标记。

只有所有地图通用的算法变化才需要修改 `deduce.js`。

## 13.5 新增一个简单角色

假设新增角色没有复杂道具：

1. 打开 `tactic-data.js` 的 `TAC_ROLES`；
2. 复制一个结构相近的角色；
3. 改成唯一英文键；
4. 设置 `camp`、`icon`，没有道具时使用空数组或参考现有结构；
5. 在语言包增加 `characters.yourRole.name`；
6. 将 `name` 设为对应 `translate()`；
7. 如有特殊速度，再配置 `speed` 或相关基础速度表；
8. 打开战术面板检查角色是否出现在正确阵营。

如果角色有道具，还要完成下一节。

## 13.6 新增一个道具

1. 在 `TAC_ITEM_TYPES` 中登记道具；
2. 设置唯一英文键、显示名和图标；
3. 需要范围圈时配置 `render` 和 `ranges.modes`；
4. 在拥有它的角色 `TAC_ROLES[role].items` 中加入道具键；
5. 在语言包补充名称和范围文案；
6. 测试放置、选中、拖动、删除、撤销和换图恢复。

连线或推动类特殊道具，还应参考结构最接近的现有道具，不要只复制名称和图标。

## 13.7 修改或新增加成

- 特质：修改 `TAC_MOVEMENT_BUFFS.trait`；
- 天赋：修改 `TAC_MOVEMENT_BUFFS.talent`；
- 其它：修改 `TAC_MOVEMENT_BUFFS.other`。

步骤：

1. 找到正确阵营；
2. 复制相近条目；
3. 设置唯一 `key` 或对象键；
4. 选择 `mult` 或 `levels`；
5. 按需设置 `duration`、`states`、`roles`、`forms`；
6. 补充语言包；
7. 检查添加、移除、分段适用范围和最终计算结果。

## 13.8 新增一个设置开关

这通常不是只改 HTML，完整流程为：

1. 在 `index.html` 对应设置卡片中添加控件和 ID；
2. 在 `core/dom.js` 增加共享引用，或在业务模块中用 `$()` 获取；
3. 在 `core/persist.js` 的默认设置中添加字段；
4. 在业务模块中绑定 `change` 事件；
5. 修改渲染逻辑，让开关真正生效；
6. 调用对应保存函数；
7. 在语言包添加标签和提示；
8. 刷新后确认设置能恢复。

## 13.9 修改快捷键

打开 `tactic.js`，搜索：

```js
window.addEventListener('keydown'
```

这里处理：

- Ctrl/Cmd + Z 撤销；
- WASD 和方向键微调；
- Esc 取消；
- Delete / Backspace 删除。

帮助弹窗中的快捷键说明位于语言包，修改行为后也要同步修改说明。

## 13.10 修改导出图片

搜索 `tacExportImage`。这里负责：

- 创建导出 Canvas；
- 绘制底图与战术元素；
- 处理是否只导出当前缩放区域；
- 导出 PNG；
- 处理跨域图片和导出失败提示。

如果底图跨域受限，应先检查图片服务器的 CORS 配置和加载时的 `crossOrigin`，不要只修改文件名。

---

## 14. 命名和代码组织约定

### 14.1 常见前缀

| 前缀或形式 | 含义 |
|---|---|
| `S.` | 跨页签共享状态 |
| `tac` | tactic，战术面板 |
| `ded` | deduction，密码机推演 |
| `sel` | selection，区域选择 |
| `mapId` | `MAPS_DATA` 数组下标 |
| `role` | 角色或角色键，需结合上下文判断 |
| `kind` | 道具或规则种类 |
| `idx`、`index` | 数组下标 |
| `El` | DOM 元素引用 |

### 14.2 数据和逻辑尽量分开

推荐：

- 新地图数据放 `maps.js`；
- 新角色和道具放 `tactic-data.js`；
- 新文案放语言包；
- 新通用算法才放业务 JS；
- 新样式放 `style.css`。

不推荐把新角色、新地图、新文案直接硬编码到 `tactic.js` 的事件处理里，否则以后难以维护。

### 14.3 模块依赖提醒

`region.js`、`shell.js`、`tactic.js`、`deduce.js` 和 `persist.js` 之间存在相互调用。当前 ES Module 可以处理这些引用，但修改导入、导出或模块顶层执行顺序时要谨慎。

如果新增功能只是某个页面内部使用，尽量保持局部，避免继续增加模块之间的循环依赖。

---

## 15. 常见问题排查

### 15.1 页面空白或语言包加载失败

检查：

1. 是否通过 `npm run dev` 访问，而不是双击 HTML；
2. `locales/zh-CN.json` 是否存在；
3. JSON 是否少了逗号、引号或括号；
4. 浏览器控制台是否出现 `Application initialization failed`。

### 15.2 界面显示了英文翻译键

例如直接看到 `ui.common.settings`，通常表示：

- JSON 中缺少该键；
- 键名拼写不一致；
- 语言包没有成功加载。

在控制台查找 `Missing translation:`。

### 15.3 地图或头像不显示

这些资源大量使用外部 URL。检查网络、图片地址是否失效，以及浏览器控制台中的跨域或资源加载错误。底图加载逻辑会自动重试，但外部服务器不可用时代码无法单独修复。

### 15.4 修改坐标后所有点都偏了

优先检查：

- 坐标是否基于原始 `mapSize`；
- 是否把屏幕坐标当成图片坐标；
- 新图片尺寸是否和 `mapSize` 一致；
- 区域顺序是否与 `zoneNames` 一致。

### 15.5 修改后看起来没有生效

依次检查：

1. 是否改了正确地图或正确角色；
2. 是否保存文件并刷新；
3. 是否被旧的 localStorage 设置覆盖；
4. 是否修改了数据，但显示文字实际来自语言包；
5. 是否存在浏览器或图片缓存。

### 15.6 新角色没有道具

检查：

- 道具是否已登记在 `TAC_ITEM_TYPES`；
- 道具键是否加入该角色的 `items`；
- 键名是否完全一致；
- 角色是否属于预期阵营。

### 15.7 推演规则没有按预期工作

检查：

- 规则使用的点位名是否与 `ciphers` 完全一致；
- `cipherCombinations` 是否引用了正确 ID；
- 是单条规则问题还是布局联立结果；
- 是否出现矛盾状态导致后续推演停止。

---

## 16. 修改后的检查清单

### 只改文案

- [ ] 没有漏掉语言包键；
- [ ] 没有把中文重新写进 HTML 或 JS；
- [ ] 长文案没有撑坏按钮、卡片和表格；
- [ ] 动态参数都已传入。

### 改地图数据

- [ ] 首页名称和底图正常；
- [ ] 区域选择点位正确；
- [ ] 推演页点位和布局正确；
- [ ] 战术面板地标正确；
- [ ] 米数和时间换算仍合理。

### 改角色或道具

- [ ] 角色按钮出现在正确阵营；
- [ ] 道具按钮能显示；
- [ ] 放置、拖动、选中、删除正常；
- [ ] 撤销正常；
- [ ] 换图后数据仍独立；
- [ ] 刷新后存档能恢复；
- [ ] 范围、连线和速度参数正确。

### 改交互逻辑

- [ ] 三个页签都能进入；
- [ ] 地图切换正常；
- [ ] 鼠标和触屏事件没有明显冲突；
- [ ] 控制台没有 JavaScript 报错；
- [ ] 本地存档没有丢失其它字段；
- [ ] 手机窄屏布局仍可使用。

---

## 17. 推荐阅读顺序

如果你是第一次接触这个项目，建议按下面顺序阅读，不要直接从四千多行的 `tactic.js` 开始：

1. **本 README 的目录结构和速查表**：先建立整体地图。
2. **`index.html`**：知道页面有哪些视图和控件。
3. **`bootstrap.js` → `main.js` → `shell.js`**：理解启动、首页和导航。
4. **`core/state.js` 和 `core/dom.js`**：理解共享状态和元素引用。
5. **`data/maps.js` 中一张地图**：先只看军工厂，不必一次读完九张图。
6. **`region.js`**：学习一个相对集中的业务页面。
7. **`data/tactic-data.js`**：了解角色、道具和速度配置。
8. **`tactic.js` 中与你任务相关的函数**：按功能阅读，不必通读。
9. **`deduce.js` 和推演辅助函数**：最后再研究规则引擎。

最重要的一句话是：**先判断要改的是文字、样式、数据还是逻辑，再用本文的速查表定位；不要为了改一个数值而通读整个项目。**


## 二维与三维地图切换

地图工具栏中的“切换三维”打开同一张三维地图，并同步当前选中测距线的起终点；未选中时取最近一条。折线取首尾，未完成的新起点只同步 A。跳转前保存二维战术板，三维页面可返回原地图。

三维端按自己的场景与参数重新计算；重叠楼层需要确认，无法对应通行面时给出提示。只同步测距端点。二维与 `/tactical-friend/3d/` 三维运行资源由本仓库统一发布，本地 `npm run dev` 也可打开这两个路径。旧 `/maps-3d/` 路径已退役，不提供兼容跳转。
