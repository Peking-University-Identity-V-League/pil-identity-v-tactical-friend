import { translate } from '../core/i18n.js';
import { TAC_TALENT_TYPES } from './talents.js';
import { TAC_SURVIVOR_ROLES } from './survivor.js';
import { TAC_HUNTER_ROLES } from './hunter.js';


// 天赋速度加成：数据源统一在 talents.js 的 buff.speedBuff，此处派生成 tactic.js 消费的既有形状
const TAC_TALENT_SPEED_BUFFS = Object.fromEntries(
  Object.entries(TAC_TALENT_TYPES)
    .filter(([, t]) => t.buff && t.buff.speedBuff)
    .map(([key, t]) => {
      const { aim, carry, extra, ...rest } = t.buff.speedBuff;
      const out = { name: t.name, ...rest, camp: t.camp };
      if (extra) out.extra = {
        name: translate("application.buff.common.name.level", { name: TAC_TALENT_TYPES[extra.talent].name, value: extra.level }),
        mult: extra.mult,
        camp: t.camp,
      };
      return [key, out];
    }));


// 角色特质速度加成：数据源统一在 survivor.js / hunter.js 的 traits 字段，此处派生成 tactic.js 消费的既有形状
const deriveTraitSpeedBuffs = (roles) => Object.entries(roles).flatMap(([roleKey, r]) =>
  Object.entries(r.traits || {})
    .filter(([, t]) => t.speedBuff)
    .map(([traitKey, t]) => {
      const { aim, ...rest } = t.speedBuff;
      return { key: traitKey, role: r.name, name: t.name, ...rest };
    }));


export const TAC_SVG_NS = 'http://www.w3.org/2000/svg';


export const TAC_MOVEMENT_SURVIVOR = {
  states: {
    run: { name: translate("movement.survivor.run"), speed: 3.8 },
    walk: { name: translate("movement.survivor.walk"), speed: 2.11 },
    crouch: { name: translate("movement.survivor.crouch"), speed: 1.14 },
    crawl: { name: translate("movement.survivor.crawl"), speed: 0.44 },
  },
  roles: {
    'survivor': { name: translate("characters.camps.survivor"), speed: 3.8, role: null },
    'wildling:0': { name: translate("movement.survivor.wildling0"), speed: 3.65, role: 'wildling', form: 0 },
    'prodigy:0': { name: translate("movement.survivor.prodigy0"), speed: 3.92, role: 'prodigy', form: 0 },
  },
  fixed: {
    'toyMerchant:0': { name: translate("movement.survivor.toyMerchant0"), speed: 5.74, role: 'toyMerchant', form: 0 },
    'lanternist:0': { name: translate("movement.survivor.lanternist0"), speed: 4.18, role: 'lanternist', form: 0 },
    'prodigy:1': { name: translate("movement.survivor.prodigy1"), speed: 3.8, role: 'prodigy', form: 1 },
  },
  stateNames: {
    run: translate("movement.survivor.run"), walk: translate("movement.survivor.walk"), crouch: translate("movement.survivor.crouch"), crawl: translate("movement.survivor.crawl"),
    role: translate("common.roles"), fixed: translate("movement.survivor.fixed"), custom: translate("common.custom"), hunter: translate("characters.camps.hunter")
  },
};


export const TAC_MOVEMENT_BUFFS = {
  trait: {
    survivor: deriveTraitSpeedBuffs(TAC_SURVIVOR_ROLES),
    hunter: deriveTraitSpeedBuffs(TAC_HUNTER_ROLES),
  },
  talent: TAC_TALENT_SPEED_BUFFS,

  other: {
    survivor: [
      { key: 'fastMusicbox', name: translate("movement.buff.other.fastMusicbox.name"), levels: [1.15, 1.25, 1.35] },
      { key: 'swarmAround', name: translate("movement.buff.other.swarmAround.name"), mult: 1.1 },
      { key: 'urgentLetter', name: translate("movement.buff.other.urgentLetter.name"), mult: 1.1, duration: 15 },
      { key: 'farewellLetter', name: translate("movement.buff.other.farewellLetter.name"), mult: 1.4, duration: 3 },
      { key: 'cheerful', name: translate("movement.buff.other.cheerful.name"), mult: 1.5, duration: 1.3 },
      { key: 'entangled', name: translate("movement.buff.other.entangled.nameAlternate"), levels: [0.92, 0.5] },
      { key: 'corruptingBreath', name: translate("movement.buff.other.corruptingBreath.name"), mult: 0.7, duration: 3 },
      { key: 'demonNotes', name: translate("movement.buff.other.demonNotes.name"), levels: [0.96, 0.92, 0.88] },
      { key: 'peeper', name: translate("movement.buff.other.peeper.name"), mult: 0.94 },
    ],
    hunter: [
      { key: 'slowMusicbox', name: translate("movement.buff.other.slowMusicbox.name"), levels: [0.88, 0.79, 0.7] },
      { key: 'stickyBomb', name: translate("movement.buff.other.stickyBomb.name"), mult: 0.7, duration: 5 },
      { key: 'pounce', name: translate("movement.buff.other.pounce.name"), mult: 0.65, duration: 2.5 },
    ],
  },
};


export const TAC_MEASURE_DEFAULT = {
  single: { color: '#eab308', width: 3 },
  chain: { color: '#f97316', width: 3 },
};


export const TAC_DISPLAY_DEFAULT = { spawnSize: 6, escapeDoorSize: 6, cipherSize: 6, dungeonSize: 6, rocketChairSize: 6, lockerSize: 3, boxSize: 3, phoneBoothSize: 3 };


export const TAC_ZOOM_MIN = 1, TAC_ZOOM_MAX = 5;


export const TAC_ZOOM_LOCK_ICONS = {
  unlocked: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>',
  locked: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
};


export const TAC_ABYSS_MAX_M = 57.5;


export const TAC_TREASURE_RULE = { rangeM: 70, ringM: [5.5, 7.3] };


export const TAC_MANAGE_DEFAULT = { roleSize: 6, iconSize: 3.4 };
