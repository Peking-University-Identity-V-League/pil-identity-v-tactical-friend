import assert from 'node:assert/strict';
import test from 'node:test';

// DOM/BOM 桩：让模块图在 node 下按浏览器入口（main.js）的求值顺序完成初始化
const elStub = new Proxy(function () {}, {
  get: (t, k) => (k === Symbol.toPrimitive ? () => '' : elStub),
  apply: () => elStub,
  set: () => true,
});
globalThis.document = {
  getElementById: () => elStub,
  querySelectorAll: () => [],
  querySelector: () => elStub,
  createElement: () => elStub,
  addEventListener: () => {},
  documentElement: elStub,
  body: elStub,
  title: '',
};
globalThis.window = {
  location: { search: '', href: 'http://localhost/', assign() {}, reload() {} },
  addEventListener: () => {},
  removeEventListener: () => {},
};
globalThis.localStorage = { getItem: () => null, setItem: () => {} };
Object.defineProperty(globalThis, 'navigator', { value: { language: 'zh-CN' }, configurable: true });
globalThis.fetch = async () => { throw new Error('no fetch in unit test'); };
globalThis.ResizeObserver = class { observe() {} unobserve() {} disconnect() {} };
globalThis.requestAnimationFrame = (cb) => setTimeout(cb, 0);
globalThis.Image = class { set src(v) {} };

await import('../../js/main.js');
const { MAPS_DATA } = await import('../../js/data/maps.js');
const { deduce } = await import('../../js/deduce.js');
const { translate } = await import('../../js/core/i18n.js');
const { tacRangeMetersOf } = await import('../../js/tactic.js');
const { TAC_ROLES } = await import('../../js/data/tactic-data.js');

test('single-card range shape (coordinator) resolves meters', () => {
  const cfg = TAC_ROLES.coordinator.ranges;
  assert.equal(cfg.key, 'showTrait');
  assert.equal(tacRangeMetersOf(cfg, {}, false), 10);
  assert.equal(tacRangeMetersOf(cfg, { rangeMeters: 10 }, false), 10);
  const opt = cfg.options[0];
  assert.equal(typeof opt.size_m, 'number');
  assert.equal(opt.labels, translate('characters.coordinator.range.card.flareGunCanUse'));
});


test('buildTacRangeRows renders range manage box (dreamWitch)', async () => {
  const { buildTacRangeRows } = await import('../../js/tactic.js');
  const cfg = TAC_ROLES.dreamWitch.ranges;
  const rows = [];
  const keepCreate = globalThis.document.createElement;
  globalThis.document.createElement = () => {
    const el = {
      innerHTML: '', className: '', dataset: {}, style: {},
      appendChild() {}, querySelectorAll: () => [], querySelector: () => null,
      addEventListener() {},
    };
    rows.push(el);
    return el;
  };
  try {
    const settings = { appendChild() {} };
    const opts = { labelPrefix: '显示', labelPostfix: '范围', hostRole: 'dreamWitch', groupKind: 'trait' };
    const allText = (r) => `${r.innerHTML || ''}${r.textContent || ''}`;

    // 猎人一级按钮统一为：显示特质范围 / 显示天赋范围 / 隐藏范围
    rows.length = 0;
    buildTacRangeRows(settings, cfg, { rangeBox: { tab: 'range', subs: [0, 1, 2], talents: {}, fill: false } }, false, opts);
    assert.ok(rows.some((r) => r.className === 'tac-manage-box'),
      'range manage box rendered');
    assert.ok(rows.some((r) => allText(r).includes(translate('ui.tacRangeBox.showTrait'))),
      'unified level-1 buttons rendered');
    ['20m', '42.2m', '59.1m'].forEach((m) => assert.ok(
      rows.some((r) => allText(r).includes(m)), `${m} description line rendered`));
    assert.ok(rows.some((r) =>
      (r.innerHTML.match(/tac-range-opt tac-range-sub/g) || []).length >= 3),
      'all three card subs rendered');
    assert.ok(!rows.some((r) => allText(r).includes('（固定）')),
      'no fixed suffix anywhere');
  } finally {
    globalThis.document.createElement = keepCreate;
  }
});


test('every map deduction has well-formed rules and ruleBook', () => {
  for (const map of MAPS_DATA) {
    const d = map.deduction;
    assert.ok(d, `map ${map.mapId}: missing deduction`);
    const n = d.ciphers.length;

    assert.ok(Array.isArray(d.rules) && d.rules.length > 0, `map ${map.mapId}: no rules`);
    assert.equal(d.ruleBook.length, d.rules.length, `map ${map.mapId}: ruleBook/rules length mismatch`);
    assert.ok(d.emptyHint, `map ${map.mapId}: emptyHint missing`);

    d.rules.forEach((r, i) => {
      for (const p of r.positions) {
        assert.ok(p >= 0 && p < n, `map ${map.mapId} rule#${i}(${r.kind}): position ${p} out of range ${n}`);
      }
      for (const key of ['pres', 'cons', 'targets', 'region']) {
        for (const p of r[key]) {
          assert.ok(p >= 0 && p < n, `map ${map.mapId} rule#${i}(${r.kind}): ${key} ${p} out of range`);
        }
      }
      if (r.marker != null) {
        assert.ok(r.marker >= 0 && r.marker < n, `map ${map.mapId} rule#${i}(link): marker out of range`);
      }
    });

    d.configs.forEach((g, gi) => g.forEach((ci) => {
      assert.ok(ci >= 0 && ci < n, `map ${map.mapId} config#${gi}: cipher index ${ci} out of range`);
    }));
  }
});

test('chinaTown chainRun loop closure: lion house + grocery => arcade and theater no', () => {
  const map = MAPS_DATA.find((m) => m.ciphers.some(
    (c) => c.name === translate('maps.chinaTown.cipher.m1.name')));
  const d = map.deduction;
  const idx = (key) => d.ciphers.findIndex((c) => c.name === translate(key));
  const marks = {
    [idx('maps.chinaTown.cipher.w3.name')]: 'yes', // 狮子楼
    [idx('maps.chinaTown.cipher.w4.name')]: 'yes', // 杂货店
  };
  const { state } = deduce(d, marks);
  assert.equal(state[idx('maps.chinaTown.cipher.m4.name')], 'no', // 红伞巷
    '红伞巷 should be ruled out');
  assert.equal(state[idx('maps.chinaTown.cipher.m2.name')], 'no', // 剧院
    '剧院 should be ruled out');
});

test('solver resolves fixed rules from empty marks on every map', () => {
  for (const map of MAPS_DATA) {
    const d = map.deduction;
    const { state } = deduce(d, {});
    d.rules
      .filter((r) => r.kind === 'fixed')
      .forEach((r, fi) => {
        for (const p of r.positions) {
          assert.equal(state[p], 'yes',
            `map ${map.mapId}: fixed rule#${fi} did not resolve position ${p}`);
        }
      });
  }
});
