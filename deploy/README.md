# 官网发布与资源管理

`main` 的 GitHub Actions 将二维与三维作为同一个发布包部署，两个入口共用一个原子 `current` 指针：

- https://pkuidv.com/tactical-friend/
- https://pkuidv.com/zhanshuyanlian/
- 对应的 `/3d/具体地图.html` 保持固定地址，往返保留入口前缀。

## 唯一配置入口

`deploy/asset-policy.json` 管理资源目录、缓存规则、压缩参数和入口前缀。`deploy/scripts/asset-policy.mjs` 是构建、清单、压缩和验证共用的实现。服务器配置与 Cloudflare 规则由此生成，禁止直接修改 `deploy/generated/`。

| 文件类型 | 版本与缓存 |
| --- | --- |
| 页面 HTML、固定资源地址 | 浏览器 `no-cache` 重新验证，CDN 绕过缓存，刷新即可获取最新入口 |
| 二维 JS/CSS、语言包、统计辅助脚本、三维辅助 JS/CSS/校准数据 | `_assets/<单文件指纹>/...`，浏览器与 CDN 一年 immutable |
| 三维地图 HTML | 固定地址读取轻量加载页；大地图独立存储于 `_assets/<指纹>/3d/地图.runtime-<内容哈希前16位>.html`，加载页绑定最终字节数和完整 SHA-256 |
| `__release.json`、`3d/__release.json`、`asset-manifest.json` | `no-store`，用于确认当前发布及每个文件的哈希/压缩/缓存类别 |
| 站外图片 | 按现有外链访问，不镜像、不改写；缓存由图片站点决定 |

版本按文件内容和构建策略计算，不含 Git 提交号、构建时间或文件修改时间。资源与策略不变时，重复构建及仅改变 Git 提交号不会改变资源 URL。每个文件独立计算指纹（策略版本与该文件 SHA-256），不把整组依赖或提交号放进资源 URL。Import map 的 scopes 将每个模块的相对导入映射到各自文件 URL，因此修改被依赖模块也不需要改写所有导入方。页面同时给语言包和三维校准数据提供精确资源映射。只改一张地图只改变该地图的运行文件和加载页 URL；共享脚本实际变化时，使用它的入口引用会相应更新。Git 提交号单独保留在发布元数据中用于追溯。

所有本站文本文件在构建阶段生成 `.gz` 和 `.br`，统一参数、相同修改时间，并验证解压后的 SHA-256。图片及三维内嵌压缩数据不会被有损重新编码。三维页面仍含较大的内嵌模型；本流程不会拆分或修改模型数据。

新版三维源码清单精确为 31 个公开运行文件：十个固定加载页、十个绑定地图运行页、列表页、发布说明 JSON、六个原有辅助文件及三个加载辅助文件。构建拒绝缺失、额外文件、链接以及错误的地图、嵌入 worker、路径、大小或 SHA-256 绑定；只允许附带两份不发布的 README/第三方说明。先验证收到的原始绑定，再改写依赖和统计脚本，并按最终运行页字节重新命名与绑定。地图文件较大时显示下载和准备进度，失败后保留重试入口。

`3d/__release.json` 的 `files`/`asset_urls` 保留旧接收协议的 18 个固定入口视图；`full_files`/`full_asset_urls` 明列全部 31 个文件，`full_asset_version` 覆盖完整清单，`runtime_urls` 逐地图列出运行页。全部 31 项同时进入根发布元数据和 `asset-manifest.json`，参与全局版本、SHA-256、压缩、预算及 immutable 路径检查；新增的 13 项经现有通用 client-assets 协议发布。CI 额外核验完整清单与加载绑定；既有接收器不解释新增字段，也不执行解压回验，解压后的内容一致性由 CI 检查。旧 18 文件格式仍可作为合法历史回滚输入。

## 日常开发与发布

使用 Node.js 24，在仓库根目录执行：

```sh
npm ci --ignore-scripts
npx playwright install chromium
npm run verify:release
npm --prefix deploy run preview
```

`verify:release` 一次运行应用测试、打包测试、接收器测试、策略漂移检查、浏览器回归、完整构建、全部文件压缩/哈希验证和构建产物浏览器测试。构建目录为 `deploy/dist/`，预览从 `http://localhost:8787/tactical-friend/` 或 `/zhanshuyanlian/` 打开。

日常资源更新只需修改源码并合并到 `main`。工作流自动构建、验证、发布，并检查两个公共入口的所有文件缓存策略与 gzip/Brotli 实际交付。PR 运行同样的构建检查，不发布。工作流仅检出公有仓库，不读取私有工具库。

更新缓存或压缩策略时：

```sh
npm --prefix deploy run policy:generate
npm --prefix deploy run policy:check
```

`generated/tactical.nginx.conf` 必须整体安装为服务器的战术组件路由；不要与旧的二维或三维 location 重复加载。它会返回 `X-PIL-Asset-Policy`，线上校验以此检查服务器是否使用当前策略。

`generated/cloudflare-cache-rules.json` 只管理 `pil_tactical_mutable_revalidate` 和 `pil_tactical_immutable_assets` 两个规则。更新时保留首页、抽签等其他组件规则，移除被替代的 `pil_stable_3d_html_one_minute` 规则，并将这两个战术规则放在其他通用规则之后。策略基础设施的变更需要管理员安装生成配置并验证；普通页面发布令牌没有服务器或 CDN 管理权限。策略未同步时线上验收会失败，不会把它报告成完整成功。

## 服务器接收与回滚

`deploy/server/receive.py` 是现有组件接收器的可审查源码。它保留首页的独立限制，只扩展战术资源验证。更新接收器前运行 `npm --prefix deploy run test:receiver`，备份现有文件，测试后重启接收服务。现有部署服务、认证令牌及其路径无需变更。

接收器校验完整资源清单、快照版本、文件哈希及压缩文件哈希；拒绝路径穿越、链接、未声明资源和同一 immutable URL 内容冲突。压缩/解压大小预算保持为战术组件 700 MiB/1 GiB、三维单文件 80 MiB。缺项或校验失败不切换 `current`。

- 历史三维快照仍保留于组件 `assets/<version>/`，用于保留已有 immutable URL。
- 新资源逐文件保留于组件 `assets/client/<单文件指纹>/`；固定地图地址链接到这里，因此重新发布不会因文件修改时间变化让未改的地图重新下载。
- 快照通过硬链接保留，常规发布目录清理不会删除浏览器仍可能引用的旧版本。
- `previous` 保留上一发布目录，用于回滚。旧 `/maps-3d/` 仍返回 404，不提供兼容跳转。

发布工作流仅在 `production` Environment 内读取 `CST_HOST` 和战术专用 `CST_DEPLOY_TOKEN`；不把凭据写入代码、产物或日志。统计保持原有隐私过滤，不上传战术标注、坐标、路线、完整状态或账户数据。资源升级不会清除 localStorage 中保存的战术。

三维地图列表及十张地图通过构建时注入的 `telemetry/maps.js` 记录页面访问，两个入口均覆盖。新版只在列表和最终运行页注入，加载页不发送第二次访问。统计仅接受固定地图路径，去掉查询参数、片段、身份和附加数据；不记录坐标交接或编辑内容。该脚本随其他资源独立哈希和预压缩，生成的三维 CSP 只增加 Umami 的脚本与连接来源。二维赞助链接统一使用 `sponsor_afdian_open`，只附带应用及入口类别。DNT、开发域名和直接打开的内部版本资源不发送新增三维统计。
