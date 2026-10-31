import { test, expect, tool, clickPoint, pickRole } from './helpers.js';

// 范围管理框（一级黄 / 二级绿 / 天赋行 / 填充 / 换行）常驻回归。

const rangeBox = (page) =>
  page.locator('#tacManageList .tac-manage-box:has(.tac-range-opt)').first();
const lv1 = (page, text) =>
  rangeBox(page).locator('.tac-range-opt:not(.tac-range-sub)', { hasText: text });
const lv2 = (page, text) =>
  rangeBox(page).locator('.tac-range-sub', { hasText: text });

async function placeRole(page, role, x = 0.3, y = 0.3) {
  await tool(page, 'roles');
  await pickRole(page, role);
  await clickPoint(page, x, y);
  await tool(page, 'select');
  await clickPoint(page, x, y);
}

test('range box: level-1 shows subs without lighting; subs toggle manually (explorer)', async ({ page }) => {
  await placeRole(page, 'explorer');
  // 一级按钮统一为三个
  await expect(rangeBox(page).locator('.tac-range-opt:not(.tac-range-sub)')).toHaveText(['显示特质范围', '显示天赋范围', '隐藏范围']);
  await lv1(page, '显示特质范围').click();
  await expect(lv1(page, '显示特质范围')).toHaveClass(/active/);
  // 一级按钮只展示二级按钮，不点亮；范围不显示
  await expect(lv2(page, '监管者感知范围')).toHaveCount(1);
  await expect(lv2(page, '监管者感知范围')).not.toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(0);
  // 亲手点击二级按钮才点亮
  await lv2(page, '监管者感知范围').click();
  await expect(lv2(page, '监管者感知范围')).toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(1);
  // 多选：点另一个则两个同时点亮，两个范围同时显示
  await lv2(page, '密码书页最远刷新范围').click();
  await expect(lv2(page, '密码书页最远刷新范围')).toHaveClass(/active/);
  await expect(lv2(page, '监管者感知范围')).toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(2);
  // 再点已选中的二级按钮：只取消该档，另一档仍亮
  await lv2(page, '密码书页最远刷新范围').click();
  await expect(lv2(page, '密码书页最远刷新范围')).not.toHaveClass(/active/);
  await expect(lv2(page, '监管者感知范围')).toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(1);
  // 切天赋一级：特质二级行隐藏
  await lv1(page, '显示天赋范围').click();
  await expect(lv2(page, '监管者感知范围')).toHaveCount(0);
  await expect(lv2(page, '韦伯定律')).toHaveCount(1);
});

test('range box: role without ranges still gets unified level-1 (forward)', async ({ page }) => {
  await placeRole(page, 'forward', 0.5, 0.5);
  await expect(rangeBox(page).locator('.tac-box-title')).toHaveCount(1);
  await expect(rangeBox(page).locator('.tac-range-opt:not(.tac-range-sub)')).toHaveText(['显示特质范围', '显示天赋范围', '隐藏范围']);
  // 无特质子范围
  await lv1(page, '显示特质范围').click();
  await expect(rangeBox(page).locator('.tac-range-sub')).toHaveCount(0);
});

test('range box: default group level-1 button is yellow on first selection (catapult item)', async ({ page }) => {
  await tool(page, 'roles');
  await pickRole(page, 'toyMerchant');
  await clickPoint(page, 0.2, 0.4);
  await page.locator('.tac-item[data-kind="catapult"]').click();
  await clickPoint(page, 0.45, 0.4);
  await tool(page, 'select');
  await clickPoint(page, 0.45, 0.4);
  // 道具一级按钮统一为两个；默认显示范围：二级「弹射板车范围」绿，一级「显示道具范围」同时变黄
  await expect(rangeBox(page).locator('.tac-range-opt:not(.tac-range-sub)')).toHaveText(['显示道具范围', '隐藏范围']);
  await expect(lv2(page, '弹射板车范围')).toHaveClass(/active/);
  await expect(lv1(page, '显示道具范围')).toHaveClass(/active/);
  await expect(page.locator('.tac-item-circle')).toHaveCount(1);
});

