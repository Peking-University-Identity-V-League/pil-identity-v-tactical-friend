import { translate } from '../core/i18n.js';


// 角色人格（天赋）注册表：求生者 40 人格 + 恐惧半径，监管者 40 人格 + 耳鸣。
// 仅部分人格外加 ranges（有明确距离参数、需要在地图上画圈的）；其余只有名称和图标。
export const TAC_TALENT_TYPES = {
  fearRadius: {

    name: translate("talent.survivor.fearRadius"),

    ranges: {

      key: 'showItem',

      fearMods: {

        hunter: [['hunter', translate("characters.camps.hunter"), 1], ['beauty', translate("talent.survivor.fearRadius.range.mode.geisha.beautyForm"), 0.8], ['prajna', translate("talent.survivor.fearRadius.range.mode.geisha.prajnaForm"), 1.1]],

        survivor: [['survivor', translate("characters.camps.survivor"), 1], ['prisoner', translate("talent.survivor.fearRadius.range.mode.prisoner"), 0.8], ['archer', translate("talent.survivor.fearRadius.range.mode.archer"), 0.76]],

      },

      options: [

        { size_m: 32.07, label: translate("talent.survivor.fearRadius") },

      ],

    },

    icon: 'https://patchwiki.biligame.com/images/dwrg/2/24/dv1pstoj7a8ftqf9l3jazt1cpe4sxwo.png',

  },
  borrowedTime: {
    name: translate("talent.survivor.borrowedTime"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/68/gx58i6eswtgskl5cakxhqw02swm03lf.png',
  },
  tideTurner: {
    name: translate("talent.survivor.tideTurner"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/4/4e/e2lx1u4qj5kdraxrg7xq5u1scdnmr05.png',
  },
  kneeJerkReflex: {
    name: translate("talent.survivor.kneeJerkReflex"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/f/f4/t46ea9jy8unps4j5ewba5mfeefg4qfi.png',
  },
  flywheelEffect: {
    name: translate("talent.survivor.flywheelEffect"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/0/07/r5uy2z33ro1xgmw8qpp847h4bfvf8ld.png',
  },
  curiosity: {
    name: translate("talent.survivor.curiosity"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/7/7d/d9yabn07l8xw9b39jxh4irdd3e0xpab.png',
  },
  sticker: {
    name: translate("talent.survivor.sticker"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/1/1a/euabjre12e35zh5swiu6nq4uvt09hju.png',
  },
  escape: {
    name: translate("talent.survivor.escape"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/3/37/igwh7ij28q3yk6tlngcs751de8mpw19.png',
  },
  distraction: {
    name: translate("talent.survivor.distraction"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/5/58/9x51kk4kqoulersg9xj4dgc6fdc8ohu.png',
  },
  snooze: {
    name: translate("talent.survivor.snooze"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/4/44/1fhksp7e63hwevsuylfgw0fn214k77h.png',
  },
  touchEffect: {
    name: translate("talent.survivor.touchEffect"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/7/70/rmz22ggguvl6e6c2aepnoqmg5mtebec.png',
  },
  telepathy: {
    name: translate("talent.survivor.telepathy"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c9/dwh4kzntz3yue7f9vl6hmtxvco0qkex.png',
  },
  companionEffect: {
    name: translate("talent.survivor.companionEffect"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/20/jc5doviawspochewch8rr9akvg3wwix.png',
  },
  audienceEffect: {
    name: translate("talent.survivor.audienceEffect"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/1/15/8hrlz9y5ggtx1ier7pvo8mtqagcgl21.png',
  },
  birdcageEffect: {
    name: translate("talent.survivor.birdcageEffect"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/24/i9bzd7ppjda0sizs3nqn20fypj7qszj.png',
  },
  saviorComplex: {
    name: translate("talent.survivor.saviorComplex"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/7/70/8im2x0e1imdiwl8a6jyki2rn3864u0p.png',
  },
  herdMentality: {
    name: translate("talent.survivor.herdMentality"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/ba/ekoulk3p7v7y5si2b6gv6r3787r8tte.png',
  },
  sneak: {

    name: translate("talent.survivor.sneak"),

    ranges: {

      key: 'showItem',

      options: [

        { size_m: 22, label: translate("talent.survivor.sneak") },

      ],

    },

    icon: 'https://patchwiki.biligame.com/images/dwrg/1/13/o8d12vi02km7ozis0f2io312tsynodg.png',

  },
  doctor: {
    name: translate("talent.survivor.doctor"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/0/05/jpcfy1y5m5m83zvex6xmx6hiqzpuuqs.png',
  },
  shelter: {
    name: translate("talent.survivor.shelter"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/e/e4/t778llk2l362rgl78vvm4yf9vwlw0dt.png',
  },
  catharsisEffect: {
    name: translate("talent.survivor.catharsisEffect"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/7/7c/0ee12g31568k9jnpuae6iqqrllypxvx.png',
  },
  emergencyReserves: {
    name: translate("talent.survivor.emergencyReserves"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/f/f6/o8ixpxb56avrj5e2tzdyps58h8rfa7i.png',
  },
  empathy: {
    name: translate("talent.survivor.empathy"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/24/4qxlekrswz8d3q71c7u27oozq8jpfap.png',
  },
  riskyMove: {
    name: translate("talent.survivor.riskyMove"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/be/qehxdreh3fqv4umqmpzpdlu9meemt5v.png',
  },
  horseflyEffect: {
    name: translate("talent.survivor.horseflyEffect"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/22/cph15mne5npfmpjlk2jnuvavkcumkz9.png',
  },
  muscleMemory: {
    name: translate("talent.survivor.muscleMemory"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/f/fb/d1gczjs1y6vrfu91ucp3j39dhwrz7sv.png',
  },
  wellEarned: {
    name: translate("talent.survivor.wellEarned"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/4/47/py190238ic3zzek7g6n80r763y78g9w.png',
  },
  greatPower: {
    name: translate("talent.survivor.greatPower"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/5/5a/s85wuu40ecakigjpg34lc7rr5vjb1zh.png',
  },
  willToSurvive: {
    name: translate("talent.survivor.willToSurvive"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/8/88/snv592i47bdhovtzf7zt9hvhwkne1bb.png',
  },
  exitPath: {
    name: translate("talent.survivor.exitPath"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/60/31wfzv6n1o3kimapa7znelpbr77x1j2.png',
  },
  brewingEffect: {
    name: translate("talent.survivor.brewingEffect"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/b2/dv4t2bxv0czqpk4p2vy3oaleio39q9k.png',
  },
  sensoryAdaptation: {
    name: translate("talent.survivor.sensoryAdaptation"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/63/2qh5ksenki8yfppw7vh7lox0alip6f7.png',
  },
  herdBehavior: {
    name: translate("talent.survivor.herdBehavior"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/24/dv1pstoj7a8ftqf9l3jazt1cpe4sxwo.png',
  },
  boldGambit: {
    name: translate("talent.survivor.boldGambit"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/21/m75mep3g3geppbh0wiz8yj84wrhp188.png',
  },
  webersLaw: {

    name: translate("talent.survivor.webersLaw"),

    ranges: {

      key: 'showItem',

      options: [

        { size_m: 18, label: translate("talent.survivor.webersLaw") },

      ],

    },

    icon: 'https://patchwiki.biligame.com/images/dwrg/2/28/4opnhwv5mnc78m81u6ulz3t2b50yhxj.png',

  },
  survivorsInstinct: {
    name: translate("talent.survivor.survivorsInstinct"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/60/pgwz9lgd9okg9hwlk7kyszsa3ov1ipf.png',
  },
  healing: {
    name: translate("talent.survivor.healing"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/7/77/s8yi0a8lbv2e4z6dqtd5ue48educk3j.png',
  },
  defenseMechanism: {
    name: translate("talent.survivor.defenseMechanism"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/5/5e/7jhjavu711fk9djq55jmdqi0h0kw1dp.png',
  },
  mutualSupport: {
    name: translate("talent.survivor.mutualSupport"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c9/rmy1slhai2al2sy8ksj5u4kuwwm3qzl.png',
  },
  symbioticEffect: {
    name: translate("talent.survivor.symbioticEffect"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/7/74/0m43fe23ldq8wcysaps2zfr95azenr9.png',
  },
  attachmentEffect: {
    name: translate("talent.survivor.attachmentEffect"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/2a/0sjfxsryqw4hmowjjp3mcd4njul5ebz.png',
  },
  tinnitus: {

    name: translate("talent.hunter.tinnitus"),

    ranges: {

      key: 'showItem',

      options: [

        { size_m: 36, label: translate("talent.hunter.tinnitus") },

      ],

    },

    icon: 'https://patchwiki.biligame.com/images/dwrg/f/f5/2546goc080xvxx8kde4sk2h1vry3k4n.png',

  },
  trumpCard: {
    name: translate("talent.hunter.trumpCard"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/bd/4aby06f4kbl87b14cihk5o3y1k61e8l.png',
  },
  detention: {
    name: translate("talent.hunter.detention"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/4/4b/rc4qgklip5wbuvipeihrh09n2agdg8g.png',
  },
  insolence: {
    name: translate("talent.hunter.insolence"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c3/ccavmjxuv1fbb6c1k518fm704ryjnud.png',
  },
  confinedSpace: {
    name: translate("talent.hunter.confinedSpace"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c3/atrblqorip0svkcp4yzgoyotad1bgfg.png',
  },
  constrain: {
    name: translate("talent.hunter.constrain"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/a/a0/9bmrx3cx4wlc3t1sj9nfjv5hai6lvbd.png',
  },
  huntersInstinct: {
    name: translate("talent.hunter.huntersInstinct"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/cf/mxddmljuqj7yoox43lzqaep65vqzlrk.png',
  },
  hospitable: {
    name: translate("talent.hunter.hospitable"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/bd/0g5ffo2nl64onqsdlb6b362iq4hxbhl.png',
  },
  announcement: {
    name: translate("talent.hunter.announcement"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/5/5e/5nttaz2s5owdqf8vczmuzuskdzz16xy.png',
  },
  wantedOrder: {
    name: translate("talent.hunter.wantedOrder"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/8/8b/osr474mxzxdslgkv7liwbjwdqy4ihhy.png',
  },
  impact: {
    name: translate("talent.hunter.impact"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/a/ad/8ea9e6vugcfryv3zygj9bspjgqhj76j.png',
  },
  desperateFight: {
    name: translate("talent.hunter.desperateFight"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/e/ed/d4h8n5a5oek1lwcxbsb5ot4og0l7rev.png',
  },
  addiction: {

    name: translate("talent.hunter.addiction"),

    ranges: {

      key: 'showItem',

      options: [

        { size_m: 20, label: translate("talent.hunter.addiction") },

      ],

    },

    icon: 'https://patchwiki.biligame.com/images/dwrg/e/eb/flp1movyr3427678u7a854cde31icqk.png',

  },
  nostalgic: {

    name: translate("talent.hunter.nostalgic"),

    ranges: {

      key: 'showItem',

      options: [

        { size_m: 32, label: translate("talent.hunter.nostalgic") },

      ],

    },

    icon: 'https://patchwiki.biligame.com/images/dwrg/e/ef/80q87s7z71ecm5yhz07bd9lo3hs1g8c.png',

  },
  inertia: {
    name: translate("talent.hunter.inertia"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/1/14/rc8ztb8bbgeu6n8aa4519l73qe91fi2.png',
  },
  mock: {
    name: translate("talent.hunter.mock"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/1/1e/oqjjx3ekhbhq6cm9e4kbcls4ve6khia.png',
  },
  carnival: {
    name: translate("talent.hunter.carnival"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/66/g9owt5pcnj58so0xowzz1feawcumbw7.png',
  },
  tippingPoint: {
    name: translate("talent.hunter.tippingPoint"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/be/i486ka9oqo1gxinmm9paucpb3ekw7ao.png',
  },
  sadist: {
    name: translate("talent.hunter.sadist"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/8/84/izx6cpgsoxaxpdhw5vivm9dnh63ia9n.png',
  },
  giantClaw: {
    name: translate("talent.hunter.giantClaw"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/9/94/d30ye1pn1adf2s1n5oxkepdm4yda3rf.png',
  },
  overwhelm: {
    name: translate("talent.hunter.overwhelm"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c0/nophz0m8ecvw970mtahqh0tsidc83zn.png',
  },
  impulsive: {
    name: translate("talent.hunter.impulsive"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/3/36/7s5zwko6w8o5dofzihh1icuwd6unab6.png',
  },
  skittish: {

    name: translate("talent.hunter.skittish"),

    ranges: {

      key: 'showItem',

      options: [

        { size_m: 12, label: translate("talent.hunter.skittish") },

      ],

    },

    icon: 'https://patchwiki.biligame.com/images/dwrg/0/0c/dmvkzw1a11nxskx0hhoq6bnfslsvw9c.png',

  },
  deerHunt: {

    name: translate("talent.hunter.deerHunt"),

    ranges: {

      key: 'showItem',

      options: [

        { size_m: 18, label: translate("talent.hunter.deerHunt") },

      ],

    },

    icon: 'https://patchwiki.biligame.com/images/dwrg/b/b7/d9ojgfgmihbwmaw6vkmbg96it0s2eb3.png',

  },
  tolerance: {
    name: translate("talent.hunter.tolerance"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/f/f6/3s0kqad251ndm3d16jpaeyc7xduonmh.png',
  },
  afterEffects: {
    name: translate("talent.hunter.afterEffects"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/1/11/rld1fyyj38hib7l68b5h4h5zyuiaj9b.png',
  },
  exhibitionist: {
    name: translate("talent.hunter.exhibitionist"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/f/f4/09t1qnokqpghr980vng318gc2mbnew2.png',
  },
  hunt: {
    name: translate("talent.hunter.hunt"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/3/3b/9vr6n98dn8ncs3ey2a2j7r0pre662qz.png',
  },
  streetSweeper: {

    name: translate("talent.hunter.streetSweeper"),

    ranges: {

      key: 'showItem',

      options: [

        { size_m: [30, 45, 60], label: translate("talent.hunter.streetSweeper") },

      ],

    },

    icon: 'https://patchwiki.biligame.com/images/dwrg/b/bd/re4lu3k5iknzh748yg85tcdvla2b0t2.png',

  },
  controlFreak: {
    name: translate("talent.hunter.controlFreak"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/a/ae/mz8qmlayh9764yyx92v107r8zu3xxnn.png',
  },
  claustrophobia: {
    name: translate("talent.hunter.claustrophobia"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/7/7f/0r543j4h6te5jkei0gkpq1u9bug339h.png',
  },
  lingeringMight: {
    name: translate("talent.hunter.lingeringMight"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/7/78/i25vjq0xfa5na6isxe4nvlkqd97za7u.png',
  },
  deteriorate: {
    name: translate("talent.hunter.deteriorate"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/a/ab/tgy9teeck5fbb45l4rqhfeuzefgme4h.png',
  },
  wither: {

    name: translate("talent.hunter.wither"),

    ranges: {

      key: 'showItem',

      options: [

        { size_m: 10, label: translate("talent.hunter.wither") },

      ],

    },

    icon: 'https://patchwiki.biligame.com/images/dwrg/4/48/9edy2j55gu74hyrt4jqx4cxkunwyray.png',

  },
  destructiveness: {
    name: translate("talent.hunter.destructiveness"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/e/ea/jia1hytcsgf2x224vpould5xxb1txxs.png',
  },
  panic: {
    name: translate("talent.hunter.panic"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/1/16/n8w0iumzvkcvcob29ar1rubll0l555k.png',
  },
  rage: {
    name: translate("talent.hunter.rage"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/f/ff/49uul2z4qsq3rkzkwmp0ebqrkoyh1yk.png',
  },
  berserk: {
    name: translate("talent.hunter.berserk"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/4/4e/2lii838vqevzhtadrgyvszn86pi8duq.png',
  },
  obsession: {

    name: translate("talent.hunter.obsession"),

    ranges: {

      key: 'showItem',

      options: [

        { size_m: 16, label: translate("talent.hunter.obsession") },

      ],

    },

    icon: 'https://patchwiki.biligame.com/images/dwrg/6/6b/ra1r6rk9depicpmew855rzug25sy8ut.png',

  },
  mischievous: {
    name: translate("talent.hunter.mischievous"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/8/8b/3nhtqryf6cqg7z97yoofqtvx2mfxyb9.png',
  },
  famine: {

    name: translate("talent.hunter.famine"),

    ranges: {

      key: 'showItem',

      options: [

        { size_m: 16, label: translate("talent.hunter.famine") },

      ],

    },

    icon: 'https://patchwiki.biligame.com/images/dwrg/4/45/73txs9wv78r9rrh0ghil23wf6tx4c3s.png',

  },
};

// 各阵营人格道具键清单：roles.js 的 items 直接引用，新增人格只需改本文件
export const TAC_TALENT_KEYS = {
  survivor: [
    'fearRadius',
    'borrowedTime',
    'tideTurner',
    'kneeJerkReflex',
    'flywheelEffect',
    'curiosity',
    'sticker',
    'escape',
    'distraction',
    'snooze',
    'touchEffect',
    'telepathy',
    'companionEffect',
    'audienceEffect',
    'birdcageEffect',
    'saviorComplex',
    'herdMentality',
    'sneak',
    'doctor',
    'shelter',
    'catharsisEffect',
    'emergencyReserves',
    'empathy',
    'riskyMove',
    'horseflyEffect',
    'muscleMemory',
    'wellEarned',
    'greatPower',
    'willToSurvive',
    'exitPath',
    'brewingEffect',
    'sensoryAdaptation',
    'herdBehavior',
    'boldGambit',
    'webersLaw',
    'survivorsInstinct',
    'healing',
    'defenseMechanism',
    'mutualSupport',
    'symbioticEffect',
    'attachmentEffect'
  ],
  hunter: [
    'tinnitus',
    'trumpCard',
    'detention',
    'insolence',
    'confinedSpace',
    'constrain',
    'huntersInstinct',
    'hospitable',
    'announcement',
    'wantedOrder',
    'impact',
    'desperateFight',
    'addiction',
    'nostalgic',
    'inertia',
    'mock',
    'carnival',
    'tippingPoint',
    'sadist',
    'giantClaw',
    'overwhelm',
    'impulsive',
    'skittish',
    'deerHunt',
    'tolerance',
    'afterEffects',
    'exhibitionist',
    'hunt',
    'streetSweeper',
    'controlFreak',
    'claustrophobia',
    'lingeringMight',
    'deteriorate',
    'wither',
    'destructiveness',
    'panic',
    'rage',
    'berserk',
    'obsession',
    'mischievous',
    'famine'
  ],
};
