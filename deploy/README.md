# 官网发布

本目录包含战术工具的静态打包、匿名统计与发布校验代码。

正式入口：

- [战术演练](https://pkuidv.com/tactical-friend/)
- [战术演练备用入口](https://pkuidv.com/zhanshuyanlian/)

`main` 更新后，GitHub Actions 运行应用与部署测试，构建静态文件，再发布并核对两个入口的版本。PR 只运行检查，不部署。也可在 Actions 手动执行。

## 本地检查

在仓库根目录运行：

```sh
npm --prefix deploy test
npm --prefix deploy run build
npm --prefix deploy run preview
```

预览地址为 `http://localhost:8787/`，构建结果位于 `deploy/dist/`。打包只包含页面、样式、应用脚本、语言包与统计脚本。

## 发布配置

发布任务使用 `production` Environment，其部署分支应限定为 `main`。该环境需配置 `CST_HOST` 和战术工具专用的 `CST_DEPLOY_TOKEN` 两项 Secrets；凭据只注入发布步骤，不写入源码、构建产物或日志。

`main` 的分支规则应要求 CODEOWNERS 审查发布代码变更。仅添加 CODEOWNERS 文件不会自动启用强制审查，需要仓库管理员配置分支规则。

统计脚本保留现有事件及隐私过滤规则，不上报标注文字、精确坐标、路线或完整战术内容。本地预览不向正式统计发送事件。