test('range box: unchecking fill keeps the range visible (musicbox)', async ({ page }) => {
  await tool(page, 'roles');
  await pickRole(page, 'femaleDancer');
  await clickPoint(page, 0.2, 0.6);
  await page.locator('.tac-item[data-kind="fastMusicbox"]').click();
  await clickPoint(page, 0.4, 0.6);
  await tool(page, 'select');
  await clickPoint(page, 0.4, 0.6);
  const circle = page.locator('.tac-item-circle');
  await expect(circle).toHaveCount(1);
  // 道具没有「显示天赋范围」
  await expect(lv1(page, '显示天赋范围')).toHaveCount(0);
  // 默认勾选范围填充；首次取消只取消填充，不隐藏范围
  const fillCb = rangeBox(page).locator('.tac-range-fill input');
  await expect(fillCb).toBeChecked();
  await fillCb.uncheck();
  await expect(circle).toHaveCount(1);
  await expect(fillCb).not.toBeChecked();
});

test('range box: customize has icon, no talents, slider radius 0 hides circle', async ({ page }) => {
  await placeRole(page, 'customize', 0.5, 0.2);
  // 图标正常渲染
  await expect(page.locator('.tac-token[data-role="customize"] img')).toHaveCount(1);
  // camp=other 一级按钮统一为：显示范围 / 隐藏范围，不显示天赋范围
  await expect(lv1(page, '显示天赋范围')).toHaveCount(0);
  await expect(rangeBox(page).locator('.tac-range-opt:not(.tac-range-sub)')).toHaveText(['显示范围', '隐藏范围']);
  await lv1(page, '显示范围').click();
  await expect(lv1(page, '显示范围')).toHaveClass(/active/);
  // 二级按钮「自定义范围」未点亮：无范围调节、无范围圈
  const slider = rangeBox(page).locator('input[type="range"]');
  const roleCircle = page.locator('.tac-role-circle[data-role="customize"]');
  await expect(lv2(page, '自定义范围')).not.toHaveClass(/active/);
  await expect(slider).toHaveCount(0);
  await expect(roleCircle).toHaveCount(0);
  // 点亮后出现范围调节，拖到 0 隐藏、20 显示
  await lv2(page, '自定义范围').click();
  await expect(lv2(page, '自定义范围')).toHaveClass(/active/);
  await expect(slider).toHaveCount(1);
  await slider.fill('0');
  await expect(roleCircle).toHaveCount(0);
  await slider.fill('20');
  await expect(roleCircle).toHaveCount(1);
  // 点描述行 ×：二级按钮不绿、范围调节隐藏
  const desc = rangeBox(page).locator('.tac-range-desc', { hasText: '自定义范围' });
  await desc.hover();
  await desc.locator('.tac-range-del').click();
  await expect(lv2(page, '自定义范围')).not.toHaveClass(/active/);
  await expect(slider).toHaveCount(0);
});

test('range box: hunter trait subs toggle independently, multiple can light (dreamWitch)', async ({ page }) => {
  await placeRole(page, 'dreamWitch', 0.4, 0.4);
  await expect(rangeBox(page).locator('.tac-range-opt:not(.tac-range-sub)')).toHaveText(['显示特质范围', '显示天赋范围', '隐藏范围']);
  await lv1(page, '显示特质范围').click();
  await expect(lv1(page, '显示特质范围')).toHaveClass(/active/);
  // 三个 range.card 标签平铺为二级按钮；一级不点亮，需亲手点击
  await expect(lv2(page, '梦隐求生者提示范围')).toHaveCount(1);
  await expect(lv2(page, '梦隐求生者提示范围')).not.toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(0);
  // 亲手点击点亮一档
  await lv2(page, '梦隐求生者提示范围').click();
  await expect(lv2(page, '梦隐求生者提示范围')).toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(1);
  // 多选：点另一档则两个同时点亮
  await lv2(page, '0阶1阶信徒控制范围').click();
  await expect(lv2(page, '0阶1阶信徒控制范围')).toHaveClass(/active/);
  await expect(lv2(page, '梦隐求生者提示范围')).toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(2);
  // 反复点同一一级按钮：无变化（两个二级仍亮）
  await lv1(page, '显示特质范围').click();
  await expect(lv2(page, '0阶1阶信徒控制范围')).toHaveClass(/active/);
  // 再点已选中的二级按钮：只取消该档，另一档仍亮
  await lv2(page, '0阶1阶信徒控制范围').click();
  await expect(lv2(page, '0阶1阶信徒控制范围')).not.toHaveClass(/active/);
  await expect(lv2(page, '梦隐求生者提示范围')).toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(1);
});

