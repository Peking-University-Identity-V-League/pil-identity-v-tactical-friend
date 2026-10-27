
import { CN_NUM, cnNum } from '../core/utils.js';


import { translate } from '../core/i18n.js';

export const DED_EMPTY_HINT = translate("maps.dedEmptyHint")
  + translate("maps.dedEmptyHintAlternate");




export function dedHelpers(positions) {

  const ids = (...names) => names.map((n) =>
    positions.findIndex((p) => p.name === n));

  const sep = translate("ui.punctuation.listSeparator");
  const join = (names) => names.join(sep);

  // 统一规则构造：所有规则都收同一个选项对象，用不到的字段传 null 或省略；
  // 返回值也是统一的完整规则对象（未用到的字段为 null / 空数组）。
  const build = (kind, o = {}) => {
    const pres = o.pres ? ids(...o.pres) : [];
    const cons = o.cons ? ids(...o.cons) : [];
    const targets = o.targets ? ids(...o.targets) : [];
    const region = o.region ? ids(...o.region) : [];
    const marker = o.marker == null ? null : ids(o.marker)[0];
    // 注意：不做去重。chainRun 等规则会故意让首尾点位重复（如闭合环线），
    // 重复项是推演语义的一部分；link 的 marker 也在 region 内，同样保留。
    const rulePositions = [
      ...ids(...(o.names ?? [])),
      ...pres, ...cons, ...targets, ...region,
      ...(marker == null ? [] : [marker]),
    ];
    return {
      kind,
      name: o.name ?? null,
      text: o.text ?? null,
      list: o.list ?? (o.names ? join(o.names) : null),
      positions: rulePositions,
      n: o.n ?? null,
      min: o.min ?? null,
      max: o.max ?? null,
      mode: o.mode ?? null,
      cyclic: o.cyclic ?? null,
      pres, cons, targets, region, marker,
      positive: o.positive ?? null,
    };
  };

  // 默认值只补 name（以及各 kind 特有的数量缺省），调用方显式传的值始终优先
  const withDefaults = (o, defaults) =>
    ({ ...defaults, ...o, name: o.name ?? defaults.name });

  const fixed = (o = {}) =>
    build('fixed', withDefaults(o, { name: translate("maps.name") }));

  const region = (o = {}) =>
    build('region', withDefaults(o, { name: translate("maps.region") }));

  const exactly = (o = {}) =>
    build('exactly', withDefaults(o,
      { name: translate("maps.exactly", { n: CN_NUM[o.n] }) }));

  const either = (o = {}) =>
    exactly({ n: 1, name: translate("maps.either"), ...o });

  const same = (o = {}) =>
    build('same', withDefaults(o, { name: translate("maps.nameAlternate") }));

  const atLeast1 = (o = {}) =>
    build('atLeast', withDefaults(o, { name: translate("maps.nameThird"), n: 1 }));

  const atMost1 = (o = {}) =>
    build('atMost', withDefaults(o, { name: translate("maps.atMost1"), n: 1 }));

  const chain = (o = {}) =>
    build('chain', withDefaults(
      { list: (o.names ?? []).join(' - '), ...o },
      { name: translate("maps.chain") }));

  const chainRun = (o = {}) =>
    build('chainRun', withDefaults(
      { list: (o.names ?? []).join(' - '), ...o },
      { name: translate("maps.chain") }));

  const implies = (o = {}) =>
    build('implies', withDefaults({ list: translate("maps.list"), ...o }, {}));

  const allAbsent = (o = {}) =>
    build('allAbsent', withDefaults({
      list: [...(o.pres ?? []), ...(o.targets ?? [])].join(sep),
      ...o,
    }, { name: translate("maps.nameFourth") }));

  const link = (o = {}) =>
    build('link', withDefaults({ list: o.marker ?? null, ...o }, {}));

  return { fixed, region, exactly, either, same, atLeast1, atMost1, chain,
    chainRun, implies, link, allAbsent };
}


export function dedRuleBook(rules) {
  const slash = (r) => r.list.split(translate("ui.punctuation.listSeparator")).join(' / ');
  return rules.map((r) => {
    switch (r.kind) {
      case 'fixed':
        return { title: r.name, text: translate("maps.text", { list: r.list }) };
      case 'region': {
        const text = r.min === r.max
          ? translate("maps.textAlternate", { value: cnNum(r.min) })
          : translate("maps.textThird", { value: cnNum(r.min), valueSecondary: cnNum(r.max) });
        return { title: r.name, text: translate("maps.textFourth", { value: slash(r), text: text }) };
      }
      case 'exactly':
        return { title: `${r.name} · ${slash(r)}`,
          text: translate("maps.textFifth", { count: cnNum(r.positions.length), value: cnNum(r.n) }) };
      case 'atLeast':
        return { title: `${r.name} · ${slash(r)}`, text: translate("maps.textSixth") };
      case 'same':
        return { title: `${r.name} · ${slash(r)}`, text: translate("maps.textSeventh") };
      case 'atMost':
        return { title: `${r.name} · ${slash(r)}`, text: translate("maps.textEighth") };
      case 'allAbsent':
        return { title: r.name, text: r.text || r.list };
      case 'chain':
        return { title: r.name, text: r.text };
      case 'chainRun':
        return { title: r.name, text: r.text };
      case 'implies':
        return { title: r.name, text: r.text };
      case 'link':
        return { title: r.name, text: r.text };
      default:
        return { title: r.name, text: r.list };
    }
  });
}


export function makeDeduction(opts) {
  const { mapImage, mapSize, ciphers, cipherCombinations,
    rules, hints } = opts;
  return {
    mapImage, mapSize, ciphers,
    configs: cipherCombinations.map((g) =>
      g.map((cid) => ciphers.findIndex((p) => p.id === cid))),
    rules,
    hints,
    ruleBook: dedRuleBook(rules),
    emptyHint: DED_EMPTY_HINT,
  };
}
