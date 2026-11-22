import { translate } from '../core/i18n.js';


// 段位图标注册表：roles.js 的 tier 角色 items 直接引用 TAC_TIER_KEYS。
export const TAC_TIER_TYPES = {
  survivorS: {
    name: translate("items.tier.survivorS.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/99/livxjh9tz91afbnw29yyqnltvvcra9j.png/90px-%E8%AE%A4%E7%9F%A5%E5%88%86_%E6%B1%82%E7%94%9F%E8%80%85S%EF%BC%88%E5%A4%A7%EF%BC%89_%E5%9B%BE%E6%A0%87.png',
  },
  survivorA: {
    name: translate("items.tier.survivorA.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b8/b1h1e4kttqopiebu1vpw5svreq1fs34.png/90px-%E8%AE%A4%E7%9F%A5%E5%88%86_%E6%B1%82%E7%94%9F%E8%80%85A%EF%BC%88%E5%A4%A7%EF%BC%89_%E5%9B%BE%E6%A0%87.png',
  },
  survivorB: {
    name: translate("items.tier.survivorB.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/01/mfbhdp4zp1cfe42l78a7nkpkuuio1ux.png/90px-%E8%AE%A4%E7%9F%A5%E5%88%86_%E6%B1%82%E7%94%9F%E8%80%85B%EF%BC%88%E5%A4%A7%EF%BC%89_%E5%9B%BE%E6%A0%87.png',
  },
  survivorC: {
    name: translate("items.tier.survivorC.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/55/9egpmk0rr67wulo8piur7kl8suvkfik.png/90px-%E8%AE%A4%E7%9F%A5%E5%88%86_%E6%B1%82%E7%94%9F%E8%80%85C%EF%BC%88%E5%A4%A7%EF%BC%89_%E5%9B%BE%E6%A0%87.png',
  },
  hunterS: {
    name: translate("items.tier.hunterS.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/24/cddhn1hbtyuepyo722sqdamxj3nxhxl.png/90px-%E8%AE%A4%E7%9F%A5%E5%88%86_%E7%9B%91%E7%AE%A1%E8%80%85S%EF%BC%88%E5%A4%A7%EF%BC%89_%E5%9B%BE%E6%A0%87.png',
  },
  hunterA: {
    name: translate("items.tier.hunterA.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f0/1apbmm6hvjd0n8z81hxrmc5aro0qqkx.png/90px-%E8%AE%A4%E7%9F%A5%E5%88%86_%E7%9B%91%E7%AE%A1%E8%80%85A%EF%BC%88%E5%A4%A7%EF%BC%89_%E5%9B%BE%E6%A0%87.png',
  },
  hunterB: {
    name: translate("items.tier.hunterB.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/bd/11yz78kt7ypexlakqtrsum3mdxny7ct.png/90px-%E8%AE%A4%E7%9F%A5%E5%88%86_%E7%9B%91%E7%AE%A1%E8%80%85B%EF%BC%88%E5%A4%A7%EF%BC%89_%E5%9B%BE%E6%A0%87.png',
  },
  hunterC: {
    name: translate("items.tier.hunterC.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/07/rjrqraeprag2ern4s44sijd6nsqe6v2.png/90px-%E8%AE%A4%E7%9F%A5%E5%88%86_%E7%9B%91%E7%AE%A1%E8%80%85C%EF%BC%88%E5%A4%A7%EF%BC%89_%E5%9B%BE%E6%A0%87.png',
  },
  survivorTier1: {
    name: translate("items.tier.survivorTier1.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d0/gvf0cxza0vkpa04ubf2u6s3538559dl.png/75px-%E5%B7%A5%E8%9C%82.png',
  },
  survivorTier2: {
    name: translate("items.tier.survivorTier2.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b8/h1y8qx81lz0flqjwn9esr1jvsw4ktck.png/75px-%E7%8C%8E%E7%8A%AC.png',
  },
  survivorTier3: {
    name: translate("items.tier.survivorTier3.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/05/d187g22k5vdv5jwdpb8qousqa27t07j.png/75px-%E9%A9%BC%E9%B9%BF.png',
  },
  survivorTier4: {
    name: translate("items.tier.survivorTier4.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f2/1gl932vh8yrnesfqnz43vb2smed8eqc.png/75px-%E7%8C%9B%E7%8A%B8.png',
  },
  survivorTier5: {
    name: translate("items.tier.survivorTier5.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7f/epljxqnq0ynqrworce4vh50aa0it1ag.png/75px-%E7%8B%AE%E9%B9%AB.png',
  },
  survivorTier6: {
    name: translate("items.tier.survivorTier6.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/6b/0ip5f3zg7qxoy24pvy65t9rndazso1b.png/75px-%E7%8B%AC%E8%A7%92%E5%85%BD.png',
  },
  survivorTier7: {
    name: translate("items.tier.survivorTier7.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/82/t4dnn71sxcqeb7a6x1bfets1t23bxzg.png/75px-%E5%8B%87%E5%A3%AB.png',
  },
  survivorPeakTier7: {
    name: translate("items.tier.survivorPeakTier7.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d3/36g0p7tjydmp141c814k4hcyi2s6k24.png/75px-%E5%A4%A7%E5%8A%9B%E7%A5%9E.png',
  },
  hunterTier1: {
    name: translate("items.tier.hunterTier1.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/04/qw7jy6750xs2mhzzooz35yratruaim3.png/75px-%E7%8B%BC%E8%9B%9B.png',
  },
  hunterTier2: {
    name: translate("items.tier.hunterTier2.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/4c/pxoylz09h3v0tuorvo17t7zzslveix6.png/75px-%E7%9C%BC%E9%95%9C%E8%9B%87.png',
  },
  hunterTier3: {
    name: translate("items.tier.hunterTier3.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/81/4tbnou9nz8qd9fh0eye56ljfyt9lyqo.png/75px-%E9%B3%84%E9%B1%BC.png',
  },
  hunterTier4: {
    name: translate("items.tier.hunterTier4.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/df/2557r2btr58s14fkdkspuygenu0lj60.png/75px-%E5%89%91%E9%BD%BF%E8%99%8E.png',
  },
  hunterTier5: {
    name: translate("items.tier.hunterTier5.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/44/7by1rnppllcnw6ij7pbt3p0ba4x57x4.png/75px-%E9%A3%9E%E7%8B%AE.png',
  },
  hunterTier6: {
    name: translate("items.tier.hunterTier6.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/09/knzb94sybqa09it8ah7jyb2rwunq5rn.png/75px-%E7%8B%AC%E7%9C%BC%E5%B7%A8%E4%BA%BA.png',
  },
  hunterTier7: {
    name: translate("items.tier.hunterTier7.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/4e/612zfask5n3581cln9zvzi54wk6of0w.png/75px-%E6%81%B6%E9%BE%99.png',
  },
  hunterPeakTier7: {
    name: translate("items.tier.hunterPeakTier7.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/30/k80w6zv784hi6jdtlxfg6jn0dhmf93a.png/75px-%E4%B9%9D%E5%A4%B4%E8%9B%87.png',
  },
  fiveplayerTier1: {
    name: translate("items.tier.fiveplayerTier1.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d8/si988vfw6obg6ui01xcxp1ytbp13pp8.png/75px-%E7%A6%81%E5%8D%AB%E5%86%9B.png',
  },
  fiveplayerTier2: {
    name: translate("items.tier.fiveplayerTier2.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/2b/8g9mlspdfjcneujehls0qlh6m5wep2u.png/75px-%E9%AA%91%E5%A3%AB.png',
  },
  fiveplayerTier3: {
    name: translate("items.tier.fiveplayerTier3.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/4a/m1wd2xkf2rvz4tp7q5ual3s3inpsbuf.png/75px-%E4%B8%BB%E6%95%99.png',
  },
  fiveplayerTier4: {
    name: translate("items.tier.fiveplayerTier4.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/20/4pw94yc0mutp00bpkvxi4rvo3k3hdfr.png/75px-%E6%88%98%E8%BD%A6.png',
  },
  fiveplayerTier5: {
    name: translate("items.tier.fiveplayerTier5.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/6e/4tla6f0js8udxxtbuvsh76m63z88n13.png/75px-%E7%9A%87%E5%90%8E.png',
  },
  fiveplayerTier6: {
    name: translate("items.tier.fiveplayerTier6.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/4c/ofvhfbmzl7p2nzkuf479he3auhebtjo.png/75px-%E5%9B%BD%E7%8E%8B.png',
  },
};

// 段位键清单（与 TAC_TIER_TYPES 条目一一对应，选择器显示顺序）
export const TAC_TIER_KEYS = [
  'survivorS',
  'hunterS',
  'survivorA',
  'hunterA',
  'survivorB',
  'hunterB',
  'survivorC',
  'hunterC',
  'survivorTier1',
  'hunterTier1',
  'survivorTier2',
  'hunterTier2',
  'survivorTier3',
  'hunterTier3',
  'survivorTier4',
  'hunterTier4',
  'survivorTier5',
  'hunterTier5',
  'survivorTier6',
  'hunterTier6',
  'survivorTier7',
  'hunterTier7',
  'survivorPeakTier7',
  'hunterPeakTier7',
  'fiveplayerTier1',
  'fiveplayerTier2',
  'fiveplayerTier3',
  'fiveplayerTier4',
  'fiveplayerTier5',
  'fiveplayerTier6'
];