test('range box: new item shows first range; subs toggle as multi-select (poseidonWatch)', async ({ page }) => {
  await tool(page, 'roles');
  await pickRole(page, 'firstOfficer');
  await clickPoint(page, 0.2, 0.4);
  await page.locator('.tac-item[data-kind="poseidonWatch"]').click();
  await clickPoint(page, 0.5, 0.4);
  await tool(page, 'select');
  await clickPoint(page, 0.5, 0.4);
  // 道具新创建默认显示第一个范围；一级按钮变黄
  await expect(rangeBox(page).locator('.tac-range-opt:not(.tac-range-sub)')).toHaveText(['显示道具范围', '隐藏范围']);
  await expect(lv1(page, '显示道具范围')).toHaveClass(/active/);
  await expect(lv2(page, '第一次催眠范围')).toHaveClass(/active/);
  await expect(lv2(page, '第二次催眠范围')).not.toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(1);
  // 多选：点击第二档后两个同时点亮
  await lv2(page, '第二次催眠范围').click();
  await expect(lv2(page, '第二次催眠范围')).toHaveClass(/active/);
  await expect(lv2(page, '第一次催眠范围')).toHaveClass(/active/);
  // 隐藏范围后清空
  await lv1(page, '隐藏范围').click();
  await expect(lv1(page, '显示道具范围')).not.toHaveClass(/active/);
  await expect(page.locator('.tac-item-circle')).toHaveCount(0);
});

test('range box: cage three-gear radio switches only 9/12/15 (goatman)', async ({ page }) => {
  await tool(page, 'roles');
  await pickRole(page, 'goatman');
  await clickPoint(page, 0.3, 0.4);
  await page.locator('.tac-item[data-kind="cage"]').click();
  await clickPoint(page, 0.5, 0.4);
  await tool(page, 'select');
  await clickPoint(page, 0.5, 0.4);
  // 牢笼三挡：默认第一挡 9m
  await expect(lv2(page, '9m')).toHaveCount(1);
  await expect(lv2(page, '12m')).toHaveCount(1);
  await expect(lv2(page, '15m')).toHaveCount(1);
  const desc = rangeBox(page).locator('.tac-range-desc');
  await expect(desc).toHaveCount(1);
  await expect(desc.first()).toContainText('牢笼范围 9m');
  // 切到第二挡 12m
  await lv2(page, '12m').click();
  await expect(desc.first()).toContainText('牢笼范围 12m');
  // 切到第三挡 15m
  await lv2(page, '15m').click();
  await expect(desc.first()).toContainText('牢笼范围 15m');
  // 三挡互斥：挡位组内只亮一个（另二级「牢笼范围」按钮保持点亮）
  await expect(rangeBox(page).locator('.tac-range-sub[data-g].active')).toHaveCount(1);
  await expect(rangeBox(page).locator('.tac-range-sub.active')).toHaveCount(2);
  // 点描述行 ×：「牢笼范围」按钮不绿，三挡按钮隐藏
  await desc.hover();
  await desc.locator('.tac-range-del').click();
  await expect(lv2(page, '牢笼范围')).not.toHaveClass(/active/);
  await expect(lv2(page, '9m')).toHaveCount(0);
  await expect(lv2(page, '12m')).toHaveCount(0);
  await expect(lv2(page, '15m')).toHaveCount(0);
  await expect(page.locator('.tac-item-circle')).toHaveCount(0);
});

test('range box: clicking a placed token while roles tool active switches tool to select', async ({ page }) => {
  await tool(page, 'roles');
  await pickRole(page, 'forward');
  await clickPoint(page, 0.3, 0.4);
  // 仍是角色工具时，直接点击地图上的造物：工具栏切到「选择」并显示造物管理
  await clickPoint(page, 0.3, 0.4);
  await expect(page.locator('.tac-tool[data-tool="select"]')).toHaveClass(/active/);
  await expect(page.locator('#tacManageList .tac-manage-box').first()).toBeVisible();
  // 管理面板中能看到角色名称（前锋）
  await expect(page.locator('#tacManageList')).toContainText('前锋');
});

test('range box: buttons wrap between each other, not inside', async ({ page }) => {
  await placeRole(page, 'theMindsEye', 0.6, 0.4);
  const wrapCss = await page.evaluate(() => {
    const opts = document.querySelector('#tacManageList .tac-range-opts');
    const btn = opts && opts.querySelector('.tac-range-opt');
    return opts && btn
      ? { wrap: getComputedStyle(opts).flexWrap, ws: getComputedStyle(btn).whiteSpace }
      : null;
  });
  expect(wrapCss).toEqual({ wrap: 'wrap', ws: 'nowrap' });
});

