# 挂椅三维交互区官网发布 Implementation Plan

**Goal:** 将已验收 preview.14 计算逻辑发布到 pkuidv.com，并核对两个正式入口。

**Architecture:** 从私有源码 d279fd0 与已验收十图构建公开运行包，只同步精确的 31 项运行文件。保留公有 main 的二维更新、免责声明、地图目录和历史公告；全量极值数据与解析材料留私有侧。

**Tech Stack:** 既有 Node/Python 构建器、Playwright、GitHub Actions production 流程。

## 1. 生成与保真

运行私有 `node web/build.mjs --maps <preview.14离线地图>`，核对 worker 摘要及原模型/导航/物件数据块；公开地图目录保持原布局，更新公告版本和时间。

## 2. 本地验收

在 `maps-3d/` 同步运行包，保留 README 和第三方说明。运行 `npm run verify:release`，检查源应用、发布策略、完整资源、压缩哈希、双入口浏览器回归。

## 3. 正式发布

推送本分支并创建 PR，等待检查成功后按用户已有管理员发布授权合并。等待 production 工作流完成，核对两个正式入口版本、源码提交与 worker 摘要，再在真实网页计算挂椅路线。

## 4. 范围

网页本次继续实时计算。720 布局 × 1,119 移动条件预计算单独在本机运行，未完成的离线结果不复制到公有库。参考姿态来源与模型边界保留在计算说明中。
