import { translate } from '../core/i18n.js';


// 通用地图图标 URL：出生点、逃生门、地窖、狂欢之椅、柜子、箱子、电话亭共用
export const COMMON_ICON_URL = {
  survivor: 'https://patchwiki.biligame.com/images/dwrg/4/45/omv2vmop0j63s9aprhjjkt4psykuy5p.png',
  hunter: 'https://patchwiki.biligame.com/images/dwrg/7/7a/f3sec5gnnhzh1xprcbxeaxa1uuzhkmo.png',
  escapeDoor: 'https://patchwiki.biligame.com/images/dwrg/e/e2/0n8mxk798sa4wj1awprw72pyrthwepv.png',
  cipherMachine: 'https://patchwiki.biligame.com/images/dwrg/9/93/eorb4lhtk2n7ej9iuuufhaadh3l2ec9.png',
  cipherMachineDone: 'https://i0.hdslb.com/bfs/new_dyn/470e117efe38e8ff949c47249932ec73262863779.png@1192w_1192h.avif',
  dungeon: 'https://patchwiki.biligame.com/images/dwrg/2/2c/52o7vcf15w5r12t4nh6aji1uglpa036.png',
  rocketChair: 'https://i0.hdslb.com/bfs/new_dyn/f120fa1a2f8db7da9b90e20821aa86e3262863779.png@176w_192h.avif',
  locker: 'https://website.homeworkkun.top/WIKI/%E5%9C%B0%E5%9B%BE/guizi.png',
  box: 'https://patchwiki.biligame.com/images/dwrg/3/31/hs9ynk4iy1nqn0jhybqux5e60yuoxbb.png',
  phoneBooth: 'https://patchwiki.biligame.com/images/dwrg/5/52/cunw06ks9ek7s8njb400kyvhev8n1ms.png',
  springBox: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/38/8xes1ox11le44dsz5g0y0idc4o4ctvh.png/90px-%E7%A7%AF%E9%9B%AA%E7%9A%84%E7%A4%BC%E7%89%A9%E7%9B%92.png',
};


// 通用自定义造物：出生点、逃生门、密码机、地窖、狂欢之椅、柜子、箱子，图标引用 COMMON_ICON_URL
export const TAC_COMMON_ITEM_TYPES = {
  customSurvivor: {
    name: translate("common.survivor"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: { min: 0, max: null }, label: translate("common.survivor") },
      ],
    },
    icon: COMMON_ICON_URL.survivor,
  },
  customHunter: {
    name: translate("common.hunter"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: { min: 0, max: null }, label: translate("common.hunter") },
      ],
    },
    icon: COMMON_ICON_URL.hunter,
  },
  customEscapeDoor: {
    name: translate("common.escapeDoor"),
    icon: COMMON_ICON_URL.escapeDoor,
  },
  customCipherMachine: {
    name: translate("common.cipherMachine"),
    icon: COMMON_ICON_URL.cipherMachine,
  },
  customDungeon: {
    name: translate("common.dungeon"),
    icon: COMMON_ICON_URL.dungeon,
  },
  customRocketChair: {
    name: translate("common.rocketChair"),
    icon: COMMON_ICON_URL.rocketChair,
  },
  customLocker: {
    name: translate("common.locker"),
    icon: COMMON_ICON_URL.locker,
  },
  customBox: {
    name: translate("common.box"),
    icon: COMMON_ICON_URL.box,
  },
  customPhoneBooth: {
    name: translate("common.phoneBooth"),
    icon: COMMON_ICON_URL.phoneBooth,
  },
  customSpringBox: {
    name: translate("common.springBox"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 8, label: translate("common.springBox") },
      ],
    },
    icon: COMMON_ICON_URL.springBox,
  },
};

export const TAC_CUSTOM_KEYS = [
  'customSurvivor',
  'customHunter',
  'customEscapeDoor',
  'customCipherMachine',
  'customDungeon',
  'customRocketChair',
  'customLocker',
  'customBox',
  'customPhoneBooth',
  'customSpringBox'
];
