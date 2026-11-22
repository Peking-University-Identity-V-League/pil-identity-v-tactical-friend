import { translate } from '../core/i18n.js';


export const TAC_ROLES = {
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
    items: ['gulliversTravels'],
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
    maxItems: 3,
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
    maxItems: 1,
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
    maxItems: 1,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/63/3s9842m4mdlccry2lxz1u1cr8cecz3s.png/90px-%E6%98%86%E8%99%AB%E5%AD%A6%E8%80%85%E5%A4%B4%E5%83%8F.png',
  },
  painter: {
    name: translate("characters.painter.name"),
    camp: 'survivor',
    items: ['paintBruahAndDrawingBoard', 'drawingBoard'],
    maxItems: 2,
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
    maxItems: 2,
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
    maxItems: 2,
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
    maxItems: 3,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b4/ezpalvrvblo048p3uaf9ejyqlggq095.png/90px-%E9%BB%98%E5%89%A7%E8%89%BA%E4%BA%BA%E5%A4%B4%E5%83%8F.png',
  },
  prodigy: {
    name: translate("characters.prodigy.name"),
    camp: 'survivor',
    items: ['hamster', 'hamsterCancel', 'dirtball', 'pushingState', 'performanceState'],
    speed: { [translate("characters.prodigy.speed.exhibition")]: 3.92, [translate("characters.prodigy.speed.pushBall")]: 3.8 },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/08/ejzgnfep2tdh21cx73mskh1svrj4uur.png/90px-%E2%80%9C%E7%A5%9E%E7%AB%A5%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },

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
    maxItems: 1,
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
  customize: {
    name: translate("characters.customize.name"),
    camp: 'other',
    ranges: {
      key: 'show',
      options: [
        { size_m: { min: 0, max: null }, label: translate("characters.customize.name") },
      ],
    },
    color: '#fbbf24',
    items: ['customSurvivor', 'customHunter', 'customEscapeDoor', 'customCipherMachine', 'customDungeon', 'customRocketChair', 'customBox'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/f/f6/o8ixpxb56avrj5e2tzdyps58h8rfa7i.png',
  },
  trait: {
    name: translate("characters.trait.name"),
    camp: 'other',
    items: ['listen', 'abnormal', 'excitement', 'patroller', 'teleport', 'peeper', 'blink', 'warp'],
    maxItems: [3, 2],
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/bd/4aby06f4kbl87b14cihk5o3y1k61e8l.png',
  },
  talentSurvivor: {
    name: translate("characters.talentSurvivor.name"),
    camp: 'other',
    items: ['fearRadius', 'webersLaw', 'sneak'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/0/07/r5uy2z33ro1xgmw8qpp847h4bfvf8ld.png',
  },
  talentHunter: {
    name: translate("characters.talentHunter.name"),
    camp: 'other',
    items: ['tinnitus', 'addiction', 'nostalgic', 'skittish', 'deerHunt', 'streetSweeper', 'wither', 'obsession', 'famine'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/a/ad/8ea9e6vugcfryv3zygj9bspjgqhj76j.png',
  },
  violentStruggle: {
    name: translate("characters.violentStruggle.name"),
    camp: 'other',
    items: ['snowball', 'bogusBag', 'crowbar', 'smokeBottle', 'blackMud', 'coldsnapFlask', 'speedPill', 'attentionPill', 'luckyPill', 'coagulant', 'powerPill', 'combustionPill', 'recoveryPill', 'ragePotion', 'resistancePotion', 'agilityPotion', 'powerupPill', 'tarotRaven', 'tarotClairvoyance', 'tarotTheGuardian', 'tarotResonance', 'tarotDovlin', 'shield', 'blackjackChips', 'tarotStars', 'frenzyRhapsodyNormalBall', 'frenzyRhapsodyExplosiveBall', 'frenzyRhapsodyDashBall', 'frenzyRhapsodySniperBall', 'hideAndSeekMonstersTreasure', 'hideAndSeekOwl', 'hideAndSeekSyringe', 'hideAndSeekDecoy', 'hideAndSeekMechanicsDoll', 'hideAndSeekScaledSkin', 'hideAndSeekWildlingPartner'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/ec/s809wohdjq9p30dtfwu34hcy40zl71c.png/90px-%E8%AE%B0%E5%BF%86%E7%A2%8E%E7%89%87_%E9%87%8D%E9%80%A2%E4%B9%8B%E6%97%B6.png',
  },
  tier: {
    name: translate("characters.tier.name"),
    camp: 'other',
    items: ['survivorS', 'hunterS', 'survivorA', 'hunterA', 'survivorB', 'hunterB', 'survivorC', 'hunterC', 'survivorTier1', 'hunterTier1', 'survivorTier2', 'hunterTier2', 'survivorTier3', 'hunterTier3', 'survivorTier4', 'hunterTier4', 'survivorTier5', 'hunterTier5', 'survivorTier6', 'hunterTier6', 'survivorTier7', 'hunterTier7', 'survivorPeakTier7', 'hunterPeakTier7', 'fiveplayerTier1', 'fiveplayerTier2', 'fiveplayerTier3', 'fiveplayerTier4', 'fiveplayerTier5', 'fiveplayerTier6'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/2b/4lnyrl54i7z952kcy8zzj87yn07by0h.png/60px-%E6%8E%92%E4%BD%8D%E4%BF%9D%E6%8A%A4%E5%8D%A1.png',
  },
  shop: {
    name: translate("characters.shop.name"),
    camp: 'other',
    items: ['clue', 'inspiration', 'fragment', 'echo', 'sealingWax', 'spyGlasses', 'commemorationToken', 'costumeRemnant', 'stickerToken', 'inkTrace'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/e/e9/hcvexmfva8ohhsdm19at0iok2garrac.png',
  },
  COA: {
    name: translate("characters.COA.name"),
    camp: 'other',
    items: ['COAIX', 'COAVIII', 'COAVII', 'COAVI', 'COAV', 'COAIV', 'COAIII', 'COAII', 'COAI'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c4/r67qgzgmse7iiog4x21nf5xwedncgkd.png/90px-%E5%BA%94%E6%8F%B4%E7%A5%A8.png',
  },
  teamIVL: {
    name: translate("characters.teamIVL.name"),
    camp: 'other',
    items: ['ACT', 'ASC', 'DOU5', 'FPXZQ', 'GG', 'GR', 'MRC', 'TE', 'WBG', 'Wolves'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/86/e9s5lbtwl2criihcp5h70ehtst9hlk9.png/150px-IVLlogo.png',
  },
  teamIJL: {
    name: translate("characters.teamIJL.name"),
    camp: 'other',
    items: ['AWG', 'AXZ', 'DFM', 'FL', 'QTD', 'RC', 'SZ', 'Zeta'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5a/aduticjamiol9j9dn01c3mqwkknvb8w.png/150px-IJLlogo.png',
  },
  sticker: {
    name: translate("characters.sticker.name"),
    camp: 'other',
    items: ['stickerYes', 'stickerNo'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/12/ierbsudwlrq55fze3uguu8xbhpy8b5r.png/90px-%E6%B6%82%E9%B8%A6_%E7%BC%AA%E6%96%AF%E5%8D%B0%E8%AE%B0_%E5%9B%BE%E6%A0%87.png',
  },
};