test('range box: Geisha fearRadius talent gets beauty/prajna variant row', async ({ page }) => {
  await placeRole(page, 'Geisha', 0.4, 0.4);
  await lv1(page, '显示天赋范围').click();
  // 二级按钮列表：红蝶天赋十个
  for (const t of ['耳鸣', '警戒半径', '成瘾症', '念旧癖', '惊弓之鸟', '狩鹿', '清道夫', '枯萎', '执念', '饥荒']) {
    await expect(lv2(page, t)).toHaveCount(1);
  }
  // 默认无三级行
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(0);
  // 点警戒半径：出现形态三级（美人相/般若相），默认美人相 32.07×0.8
  await lv2(page, '警戒半径').click();
  const beauty = rangeBox(page).locator('.tac-range-sub', { hasText: '美人相' });
  const prajna = rangeBox(page).locator('.tac-range-sub', { hasText: '般若相' });
  await expect(beauty).toHaveCount(1);
  await expect(prajna).toHaveCount(1);
  await expect(beauty).toHaveClass(/active/);
  await expect(prajna).not.toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc'))
    .toContainText(['警戒半径·美人相']);
  // 切般若相：互斥，米数变为 32.07×1.1
  await prajna.click();
  await expect(prajna).toHaveClass(/active/);
  await expect(beauty).not.toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc'))
    .toContainText(['警戒半径·般若相']);
  // 点清道夫：只显示清道夫的三挡 30/45/60，不再显示警戒半径形态行
  await lv2(page, '清道夫').click();
  await expect(beauty).toHaveCount(0);
  for (const m of ['30m', '45m', '60m']) {
    await expect(rangeBox(page).locator('.tac-range-sub', { hasText: m })).toHaveCount(1);
  }
  await expect(rangeBox(page).locator('.tac-range-desc')).toContainText(['清道夫范围 30m']);
  // 三挡互斥：切 60m
  await rangeBox(page).locator('.tac-range-sub', { hasText: '60m' }).click();
  await expect(rangeBox(page).locator('.tac-range-desc')).toContainText(['清道夫范围 60m']);
  // 两个天赋可同时点亮：警戒半径仍亮
  await expect(lv2(page, '警戒半径')).toHaveClass(/active/);
  await expect(rangeBox(page).locator('.tac-range-desc')).toHaveCount(2);
});

test('range box: second-level buttons share one line; gear/slider rows appear below when lit', async ({ page }) => {
  // 心兽：数字 + 档位数组 + 数字 混合，二级按钮全部同一行
  await placeRole(page, 'herztier', 0.4, 0.4);
  await lv1(page, '显示特质范围').click();
  const subsOneline = await page.evaluate(() => {
    const subs = [...document.querySelectorAll('#tacManageList .tac-range-sub[data-v]')];
    return subs.length === 3 && subs.every((s) => s.parentElement === subs[0].parentElement);
  });
  expect(subsOneline).toBe(true);
  // 未点亮时无挡位组
  await expect(rangeBox(page).locator('.tac-range-sub[data-g]')).toHaveCount(0);
  // 点亮「追袭范围」：下方出现 7m / 14m 互斥挡位，且挡位行与二级按钮行不同行
  await lv2(page, '追袭范围').click();
  await expect(rangeBox(page).locator('.tac-range-sub[data-g]')).toHaveText(['7m', '14m']);
  const gearOnOwnLine = await page.evaluate(() => {
    const sub = document.querySelector('#tacManageList .tac-range-sub[data-v]');
    const gear = document.querySelector('#tacManageList .tac-range-sub[data-g]');
    return sub && gear && sub.parentElement !== gear.parentElement;
  });
  expect(gearOnOwnLine).toBe(true);

  // 牙医：4 个滑杆 + 1 个数字，二级按钮同一行；点亮滑杆项后滑杆出现在下方
  await placeRole(page, 'dentist', 0.6, 0.6);
  await lv1(page, '显示特质范围').click();
  const dentistOneline = await page.evaluate(() => {
    const subs = [...document.querySelectorAll('#tacManageList .tac-range-sub[data-v]')];
    return subs.length === 5 && subs.every((s) => s.parentElement === subs[0].parentElement);
  });
  expect(dentistOneline).toBe(true);
  await expect(rangeBox(page).locator('input[type="range"]')).toHaveCount(0);
  await lv2(page, '5档位口腔镜范围').click();
  await expect(rangeBox(page).locator('input[type="range"]')).toHaveCount(1);
  const sliderOnOwnLine = await page.evaluate(() => {
    const sub = document.querySelectorAll('#tacManageList .tac-range-sub[data-v]')[0];
    const slider = document.querySelector('#tacManageList input[type="range"]');
    return sub && slider && !sub.parentElement.contains(slider);
  });
  expect(sliderOnOwnLine).toBe(true);
});
