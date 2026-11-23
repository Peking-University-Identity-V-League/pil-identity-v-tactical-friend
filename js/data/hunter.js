import { translate } from '../core/i18n.js';


// 监管者角色数据：名称、移速、范围、道具、头像
export const TAC_HUNTER_ROLES = {
  hellEmber: {
    name: translate("characters.hellEmber.name"),
    camp: 'hunter',
    speed: 4.73,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 55, label: translate("characters.hellEmber.range.puppetCastMax") },
      ],
    },
    items: ['phantom', 'puppet1', 'puppet2'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/43/9ji6s1uz7c0dnn0r70zxv4a3cx67xm2.png/90px-%E5%8E%82%E9%95%BF%E5%A4%B4%E5%83%8F.png',
  },
  smileyFace: {
    name: translate("characters.smileyFace.name"),
    camp: 'hunter',
    speed: 4.56,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 19.5, label: translate("characters.smileyFace.range.rocketDashMaxTier1") },
        { size_m: 26, label: translate("characters.smileyFace.range.rocketDashMaxTier2") },
        { size_m: 24, label: translate("characters.smileyFace.range.partSeen") },
      ],
    },
    items: ['windWings', 'drill', 'propeller', 'rocketDash'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/55/ob4f8gqvpcfw0sarr5ule5mpmzxby7l.png/90px-%E5%B0%8F%E4%B8%91%E5%A4%B4%E5%83%8F.png',
  },
  gameKeeper: {
    name: translate("characters.gameKeeper.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['chainHook', 'trap'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e3/jr41oyh7dug7kstuwjaqpt0twtmuk4t.png/90px-%E9%B9%BF%E5%A4%B4%E5%A4%B4%E5%83%8F.png',
  },
  theRipper: {
    name: translate("characters.theRipper.name"),
    camp: 'hunter',
    speed: 4.73,
    items: ['fogZone', 'freezingFog', 'hiddenInMist'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/97/ivu0gnyhfvshbheysxmqaeqcq6j5pi3.png/90px-%E2%80%9C%E6%9D%B0%E5%85%8B%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  soulWeaver: {
    name: translate("characters.soulWeaver.name"),
    camp: 'hunter',
    speed: 4.56,
    items: ['cocoon', 'webbing', 'spinning'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/97/dpvb1d7e4f03tqh9s0l0ulua91ouuab.png/90px-%E8%9C%98%E8%9B%9B%E5%A4%B4%E5%83%8F.png',
  },
  geisha: {
    name: translate("characters.geisha.name"),
    camp: 'hunter',
    speed: { [translate("characters.geisha.beautyForm")]: 4.73, [translate("characters.geisha.prajnaForm")]: 4.56 },
    items: ['swallowtailButterfly', 'dashHit', 'soulDeparture'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/bd/qcstapls4hnm6fckekl6l6890h19vst.png/90px-%E7%BA%A2%E8%9D%B6%E5%A4%B4%E5%83%8F.png',
  },
  wuchang: {
    name: translate("characters.wuchang.name"),
    camp: 'hunter',
    speed: { [translate("characters.wuchang.xieBiAn")]: 4.73, [translate("characters.wuchang.fanWuJiu")]: 4.56 },
    items: ['umbrella', 'siphonSoulWaveringSoul'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/2a/gd5yd3hfaohhj2pozgqf2cfivpadbn6.png/90px-%E5%AE%BF%E4%BC%9E%E4%B9%8B%E9%AD%82%E5%A4%B4%E5%83%8F.png',
  },
  photographer: {
    name: translate("characters.photographer.name"),
    camp: 'hunter',
    speed: 4.64,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 33, label: translate("characters.photographer.range.locateCamera") },
      ],
    },
    items: ['camera', 'recordedMoment', 'timeJump'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c6/rmzvfbp2mi0ucb13xcj6t6dzgd41tlz.png/90px-%E6%91%84%E5%BD%B1%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  madEyes: {
    name: translate("characters.madEyes.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['console', 'fence', 'portableConsole', 'overlock'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/4a/kybq2j420o43mr2b0wi5qy4wgtmq65k.png/90px-%E7%96%AF%E7%9C%BC%E5%A4%B4%E5%83%8F.png',
  },
  theFeaster: {
    name: translate("characters.theFeaster.name"),
    camp: 'hunter',
    speed: 4.64,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 42.2, label: translate("characters.theFeaster.range.tentaclePlacement") },
        { size_m: 21.1, label: translate("characters.theFeaster.range.tentacleControlHit") },
        { size_m: 21.1, label: translate("characters.theFeaster.range.nightmareGaze") },
      ],
    },
    items: ['tentacles', 'nightmareAttack', 'nightmareGaze'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/30/3yr81lwbegfcgotyiis8yknwc2224is.png/90px-%E9%BB%84%E8%A1%A3%E4%B9%8B%E4%B8%BB%E5%A4%B4%E5%83%8F.png',
  },
  dreamWitch: {
    name: translate("characters.dreamWitch.name"),
    camp: 'hunter',
    speed: { [translate("characters.dreamWitch.originalBody")]: 6.08, [translate("items.dreamWitch.follower.name")]: 4.56 },
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 20, label: translate("characters.dreamWitch.range.hiddenDreamsurvivorNotification") },
        { size_m: 42.2, label: translate("characters.dreamWitch.range.followerControlTier0Tier1") },
        { size_m: 59.1, label: translate("characters.dreamWitch.range.followerControlTier2") },
      ],
    },
    items: ['follower', 'witchMark', 'hiddenDream', 'preach', 'leech'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/6c/igl4l2j95ftovgiv85sdeidapbse4gu.png/90px-%E6%A2%A6%E4%B9%8B%E5%A5%B3%E5%B7%AB%E5%A4%B4%E5%83%8F.png',
  },
  axeBoy: {
    name: translate("characters.axeBoy.name"),
    camp: 'hunter',
    speed: 4.56,
    items: ['peacefulPine', 'resentfulSoul', 'restfulRoad'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/1c/jtvvska3lxcxlxq9vpto2mq2lj3l2q9.png/90px-%E7%88%B1%E5%93%AD%E9%AC%BC%E5%A4%B4%E5%83%8F.png',
  },
  evilReptilian: {
    name: translate("characters.evilReptilian.name"),
    camp: 'hunter',
    speed: 4.64,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 3, label: translate("characters.evilReptilian.range.lethalCrash") },
      ],
    },
    items: ['preyingLeap', 'crash', 'lethalCrash'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8b/e7uzw52eywkaptcdagdm61cihnpot2p.png/90px-%E5%AD%BD%E8%9C%A5%E5%A4%B4%E5%83%8F.png',
  },
  bloodyQueen: {
    name: translate("characters.bloodyQueen.name"),
    camp: 'hunter',
    speed: 4.64,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 25.3, label: translate("characters.bloodyQueen.range.aquaMirrorPlacement") },
      ],
    },
    items: ['aquaMirror', 'mirrorRotation'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/93/5sfpytt0vm3cjq75sr912v6eaxzqh7z.png/90px-%E7%BA%A2%E5%A4%AB%E4%BA%BA%E5%A4%B4%E5%83%8F.png',
  },
  guard26: {
    name: translate("characters.guard26.name"),
    camp: 'hunter',
    speed: 4.64,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 35.5, label: translate("characters.guard26.range.bombThrowMax") },
      ],
    },
    items: ['timeBomb', 'remoteControlledBomb'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/bf/jycs4x41s0qky58o3pfprwwz9fpvr54.png/90px-26%E5%8F%B7%E5%AE%88%E5%8D%AB%E5%A4%B4%E5%83%8F.png',
  },
  disciple: {
    name: translate("characters.disciple.name"),
    camp: 'hunter',
    speed: 4.73,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 30, label: translate("characters.disciple.range.guidePlacement") },
        { size_m: 10.5, label: translate("characters.disciple.range.catwalkTier0") },
        { size_m: 12.5, label: translate("characters.disciple.range.catwalkTier2") },
      ],
    },
    items: ['cat', 'guide', 'catwalk'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/fa/hbvpsmvnox9azfb2kj93nsmbv2a350r.png/90px-%E2%80%9C%E4%BD%BF%E5%BE%92%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  violinist: {
    name: translate("characters.violinist.name"),
    camp: 'hunter',
    speed: 4.64,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 20.5, label: translate("characters.violinist.range.musicNotePlacement") },
      ],
    },
    items: ['musicNote', 'infiniteMovement', 'terrifyingMelody'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0a/7mjm285tyi076r96jb62rl469no2wn2.png/90px-%E5%B0%8F%E6%8F%90%E7%90%B4%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  sculptor: {
    name: translate("characters.sculptor.name"),
    camp: 'hunter',
    speed: 4.64,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 22.5, label: translate("characters.sculptor.range.sculpturePlacement") },
        { size_m: 12, label: translate("characters.sculptor.range.hieroglyphicGraveyardHint") },
      ],
    },
    items: ['sculpture', 'sculptureOfNobility', 'hieroglyphicGraveyard'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/6a/b3mgw309lp8v5sqfzvrfroizdijrv50.png/90px-%E9%9B%95%E5%88%BB%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  undead: {
    name: translate("characters.undead.name"),
    camp: 'hunter',
    speed: 4.73,
    items: ['kineticDashHit', 'chargedStrike', 'energyConversion'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b7/6bjonfiuioth8cvmi8vvfae13ii1f3d.png/90px-%E2%80%9C%E5%8D%9A%E5%A3%AB%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  theBreakingWheel: {
    name: translate("characters.theBreakingWheel.name"),
    camp: 'hunter',
    speed: { [translate("characters.theBreakingWheel.humanForm")]: 4.64, [translate("characters.theBreakingWheel.wheelForm")]: 10.13 },
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 11.8, label: translate("characters.theBreakingWheel.range.pessimistic") },
        { size_m: 10.1, label: translate("characters.theBreakingWheel.range.ridicule") },
      ],
    },
    items: ['wheelForm', 'nailBoard', 'wheelOfImpalement', 'pessimistic', 'ridicule'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b4/a9kc3enyzxn84eu29l6lxszhvs3lhaf.png/90px-%E7%A0%B4%E8%BD%AE%E5%A4%B4%E5%83%8F.png',
  },
  naiad: {
    name: translate("characters.naiad.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['spearfishing', 'surgingTides'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/dc/dah1qypfv56191rerxkkvdytfvki1jh.png/90px-%E6%B8%94%E5%A5%B3%E5%A4%B4%E5%83%8F.png',
  },
  waxArtist: {
    name: translate("characters.waxArtist.name"),
    camp: 'hunter',
    speed: 4.73,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 4.2, label: translate("characters.waxArtist.range.waxenCoatSplash") },
      ],
    },
    items: ['waxBlock', 'moltenWax', 'waxSculpting'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/04/taokr9xvuhc9tlo57yedyyi08tdh90f.png/90px-%E8%9C%A1%E5%83%8F%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  nightmare: {
    name: translate("characters.nightmare.name"),
    camp: 'hunter',
    speed: 4.64,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 6.33, label: translate("characters.nightmare.range.dive") },
      ],
    },
    items: ['raven', 'spy', 'badOmen'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8f/ea16nemw9m7j8rvj3sg1nm89jh44e7u.png/90px-%E2%80%9C%E5%99%A9%E6%A2%A6%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  clerk: {
    name: translate("characters.clerk.name"),
    camp: 'hunter',
    speed: 4.73,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 20, label: translate("characters.clerk.range.replayMax") },
      ],
    },
    items: ['record', 'inspect', 'replay', 'invalid'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/ac/3wfd3yosh529sx4uxfxu0hq9qrzocnl.png/90px-%E2%80%9C%E8%AE%B0%E5%BD%95%E5%91%98%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  hermit: {
    name: translate("characters.hermit.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['electromagneticFieldN', 'electromagneticFieldS', 'secondDawn', 'reversePolarity', 'meditation'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/4f/5ed5nvceb7pj3ohyyz493eupwfbowte.png/90px-%E9%9A%90%E5%A3%AB%E5%A4%B4%E5%83%8F.png',
  },
  nightWatch: {
    name: translate("characters.nightWatch.name"),
    camp: 'hunter',
    speed: 4.64,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 15.9, label: translate("characters.nightWatch.range.tempest") },
        { size_m: 11.8, label: translate("characters.nightWatch.range.tempestCyclone") },
        { size_m: 15.2, label: translate("characters.nightWatch.range.windwalkCharge") },
      ],
    },
    items: ['tempest', 'windwalk', 'tempestCyclone', 'windwalkCharge', 'windControl'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c3/d99smic5vrfjsir2pwo8endmiaoipp5.png/90px-%E5%AE%88%E5%A4%9C%E4%BA%BA%E5%A4%B4%E5%83%8F.png',
  },
  operaSinger: {
    name: translate("characters.operaSinger.name"),
    camp: 'hunter',
    speed: 4.56,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 4.64, label: translate("characters.operaSinger.range.shadowLeapTier0Tier1") },
        { size_m: 5.568, label: translate("characters.operaSinger.range.shadowLeapTier2") },
      ],
    },
    items: ['remnant', 'shadowstrike'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/be/k47ppq37pc3g92kjsu3iakot58em2pk.png/90px-%E6%AD%8C%E5%89%A7%E6%BC%94%E5%91%98%E5%A4%B4%E5%83%8F.png',
  },
  foolsGold: {
    name: translate("characters.foolsGold.name"),
    camp: 'hunter',
    speed: 4.64,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 40, label: translate("characters.foolsGold.range.pickaxeThrowMax") },
        { size_m: 60, label: translate("characters.foolsGold.range.pickaxeReturn") },
        { size_m: 60, label: translate("characters.foolsGold.range.magneticRockPlacemnt") },
      ],
    },
    items: ['pickaxe', 'magneticRock'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b8/bkshz3pnyhz1mhmq3xrr3bgr2mctkc0.png/90px-%E2%80%9C%E6%84%9A%E4%BA%BA%E9%87%91%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  theShadow: {
    name: translate("characters.theShadow.name"),
    camp: 'hunter',
    speed: { [translate("characters.theShadow.ivy")]: 4.64, [translate("items.theShadow.yithian.name")]: 7.59 },
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 15, label: translate("characters.theShadow.range.corruption") },
      ],
    },
    items: ['yithian', 'ancientVisage', 'psychicIntrusion', 'corruptedOstracon'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b7/sm52k5nm0azevp1522d8fdx7p59d4nl.png/90px-%E6%97%B6%E7%A9%BA%E4%B9%8B%E5%BD%B1%E5%A4%B4%E5%83%8F.png',
  },
  goatman: {
    name: translate("characters.goatman.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['cage', 'backstep'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/6c/1lx58h74jh6atpnkp3ve0z23d5xrwyy.png/90px-%E2%80%9C%E8%B7%9B%E8%84%9A%E7%BE%8A%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  hullabaloo: {
    name: translate("characters.hullabaloo.name"),
    camp: 'hunter',
    speed: 5.10,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 3.54, label: translate("characters.hullabaloo.range.bombsArea") },
      ],
    },
    items: ['cloneHullabaloo', 'encore', 'trapeze'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/4a/h01g2xvfrfnb48m8u3a1xghciyfd9cy.png/90px-%E2%80%9C%E5%96%A7%E5%9A%A3%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  peddler: {
    name: translate("characters.peddler.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['pettyGains', 'natureAffinity', 'mineralAffinity', 'metalAffinity'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/af/c1idozmlwq4h20eylgrl3zzuueatha9.png/90px-%E6%9D%82%E8%B4%A7%E5%95%86%E5%A4%B4%E5%83%8F.png',
  },
  cueist: {
    name: translate("characters.cueist.name"),
    camp: 'hunter',
    speed: 4.64,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 15.2, label: translate("characters.cueist.range.contactPointFirstPlacement") },
        { size_m: 8, label: translate("characters.cueist.range.maxwellsDemon") },
        { size_m: { min: 8, max: 11 }, label: translate("characters.cueist.range.cueBallCapturePlacement") },
      ],
    },
    items: ['contactPoint', 'cueBall', 'maxwellsDemon'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e5/7st2e3ycktftdvdl68mdlub4aun3g6a.png/90px-%E2%80%9C%E5%8F%B0%E7%90%83%E6%89%8B%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  queenBee: {
    name: translate("characters.queenBee.name"),
    camp: 'hunter',
    speed: { [translate("characters.queenBee.name")]: 4.64, [translate("characters.queenBee.speed.hiveCluster")]: 12 },
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 28, label: translate("characters.queenBee.range.swarmOfInsectsControl") },
      ],
    },
    items: ['swarmOfInsects', 'stinger'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c6/0kb43nn36sho3vxrlvy2byk5xt9wldt.png/90px-%E2%80%9C%E5%A5%B3%E7%8E%8B%E8%9C%82%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  dentist: {
    name: translate("characters.dentist.name"),
    camp: 'hunter',
    speed: 4.73,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 6.56, ringInner: 4.56, label: translate("characters.dentist.range.dentalMirrorLensAngle1") },
        { size_m: 11.4, ringInner: 9.4, label: translate("characters.dentist.range.dentalMirrorLensAngle2") },
        { size_m: 18.9, ringInner: 16.9, label: translate("characters.dentist.range.dentalMirrorLensAngle3") },
        { size_m: { min: 12.7, max: 35 }, label: translate("characters.dentist.range.beamPlacement") },
        { size_m: 32, label: translate("characters.dentist.range.ultravioletFade") },
      ],
    },
    items: ['beam', 'dentalMirror', 'darkMire'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/55/qqgw8tk7p16rrgpfodmon5y9ljj2dq8.png/90px-%E2%80%9C%E7%89%99%E5%8C%BB%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  herztier: {
    name: translate("characters.herztier.name"),
    camp: 'hunter',
    speed: 4.64,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 48, label: translate("characters.herztier.range.bestialAwakening") },
        { size_m: [7, 14], label: translate("characters.herztier.range.lunge") },
        { size_m: 25, label: translate("characters.herztier.range.heightenedSenses") },
      ],
    },
    items: ['bestialAwakening', 'lunge', 'heightenedSenses'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5f/d9d4dwfp18lwnmcmymoy3iylx2pai6j.png/90px-%E2%80%9C%E5%BF%83%E5%85%BD%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
};
