# 三维运行文件的第三方说明

本目录是已公开部署的浏览器运行文件，不包含资源提取或原始游戏资源包。本次迁移不为游戏素材或未明确授权的代码新增开源许可。

页面内嵌 Three.js revision 159、GLTFLoader、OrbitControls 和 BufferGeometryUtils，原 MIT 许可及源码头随生成页面保留。地图模型、贴图、布局、导航和碰撞来自固定版本游戏资源，权利归各自权利人所有。

平面地图参考了 Wiki 提供的游戏小地图，底图在构建时无损转换；夜间红教堂与地下室示意图由场景几何生成。这些说明不构成对游戏图片的重新许可。

角色数值、天赋说明、社区地点名称及出生点参考了 IDV Tactic 与 Wiki 资料。运行文件不包含参考站点的应用程序源码；数据快照与校准不代表已逐项完成实机核验。内部工具库保留详细来源、构建与校准记录。

## Three.js license

The MIT License

Copyright © 2010-2023 three.js authors

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

## Recast Navigation / recast-navigation-js 0.44.0

三维求路使用 Recast/Detour 及 Isaac Mason 的 JavaScript/WebAssembly 移植。源导航面约束、经典离线 worker 打包和结果校验适配属于本项目修改，不代表未经修改的上游输出。运行 worker 保留原许可说明；不从外部 CDN 加载求路代码。

The MIT License

Copyright © 2025 Isaac Mason

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.

### Recast & Detour notice

@recast-navigation/wasm, a port of recast navigation to JavaScript.
https://github.com/isaac-mason/recast-navigation-js
recastnavigation
https://github.com/recastnavigation/recastnavigation
Recast & Detour 
Copyright (c) 2009 Mikko Mononen memon@inside.org

This software is provided 'as-is', without any express or implied
warranty.  In no event will the authors be held liable for any damages
arising from the use of this software.

Permission is granted to anyone to use this software for any purpose,
including commercial applications, and to alter it and redistribute it
freely, subject to the following restrictions:

1. The origin of this software must not be misrepresented; you must not
claim that you wrote the original software. If you use this software
in a product, an acknowledgment in the product documentation would be
appreciated but is not required.
2. Altered source versions must be plainly marked as such, and must not be
misrepresented as being the original software.
3. This notice may not be removed or altered from any source distribution.
