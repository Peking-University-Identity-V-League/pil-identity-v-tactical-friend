# 官网三维地图运行文件

线上入口：[pkuidv.com/tactical-friend/3d/](https://pkuidv.com/tactical-friend/3d/)。二维入口是 [pkuidv.com/tactical-friend/](https://pkuidv.com/tactical-friend/)。

本目录接管原 `/maps-3d/` 已公开部署的 18 个运行文件，包括十个地图页面、地图列表、前端脚本、样式、坐标校准和版本信息。迁移基准为 `d881d1fb0bf3aad2bc8a076707d9ed57c59623d7`，页面保持该生产版本的原始字节；迁移不引入其他开发分支的功能变更。

二维应用及本目录由本仓库的 `main` 分支统一检查、打包和发布。发布构建不读取私有仓库，也不需要私有仓库凭据。地图版本由全部运行文件的 SHA-256 清单计算；版本文件保留长期缓存，固定入口重新验证并保留查询参数及坐标片段。

本地可直接打开 `index.html`，或从仓库根目录运行 `npm run dev`，访问 `/tactical-friend/3d/`。部署构建：`npm --prefix deploy run build`。

资源提取、格式解析、模型重建、缓存与研究材料留在内部工具库。更新地图时，由工具库生成并验证候选成品，只将本目录列出的运行文件作为公开发布变更提交。`deploy/scripts/maps3d.mjs` 使用精确文件清单，额外文件、缺失文件和符号链接都会使构建失败。

地图资源快照仍为 `2.104.3075708 / 2026-10-23`。地图、贴图及其他第三方内容的权利不因本次仓库迁移而改变，详见 [第三方说明](THIRD_PARTY_NOTICES.md)。
