import { translate } from '../core/i18n.js';


// 求生者角色数据：名称、移速、范围、道具、头像
export const TAC_SURVIVOR_ROLES = {
  luckyGuy: {
    name: translate("characters.luckyGuy.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 25.3, label: translate("characters.luckyGuy.range.detectChestNearby") },
      ],
    },
    items: ['luckyParcel'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/43/4lql67bftg4hb0bm3gvhlj12mf0hx6a.png/90px-%E5%B9%B8%E8%BF%90%E5%84%BF%E5%A4%B4%E5%83%8F.png',
  },
  doctor: {
    name: translate("characters.doctor.name"),
    camp: 'survivor',
    items: ['syringe'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3f/1w5x3hebebapsytc5agra0mfbk1evwk.png/90px-%E5%8C%BB%E7%94%9F%E5%A4%B4%E5%83%8F.png',
  },
  lawyer: {
    name: translate("characters.lawyer.name"),
    camp: 'survivor',
    items: ['map'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/75/cbk98bqc51i4mojakibyl03xd20uk14.png/90px-%E5%BE%8B%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  thief: {
    name: translate("characters.thief.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 8, label: translate("characters.thief.range.flashlightShining") },
      ],
    },
    items: ['flashlight'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/29/1ng3fsmkec1slkxdgtwg5pv2b69w0n4.png/90px-%E2%80%9C%E6%85%88%E5%96%84%E5%AE%B6%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  gardener: {
    name: translate("characters.gardener.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 15, label: translate("characters.gardener.range.locateRocketChairNearby") },
      ],
    },
    items: ['toolkit'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f6/j9xl16i2incpfel2f5v06l2qrn65u6m.png/90px-%E5%9B%AD%E4%B8%81%E5%A4%B4%E5%83%8F.png',
  },
  magician: {
    name: translate("characters.magician.name"),
    camp: 'survivor',
    items: ['wand'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/df/rsppa4etapj4i0a9vpqeary620yfpu6.png/90px-%E9%AD%94%E6%9C%AF%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  explorer: {
    name: translate("characters.explorer.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 60, label: translate("characters.explorer.range.senseHunter") },
        { size_m: 70, label: translate("characters.explorer.range.passwordPage") },
      ],
    },
    items: ['gulliversTravels' ,'passwordPage'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8d/4bayjt56xydhpwb91pcie4hpbnm6gp7.png/90px-%E5%86%92%E9%99%A9%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  mercenary: {
    name: translate("characters.mercenary.name"),
    camp: 'survivor',
    items: ['elbowPads', 'elbowPadsOff'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/4c/3q44aot13l2d3en8vhxflg2hkq1e5h9.png/90px-%E4%BD%A3%E5%85%B5%E5%A4%B4%E5%83%8F.png',
  },
  coordinator: {
    name: translate("characters.coordinator.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 10, label: translate("characters.coordinator.range.flareGunCanUse") },
      ],
    },
    items: ['flareGun'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/22/22nticg5kk2o0m6d5krcoaambmjfxk1.png/90px-%E7%A9%BA%E5%86%9B%E5%A4%B4%E5%83%8F.png',
  },
  mechanic: {
    name: translate("characters.mechanic.name"),
    camp: 'survivor',
    items: ['mechanicsDoll', 'mechanicsDollControl'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/35/der9jwp2lihygo0cq7wpfkqz84zg63a.png/90px-%E6%9C%BA%E6%A2%B0%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  forward: {
    name: translate("characters.forward.name"),
    camp: 'survivor',
    items: ['football'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/17/adh59za8e9rtz8cfqzxyalsa1ipa3n0.png/90px-%E5%89%8D%E9%94%8B%E5%A4%B4%E5%83%8F.png',
  },
  theMindsEye: {
    name: translate("characters.theMindsEye.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 25.3, label: translate("characters.theMindsEye.range.tapTapLocatePosition") },
        { size_m: 6.8, label: translate("characters.theMindsEye.range.strikeInteractionSpeedReduceOne") },
        { size_m: 25.3, label: translate("characters.theMindsEye.range.strikeInteractionSpeedReduceTwo") },
      ],
    },
    items: ['cane'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d8/qvgdwg0j78wq87wwueb2o5h3s5uduy3.png/90px-%E7%9B%B2%E5%A5%B3%E5%A4%B4%E5%83%8F.png',
  },
  priestess: {
    name: translate("characters.priestess.name"),
    camp: 'survivor',
    items: ['straightPassage', 'ultralongPassage'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/56/clgsyw7wsb933tstoge2j3f305agt86.png/90px-%E7%A5%AD%E5%8F%B8%E5%A4%B4%E5%83%8F.png',
  },
  perfumer: {
    name: translate("characters.perfumer.name"),
    camp: 'survivor',
    items: ['euphoriaPerfume'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/60/7042qxxqgrsijjmv85o9fp8siwgrziy.png/90px-%E8%B0%83%E9%A6%99%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  cowboy: {
    name: translate("characters.cowboy.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 15.2, label: translate("characters.cowboy.range.lassoHitMax") },
      ],
    },
    items: ['lasso'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0f/6g0s5afin66fseijjq4kqwo2hmx6kae.png/90px-%E7%89%9B%E4%BB%94%E5%A4%B4%E5%83%8F.png',
  },
  femaleDancer: {
    name: translate("characters.femaleDancer.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 8.44, label: translate("characters.femaleDancer.range.slide") },
      ],
    },
    items: ['fastMusicbox', 'slowMusicbox', 'musicboxSwitch'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/14/6u90w90cko8ucql7td6s2g66tirtqm6.png/90px-%E8%88%9E%E5%A5%B3%E5%A4%B4%E5%83%8F.png',
  },
  seer: {
    name: translate("characters.seer.name"),
    camp: 'survivor',
    items: ['owl'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7f/kc24bm0cjockhhopjtef8rg25q48bhd.png/90px-%E5%85%88%E7%9F%A5%E5%A4%B4%E5%83%8F.png',
  },
  embalmer: {
    name: translate("characters.embalmer.name"),
    camp: 'survivor',
    items: ['makeupBox', 'coffin'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/ac/9ycf32ktg7qe2234e49d8mzrc18ma1w.png/90px-%E5%85%A5%E6%AE%93%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  prospector: {
    name: translate("characters.prospector.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 14.5, label: translate("characters.prospector.range.magnetThrowMax") },
        { size_m: 18, label: translate("characters.prospector.range.stunReduce") },
      ],
    },
    items: ['meteoriteMagnetN', 'meteoriteMagnetS'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8d/1mes1uvmogs9veklzk3ieep2i5y7evt.png/90px-%E5%8B%98%E6%8E%A2%E5%91%98%E5%A4%B4%E5%83%8F.png',
  },
  enchantress: {
    name: translate("characters.enchantress.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 5.1, label: translate("characters.enchantress.range.apeCurseParalyze") },
        { size_m: 16.9, label: translate("characters.enchantress.range.guardStack") },
        { size_m: 12.7, label: translate("characters.enchantress.range.guardStackReduce") },
      ],
    },
    items: ['cursedEmblem', 'cursedEmblemSpecial'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/61/ezw8a4g51y9o4zufeug2rbeemzmdzs5.png/90px-%E5%92%92%E6%9C%AF%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  wildling: {
    name: translate("characters.wildling.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 15, label: translate("characters.wildling.range.bumpMax") },
        { size_m: 17, label: translate("characters.wildling.range.bumpAddKnockBackMax") },
      ],
    },
    items: ['wildlingPartner', 'wildlingPartnerRide', 'wildlingPartnerFollowingState', 'wildlingPartnerRidingState', 'wildlingPartnerRidingStateCross'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b0/qix27d33osv7o1ti0g244pf7xzp8d0x.png/90px-%E9%87%8E%E4%BA%BA%E5%A4%B4%E5%83%8F.png',
  },
  acrobat: {
    name: translate("characters.acrobat.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 4, label: translate("characters.acrobat.range.leapDefault") },
        { size_m: 7.5, label: translate("characters.acrobat.range.leapMax") },
        { size_m: 12, label: translate("characters.acrobat.range.leapAddSomersault") },
      ],
    },
    items: ['stickyBomb', 'nitroBomb', 'fireBomb', 'stickyBombThrow', 'nitroBombThrow', 'fireBombThrow'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c4/c6whxfr6ba7v3pv5xcskfvv0rvgt4e8.png/90px-%E6%9D%82%E6%8A%80%E6%BC%94%E5%91%98%E5%A4%B4%E5%83%8F.png',
  },
  firstOfficer: {
    name: translate("characters.firstOfficer.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 27, label: translate("characters.firstOfficer.range.hypnotize1") },
        { size_m: 8.4, label: translate("characters.firstOfficer.range.hypnotize2") },
        { size_m: 5.1, label: translate("characters.firstOfficer.range.hypnotize3") },
      ],
    },
    items: ['poseidonWatch'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0d/fcqecshh4fczyoeczq8ly2yt3rx0f5q.png/90px-%E5%A4%A7%E5%89%AF%E5%A4%B4%E5%83%8F.png',
  },
  barmaid: {
    name: translate("characters.barmaid.name"),
    camp: 'survivor',
    items: ['duphrin', 'strongDovlin', 'mixDovlin'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d1/qxsohhayojydlkq1rvfpb9fefsvei2m.png/90px-%E8%B0%83%E9%85%92%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  postman: {
    name: translate("characters.postman.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 16.9, label: translate("characters.postman.range.postDogDashMax") },
      ],
    },
    items: ['letter', 'postDog'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d7/mhxuubsfzzp0yxdeilggtix32euxgf4.png/90px-%E9%82%AE%E5%B7%AE%E5%A4%B4%E5%83%8F.png',
  },
  graveKeeper: {
    name: translate("characters.graveKeeper.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 9.7, label: translate("characters.graveKeeper.range.tremor") },
      ],
    },
    items: ['shovel', 'shovelEmerge'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5c/dc57y6fvws61am1wmtpnqjzbeu0pnmy.png/90px-%E5%AE%88%E5%A2%93%E4%BA%BA%E5%A4%B4%E5%83%8F.png',
  },
  prisoner: {
    name: translate("characters.prisoner.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 5.9, label: translate("characters.prisoner.range.severeElectricCurrentStun") },
      ],
    },
    items: ['insulatingGloves', 'severeElectricCurrent', 'electricalArea'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/80/6lii1orabnu42oto26e1o570vl5w6f1.png/90px-%22%E5%9B%9A%E5%BE%92%22%E5%A4%B4%E5%83%8F.png',
  },
  entomologist: {
    name: translate("characters.entomologist.name"),
    camp: 'survivor',
    items: ['swarmNet', 'swarmNetWave'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/63/3s9842m4mdlccry2lxz1u1cr8cecz3s.png/90px-%E6%98%86%E8%99%AB%E5%AD%A6%E8%80%85%E5%A4%B4%E5%83%8F.png',
  },
  painter: {
    name: translate("characters.painter.name"),
    camp: 'survivor',
    items: ['paintBruahAndDrawingBoard', 'drawingBoard'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/56/821z7af4xzflb8o5ad3jxjzqzxswqqh.png/90px-%E7%94%BB%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  batter: {
    name: translate("characters.batter.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 10.1, label: translate("characters.batter.range.cricketBatCanHit") },
        { size_m: 17.55, label: translate("characters.batter.range.cricketBatHitAddKnockBackMax") },
        { size_m: 15.2, label: translate("characters.batter.range.altruism") },
      ],
    },
    items: ['cricketBat', 'rampage'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/64/qfrijnvjm5sr2pq8ny1mv2zxj60k7b0.png/90px-%E5%87%BB%E7%90%83%E6%89%8B%E5%A4%B4%E5%83%8F.png',
  },
  toyMerchant: {
    name: translate("characters.toyMerchant.name"),
    camp: 'survivor',
    items: ['catapult', 'woodenWings', 'toyBox', 'toyContainer'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/9e/sjqzxjfh9dr8zjhdl3y9g5xoibszlck.png/90px-%E7%8E%A9%E5%85%B7%E5%95%86%E5%A4%B4%E5%83%8F.png',
  },
  psychologist: {
    name: translate("characters.psychologist.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 13, label: translate("characters.psychologist.range.subjectiveAnchor") },
        { size_m: 13, label: translate("characters.psychologist.range.bonded") },
      ],
    },
    items: ['whistle', 'subjectiveAnchor', 'bonded'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e4/bqml61178c80rz5gd4m6rjyejqfjuw2.png/90px-%E2%80%9C%E5%BF%83%E7%90%86%E5%AD%A6%E5%AE%B6%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  patient: {
    name: translate("characters.patient.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 13, label: translate("characters.patient.range.bonded") },
      ],
    },
    items: ['grapplingHook', 'bonded'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/63/3ihjylgclyicqv0c9xxhw3lg6ccrzts.png/90px-%E7%97%85%E6%82%A3%E5%A4%B4%E5%83%8F.png',
  },
  novelist: {
    name: translate("characters.novelist.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 13.5, label: translate("characters.novelist.range.metaphorDefault") },
        { size_m: 9.8, label: translate("characters.novelist.range.metaphorReduce") },
      ],
    },
    items: ['sketchBook'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/33/9rjzftpqbbo1z2uuyqlrm8jay8mwmci.png/90px-%E5%B0%8F%E8%AF%B4%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  littleGirl: {
    name: translate("characters.littleGirl.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 3.4, label: translate("characters.littleGirl.range.memorySync") },
      ],
    },
    items: ['memoryFragment', 'memorySync', 'pity'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0f/9fgs5q97em3fq64uahgmlkfl3fer2g8.png/90px-%E2%80%9C%E5%B0%8F%E5%A5%B3%E5%AD%A9%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  weepingClown: {
    name: translate("characters.weepingClown.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 6, label: translate("characters.weepingClown.range.rocketExplode") },
        { size_m: 3, label: translate("characters.weepingClown.range.stunHunter") },
      ],
    },
    items: ['rocket'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/2f/gnwi7vgnop543ts7ki7d99fkhoc18wf.png/90px-%E5%93%AD%E6%B3%A3%E5%B0%8F%E4%B8%91%E5%A4%B4%E5%83%8F.png',
  },
  professor: {
    name: translate("characters.professor.name"),
    camp: 'survivor',
    items: ['scale', 'injection'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/1d/axm2gkg6h7t9244sf86k8li6mxa4e59.png/90px-%E6%95%99%E6%8E%88%E5%A4%B4%E5%83%8F.png',
  },
  antiquarian: {
    name: translate("characters.antiquarian.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 4.9, label: translate("characters.antiquarian.range.flip") },
        { size_m: 3.5, label: translate("characters.antiquarian.range.sweepSwing") },
        { size_m: 4.7, label: translate("characters.antiquarian.range.stab") },
        { size_m: 12.7, label: translate("characters.antiquarian.range.obscure") },
      ],
    },
    items: ['mechanicalFlute'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/74/tf2vgv7zpklv72yeuc2ruop9u01yiqw.png/90px-%E5%8F%A4%E8%91%A3%E5%95%86%E5%A4%B4%E5%83%8F.png',
  },
  composer: {
    name: translate("characters.composer.name"),
    camp: 'survivor',
    items: ['tuningFork'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3a/4cdodjbq2m7ie64pms8fxearjbhn2cm.png/90px-%E4%BD%9C%E6%9B%B2%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  journalist: {
    name: translate("characters.journalist.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 15, label: translate("characters.journalist.range.phantomPlacement") },
      ],
    },
    items: ['cameraJournalist'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/be/fiibeyy2dkxlkbexfvoxjb7nszh3b4d.png/90px-%E8%AE%B0%E8%80%85%E5%A4%B4%E5%83%8F.png',
  },
  aeroplanist: {
    name: translate("characters.aeroplanist.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 18.5, label: translate("characters.aeroplanist.range.jetpackPropelThreeMax") },
        { size_m: 12.7, label: translate("characters.aeroplanist.range.essentialTremor") },
      ],
    },
    items: ['jetpack', 'jetpackPropel'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/11/pkpubifvltwi4g20xgegmmfr5hp0w7e.png/90px-%E9%A3%9E%E8%A1%8C%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  cheerleader: {
    name: translate("characters.cheerleader.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 20, label: translate("characters.cheerleader.range.encourage") },
      ],
    },
    items: ['pompoms', 'inspire', 'inspireIcon', 'encourage1', 'encourage2', 'encourageCheerful', 'encourageExcited'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/49/ksf2totnw4cumjj4rf0jxcoryl5ispq.png/90px-%E6%8B%89%E6%8B%89%E9%98%9F%E5%91%98%E5%A4%B4%E5%83%8F.png',
  },
  puppeteer: {
    name: translate("characters.puppeteer.name"),
    camp: 'survivor',
    items: ['louis'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f3/1t653qhzktgem5iwo2ma4gkjucf4xuq.png/90px-%E6%9C%A8%E5%81%B6%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  fireInvestigator: {
    name: translate("characters.fireInvestigator.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 4.2, label: translate("characters.fireInvestigator.range.deployDefault") },
        { size_m: 12.64, label: translate("characters.fireInvestigator.range.deployMax") },
        { size_m: 9.6, label: translate("characters.fireInvestigator.range.repulsion") },
      ],
    },
    items: ['airbag'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/38/7yxt90beix98wxs6z3guktddhnpj1t1.png/90px-%E7%81%AB%E7%81%BE%E8%B0%83%E6%9F%A5%E5%91%98%E5%A4%B4%E5%83%8F.png',
  },
  faroLady: {
    name: translate("characters.faroLady.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 18, label: translate("characters.faroLady.range.cloak") },
      ],
    },
    items: ['aromatherapyCane', 'dexterous'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f0/04o60ry6yqz28mfqd98eo2pwm5s2rpl.png/90px-%E2%80%9C%E6%B3%95%E7%BD%97%E5%A5%B3%E5%A3%AB%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  knight: {
    name: translate("characters.knight.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 13, label: translate("characters.knight.range.tacticalForesight") },
        { size_m: 7, label: translate("characters.knight.range.chivalrousSympathy") },
      ],
    },
    items: ['helmet', 'tacticalForesight', 'tacticalForesightAttack', 'tacticalForesightAbility', 'tacticalForesightStalemate', 'chivalrousSympathy'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/97/10yk7nm7qb4focpftij0jl8d4y15itk.png/90px-%E2%80%9C%E9%AA%91%E5%A3%AB%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  meteorologist: {
    name: translate("characters.meteorologist.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 32, label: translate("characters.meteorologist.range.warmRain") },
      ],
    },
    items: ['stormGlass', 'gale1', 'gale2', 'gale3', 'stratus1', 'stratus2', 'stratus3', 'rainfall', 'stormGlassDecompose'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d1/31tsfob5vzra69oorilz2powtnzcaxj.png/90px-%E6%B0%94%E8%B1%A1%E5%AD%A6%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  archer: {
    name: translate("characters.archer.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 18, label: translate("characters.archer.range.keelBowHitMax") },
        { size_m: 12, label: translate("characters.archer.range.keelBowCanHitCore") },
        { size_m: 4.5, label: translate("characters.archer.range.crossbow") },
      ],
    },
    items: ['keelBow', 'crossBow'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e5/gvjxblieo1gyabfvvx6ezapc8b80mkn.png/90px-%E5%BC%93%E7%AE%AD%E6%89%8B%E5%A4%B4%E5%83%8F.png',
  },
  escapologist: {
    name: translate("characters.escapologist.name"),
    camp: 'survivor',
    items: ['thurible', 'escapeAct'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/fe/b5912707v68vwuk88fyr8d2lqs66to0.png/90px-%E2%80%9C%E9%80%83%E8%84%B1%E5%A4%A7%E5%B8%88%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  lanternist: {
    name: translate("characters.lanternist.name"),
    camp: 'survivor',
    items: ['projectionLanternLivingImage', 'projectionLanternStaticProjection'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/00/ovc4lksvcclqsfd8548sof4m0207b9h.png/90px-%E5%B9%BB%E7%81%AF%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  matador: {
    name: translate("characters.matador.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 6, label: translate("characters.matador.range.muletaDash") },
        { size_m: 2.25, label: translate("characters.matador.range.muletaSweep") },
      ],
    },
    items: ['muleta', 'gaoneraPass'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/ce/sj6wwgwa3uqsi94yw71dsh3bbab1l54.png/90px-%E6%96%97%E7%89%9B%E5%A3%AB%E5%A4%B4%E5%83%8F.png',
  },
  mimeArtist: {
    name: translate("characters.mimeArtist.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 20.3, label: translate("characters.mimeArtist.range.emotionAccumulation") },
      ],
    },
    items: ['propUmbrella'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b4/ezpalvrvblo048p3uaf9ejyqlggq095.png/90px-%E9%BB%98%E5%89%A7%E8%89%BA%E4%BA%BA%E5%A4%B4%E5%83%8F.png',
  },
  prodigy: {
    name: translate("characters.prodigy.name"),
    camp: 'survivor',
    items: ['hamster', 'hamsterCancel', 'dirtball', 'pushingState', 'performanceState'],
    speed: { [translate("characters.prodigy.speed.exhibition")]: 3.92, [translate("characters.prodigy.speed.pushBall")]: 3.8 },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/08/ejzgnfep2tdh21cx73mskh1svrj4uur.png/90px-%E2%80%9C%E7%A5%9E%E7%AB%A5%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
};
