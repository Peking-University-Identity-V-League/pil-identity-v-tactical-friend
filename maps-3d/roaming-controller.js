import {installKeyboardCamera} from 'camera-controls';
import {installWorldCollision} from 'world-collision';
import {installCollisionDisplay} from 'collision-display';

// Keep the V15 route timeline authoritative. This controller owns only the
// manual avatar, camera and collision display; it never computes route time.
const textRows = [
 ['俯瞰移动速度','俯瞰移動速度','Overview movement speed'],
 ['俯瞰相机移动速度','俯瞰相機移動速度','Overview camera movement speed'],
 ['俯瞰相机移动速度数值','俯瞰相機移動速度數值','Overview camera movement speed value'],
 ['数值（1–100 米/秒）','數值（1–100 米/秒）','Value (1–100 m/s)'],
 ['仅用于俯瞰相机移动；Shift 可临时加速。设置自动保存。','僅用於俯瞰相機移動；Shift 可暫時加速。設定自動儲存。','Controls overview camera movement only. Hold Shift for a temporary boost. The setting is saved automatically.'],
 ['附近没有可安全站立并移动的位置，请换一个位置再进入第三人称。','附近沒有可安全站立並移動的位置，請換一個位置再進入第三人稱。','No nearby position has standing clearance and a walkable exit. Choose another location.'],
 ['A 点附近没有可安全站立并移动的位置，请重新选择出发位置。','A 點附近沒有可安全站立並移動的位置，請重新選擇出發位置。','No safe standing and walking position was found near A. Choose another start.'],
 ['已将漫游人物放到同层附近可行走的位置。','已將漫遊人物放到同層附近可行走的位置。','The avatar was placed at a nearby walkable position on the same level.'],
 ['已从 A 点附近的可行走位置出发，测距点保持原位。','已從 A 點附近的可行走位置出發，測距點保持原位。','Starting from a walkable position near A; measurement endpoints are preserved.'],
 ['视角与漫游','視角與漫遊','Camera and roaming'],
 ['启用移动','啟用移動','Enable movement'],
 ['相机模式','相機模式','Camera mode'],
 ['俯瞰模式','俯瞰模式','Overview'],
 ['第三人称','第三人稱','Third person'],
 ['显示碰撞范围','顯示碰撞範圍','Show collision'],
 ['紫色：全图源碰撞网格','紫色：全圖來源碰撞網格','Purple: source collision mesh'],
 ['橙框：附加阻挡盒','橙框：附加阻擋盒','Orange: active obstacle boxes'],
 ['红线：导航面边缘','紅線：導航面邊緣','Red: navigation edges'],
 ['青色：人物判定范围','青色：人物判定範圍','Cyan: avatar capsule'],
 ['开关只控制显示；全图源碰撞始终参与手动行走。人物胶囊与下落为浏览近似，路线测算按窗板可通行规则进行。','開關僅控制顯示；全圖來源碰撞始終參與手動行走。人物膠囊與下落為瀏覽近似，路線測算按窗板可通行規則進行。','The toggle controls visualization. Source collision always applies to manual movement. The avatar capsule and falling are browsing approximations; route planning permits window and pallet crossings.'],
 ['从 A 点出发','從 A 點出發','Start from A'],
 ['前后左右','前後左右','Move'],
 ['浏览加速','瀏覽加速','Browse faster'],
 ['漫游速度来源','漫遊速度來源','Manual speed source'],
 ['跟随角色','跟隨角色','Follow character'],
 ['档位吸附','檔位吸附','Speed presets'],
 ['自由调速','自由調速','Custom speed'],
 ['手动漫游速度','手動漫遊速度','Manual roaming speed'],
 ['野人','野人','Wildling'],['求生','求生','Survivor'],['监Ⅰ','監Ⅰ','Hunter I'],['监Ⅱ','監Ⅱ','Hunter II'],['监Ⅲ','監Ⅲ','Hunter III'],['喧嚣','喧囂','Hullabaloo'],['女巫','女巫','Witch'],['灵体','靈體','Yithian'],
 ['角色与状态档位','角色與狀態檔位','Character and state preset'],
 ['移速档位','移速檔位','Speed preset'],
 ['自定义速度（1–40 米/秒）','自訂速度（1–40 米/秒）','Custom speed (1–40 m/s)'],
 ['恢复当前角色跑速','恢復目前角色跑速','Use selected character speed'],
 ['档位数值参考','檔位數值參考','Speed preset source:'],
 ['（2026-10-27 核对），只设置手动移速。','（2026-10-27 核對），僅設定手動移速。','(checked 2026-10-27). Presets affect manual movement only.'],
 ['降低／抬高视角。鼠标旋转、缩放，移动中可标 A/B。','降低／抬高視角。滑鼠旋轉、縮放，移動中可標 A/B。','Lower / raise the camera. Drag and zoom with the mouse; A/B picking remains available.'],
 ['鼠标转向，滚轮调远近；Esc 释放光标后可标点。触屏拖动环视、方向键移动。斜碰障碍可贴墙滑动，无障碍楼沿可下落。手动翻窗翻板尚未模拟；路线动画按测算时间通过。','滑鼠轉向，滾輪調遠近；Esc 釋放游標後可標點。觸控拖動環視、方向鍵移動。斜碰障礙可貼牆滑動，無障礙樓沿可下落。手動翻窗翻板尚未模擬；路線動畫按測算時間通過。','Look with the mouse and zoom with the wheel; Esc releases the cursor for picking. Touch users can drag to look and use the direction pad. Move along walls and fall from open edges. Manual vaulting is not simulated; route playback uses the calculated vault time.'],
 ['WASD 移动 · Shift 加速 · Esc 释放鼠标后标点','WASD 移動 · Shift 加速 · Esc 釋放滑鼠後標點','WASD move · Shift faster · Esc release cursor to pick'],
 ['人物移动','人物移動','Avatar movement'],['向前','向前','Forward'],['向左','向左','Left'],['向后','向後','Backward'],['向右','向右','Right'],
 ['{speed} 米/秒','{speed} 米/秒','{speed} m/s'],
 ['跟随当前测算角色','跟隨目前測算角色','Following the selected planning character'],
 ['采用当前角色的基础跑速与持续倍率；翻越后天赋加速由路线时间轴表现。','採用目前角色的基礎跑速與持續倍率；翻越後天賦加速由路線時間軸表現。','Uses the selected character’s base running speed and continuous multiplier. Post-vault talent boosts are represented by the route timeline.'],
 ['自定义速度仅用于手动漫游。','自訂速度僅用於手動漫遊。','Custom speed applies only to manual roaming.'],
 ['Shift 为三倍浏览加速；漫游设置不改变路线计算或播放时间。','Shift 為三倍瀏覽加速；漫遊設定不改變路線計算或播放時間。','Shift gives 3× browsing speed. Roaming settings do not change route calculation or playback timing.'],
 ['释放鼠标 · Esc','釋放滑鼠 · Esc','Release mouse · Esc'],['开启鼠标控制','開啟滑鼠控制','Lock mouse'],
 ['正在载入全图碰撞，完成后可行走。','正在載入全圖碰撞，完成後可行走。','Loading source collision. Walking will be enabled when ready.'],
 ['全图碰撞载入失败：{error}。请刷新页面重试。','全圖碰撞載入失敗：{error}。請重新載入頁面。','Source collision failed: {error}. Reload the page to retry.'],
 ['俯瞰：鼠标拖动旋转，WASD 水平平移','俯瞰：滑鼠拖動旋轉，WASD 水平平移','Overview: drag to rotate; WASD pans horizontally'],
 ['鼠标控制中 · Esc 释放后可标点','滑鼠控制中 · Esc 釋放後可標點','Mouse locked · Esc releases it for picking'],
 ['光标已释放 · 可标点，或右键拖动环视','游標已釋放 · 可標點，或右鍵拖動環視','Cursor released · pick points or right-drag to look'],
 ['浏览器不支持鼠标锁定，可按住右键拖动环视。','瀏覽器不支援滑鼠鎖定，可按住右鍵拖動環視。','Pointer lock is unavailable. Hold the right mouse button and drag to look.'],
 ['鼠标锁定未成功；可再点一次，或按住右键拖动环视。','滑鼠鎖定未成功；可再點一次，或按住右鍵拖動環視。','Pointer lock failed. Try again, or hold the right mouse button and drag to look.'],
 ['没有可用通行面，暂时无法进入第三人称。','沒有可用通行面，暫時無法進入第三人稱。','No usable navigation surface is available for third-person mode.'],
 ['请先在地图上标记 A 点，再从 A 点出发。','請先在地圖上標記 A 點，再從 A 點出發。','Mark point A on the map before starting from A.'],
 ['A 点所在通行面不可用，请重新标点。','A 點所在通行面不可用，請重新標點。','The surface at A is unavailable. Pick A again.'],
 ['全图 {triangles} 个碰撞三角面 · {boxes} 个附加盒 · {boundaries} 段通行边界。','全圖 {triangles} 個碰撞三角面 · {boxes} 個附加盒 · {boundaries} 段通行邊界。','{triangles} source collision triangles · {boxes} active boxes · {boundaries} navigation edges.'],
 ['路线演示中：沿规划线播放，不执行手动碰撞判断。','路線演示中：沿規劃線播放，不執行手動碰撞判斷。','Route playback follows the planned line; manual collision checks are not applied.'],
 ['正在下落，落地后恢复贴地行走。','正在下落，落地後恢復貼地行走。','Falling. Ground movement resumes after landing.'],
 ['被源碰撞网格挡住（物件 {id}，白线标出碰撞面）。','被來源碰撞網格擋住（物件 {id}，白線標出碰撞面）。','Blocked by source collision (object {id}); the contact face is highlighted in white.'],
 ['全图碰撞尚未就绪，手动行走已暂停。','全圖碰撞尚未就緒，手動行走已暫停。','Source collision is not ready; manual walking is paused.'],
 ['被附加阻挡盒 {id} 挡住。','被附加阻擋盒 {id} 擋住。','Blocked by active obstacle box {id}.'],
 ['被通行面高度接缝挡住。','被通行面高度接縫擋住。','Blocked by a navigation height discontinuity.'],
 ['被通行边界或手动封闭区域挡住。','被通行邊界或手動封閉區域擋住。','Blocked by a navigation edge or a manually closed area.'],
 ['人物判定范围随位置同步。','人物判定範圍隨位置同步。','The avatar collision shape follows its position.'],
 ['进入第三人称可查看人物判定范围。','進入第三人稱可查看人物判定範圍。','Enter third-person mode to see the avatar collision shape.'],
 ['正在沿接触面切线滑动。','正在沿接觸面切線滑動。','Sliding along the contact surface.'],
 ['镜头遇模型遮挡，已缩近；与人物阻挡分别判定。','鏡頭遇模型遮擋，已縮近；與人物阻擋分別判定。','The camera moved closer to avoid an obstruction; camera and avatar collisions are checked separately.'],
 ['等待地图载入后显示碰撞范围。','等待地圖載入後顯示碰撞範圍。','Waiting for the map before showing collision.'],
 ['野人（未骑乘）','野人（未騎乘）','Wildling (unmounted)'],['普通求生者','普通求生者','Ordinary survivor'],['监管一档','監管一檔','Hunter preset I'],['监管二档','監管二檔','Hunter preset II'],['监管三档','監管三檔','Hunter preset III'],['梦之女巫·本体','夢之女巫·本體','Dream Witch (main body)'],['时空之影·伊斯人','時空之影·伊斯人','The Shadow (Yithian)'],
 ['野人未骑乘时的基础跑动，采用公开近似值 3.65 米/秒。','野人未騎乘時的基礎跑動，採用公開近似值 3.65 米/秒。','Unmounted Wildling: published approximate base speed of 3.65 m/s.'],
 ['普通求生者基础跑动 · 45 坐标单位/秒 ≈ 3.80 游戏米/秒。','普通求生者基礎跑動 · 45 座標單位/秒 ≈ 3.80 遊戲米/秒。','Ordinary survivor: 45 source units/s, approximately 3.80 game m/s.'],
 ['约 4.56 米/秒，例如小丑、梦之女巫原生与寄生信徒；不含信徒脱控跟随加速。','約 4.56 米/秒，例如小丑、夢之女巫原生與寄生信徒；不含信徒脫控跟隨加速。','Approximately 4.56 m/s: e.g. Smiley Face and Dream Witch followers; excludes uncontrolled follower catch-up speed.'],
 ['约 4.64 米/秒，例如红夫人；采用无其他加减速的基础移动档位。','約 4.64 米/秒，例如紅夫人；採用無其他加減速的基礎移動檔位。','Approximately 4.64 m/s: e.g. Bloody Queen; base movement without modifiers.'],
 ['约 4.73 米/秒，例如厂长、杰克；不含厂长技能加速或杰克雾隐、雾区加速。','約 4.73 米/秒，例如廠長、傑克；不含廠長技能加速或傑克霧隱、霧區加速。','Approximately 4.73 m/s: e.g. Hell Ember and the Ripper; excludes skill and fog speed bonuses.'],
 ['喧嚣基础移动，采用公开近似值 5.10 米/秒，不含其他加减速。','喧囂基礎移動，採用公開近似值 5.10 米/秒，不含其他加減速。','Hullabaloo: published approximate base speed of 5.10 m/s without modifiers.'],
 ['女巫本体约 6.08 米/秒；原生和寄生信徒属于监管一档，不是本体速度。','女巫本體約 6.08 米/秒；原生和寄生信徒屬於監管一檔，不是本體速度。','Dream Witch main body: approximately 6.08 m/s. Followers use hunter preset I.'],
 ['伊斯人灵体约 7.59 米/秒，仅选择移速；不改变当前路线的角色交互规则。','伊斯人靈體約 7.59 米/秒，僅選擇移速；不改變目前路線的角色互動規則。','Yithian: approximately 7.59 m/s. This selects manual speed, without changing route interaction rules.'],
 ['碰撞数据格式不匹配','碰撞資料格式不符','Collision schema mismatch'],['碰撞顶点数据无效','碰撞頂點資料無效','Invalid collision vertices'],['碰撞面索引不连续','碰撞面索引不連續','Non-contiguous collision face indices'],['碰撞面索引越界','碰撞面索引超出範圍','Collision face index out of range'],['碰撞顶点索引越界','碰撞頂點索引超出範圍','Collision vertex index out of range'],['碰撞面数据不完整','碰撞面資料不完整','Incomplete collision faces'],['内嵌碰撞数据校验失败','內嵌碰撞資料校驗失敗','Embedded collision digest mismatch'],['碰撞源文件校验不一致','碰撞來源檔案校驗不一致','Collision source digest mismatch'],
];
const translations = new Map(textRows.map(row => [row[0], row]));

