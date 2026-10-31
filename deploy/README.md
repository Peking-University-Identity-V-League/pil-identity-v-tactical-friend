# 官网发布

本目录包含战术工具的静态打包、匿名统计与发布校验代码。

正式入口：

- [战术演练](https://pkuidv.com/tactical-friend/)
- [三维地图](https://pkuidv.com/tactical-friend/3d/)
- [战术演练备用入口](https://pkuidv.com/zhanshuyanlian/)
- [备用入口三维地图](https://pkuidv.com/zhanshuyanlian/3d/)

`main` 更新后，GitHub Actions 运行应用与部署测试，将二维与三维构建为一个静态包，原子发布后核对所有入口的版本。PR 只运行检查，不部署。也可在 Actions 手动执行。工作流仅使用本公有库的检出，不读取私有仓库。

## 本地检查

在仓库根目录运行：

```sh
npm --prefix deploy test
npm --prefix deploy run build
npm --prefix deploy run preview
```

预览地址为 `http://localhost:8787/`，构建结果位于 `deploy/dist/`。打包仅包含二维运行文件、统计脚本和 `maps-3d/` 精确清单内的 18 个三维运行文件。三维带路径导航的本地预览使用根目录 `npm run dev`。

三维文件写入 `3d/releases/<64位内容哈希>/`，附带可解压回原始内容的 Brotli/gzip 文件。接收器创建内部运行目录链接，由同一个原子 `current` 指针选择二维与三维内容。浏览器使用 `/tactical-friend/3d/具体地图.html` 或 `/zhanshuyanlian/3d/具体地图.html`，切换及返回均保留原入口，不跳转到版本目录；查询参数与片段保留在原地址。版本信息位于 `3d/__release.json`。只有带版本号的资源使用一年 immutable 缓存，固定 HTML 地址由浏览器重新验证，CDN 可短期缓存。

服务器接收器需支持战术组件 700 MiB 压缩包、1 GiB 解压总量、三维单文件 80 MiB，并校验三维清单、内容哈希与不可覆盖的版本文件。首页组件原有小包限制不变。部署失败时不切换当前目录；`previous` 指针保留上一版用于回滚。旧 `/maps-3d/` 入口和旧版本路径已退役，返回 404，不提供兼容跳转。

## 发布配置

发布任务使用 `production` Environment，其部署分支应限定为 `main`。该环境需配置 `CST_HOST` 和战术工具专用的 `CST_DEPLOY_TOKEN` 两项 Secrets；凭据只注入发布步骤，不写入源码、构建产物或日志。

`main` 的分支规则应要求 CODEOWNERS 审查发布代码变更。仅添加 CODEOWNERS 文件不会自动启用强制审查，需要仓库管理员配置分支规则。

统计脚本保留现有事件及隐私过滤规则，不上报标注文字、精确坐标、路线或完整战术内容。本地预览不向正式统计发送事件。
