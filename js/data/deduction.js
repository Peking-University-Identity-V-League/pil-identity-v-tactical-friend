
import { cnNum } from '../core/utils.js';


import { translate } from '../core/i18n.js';

export const DED_EMPTY_HINT = translate("ui.ded.basis.note");




export function dedHelpers(positions) {

  const ids = (...cipherNames) => cipherNames.map((n) =>
    positions.findIndex((p) => p.name === n));

  const sep = translate("ui.ded.basis.separator.list");
  const join = (cipherNames) => cipherNames.join(sep);

  // 统一规则构造：所有规则都收同一个选项对象，用不到的字段传 null 或省略；
  // 返回值也是统一的完整规则对象（未用到的字段为 null / 空数组）。
  const build = (kind, o = {}) => {
    const pres = o.pres ? ids(...o.pres) : [];
    const cons = o.cons ? ids(...o.cons) : [];
    const targets = o.targets ? ids(...o.targets) : [];
    const region = o.region ? ids(...o.region) : [];
    const marker = o.marker == null ? null : ids(o.marker)[0];
    // 注意：不做去重。chainThree 等规则会故意让首尾点位重复（如闭合环线），
    // 重复项是推演语义的一部分；link 的 marker 也在 region 内，同样保留。
    const rulePositions = [
      ...ids(...(o.cipherNames ?? [])),
      ...pres, ...cons, ...targets, ...region,
      ...(marker == null ? [] : [marker]),
    ];
    return {
      kind,
      name: o.name ?? null,
      text: o.text ?? null,
      list: o.list ?? (o.cipherNames ? join(o.cipherNames) : null),
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
    build('fixed', withDefaults(
      o,
      { name: translate("deduction.rule.type.fixed") }));

  const region = (o = {}) =>
    build('region', withDefaults(
      o,
      { name: translate("deduction.rule.type.region") }));

  const exactly = (o = {}) =>
    build('exactly', withDefaults(
      o,
      { name: translate("deduction.rule.type.exactly", { n: cnNum(o.n) }) }));

  const either = (o = {}) =>
    exactly({ n: 1, name: translate("deduction.rule.type.either"), ...o });

  const same = (o = {}) =>
    build('same', withDefaults(
      o,
      { name: translate("deduction.rule.type.same") }));

  const implies = (o = {}) =>
    build('implies', withDefaults(
      { list: [...(o.pres ?? []), ...(o.cons ?? [])].join(sep), ...o,},
      { name: translate("deduction.rule.type.same")}));

  const atLeast1 = (o = {}) =>
    build('atLeast1', withDefaults(
      o,
      { name: translate("deduction.rule.type.atLeast1"), n: 1 }));

  const atMost1 = (o = {}) =>
    build('atMost1', withDefaults(
      o,
      { name: translate("deduction.rule.type.atMost1"), n: 1 }));

  const chain = (o = {}) =>
    build('chain', withDefaults(
      { list: (o.cipherNames ?? []).join(' - '), ...o },
      { name: translate("deduction.rule.type.chain") }));

  const chainThree = (o = {}) =>
    build('chainThree', withDefaults(
      { list: (o.cipherNames ?? []).join(' - '), ...o },
      { name: translate("deduction.rule.type.chain") }));

  // 唐人街特殊规律
  const allAbsent = (o = {}) =>
    build('allAbsent', withDefaults(
      { list: [...(o.pres ?? []), ...(o.targets ?? [])].join(sep), ...o,},
      { name: translate("deduction.rule.type.allAbsent") }));

  // 里奥的回忆东区西区数量规律
  const link = (o = {}) =>
    build('link', withDefaults(
      { list: o.marker ?? null, ...o },
      { name: translate("deduction.rule.type.region") }));

  return {
    fixed, region, exactly, either, same, implies, atLeast1, atMost1, chain, chainThree, allAbsent, link
  };
}


export function dedRuleBook(rules) {
  const slash = (r) => r.list.split(translate("ui.ded.basis.separator.list")).join(' / ');
  return rules.map((r) => {
    switch (r.kind) {
      case 'fixed':
        return { title: r.name, text: translate("deduction.rule.type.fixed.text", { list: r.list }) };
      case 'region': {
        const text = r.min === r.max
          ? translate("deduction.rule.type.region.text1", { value: cnNum(r.min) })
          : translate("deduction.rule.type.region.text2", { value: cnNum(r.min), valueSecondary: cnNum(r.max) });
        return { title: r.name, text: translate("deduction.rule.type.region.text", { ciphersName: slash(r), text: text })};
      }
      case 'exactly':
        return { title: `${r.name} · ${slash(r)}`, text: translate("deduction.rule.type.exactly.text", { count: cnNum(r.positions.length), value: cnNum(r.n) })};
      case 'same':
        return { title: `${r.name} · ${slash(r)}`, text: translate("deduction.rule.type.same.text") };
      case 'implies':
        return { title: `${r.name} · ${slash(r)}`, text: r.text };
      case 'atLeast1':
        return { title: `${r.name} · ${slash(r)}`, text: translate("deduction.rule.type.atLeast1.text") };
      case 'atMost1':
        return { title: `${r.name} · ${slash(r)}`, text: translate("deduction.rule.type.atMost1.text") };
      case 'chain':
        return { title: r.name, text: r.text };
      case 'chainThree':
        return { title: r.name, text: r.text };
      case 'allAbsent':
        return { title: r.name, text: r.text };
      case 'link':
        return { title: r.name, text: r.text };
      default:
        return { title: r.name, text: r.text };
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
