# 三维地图目录更新公告 Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 在地图选择下方展示用户确认的五项更新，并标明当前工具版本和北京时间。

**Architecture:** 只修改公开仓库 `maps-3d/index.html`，在十张地图链接后增加默认展开的静态公告。沿用目录现有配色、字体与圆角，不增加脚本、外部资源或计算功能。

**Tech Stack:** 自包含 HTML/CSS、现有 Node 构建与 GitHub Actions 发布流程。

## 实施步骤

1. 公告标题为“更新公告”，标明 `v0.17.0-preview.10`、带时区的更新时间，列出搏命、双向挂椅、极值点、颜色图例和第三人称等五项更新。排名文案保留“当前配置”“候选点”的准确范围。
2. 使用语义化 `section`、`h2`、`time`、列表，复用现有目录视觉；版本与时间允许换行，公告放在地图网格之后。
3. 在真实浏览器查看桌面及 320 像素截图，确认公告顺序、十个地图链接、元数据和窄屏无横向溢出；本次为静态文案，沿用现有测试，不新增实现镜像测试。
4. 构建并核验发布包，提交公开仓库，使用现有生产流程检查并发布。确认两个线上入口均显示公告后交付链接。