export function installRoaming({THREE,camera,controls,canvas,scene,unitsPerMeter,payload,isReady,invalidate,
 getNavigation,getCameraMeshes,getSceneBoxes,getBlockedPolygons,getStartPoint,getMovementProfile=()=>null,
 onManualMove=()=>{},onModeChange=()=>{},onSpeedChange=()=>{}}) {
 let language='zh-CN';
 const originalText=new WeakMap();
 const translate=(text,values={})=>{
  const row=translations.get(text),index=language==='en'?2:language==='zh-TW'?1:0;
  return (row?.[index]??text).replace(/\{(\w+)\}/g,(_,key)=>String(values[key]??''));
 };
 const world=installWorldCollision({THREE,payload,invalidate});
 const keyboard=installKeyboardCamera({THREE,camera,controls,canvas,scene,unitsPerMeter,
  isReady,invalidate,getNavigation,getCameraMeshes,getSceneBoxes,getBlockedPolygons,getStartPoint,getMovementProfile,
  isInputActive:()=>document.body.dataset.mapView!=='planar',
  getWorldCollision:()=>world,onManualMove,onModeChange,onSpeedChange,translate});
 const display=installCollisionDisplay({THREE,scene,unitsPerMeter,isReady,getNavigation,getSceneBoxes,
  getBlockedPolygons,cameraController:keyboard,worldCollision:world,invalidate,translate});
 function setLanguage(next){
  language=['zh-CN','zh-TW','en'].includes(next)?next:'zh-CN';
  for(const el of document.querySelectorAll('[data-roaming-text]')){
   if(!originalText.has(el))originalText.set(el,el.textContent);
   el.textContent=translate(originalText.get(el));
  }
  for(const el of document.querySelectorAll('[data-roaming-aria]'))el.setAttribute('aria-label',translate(el.dataset.roamingAria));
  keyboard.setLanguage(language);display.setLanguage(language);invalidate();
 }
 function positionOverlay(){
  const crosshair=document.querySelector('#camera-crosshair'),pad=document.querySelector('#camera-touch-pad');
  const rect=canvas.getBoundingClientRect(),visible=rect.width>0&&rect.height>0;
  if(crosshair){
   crosshair.hidden=!visible||document.pointerLockElement!==canvas;
   crosshair.style.left=(rect.left+rect.width/2)+'px';crosshair.style.top=(rect.top+rect.height/2)+'px';
  }
  if(pad){
   pad.hidden=!visible||!keyboard.isThirdPerson();
   pad.style.right='auto';pad.style.bottom='auto';
   pad.style.left=Math.max(rect.left+8,rect.right-pad.offsetWidth-12)+'px';
   pad.style.top=Math.max(rect.top+8,rect.bottom-pad.offsetHeight-12)+'px';
  }
 }
 const overlayObserver=typeof ResizeObserver!=='undefined'?new ResizeObserver(positionOverlay):null;
 overlayObserver?.observe(canvas);window.addEventListener('resize',positionOverlay);
 setLanguage(language);
 return {
  update(now){const changed=keyboard.update(now);display.update();positionOverlay();return changed;},
  beforeFrame(){keyboard.clearKeys();keyboard.setMode('overview');},
  setMode(mode){const ok=keyboard.setMode(mode);positionOverlay();return ok;},isThirdPerson:keyboard.isThirdPerson,
  startFromA(){const ok=keyboard.startFromA();positionOverlay();return ok;},
  syncMovementProfile:keyboard.syncMovementProfile,showRoutePose:keyboard.showRoutePose,releaseRoutePose:keyboard.releaseRoutePose,
  clearKeys:keyboard.clearKeys,speed:keyboard.speed,speedState:keyboard.speedState,setSpeedMode:keyboard.setSpeedMode,
  cameraMovement:keyboard.stats,worldCollision:world.stats,collisionDisplay:display.stats,setLanguage,
  stats(){return {language,camera:keyboard.stats(),movement:keyboard.speedState(),world:world.stats(),collision:display.stats()};},
 };
}
