import { translate } from '../core/i18n.js';


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
    role: translate("ui.common.roles"), fixed: translate("movement.survivor.fixed"), custom: translate("application.name"), hunter: translate("characters.camps.hunter")
  },
};


export const TAC_MOVEMENT_BUFFS = {
  trait: {
    survivor: [
      { key: 'sensitivity', role: translate("characters.doctor.name"), name: translate("movement.buff.trait.doctor.sensitivity.name"), mult: 1.45, duration: 2 },
      { key: 'takeNotes', role: translate("characters.lawyer.name"), name: translate("movement.buff.trait.lawyer.takeNotes.name"), mult: 1.035 },
      { key: 'illusion', role: translate("characters.magician.name"), name: translate("movement.buff.trait.magician.illusion.name"), mult: 1.5, duration: 0.87 },
      { key: 'tinyLilliputian', role: translate("characters.explorer.name"), name: translate("movement.buff.trait.explorer.tinyLilliputian.name"), mult: 0.9 },
      { key: 'energyReserves', role: translate("characters.explorer.name"), name: translate("movement.buff.trait.explorer.energyReserves.name"), mult: 1.35, duration: 4 },
      { key: 'tapTapWalk', role: translate("characters.theMindsEye.name"), name: translate("movement.buff.trait.theMindsEye.tapTapWalk.name"), mult: 1.25, states: ['walk'] },
      { key: 'tapTap', role: translate("characters.theMindsEye.name"), name: translate("movement.buff.trait.theMindsEye.tapTap.name"), mult: 1.3, duration: 2, states: ['run'] },
      { key: 'armyBond', role: translate("characters.coordinator.name"), name: translate("movement.buff.trait.coordinator.armyBond.name"), mult: 1.05 },
      { key: 'dashFootball', role: translate("characters.forward.name"), name: translate("movement.buff.trait.forward.dashFootball.name"), mult: 3 },
      { key: 'ridingFullRage', role: translate("characters.wildling.name"), name: translate("movement.buff.trait.wildling.ridingFullRage.name"), mult: 1.33 },
      { key: 'duphrin', role: translate("characters.barmaid.name"), name: translate("movement.buff.trait.duphrin.name"), mult: 1.5, duration: 2 },
      { key: 'undergroundSneak', role: translate("characters.graveKeeper.name"), name: translate("movement.buff.trait.graveKeeper.undergroundSneak.name"), mult: 1.1 },
      { key: 'aestheticResonance', role: translate("characters.painter.name"), name: translate("movement.buff.trait.painter.aestheticResonance.name"), levels: [1.02, 1.04] },
      { key: 'altruism', role: translate("characters.batter.name"), name: translate("movement.buff.trait.batter.altruism.name"), mult: 1.5, duration: 10 },
      { key: 'landing', role: translate("characters.toyMerchant.name"), name: translate("movement.buff.trait.toyMerchant.landing.name"), mult: 1.3, duration: 2 },
      { key: 'resonance', role: translate("characters.novelist.name"), name: translate("movement.buff.trait.novelist.resonance.name"), mult: 1.5, duration: 2.5 },
      { key: 'rocketDash', role: translate("characters.weepingClown.name"), name: translate("movement.buff.trait.weepingClown.rocketDash.name"), mult: 1.5 },
      { key: 'firefightingTraining', role: translate("characters.fireInvestigator.name"), name: translate("movement.buff.trait.fireInvestigator.firefightingTraining.name"), mult: 1.5, duration: 2 },
      { key: 'smokeScreen', role: translate("characters.escapologist.name"), name: translate("movement.buff.trait.escapologist.smokeScreen.name"), mult: 1.35, duration: 1 },
      { key: 'stratus', role: translate("characters.meteorologist.name"), name: translate("movement.buff.trait.meteorologist.stratus.name"), levels: [1.33, 1.77] },
      { key: 'concealedSpin', role: translate("characters.antiquarian.name"), name: translate("movement.buff.trait.antiquarian.concealedSpin.name"), mult: 1.05 },
      { key: 'tuning', role: translate("characters.composer.name"), name: translate("movement.buff.trait.composer.tuning.name"), mult: 1.5 },
      { key: 'motivate', role: translate("characters.cheerleader.name"), name: translate("movement.buff.trait.cheerleader.motivate.name"), mult: 1.7, duration: 4 },
      { key: 'flexibleJoints', role: translate("characters.puppeteer.name"), name: translate("movement.buff.trait.puppeteer.flexibleJoints.name"), mult: 1.08, duration: 9 },
    ],
    hunter: [
      { key: 'windWings', role: translate("characters.smileyFace.name"), name: translate("movement.buff.trait.windWings.name"), mult: 1.2, roles: ['smileyFace'], forms: [1, 2, 3] },
      { key: 'fog', role: translate("characters.theRipper.name"), name: translate("movement.buff.trait.theRipper.fog.name"), mult: 1.2 },
      { key: 'entangled', role: translate("characters.soulWeaver.name"), name: translate("movement.buff.trait.soulWeaver.entangled.name"), levels: [1.5, 1.9, 2.35] },
      { key: 'followerOutOfRadius', role: translate("characters.dreamWitch.name"), name: translate("movement.buff.trait.dreamWitch.followerOutOfRadius.name"), mult: 1.3, postMult: true, forms: [1] },
      { key: 'slipstream', role: translate("characters.naiad.name"), name: translate("movement.buff.trait.naiad.slipstream.name"), mult: 1.3 },
      { key: 'windwalk', role: translate("characters.nightWatch.name"), name: translate("movement.buff.trait.nightWatch.windwalk.name"), mult: 1.12 },
      { key: 'heightenedSenses', role: translate("characters.herztier.name"), name: translate("movement.buff.trait.heightenedSenses.name"), mult: 1.08, duration: 10 },
    ],
  },
  talent: {
    kneeJerkReflex: { name: translate("movement.buff.talent.kneeJerkReflex.name"), mult: 1.5, duration: 3, camp: 'survivor' },
    webersLaw: { name: translate("movement.buff.talent.webersLaw.name"), levels: [1.1, 1.15, 1.2], duration: 3.5, camp: 'survivor' },
    borrowedTime: {
      name: translate("movement.buff.talent.borrowedTime.name"), mult: 1.5, duration: 5, camp: 'survivor',
      extra: { name: translate("movement.buff.talent.extra.name"), mult: 1.05, camp: 'survivor' },
    },
    escape: { name: translate("movement.buff.talent.escape.name"), levels: [1.03, 1.04, 1.05], camp: 'survivor' },
    wellEarned: { name: translate("movement.buff.talent.wellEarned.name"), mult: 1.25, duration: 4, camp: 'survivor' },
    mutualSupport: { name: translate("movement.buff.talent.mutualSupport.name"), levels: [1.04, 1.08], camp: 'survivor' },
    symbioticEffect: { name: translate("movement.buff.talent.symbioticEffect.name"), levels: [1.06, 1.1], camp: 'survivor' },
    sticker: { name: translate("movement.buff.talent.sticker.name"), levels: [1.3, 1.6, 1.9], camp: 'survivor', states: ['crawl'] },
    touchEffect: { name: translate("movement.buff.talent.touchEffect.name"), levels: [1.16, 1.28, 1.4], duration: 1.5, camp: 'survivor' },
    companionEffect: { name: translate("movement.buff.talent.companionEffect.name"), mult: 1.28, duration: 2, camp: 'survivor' },
    birdcageEffect: { name: translate("movement.buff.talent.birdcageEffect.name"), mult: 1.1, camp: 'survivor' },
    saviorComplex: { name: translate("movement.buff.talent.saviorComplex.name"), levels: [1.05, 1.1, 1.15], duration: 3, camp: 'survivor' },
    herdMentality: { name: translate("movement.buff.talent.herdMentality.name"), levels: [1.04, 1.06, 1.08], camp: 'survivor' },
    empathy: { name: translate("movement.buff.talent.empathy.name"), mult: 1.14, duration: 12, camp: 'survivor' },
    huntersInstinct: { name: translate("movement.buff.talent.huntersInstinct.name"), levels: [1.01, 1.015, 1.02], camp: 'hunter' },
    hospitable: { name: translate("movement.buff.talent.hospitable.name"), levels: [1.04, 1.06, 1.08], camp: 'hunter' },
    wantedOrder: { name: translate("movement.buff.talent.wantedOrder.name"), levels: [0.98, 0.99, 1], camp: 'hunter' },
    nostalgic: { name: translate("movement.buff.talent.nostalgic.name"), mult: 1.1, duration: 14, camp: 'hunter' },
    mock: { name: translate("movement.buff.talent.mock.name"), levels: [1.03, 1.04, 1.05], camp: 'hunter' },
    carnival: { name: translate("movement.buff.talent.carnival.name"), levels: [1.03, 1.04, 1.05], duration: 120, camp: 'hunter' },
    hunt: { name: translate("movement.buff.talent.hunt.name"), mult: 1.1, camp: 'hunter' },
    controlFreak: { name: translate("movement.buff.talent.controlFreak.name"), mult: 1.1, duration: 3, camp: 'hunter' },
    lingeringMight: { name: translate("movement.buff.talent.lingeringMight.name"), mult: 1.1, duration: 50, camp: 'hunter' },
    obsession: { name: translate("movement.buff.talent.obsession.name"), mult: 1.05, duration: 15, camp: 'hunter' },
  },
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


export const TAC_ITEM_TYPES = {
  luckyParcel: {
    name: translate("items.luckyGuy.luckyParcel.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/af/ob4bthfz0xcdkn40xtl39ox9ksuol8i.png/120px-%E5%B9%B8%E8%BF%90%E5%84%BF%E9%81%93%E5%85%B7.png',
  },
  syringe: {
    name: translate("items.doctor.syringe.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/cd/4y6m5sv3phtkfpctx0o653f6o6grlwq.png/120px-%E9%95%87%E9%9D%99%E5%89%82.png',
  },
  map: {
    name: translate("items.lawyer.map.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/ed/n3gn9ipv1767dsebpc0fje5es04w0ws.png/120px-%E5%BE%8B%E5%B8%88%E9%81%93%E5%85%B7.png',
  },
  flashlight: {
    name: translate("items.thief.flashlight.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 8, label: translate("items.thief.flashlight.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e3/an2z7q5vnl5bcm6q7f6e9c3jboe6bl9.png/120px-%E6%89%8B%E7%94%B5%E7%AD%92.png',
  },
  toolkit: {
    name: translate("items.gardener.toolkit.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/02/9pl20myzkes0843oi6d617eupnkzzln.png/120px-%E5%B7%A5%E5%85%B7%E7%AE%B1.png',
  },
  wand: {
    name: translate("items.magician.wand.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/83/4uuq9qpnv9outj01e0b1ch1sqv17i1o.png/120px-%E9%AD%94%E6%A3%92.png',
  },
  gulliversTravels: {
    name: translate("items.explorer.gulliversTravels.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/16/efejhb0yhmpztz2a919brwu81lfcn7s.png/120px-%E6%A0%BC%E5%88%97%E4%BD%9B%E6%B8%B8%E8%AE%B0.png',
  },
  elbowPads: {
    name: translate("items.mercenary.elbowPads.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/23/tgvqrsppifmb5k5q07vyqiavzp9okqb.png/120px-%E9%92%A2%E9%93%81%E6%8A%A4%E8%82%98.png',
  },
  flareGun: {
    name: translate("items.coordinator.flareGun.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/dd/260vjot3aa02s3h4w1a3101e4xnnqfd.png/120px-%E4%BF%A1%E5%8F%B7%E6%9E%AA.png',
  },
  doll: {
    name: translate("items.mechanic.doll.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3f/7cj09auhp2fspkqko5awq4dppp39g80.png/90px-%E6%9C%BA%E6%A2%B0%E5%B8%88%E9%81%93%E5%85%B7.png',
  },
  football: {
    name: translate("items.forward.football.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/34/22a119qxfnul75554zw0oq15mvdvyn0.png/120px-%E6%A9%84%E6%A6%84%E7%90%83.png',
  },
  cane: {
    name: translate("items.theMindsEye.cane.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d9/d20xdfnt18k56bgsrnwg3zh8u63lv9a.png/120px-%E7%9B%B2%E6%9D%96.png',
  },
  straightPassage: {
    name: translate("items.priestess.straightPassage.name"),
    render: 'link',
    linkColor: '#f8fafc',
    linkWidth: 2,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e3/67cz7xprk86w25010iwsz1rb90irsp7.png/90px-%E9%97%A8%E4%B9%8B%E9%92%A5.png',
  },
  ultralongPassage: {
    name: translate("items.priestess.ultralongPassage.name"),
    render: 'link',
    linkColor: '#f8fafc',
    linkWidth: 2,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e9/bdkyvpjd6vquuhhl60mlltayqysbolj.png/90px-%E9%97%A8%E4%B9%8B%E9%92%A5_%E8%B6%85%E9%95%BF%E9%80%9A%E9%81%93.png',
  },
  euphoriaPerfume: {
    name: translate("items.perfumer.euphoriaPerfume.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/07/d5h74pj313guss4ls6lvrzfn9xs9zmt.png/120px-%E5%BF%98%E5%BF%A7%E4%B9%8B%E9%A6%99.png',
  },
  lasso: {
    name: translate("items.cowboy.lasso.name"),
    linkToRole: 'cowboy',
    linkMaxM: 15.2,
    linkColor: '#f8fafc',
    linkWidth: 2,
    icon: 'https://patchwiki.biligame.com/images/dwrg/0/08/bt5rd2ca6v9a9v44f4f1rfxtc4yn4zk.png',
  },
  fastMusicbox: {
    name: translate("items.femaleDancer.fastMusicbox.name"),
    render: 'circle',
    ranges: {
      key: 'showItem',
      options: [
        { size_m: { min: 6.3, max: 9 }, label: translate("items.femaleDancer.fastMusicbox.name") },
      ],
    },
    color: '#f472b6',
    fill: 'rgba(244, 114, 182, 0.22)',
    glow: 'rgba(244, 114, 182, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/85/n0rp6b2j5psgbbffvcgxdgc981i34ts.png/90px-%E8%88%9E%E5%A5%B3%E9%81%93%E5%85%B7.png',
  },
  slowMusicbox: {
    name: translate("items.femaleDancer.slowMusicbox.name"),
    render: 'circle',
    ranges: {
      key: 'showItem',
      options: [
        { size_m: { min: 6.3, max: 9 }, label: translate("items.femaleDancer.slowMusicbox.name") },
      ],
    },
    color: '#60a5fa',
    fill: 'rgba(96, 165, 250, 0.22)',
    glow: 'rgba(96, 165, 250, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/85/n0rp6b2j5psgbbffvcgxdgc981i34ts.png/90px-%E8%88%9E%E5%A5%B3%E9%81%93%E5%85%B7.png',
  },
  owl: {
    name: translate("items.seer.owl.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f4/sgdqdymhqz2vs63d83rcqraj8w16amv.png/120px-%E5%BD%B9%E9%B8%9F.png',
  },
  coffin: {
    name: translate("items.embalmer.coffin.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/88/sbbkt166a4ntucdr78whfpvhv1socye.png/90px-%E5%85%A5%E6%AE%93%E5%B8%88%E9%81%93%E5%85%B7.png',
  },
  meteoriteMagnetN: {
    name: translate("items.prospector.meteoriteMagnetN.name"),
    render: 'circle',
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4.5, label: translate("items.prospector.meteoriteMagnetN.name") },
      ],
    },
    color: '#ef4444',
    fill: 'rgba(239, 68, 68, 0.22)',
    glow: 'rgba(239, 68, 68, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c6/myjspwy5088svioy3ws8iw0dm05ofia.png/90px-%E5%8B%98%E6%8E%A2%E5%91%98%E9%81%93%E5%85%B7.png',
  },
  meteoriteMagnetS: {
    name: translate("items.prospector.meteoriteMagnetS.name"),
    render: 'circle',
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4.5, label: translate("items.prospector.meteoriteMagnetS.name") },
      ],
    },
    color: '#1d4ed8',
    fill: 'rgba(29, 78, 216, 0.22)',
    glow: 'rgba(29, 78, 216, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c6/myjspwy5088svioy3ws8iw0dm05ofia.png/90px-%E5%8B%98%E6%8E%A2%E5%91%98%E9%81%93%E5%85%B7.png',
  },
  cursedEmblem: {
    name: translate("items.enchantress.cursedEmblem.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0d/5fx6ovc35w5dao0ujrhb190uyvnd0mp.png/120px-%E7%8C%BF%E7%8C%B4%E5%92%92%E5%83%8F.png',
  },
  wildlingPartner: {
    name: translate("items.wildling.wildlingPartner.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/91/o66wfufxbe1jgx8614fw54qieeyml7x.png/120px-%E9%87%8E%E6%80%A7%E4%BC%99%E4%BC%B4.png',
  },
  bomb: {
    name: translate("items.acrobat.bomb.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/8/8c/ltaw2at60zi7mx3afwdzd2m0qb858qh.png',
  },
  poseidonWatch: {
    name: translate("items.firstOfficer.poseidonWatch.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 27, label: translate("items.firstOfficer.poseidonWatch.range.label.hypnotizeOne") },
        { size_m: 8.4, label: translate("items.firstOfficer.poseidonWatch.range.label.hypnotizeTwo") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b7/kfypkpcjk8dtc4pq1lrzall2wzviihu.png/120px-%E6%B5%B7%E7%A5%9E%E6%80%80%E8%A1%A8.png',
  },
  duphrin: {
    name: translate("items.barmaid.duphrin.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5b/d19s0bfdx0qnotkptydfaw4f8wg3oe4.png/120px-%E5%A4%9A%E5%A4%AB%E6%9E%97%E5%BA%95%E9%85%92.png',
  },
  strongDovlin: {
    name: translate("items.barmaid.strongDovlin.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3f/jpu6baeh2ksxcotujaejh8gmh14xv9l.png/120px-%E7%83%88%E6%80%A7%E5%A4%9A%E5%A4%AB%E6%9E%97.png',
  },
  letter: {
    name: translate("items.postman.letter.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f6/rosmnxacl5g5xpsiphsv75bmbcxobme.png/120px-%E4%BF%A1%E4%BB%B6.png',
  },
  postDog: {
    name: translate("items.postman.postDog.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 1.27, label: translate("items.postman.postDog.range.label.postDogPounce") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/ed/fohz3k2zrkhum55m6ypco170bdqdypu.png/120px-%E9%80%81%E4%BF%A1%E7%8A%AC.png',
  },
  shovel: {
    name: translate("items.graveKeeper.shovel.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/73/obmza342xyuyb4gwic2tpwwwm9smrnp.png/120px-%E9%93%81%E9%93%B2.png',
  },
  insulatingGloves: {
    name: translate("items.prisoner.insulatingGloves.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/00/1si78i0yopgcea9exbgjxztdm723o9v.png/120px-%E7%BB%9D%E7%BC%98%E6%89%8B%E5%A5%97.png',
  },
  severeElectricCurrent: {
    name: translate("items.prisoner.severeElectricCurrent.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0e/dkivpbnay9pkemab2argg44aqufm7hs.png/120px-%E5%BC%BA%E7%94%B5%E6%B5%81.png',
  },
  swarm: {
    name: translate("items.entomologist.swarm.name"),
    render: 'circle',
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 1.2, label: translate("items.entomologist.swarm.name") },
      ],
    },
    color: '#d4a373',
    fill: 'rgba(212, 163, 115, 0.22)',
    glow: 'rgba(212, 163, 115, 0.45)',
    pushes: true,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5d/3vmln26rb8aonm2iwnfzyvq3hpo9l9i.png/90px-%E6%98%86%E8%99%AB%E5%AD%A6%E8%80%85%E9%81%93%E5%85%B7.png',
  },
  drawingBoard: {
    name: translate("items.painter.drawingBoard.name"),
    render: 'circle',
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 12, label: translate("items.painter.drawingBoard.name") },
      ],
    },
    color: '#60a5fa',
    fill: 'rgba(96, 165, 250, 0.22)',
    glow: 'rgba(96, 165, 250, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/cc/tpvtb6qirophc1w676xlalljti1w42w.png/90px-%E7%94%BB%E5%AE%B6%E9%81%93%E5%85%B7.png',
  },
  cricketBat: {
    name: translate("items.batter.cricketBat.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: { min: 3.73, max: 7.45 }, label: translate("items.batter.cricketBat.range.label.cricketBatKnockBack") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7e/19s98s5y8v0pz05ifj94fvyubyjssvd.png/120px-%E5%87%BB%E7%90%83%E6%89%8B%E9%81%93%E5%85%B7.png',
  },
  catapult: {
    name: translate("items.toyMerchant.catapult.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 21.9, label: translate("items.toyMerchant.catapult.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/be/q00bu5gdar393rxoi65gjmhpfcko4cl.png/90px-%E7%8E%A9%E5%85%B7%E5%95%86%E9%81%93%E5%85%B71.png',
  },
  whistle: {
    name: translate("items.psychologist.whistle.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/fc/gnww27qe3kgz7suy0b9k11sc3050svg.png/120px-%E2%80%9C%E5%BF%83%E7%90%86%E5%AD%A6%E5%AE%B6%E2%80%9D%E9%81%93%E5%85%B7.png',
  },
  grapplingHook: {
    name: translate("items.patient.grapplingHook.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/36/jpqijz4szik8gcx77lquf0ausw4zeeu.png/120px-%E7%97%85%E6%82%A3%E9%81%93%E5%85%B7.png',
  },
  sketchBook: {
    name: translate("items.novelist.sketchBook.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5b/oum8nsl5cpvaqdq7uoemo5sm249ls2k.png/120px-%E5%B0%8F%E8%AF%B4%E5%AE%B6%E9%81%93%E5%85%B7.png',
  },
  memoryFragment: {
    name: translate("items.littleGirl.memoryFragment.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 6.1, label: translate("items.littleGirl.memoryFragment.range.label.impact") },
        { size_m: 10.3, label: translate("items.littleGirl.memoryFragment.range.label.impactAddLaunchMax") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f9/asmvxiz04rw0af5of7ic2lzyorwjsz0.png/120px-%E5%9B%9E%E5%BF%86%E7%A2%8E%E7%89%87.png',
  },
  rocket: {
    name: translate("items.weepingClown.rocket.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/d/d4/igscyutpd7sygzjkmxijnavjihx42ht.png',
  },
  scale: {
    name: translate("items.professor.scale.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b5/d4rcr4pkvrw70yv8mhcqij5f8bzkq92.png/90px-%E6%95%99%E6%8E%88%E9%81%93%E5%85%B7.png',
  },
  mechanicalFlute: {
    name: translate("items.antiquarian.mechanicalFlute.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/58/osytykpscd59ewg0n2w83oqqe98hvms.png/90px-%E5%8F%A4%E8%91%A3%E5%95%86%E9%81%93%E5%85%B7.png',
  },
  tuningFork: {
    name: translate("items.composer.tuningFork.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/8/8b/rbsdnqidb6vsujgtxzhvhjj38r1r6b3.png',
  },
  cameraJournalist: {
    name: translate("items.journalist.cameraJournalist.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/aa/dvu1rkgsnz3sn7niwjn0sj4c0q0qtxg.png/120px-%E8%AE%B0%E8%80%85%E9%81%93%E5%85%B7.png',
  },
  jetpack: {
    name: translate("items.aeroplanist.jetpack.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/6e/aqdnbg7aq11lbi4mubphuvwgrhji0cd.png/120px-%E9%A3%9E%E8%A1%8C%E5%AE%B6%E9%81%93%E5%85%B7.png',
  },
  pompoms: {
    name: translate("items.cheerleader.pompoms.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/ab/5s8o1cg0zk9ysp3mnm9tkeomz8uznjf.png/120px-%E6%8B%89%E6%8B%89%E9%98%9F%E5%91%98%E9%81%93%E5%85%B7.png',
  },
  louis: {
    name: translate("items.puppeteer.louis.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/50/eaxbgojlp5fz2y6nxrowk0dwi44ikmf.png/120px-%E2%80%9C%E8%B7%AF%E6%98%93%E2%80%9D.png',
  },
  airbag: {
    name: translate("items.fireInvestigator.airbag.name"),
    render: 'circle',
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4.2, label: translate("items.fireInvestigator.airbag.name") },
      ],
    },
    color: '#f8fafc',
    fill: 'rgba(248, 250, 252, 0.22)',
    glow: 'rgba(248, 250, 252, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7b/1jxsg19mhdmhk4iy1n5jzbd13qacdul.png/90px-%E7%81%AB%E7%81%BE%E8%B0%83%E6%9F%A5%E5%91%98%E9%81%93%E5%85%B7.png',
  },
  aromatherapyCane: {
    name: translate("items.faroLady.aromatherapyCane.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5d/5od6849sin7d6e7kegpexjfezdbubzo.png/120px-%E9%A6%99%E8%96%B0%E6%89%8B%E6%9D%96.png',
  },
  helmet: {
    name: translate("items.knight.helmet.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3f/2srn3jrzo5atz18iopcn7430wridv6n.png/120px-%E2%80%9C%E9%AA%91%E5%A3%AB%E2%80%9D%E9%81%93%E5%85%B7.png',
  },
  stormGlass: {
    name: translate("items.meteorologist.stormGlass.name"),
    render: 'circle',
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4, label: translate("items.meteorologist.stormGlass.range.label.rainfall") },
      ],
    },
    color: '#f8fafc',
    fill: 'rgba(248, 250, 252, 0.22)',
    glow: 'rgba(248, 250, 252, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/ae/fxa05k9lw4ubsk94yolnc6osfo327qr.png/90px-%E5%A4%A9%E6%B0%94%E7%93%B6.png',
  },
  keelBow: {
    name: translate("items.archer.keelBow.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/17/72onpht7012kcr7evkru8y978r0t8yk.png/120px-%E5%BC%93%E7%AE%AD%E6%89%8B%E9%81%93%E5%85%B71.png',
  },
  crossBow: {
    name: translate("items.archer.crossBow.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/06/n82qspoynhryogp57gew3x4y551wnyh.png/120px-%E5%BC%93%E7%AE%AD%E6%89%8B%E9%81%93%E5%85%B72.png',
  },
  thurible: {
    name: translate("items.escapologist.thurible.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 16.9, label: translate("items.escapologist.thurible.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c2/2w71hgyr6ozvswrc8fvzz14gaxh27ng.png/90px-%E8%BF%B7%E7%83%9F%E7%82%89.png',
  },
  projectionLanternLivingImage: {
    name: translate("items.lanternist.projectionLanternLivingImage.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/68/jrtuitxf11kf9gliflsgogw269fn0xk.png/120px-%E5%B9%BB%E7%81%AF%E4%BB%AA_%E4%BA%BA%E7%89%A9%E6%8A%95%E5%BD%B1.png',
  },
  projectionLanternStaticProjection: {
    name: translate("items.lanternist.projectionLanternStaticProjection.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e0/b484rmtnnaxuuem8qs7j223430paaui.png/120px-%E5%B9%BB%E7%81%AF%E4%BB%AA_%E9%9D%99%E7%89%A9%E6%8A%95%E5%BD%B1.png',
  },
  muleta: {
    name: translate("items.matador.muleta.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7f/ox395f4ntj1h4t9i04uatoneu35zyz3.png/120px-%E6%96%97%E7%89%9B%E5%A3%AB%E9%81%93%E5%85%B71.png',
  },
  propUmbrella: {
    name: translate("items.mimeArtist.propUmbrella.name"),
    render: 'circle',
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 12.7, label: translate("items.mimeArtist.propUmbrella.range.label.anxiousRoutine") },
      ],
    },
    color: '#18181b',
    fill: 'rgba(24, 24, 27, 0.22)',
    glow: 'rgba(24, 24, 27, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/49/os2khk79tu1tnvnxohhtq7vvt6xa3xe.png/90px-%E9%BB%98%E5%89%A7%E8%89%BA%E4%BA%BA%E9%81%93%E5%85%B7.png',
  },
  hamster: {
    name: translate("items.prodigy.hamster.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/32/7dcfplvn8p83ewanw29b8bttsb8o0q4.png/120px-%E2%80%9C%E7%A5%9E%E7%AB%A5%E2%80%9D%E9%81%93%E5%85%B7.png',
  },
  phantom: {
    name: translate("items.hellEmber.phantom.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c6/rfu060f3aed5z8y5gz19d58irffzby8.png/90px-%E5%8E%82%E9%95%BF0%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  puppet1: {
    name: translate("items.hellEmber.puppet1.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/a6/cdnjdljtwds6ly62lzyytmb6v84omae.png/90px-%E5%8E%82%E9%95%BF1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  puppet2: {
    name: translate("items.hellEmber.puppet2.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/a6/cdnjdljtwds6ly62lzyytmb6v84omae.png/90px-%E5%8E%82%E9%95%BF1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  windWings: {
    name: translate("items.smileyFace.windWings.name"),
    icon: 'https://i0.hdslb.com/bfs/new_dyn/71c214c8da2a75025e1d9626643b25c696830223.png@1192w.avif',
    iconSize: 1.7,
  },
  drill: {
    name: translate("items.smileyFace.drill.name"),
    icon: 'https://i0.hdslb.com/bfs/new_dyn/6f2652a4c70808eb0a437d56cdfb684f96830223.png@1192w.avif',
    iconSize: 1.7,
  },
  propeller: {
    name: translate("items.smileyFace.propeller.name"),
    icon: 'https://i0.hdslb.com/bfs/new_dyn/dcdc3fe7c8923f49eb1ea04fcaa8ec6696830223.png@1192w.avif',
    iconSize: 1.7,
  },
  chainHook: {
    name: translate("items.gameKeeper.chainHook.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4.2, label: translate("items.gameKeeper.chainHook.range.label.shockwave") },
      ],
    },
    linkToRole: 'gameKeeper',
    linkMaxM: 16.9,
    linkColor: '#f8fafc',
    linkWidth: 2,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f3/pqa6vwrrdj0jzf4foko5zqm0uygn4rf.png/90px-%E9%B9%BF%E5%A4%B40%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  trap: {
    name: translate("items.gameKeeper.trap.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 20, label: translate("items.gameKeeper.trap.range.label.destroyedByRocketChair") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/dd/40u7gtj5cvffk3e4dy5edl1ntd56kdh.png/90px-%E9%B9%BF%E5%A4%B40%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  cocoon: {
    name: translate("items.soulWeaver.cocoon.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/29/irffbeqngfqxra20eq3i4dxs5eckavf.png',
  },
  webbing: {
    name: translate("items.soulWeaver.webbing.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/97/2y46adah814l2tmyc9ws2j7zs70mwx3.png/90px-%E8%9C%98%E8%9B%9B0%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  spinning: {
    name: translate("items.soulWeaver.spinning.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/be/1shbnt82gkl17pdaoz3i1ke5r53yzva.png/90px-%E8%9C%98%E8%9B%9B1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  swallowtailButterfly: {
    name: translate("items.Geisha.swallowtailButterfly.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/3/39/2zzetskt6albjea26dh8cbhoyywljni.png',
  },
  umbrella: {
    name: translate("items.wuchang.umbrella.name"),
    render: 'circle',
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 9.3, label: translate("items.wuchang.umbrella.name") },
      ],
    },
    linkToRole: 'wuchang',
    linkMaxM: 84.4,
    linkColor: '#f8fafc',
    linkWidth: 2,
    color: '#22c55e',
    fill: 'rgba(34, 197, 94, 0.22)',
    glow: 'rgba(34, 197, 94, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3f/98f3qxkbtphouvvzglqleqnf00t5mlv.png/90px-%E5%AE%BF%E4%BC%9E%E4%B9%8B%E9%AD%820%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  camera: {
    name: translate("items.photographer.camera.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/64/mx0ydtuij8mg5bp32tuu9e1lq8usba6.png',
  },
  timeJump: {
    name: translate("items.photographer.timeJump.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8c/21xhiccnzcn7z3xtbaffb88hdguodia.png/90px-%E6%91%84%E5%BD%B1%E5%B8%882%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  console: {
    name: translate("items.madEyes.console.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/f/f7/jbqdvznjphrq602qh303r24qdn3ti4b.png',
  },
  tentacle: {
    name: translate("items.theFeaster.tentacle.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4.25, label: translate("items.theFeaster.tentacle.range.label.tentacleHit") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/99/9q4qco9e4a4eb87ml89bf6lrnc7wmzc.png/90px-%E9%BB%84%E8%A1%A3%E4%B9%8B%E4%B8%BB0%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  follower: {
    name: translate("items.dreamWitch.follower.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/d/d3/ers6mddb9wt8i5nnojwsvnm1tveyxv0.png',
  },
  witchMark: {
    name: translate("items.dreamWitch.witchMark.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/2f/80u76g7virvqtdi3roi8go36cpa3rxy.png',
  },
  hiddenDream: {
    name: translate("items.dreamWitch.hiddenDream.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 20, label: translate("items.dreamWitch.hiddenDream.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/3/33/265axozop5uoe1opp2e6gj8noxlby8e.png',
  },
  peacefulPine: {
    name: translate("items.axeBoy.peacefulPine.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 20.5, label: translate("items.axeBoy.peacefulPine.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/29/00c30uaryazol4s5ec4iuk19kr773o2.png/90px-%E7%88%B1%E5%93%AD%E9%AC%BC2%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  resentfulSoul: {
    name: translate("items.axeBoy.resentfulSoul.name"),
    linkToRole: 'axeBoy',
    linkMaxM: 27,
    linkColor: '#f8fafc',
    linkWidth: 2,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/76/j68ytwyvhnz5o8eymvxre4o6crjirlh.png/90px-%E7%88%B1%E5%93%AD%E9%AC%BC0%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  aquaMirror: {
    name: translate("items.bloodyQueen.aquaMirror.name"),
    linkToRole: 'bloodyQueen',
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 8.4, label: translate("items.bloodyQueen.aquaMirror.range.label.showSurvivor") },
        { size_m: 4.2, label: translate("items.bloodyQueen.aquaMirror.range.label.mirrorRotationTier1") },
        { size_m: 21.1, label: translate("items.bloodyQueen.aquaMirror.range.label.mirrorImageSurvivorTier2") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/03/tmqwk7lb2do1swhtp7sklgx75t0ig6f.png/90px-%E7%BA%A2%E5%A4%AB%E4%BA%BA0%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  mirrorImage: {
    name: translate("items.mirrorImage.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/b2/924f03wryik2gfgrenb3q75ngh466vi.png',
  },
  cat: {
    name: translate("items.disciple.cat.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 3.38, label: translate("items.disciple.cat.range.label.alertRadius") },
        { size_m: 6.33, label: translate("items.disciple.cat.range.label.paralysisArea") },
        { size_m: 10.5, label: translate("items.disciple.cat.range.label.locateSurvivor") },
        { size_m: 33.8, label: translate("items.disciple.cat.range.label.seenBySurvivor") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/a/a4/h2c1hndne3n1j3cq9f7itl25r646agu.png',
  },
  guide: {
    name: translate("items.disciple.guide.name"),
    linkToRole: 'disciple',
    linkMaxM: 30,
    linkColor: '#f8fafc',
    linkWidth: 2,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/bb/nnkr7l1hieew5jr1kx6m7mt6557aku7.png/90px-%E2%80%9C%E4%BD%BF%E5%BE%92%E2%80%9D1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  catwalk: {
    name: translate("items.disciple.catwalk.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/de/ljj3rujwc3hlnmf6idniig99rjdiuc5.png/90px-%E2%80%9C%E4%BD%BF%E5%BE%92%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  musicNote: {
    name: translate("items.violinist.musicNote.name"),
    render: 'link',
    linkColor: '#f8fafc',
    linkWidth: 2,
    linkMaxM: 23,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/38/dvl0ktwk8452koko8ldzj9prewp7ku5.png/90px-%E5%B0%8F%E6%8F%90%E7%90%B4%E5%AE%B60%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  infiniteMovement: {
    name: translate("items.violinist.infiniteMovement.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/33/3rmnxm8m4bwbxpv3xz6yo868q1qh94b.png/90px-%E5%B0%8F%E6%8F%90%E7%90%B4%E5%AE%B62%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  terrifyingMelody: {
    name: translate("items.violinist.terrifyingMelody.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 12, label: translate("items.violinist.terrifyingMelody.range.label.meditationCalmDownSurvivorAlone") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/9/9c/01jc95fkcxi85en8g4o3bixexw794ib.png',
  },
  sculpture: {
    name: translate("items.sculptor.sculpture.name"),
    render: 'link',
    linkColor: '#f8fafc',
    linkWidth: 2,
    linkMaxM: 11,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/12/7q7e3iajnfcsbu9f80i95d6acpbr41p.png/90px-%E9%9B%95%E5%88%BB%E5%AE%B60%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  sculptureOfNobility: {
    name: translate("items.sculptor.sculptureOfNobility.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 36, label: translate("items.sculptor.sculptureOfNobility.range.label.chargeTowardSurvivor") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/1d/eh2irolwokjiwzpyqh6paj92l9mnpan.png/90px-%E9%9B%95%E5%88%BB%E5%AE%B62%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  hieroglyphicGraveyard: {
    name: translate("items.sculptor.hieroglyphicGraveyard.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 26, label: translate("items.sculptor.hieroglyphicGraveyard.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/d/d1/dqvmem9kl2u7mpz88bgrlwhgti6cac8.png',
  },
  kineticDashHit: {
    name: translate("items.undead.kineticDashHit.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c2/pfpabajnlskmohzxfilx3gid9khv0we.png/90px-%E2%80%9C%E5%8D%9A%E5%A3%AB%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  chargedStrike: {
    name: translate("items.undead.chargedStrike.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/1a/byzs5eih7ts28g1ja00sv57iyaa5sq7.png/90px-%E2%80%9C%E5%8D%9A%E5%A3%AB%E2%80%9D1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  energyConversion: {
    name: translate("items.undead.energyConversion.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/67/7r2f4skn6tjggh6rzqomw6dtga3asl4.png/90px-%E2%80%9C%E5%8D%9A%E5%A3%AB%E2%80%9D2%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  wheelForm: {
    name: translate("items.theBreakingWheel.wheelForm.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/e/e6/mkp0acq02ft5dxif5f4oylheg6fs7z8.png',
  },
  nailBoard: {
    name: translate("items.theBreakingWheel.nailBoard.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/fb/069n3cm9y1pgho74g25jbgsnaqilrjx.png/120px-%E7%A0%B4%E8%BD%AE0%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  wheelOfImpalement: {
    name: translate("items.theBreakingWheel.wheelOfImpalement.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/44/hmcue30b2ndwbm8lli24m1702cysknf.png/90px-%E7%A0%B4%E8%BD%AE1%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  pessimistic: {
    name: translate("items.theBreakingWheel.pessimistic.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 11.8, label: translate("items.theBreakingWheel.pessimistic.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/62/4fs560q1f5qr8to83c79x87xevnbq7f.png/90px-%E7%A0%B4%E8%BD%AE1%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  ridicule: {
    name: translate("items.theBreakingWheel.ridicule.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 10.1, label: translate("items.theBreakingWheel.ridicule.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/76/noq00uguf6o8hl3c62zzyxxuwe57o1x.png/90px-%E7%A0%B4%E8%BD%AE2%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  spearfishing: {
    name: translate("items.naiad.spearfishing.name"),
    linkToRole: 'naiad',
    linkMaxM: 57.5,
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4, label: translate("items.naiad.spearfishing.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/be/3b3skletdo6z31k2wti92rsxisja1tg.png/90px-%E6%B8%94%E5%A5%B30%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  surgingTides: {
    name: translate("items.naiad.surgingTides.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/fb/iwkktsakmdsap200428ptehd25s8j2j.png/90px-%E6%B8%94%E5%A5%B31%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  waxBlock: {
    name: translate("items.waxArtist.waxBlock.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4.2, label: translate("items.waxArtist.waxBlock.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/36/oeapyqg4ukhau28gj91mcah6b5h9x4t.png/90px-%E8%9C%A1%E5%83%8F%E5%B8%881%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  moltenWax: {
    name: translate("items.waxArtist.moltenWax.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f2/110amobr867n8qauyf4ru3vfqp1t4u6.png/90px-%E8%9C%A1%E5%83%8F%E5%B8%882%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  waxSculpting: {
    name: translate("items.waxArtist.waxSculpting.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/9/94/tsqoz0zmefmrnlfwk4jlfrpxxwjmxtp.png',
  },
  raven: {
    name: translate("items.nightmare.raven.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/9b/rhdo7djouajt19j04d2ht83o1x7smip.png/90px-%E2%80%9C%E5%99%A9%E6%A2%A6%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  spy: {
    name: translate("items.nightmare.spy.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/20/n2yhpt9958248kawaffxbtv5fyhu40u.png/90px-%E2%80%9C%E5%99%A9%E6%A2%A6%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  badOmen: {
    name: translate("items.nightmare.badOmen.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/00/psijwfoopecl4dwpc63ky7ujtegc0oy.png/90px-%E2%80%9C%E5%99%A9%E6%A2%A6%E2%80%9D1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  record: {
    name: translate("items.clerk.record.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/5/51/1sax8lcomca9fuftk4h64u41s4ls0hm.png',
  },
  inspect: {
    name: translate("items.clerk.inspect.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/4f/4t3fhxkwbql5ag0c29soi6bwoy18i84.png/90px-%E2%80%9C%E8%AE%B0%E5%BD%95%E5%91%98%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  replay: {
    name: translate("items.clerk.replay.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c4/qwpvuh2q31nzpjkr1ynf6w335gao18s.png',
  },
  invalid: {
    name: translate("items.clerk.invalid.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c1/k5gp583qiih9dmckkn56eccoprevg0f.png',
  },
  electromagneticFieldN: {
    name: translate("items.hermit.electromagneticFieldN.name"),
    render: 'circle',
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 2.3, label: translate("items.hermit.electromagneticFieldN.name") },
      ],
    },
    color: '#ef4444',
    fill: 'rgba(239, 68, 68, 0.22)',
    glow: 'rgba(239, 68, 68, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/69/sktrgc7dzmstt8bsbokywfq0jmzshg2.png',
  },
  electromagneticFieldS: {
    name: translate("items.hermit.electromagneticFieldS.name"),
    render: 'circle',
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 2.3, label: translate("items.hermit.electromagneticFieldS.name") },
      ],
    },
    color: '#1d4ed8',
    fill: 'rgba(29, 78, 216, 0.22)',
    glow: 'rgba(29, 78, 216, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/69/sktrgc7dzmstt8bsbokywfq0jmzshg2.png',
  },
  secondDawn: {
    name: translate("items.hermit.secondDawn.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/e/ef/0clrghg6k59p4fiumfe6dyp5kamq87v.png',
  },
  reversePolarity: {
    name: translate("items.hermit.reversePolarity.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/ad/cz51fbfkk2gckg04bpa8qxky2fm7lol.png/90px-%E9%9A%90%E5%A3%AB0%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  meditation: {
    name: translate("items.hermit.meditation.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c0/tmgrj8i99jc5wzl6n2tnu7w0cqxx094.png',
  },
  tempest: {
    name: translate("items.nightWatch.tempest.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 15.9, label: translate("items.nightWatch.tempest.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/62/l82kzmd8c621e7mm3wvu4qutqh0a6er.png/90px-%E5%AE%88%E5%A4%9C%E4%BA%BA0%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  windwalk: {
    name: translate("items.nightWatch.windwalk.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/2d/fixoiw0rb7utlepv5lhga4ktvlqfoak.png',
  },
  tempestCyclone: {
    name: translate("items.nightWatch.tempestCyclone.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 11.8, label: translate("items.nightWatch.tempestCyclone.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/86/4o4xemckgxf3le7dxrnnmm0m7k6cdqr.png/90px-%E5%AE%88%E5%A4%9C%E4%BA%BA1%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  windwalkCharge: {
    name: translate("items.nightWatch.windwalkCharge.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 15.2, label: translate("items.nightWatch.windwalkCharge.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/94/rhchhzimk1la3tkmcjc5g62lgtzvmyj.png/90px-%E5%AE%88%E5%A4%9C%E4%BA%BA1%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  windControl: {
    name: translate("items.nightWatch.windControl.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/be/crtbkqxhyeqvzccz4q9o6u321r9l1lq.png/90px-%E5%AE%88%E5%A4%9C%E4%BA%BA1%E9%98%B6%E6%8A%80%E8%83%BD3.png',
  },
  remnant: {
    name: translate("items.operaSinger.remnant.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/2c/i63l26e9f0di64h97egr3qngfbf5u1r.png/90px-%E6%AD%8C%E5%89%A7%E6%BC%94%E5%91%980%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  shadowstrike: {
    name: translate("items.operaSinger.shadowstrike.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b8/m3kemxopxjddcbko8ojmggxgtru6tz9.png/90px-%E6%AD%8C%E5%89%A7%E6%BC%94%E5%91%981%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  pickaxe: {
    name: translate("items.foolsGold.pickaxe.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/fd/5iukz0stigdwm5gjetzfetpcruysb6u.png/90px-%E2%80%9C%E6%84%9A%E4%BA%BA%E9%87%91%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  magneticRock: {
    name: translate("items.foolsGold.magneticRock.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b2/rsi766km0ehqbmrvciyk3wp75ukap0u.png/90px-%E2%80%9C%E6%84%9A%E4%BA%BA%E9%87%91%E2%80%9D1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  yithian: {
    name: translate("items.theShadow.yithian.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/bd/9fsij05z733x1stahpjarmbgur876op.png/90px-%E6%97%B6%E7%A9%BA%E4%B9%8B%E5%BD%B10%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  corruptedOstracon: {
    name: translate("items.theShadow.corruptedOstracon.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 9, label: translate("items.theShadow.corruptedOstracon.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/35/6tyw4qniiw51aohhjwxjv4wq8yj28ud.png/90px-%E6%97%B6%E7%A9%BA%E4%B9%8B%E5%BD%B10%E9%98%B6%E6%8A%80%E8%83%BD4.png',
  },
  ancientVisage: {
    name: translate("items.theShadow.ancientVisage.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 9, label: translate("items.theShadow.ancientVisage.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/d/da/c2qmk7cs5shwl528wzkkmma6i2v8ael.png',
  },
  cloneHullabaloo: {
    name: translate("items.hullabaloo.cloneHullabaloo.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/18/hj1mypuwdo5p41epy37ia9ln3cylr7q.png/90px-%E2%80%9C%E5%96%A7%E5%9A%A3%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  contactPoint: {
    name: translate("items.cueist.contactPoint.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 3, label: translate("items.cueist.contactPoint.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c6/t5t9qmg4vouffmvsxnzq6mizonmjzvr.png',
  },
  cueBall: {
    name: translate("items.cueist.cueBall.name"),
    render: 'circle',
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4, label: translate("items.cueist.cueBall.name") },
      ],
    },
    color: '#18181b',
    fill: 'rgba(24, 24, 27, 0.22)',
    glow: 'rgba(24, 24, 27, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/67/t7auxaxdhzzis13n6qnl24dciluiddd.png',
  },
  cage: {
    name: translate("items.goatman.cage.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: [9, 12, 15], label: translate("items.goatman.cage.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/67/kqp54mjbpln0aytlr986ko5j4y7cy4t.png/90px-%E2%80%9C%E8%B7%9B%E8%84%9A%E7%BE%8A%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  bestialAwakening: {
    name: translate("items.herztier.bestialAwakening.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 48, label: translate("items.herztier.bestialAwakening.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/8/89/agxycu6xg1opqj3xo7tpix753cvfkzz.png',
  },
  heightenedSenses: {
    name: translate("items.herztier.heightenedSenses.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 25, label: translate("items.herztier.heightenedSenses.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/91/hu0fnv6ev967sdypg7bgso8f6ch8jzr.png/90px-%E2%80%9C%E5%BF%83%E5%85%BD%E2%80%9D1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  peeper: {
    name: translate("items.trait.peeper.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 13, label: translate("items.trait.peeper.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/ba/4sgjzcxl8526632orcqqgwkt5pv9s4f.png',
  },
  warp: {
    name: translate("items.trait.warp.name"),
    render: 'link',
    linkColor: '#f8fafc',
    linkWidth: 2,
    linkMaxM: 60,
    icon: 'https://patchwiki.biligame.com/images/dwrg/f/f5/lqbsf4hruktmy7b6m454ya5efebmmg7.png',
  },
  fearRadius: {
    name: translate("items.talentSurvivor.fearRadius.name"),
    ranges: {
      key: 'showItem',
      fearMods: {
        hunter: [['hunter', translate("characters.camps.hunter"), 1], ['beauty', translate("items.talentSurvivor.fearRadius.range.fearMods.one"), 0.8], ['prajna', translate("items.talentSurvivor.fearRadius.range.fearMods.oneAlternate"), 1.1]],
        survivor: [['survivor', translate("characters.camps.survivor"), 1], ['prisoner', translate("items.talentSurvivor.fearRadius.range.fearMods.oneThird"), 0.8], ['archer', translate("items.talentSurvivor.fearRadius.range.fearMods.oneFourth"), 0.76]],
      },
      options: [
        { size_m: 32.07, label: translate("items.talentSurvivor.fearRadius.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/24/dv1pstoj7a8ftqf9l3jazt1cpe4sxwo.png',
  },
  webersLaw: {
    name: translate("items.talentSurvivor.webersLaw.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 18, label: translate("items.talentSurvivor.webersLaw.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/28/4opnhwv5mnc78m81u6ulz3t2b50yhxj.png',
  },
  sneak: {
    name: translate("items.talentSurvivor.sneak.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 22, label: translate("items.talentSurvivor.sneak.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/1/13/o8d12vi02km7ozis0f2io312tsynodg.png',
  },
  tinnitus: {
    name: translate("items.talentHunter.tinnitus.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 36, label: translate("items.talentHunter.tinnitus.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/f/f5/2546goc080xvxx8kde4sk2h1vry3k4n.png',
  },
  addiction: {
    name: translate("items.talentHunter.addiction.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 20, label: translate("items.talentHunter.addiction.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/e/eb/flp1movyr3427678u7a854cde31icqk.png',
  },
  nostalgic: {
    name: translate("items.talentHunter.nostalgic.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 32, label: translate("items.talentHunter.nostalgic.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/e/ef/80q87s7z71ecm5yhz07bd9lo3hs1g8c.png',
  },
  skittish: {
    name: translate("items.talentHunter.skittish.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 12, label: translate("items.talentHunter.skittish.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/0/0c/dmvkzw1a11nxskx0hhoq6bnfslsvw9c.png',
  },
  deerHunt: {
    name: translate("items.talentHunter.deerHunt.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 18, label: translate("items.talentHunter.deerHunt.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/b7/d9ojgfgmihbwmaw6vkmbg96it0s2eb3.png',
  },
  streetSweeper: {
    name: translate("items.talentHunter.streetSweeper.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: [30, 45, 60], label: translate("items.talentHunter.streetSweeper.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/bd/re4lu3k5iknzh748yg85tcdvla2b0t2.png',
  },
  wither: {
    name: translate("items.talentHunter.wither.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 10, label: translate("items.talentHunter.wither.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/4/48/9edy2j55gu74hyrt4jqx4cxkunwyray.png',
  },
  obsession: {
    name: translate("items.talentHunter.obsession.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 16, label: translate("items.talentHunter.obsession.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/6b/ra1r6rk9depicpmew855rzug25sy8ut.png',
  },
  famine: {
    name: translate("items.talentHunter.famine.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 16, label: translate("items.talentHunter.famine.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/4/45/73txs9wv78r9rrh0ghil23wf6tx4c3s.png',
  },
};


export const TAC_ROLES = {
  luckyGuy: {
    name: translate("characters.luckyGuy.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 25.3, label: translate("characters.luckyGuy.range.label.detectChestNearby") },
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
        { size_m: 8, label: translate("characters.thief.range.label.flashlightShining") },
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
        { size_m: 15, label: translate("characters.gardener.range.label.locateRocketChairNearby") },
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
        { size_m: 60, label: translate("characters.explorer.range.label.senseHunter") },
        { size_m: 70, label: translate("characters.explorer.range.label.passwordPage") },
      ],
    },
    items: ['gulliversTravels'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8d/4bayjt56xydhpwb91pcie4hpbnm6gp7.png/90px-%E5%86%92%E9%99%A9%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  mercenary: {
    name: translate("characters.mercenary.name"),
    camp: 'survivor',
    items: ['elbowPads'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/4c/3q44aot13l2d3en8vhxflg2hkq1e5h9.png/90px-%E4%BD%A3%E5%85%B5%E5%A4%B4%E5%83%8F.png',
  },
  coordinator: {
    name: translate("characters.coordinator.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 10, label: translate("characters.coordinator.range.label.flareGunCanUse") },
      ],
    },
    items: ['flareGun'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/22/22nticg5kk2o0m6d5krcoaambmjfxk1.png/90px-%E7%A9%BA%E5%86%9B%E5%A4%B4%E5%83%8F.png',
  },
  mechanic: {
    name: translate("characters.mechanic.name"),
    camp: 'survivor',
    items: ['doll'],
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
        { size_m: 25.3, label: translate("characters.theMindsEye.range.label.tapTapLocatePosition") },
        { size_m: 6.8, label: translate("characters.theMindsEye.range.label.strikeInteractionSpeedReduceOne") },
        { size_m: 25.3, label: translate("characters.theMindsEye.range.label.strikeInteractionSpeedReduceTwo") },
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
        { size_m: 15.2, label: translate("characters.cowboy.range.label.lassoHitMax") },
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
        { size_m: 8.44, label: translate("characters.femaleDancer.range.label.slide") },
      ],
    },
    items: ['fastMusicbox', 'slowMusicbox'],
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
    items: ['coffin'],
    maxItems: 1,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/ac/9ycf32ktg7qe2234e49d8mzrc18ma1w.png/90px-%E5%85%A5%E6%AE%93%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  prospector: {
    name: translate("characters.prospector.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 14.5, label: translate("characters.prospector.range.label.magnetThrowMax") },
        { size_m: 18, label: translate("characters.prospector.range.label.stunReduce") },
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
        { size_m: 5.1, label: translate("characters.enchantress.range.label.apeCurseParalyze") },
        { size_m: 16.9, label: translate("characters.enchantress.range.label.guardStack") },
        { size_m: 12.7, label: translate("characters.enchantress.range.label.guardStackReduce") },
      ],
    },
    items: ['cursedEmblem'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/61/ezw8a4g51y9o4zufeug2rbeemzmdzs5.png/90px-%E5%92%92%E6%9C%AF%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  wildling: {
    name: translate("characters.wildling.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 15, label: translate("characters.wildling.range.label.bumpMax") },
        { size_m: 17, label: translate("characters.wildling.range.label.bumpAddKnockBackMax") },
      ],
    },
    items: ['wildlingPartner'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b0/qix27d33osv7o1ti0g244pf7xzp8d0x.png/90px-%E9%87%8E%E4%BA%BA%E5%A4%B4%E5%83%8F.png',
  },
  acrobat: {
    name: translate("characters.acrobat.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 4, label: translate("characters.acrobat.range.label.leapDefault") },
        { size_m: 7.5, label: translate("characters.acrobat.range.label.leapMax") },
        { size_m: 12, label: translate("characters.acrobat.range.label.leapAddSomersault") },
      ],
    },
    items: ['bomb'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c4/c6whxfr6ba7v3pv5xcskfvv0rvgt4e8.png/90px-%E6%9D%82%E6%8A%80%E6%BC%94%E5%91%98%E5%A4%B4%E5%83%8F.png',
  },
  firstOfficer: {
    name: translate("characters.firstOfficer.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 27, label: translate("characters.firstOfficer.range.label.hypnotizeOne") },
        { size_m: 8.4, label: translate("characters.firstOfficer.range.label.hypnotizeTwo") },
        { size_m: 5.1, label: translate("characters.firstOfficer.range.label.hypnotizeThree") },
      ],
    },
    items: ['poseidonWatch'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0d/fcqecshh4fczyoeczq8ly2yt3rx0f5q.png/90px-%E5%A4%A7%E5%89%AF%E5%A4%B4%E5%83%8F.png',
  },
  barmaid: {
    name: translate("characters.barmaid.name"),
    camp: 'survivor',
    items: ['duphrin', 'strongDovlin'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d1/qxsohhayojydlkq1rvfpb9fefsvei2m.png/90px-%E8%B0%83%E9%85%92%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  postman: {
    name: translate("characters.postman.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 16.9, label: translate("characters.postman.range.label.postDogDashMax") },
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
        { size_m: 9.7, label: translate("characters.graveKeeper.range.label.tremor") },
      ],
    },
    items: ['shovel'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5c/dc57y6fvws61am1wmtpnqjzbeu0pnmy.png/90px-%E5%AE%88%E5%A2%93%E4%BA%BA%E5%A4%B4%E5%83%8F.png',
  },
  prisoner: {
    name: translate("characters.prisoner.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 5.9, label: translate("characters.prisoner.range.label.severeElectricCurrentStun") },
      ],
    },
    items: ['insulatingGloves', 'severeElectricCurrent'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/80/6lii1orabnu42oto26e1o570vl5w6f1.png/90px-%22%E5%9B%9A%E5%BE%92%22%E5%A4%B4%E5%83%8F.png',
  },
  entomologist: {
    name: translate("characters.entomologist.name"),
    camp: 'survivor',
    items: ['swarm'],
    maxItems: 1,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/63/3s9842m4mdlccry2lxz1u1cr8cecz3s.png/90px-%E6%98%86%E8%99%AB%E5%AD%A6%E8%80%85%E5%A4%B4%E5%83%8F.png',
  },
  painter: {
    name: translate("characters.painter.name"),
    camp: 'survivor',
    items: ['drawingBoard'],
    maxItems: 2,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/56/821z7af4xzflb8o5ad3jxjzqzxswqqh.png/90px-%E7%94%BB%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  batter: {
    name: translate("characters.batter.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 10.1, label: translate("characters.batter.range.label.cricketBatCanHit") },
        { size_m: 17.55, label: translate("characters.batter.range.label.cricketBatHitAddKnockBackMax") },
        { size_m: 15.2, label: translate("characters.batter.range.label.altruism") },
      ],
    },
    items: ['cricketBat'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/64/qfrijnvjm5sr2pq8ny1mv2zxj60k7b0.png/90px-%E5%87%BB%E7%90%83%E6%89%8B%E5%A4%B4%E5%83%8F.png',
  },
  toyMerchant: {
    name: translate("characters.toyMerchant.name"),
    camp: 'survivor',
    items: ['catapult'],
    maxItems: 2,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/9e/sjqzxjfh9dr8zjhdl3y9g5xoibszlck.png/90px-%E7%8E%A9%E5%85%B7%E5%95%86%E5%A4%B4%E5%83%8F.png',
  },
  psychologist: {
    name: translate("characters.psychologist.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 13, label: translate("characters.psychologist.range.label.subjectiveAnchor") },
        { size_m: 13, label: translate("characters.psychologist.range.label.bonded") },
      ],
    },
    items: ['whistle'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e4/bqml61178c80rz5gd4m6rjyejqfjuw2.png/90px-%E2%80%9C%E5%BF%83%E7%90%86%E5%AD%A6%E5%AE%B6%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  patient: {
    name: translate("characters.patient.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 13, label: translate("characters.patient.range.label.bonded") },
      ],
    },
    items: ['grapplingHook'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/63/3ihjylgclyicqv0c9xxhw3lg6ccrzts.png/90px-%E7%97%85%E6%82%A3%E5%A4%B4%E5%83%8F.png',
  },
  novelist: {
    name: translate("characters.novelist.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 13.5, label: translate("characters.novelist.range.label.metaphorDefault") },
        { size_m: 9.8, label: translate("characters.novelist.range.label.metaphorReduce") },
      ],
    },
    items: ['sketchBook'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/33/9rjzftpqbbo1z2uuyqlrm8jay8mwmci.png/90px-%E5%B0%8F%E8%AF%B4%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  littleGirl: {
    name: translate("characters.littleGirl.name"),
    camp: 'survivor',
    items: ['memoryFragment'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0f/9fgs5q97em3fq64uahgmlkfl3fer2g8.png/90px-%E2%80%9C%E5%B0%8F%E5%A5%B3%E5%AD%A9%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  weepingClown: {
    name: translate("characters.weepingClown.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 6, label: translate("characters.weepingClown.range.label.rocketExplode") },
        { size_m: 3, label: translate("characters.weepingClown.range.label.stunHunter") },
      ],
    },
    items: ['rocket'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/2f/gnwi7vgnop543ts7ki7d99fkhoc18wf.png/90px-%E5%93%AD%E6%B3%A3%E5%B0%8F%E4%B8%91%E5%A4%B4%E5%83%8F.png',
  },
  professor: {
    name: translate("characters.professor.name"),
    camp: 'survivor',
    items: ['scale'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/1d/axm2gkg6h7t9244sf86k8li6mxa4e59.png/90px-%E6%95%99%E6%8E%88%E5%A4%B4%E5%83%8F.png',
  },
  antiquarian: {
    name: translate("characters.antiquarian.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 4.9, label: translate("characters.antiquarian.range.label.flip") },
        { size_m: 3.5, label: translate("characters.antiquarian.range.label.sweepSwing") },
        { size_m: 4.7, label: translate("characters.antiquarian.range.label.stab") },
        { size_m: 12.7, label: translate("characters.antiquarian.range.label.obscure") },
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
        { size_m: 15, label: translate("characters.journalist.range.label.phantomPlacement") },
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
        { size_m: 18.5, label: translate("characters.aeroplanist.range.label.jetpackPropelThreeMax") },
        { size_m: 12.7, label: translate("characters.aeroplanist.range.label.essentialTremor") },
      ],
    },
    items: ['jetpack'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/11/pkpubifvltwi4g20xgegmmfr5hp0w7e.png/90px-%E9%A3%9E%E8%A1%8C%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  cheerleader: {
    name: translate("characters.cheerleader.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 20, label: translate("characters.cheerleader.range.label.encourage") },
      ],
    },
    items: ['pompoms'],
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
        { size_m: 4.2, label: translate("characters.fireInvestigator.range.label.deployDefault") },
        { size_m: 12.64, label: translate("characters.fireInvestigator.range.label.deployMax") },
        { size_m: 9.6, label: translate("characters.fireInvestigator.range.label.repulsion") },
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
        { size_m: 18, label: translate("characters.faroLady.range.label.cloak") },
      ],
    },
    items: ['aromatherapyCane'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f0/04o60ry6yqz28mfqd98eo2pwm5s2rpl.png/90px-%E2%80%9C%E6%B3%95%E7%BD%97%E5%A5%B3%E5%A3%AB%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  knight: {
    name: translate("characters.knight.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 13, label: translate("characters.knight.range.label.tacticalForesight") },
        { size_m: 7, label: translate("characters.knight.range.label.chivalrousSympathy") },
      ],
    },
    items: ['helmet'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/97/10yk7nm7qb4focpftij0jl8d4y15itk.png/90px-%E2%80%9C%E9%AA%91%E5%A3%AB%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  meteorologist: {
    name: translate("characters.meteorologist.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 32, label: translate("characters.meteorologist.range.label.warmRain") },
      ],
    },
    items: ['stormGlass'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d1/31tsfob5vzra69oorilz2powtnzcaxj.png/90px-%E6%B0%94%E8%B1%A1%E5%AD%A6%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  archer: {
    name: translate("characters.archer.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 18, label: translate("characters.archer.range.label.keelBowHitMax") },
        { size_m: 12, label: translate("characters.archer.range.label.keelBowCanHitCore") },
        { size_m: 4.5, label: translate("characters.archer.range.label.crossbow") },
      ],
    },
    items: ['keelBow', 'crossBow'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e5/gvjxblieo1gyabfvvx6ezapc8b80mkn.png/90px-%E5%BC%93%E7%AE%AD%E6%89%8B%E5%A4%B4%E5%83%8F.png',
  },
  escapologist: {
    name: translate("characters.escapologist.name"),
    camp: 'survivor',
    items: ['thurible'],
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
        { size_m: 6, label: translate("characters.matador.range.label.muletaDash") },
        { size_m: 2.25, label: translate("characters.matador.range.label.muletaSweep") },
      ],
    },
    items: ['muleta'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/ce/sj6wwgwa3uqsi94yw71dsh3bbab1l54.png/90px-%E6%96%97%E7%89%9B%E5%A3%AB%E5%A4%B4%E5%83%8F.png',
  },
  mimeArtist: {
    name: translate("characters.mimeArtist.name"),
    camp: 'survivor',
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 20.3, label: translate("characters.mimeArtist.range.label.emotionAccumulation") },
      ],
    },
    items: ['propUmbrella'],
    maxItems: 3,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b4/ezpalvrvblo048p3uaf9ejyqlggq095.png/90px-%E9%BB%98%E5%89%A7%E8%89%BA%E4%BA%BA%E5%A4%B4%E5%83%8F.png',
  },
  prodigy: {
    name: translate("characters.prodigy.name"),
    camp: 'survivor',
    items: ['hamster'],
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
        { size_m: 55, label: translate("characters.hellEmber.range.label.puppetCastMax") },
      ],
    },
    items: ['phantom', 'puppet1', 'puppet2'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/43/9ji6s1uz7c0dnn0r70zxv4a3cx67xm2.png/90px-%E5%8E%82%E9%95%BF%E5%A4%B4%E5%83%8F.png',
  },
  smileyFace: {
    name: translate("characters.smileyFace.name"),
    camp: 'hunter',
    speed: { [translate("characters.smileyFace.name")]: 4.56, [translate("characters.smileyFace.speed.rocketDashTier0")]: 7.07, [translate("characters.smileyFace.speed.rocketDashTier1")]: 7.39, [translate("characters.smileyFace.speed.rocketDashTier2")]: 9.12 },
    items: ['windWings', 'drill', 'propeller'],
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
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/97/ivu0gnyhfvshbheysxmqaeqcq6j5pi3.png/90px-%E2%80%9C%E6%9D%B0%E5%85%8B%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  soulWeaver: {
    name: translate("characters.soulWeaver.name"),
    camp: 'hunter',
    speed: 4.56,
    items: ['cocoon', 'webbing', 'spinning'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/97/dpvb1d7e4f03tqh9s0l0ulua91ouuab.png/90px-%E8%9C%98%E8%9B%9B%E5%A4%B4%E5%83%8F.png',
  },
  Geisha: {
    name: translate("characters.geisha.name"),
    camp: 'hunter',
    speed: { [translate("characters.geisha.speed.beautyForm")]: 4.73, [translate("characters.geisha.speed.prajnaForm")]: 4.56 },
    items: ['swallowtailButterfly'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/bd/qcstapls4hnm6fckekl6l6890h19vst.png/90px-%E7%BA%A2%E8%9D%B6%E5%A4%B4%E5%83%8F.png',
  },
  wuchang: {
    name: translate("characters.wuchang.name"),
    camp: 'hunter',
    speed: { [translate("characters.wuchang.speed.xieBian")]: 4.73, [translate("characters.wuchang.speed.fanWuJiu")]: 4.56 },
    items: ['umbrella'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/2a/gd5yd3hfaohhj2pozgqf2cfivpadbn6.png/90px-%E5%AE%BF%E4%BC%9E%E4%B9%8B%E9%AD%82%E5%A4%B4%E5%83%8F.png',
  },
  photographer: {
    name: translate("characters.photographer.name"),
    camp: 'hunter',
    speed: 4.64,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 33, label: translate("characters.photographer.range.label.locateCamera") },
      ],
    },
    items: ['camera', 'timeJump'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c6/rmzvfbp2mi0ucb13xcj6t6dzgd41tlz.png/90px-%E6%91%84%E5%BD%B1%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  madEyes: {
    name: translate("characters.madEyes.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['console'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/4a/kybq2j420o43mr2b0wi5qy4wgtmq65k.png/90px-%E7%96%AF%E7%9C%BC%E5%A4%B4%E5%83%8F.png',
  },
  theFeaster: {
    name: translate("characters.theFeaster.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['tentacle'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/30/3yr81lwbegfcgotyiis8yknwc2224is.png/90px-%E9%BB%84%E8%A1%A3%E4%B9%8B%E4%B8%BB%E5%A4%B4%E5%83%8F.png',
  },
  dreamWitch: {
    name: translate("characters.dreamWitch.name"),
    camp: 'hunter',
    speed: { [translate("characters.dreamWitch.speed.originalBody")]: 6.08, [translate("items.dreamWitch.follower.name")]: 4.56 },
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 20, label: translate("characters.dreamWitch.range.label.hiddenDreamsurvivorNotification") },
        { size_m: 42.2, label: translate("characters.dreamWitch.range.label.followerControlTier0Tier1") },
        { size_m: 59.1, label: translate("characters.dreamWitch.range.label.followerControlTier2") },
      ],
    },
    items: ['follower', 'witchMark', 'hiddenDream'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/6c/igl4l2j95ftovgiv85sdeidapbse4gu.png/90px-%E6%A2%A6%E4%B9%8B%E5%A5%B3%E5%B7%AB%E5%A4%B4%E5%83%8F.png',
  },
  axeBoy: {
    name: translate("characters.axeBoy.name"),
    camp: 'hunter',
    speed: 4.56,
    items: ['peacefulPine', 'resentfulSoul'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/1c/jtvvska3lxcxlxq9vpto2mq2lj3l2q9.png/90px-%E7%88%B1%E5%93%AD%E9%AC%BC%E5%A4%B4%E5%83%8F.png',
  },
  evilReptilian: {
    name: translate("characters.evilReptilian.name"),
    camp: 'hunter',
    speed: 4.64,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8b/e7uzw52eywkaptcdagdm61cihnpot2p.png/90px-%E5%AD%BD%E8%9C%A5%E5%A4%B4%E5%83%8F.png',
  },
  bloodyQueen: {
    name: translate("characters.bloodyQueen.name"),
    camp: 'hunter',
    speed: 4.64,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 25.3, label: translate("characters.bloodyQueen.range.label.aquaMirrorPlacement") },
      ],
    },
    items: ['aquaMirror'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/93/5sfpytt0vm3cjq75sr912v6eaxzqh7z.png/90px-%E7%BA%A2%E5%A4%AB%E4%BA%BA%E5%A4%B4%E5%83%8F.png',
  },
  guard26: {
    name: translate("characters.guard26.name"),
    camp: 'hunter',
    speed: 4.64,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 35.5, label: translate("characters.guard26.range.label.bombThrowMax") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/bf/jycs4x41s0qky58o3pfprwwz9fpvr54.png/90px-26%E5%8F%B7%E5%AE%88%E5%8D%AB%E5%A4%B4%E5%83%8F.png',
  },
  disciple: {
    name: translate("characters.disciple.name"),
    camp: 'hunter',
    speed: 4.73,
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 30, label: translate("characters.disciple.range.label.guidePlacement") },
        { size_m: 10.5, label: translate("characters.disciple.range.label.catwalkTier0") },
        { size_m: 12.5, label: translate("characters.disciple.range.label.catwalkTier2") },
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
        { size_m: 20.5, label: translate("characters.violinist.range.label.musicNotePlacement") },
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
        { size_m: 22.5, label: translate("characters.sculptor.range.label.sculpturePlacement") },
        { size_m: 12, label: translate("characters.sculptor.range.label.hieroglyphicGraveyardHint") },
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
    speed: { [translate("characters.theBreakingWheel.speed.humanForm")]: 4.64, [translate("characters.theBreakingWheel.speed.wheelForm")]: 10.13 },
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 11.8, label: translate("characters.theBreakingWheel.range.label.pessimistic") },
        { size_m: 10.1, label: translate("characters.theBreakingWheel.range.label.ridicule") },
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
        { size_m: 4.2, label: translate("characters.waxArtist.range.label.waxenCoatSplash") },
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
        { size_m: 6.33, label: translate("characters.nightmare.range.label.dive") },
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
        { size_m: 20, label: translate("characters.clerk.range.label.replayMax") },
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
        { size_m: 15.9, label: translate("characters.nightWatch.range.label.tempest") },
        { size_m: 11.8, label: translate("characters.nightWatch.range.label.tempestCyclone") },
        { size_m: 15.2, label: translate("characters.nightWatch.range.label.windwalkCharge") },
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
        { size_m: 4.64, label: translate("characters.operaSinger.range.label.shadowLeapTier0Tier1") },
        { size_m: 5.568, label: translate("characters.operaSinger.range.label.shadowLeapTier2") },
      ],
    },
    items: ['remnant', 'shadowstrike'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/be/k47ppq37pc3g92kjsu3iakot58em2pk.png/90px-%E6%AD%8C%E5%89%A7%E6%BC%94%E5%91%98%E5%A4%B4%E5%83%8F.png',
  },
  foolsGold: {
    name: translate("characters.foolsGold.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['pickaxe', 'magneticRock'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b8/bkshz3pnyhz1mhmq3xrr3bgr2mctkc0.png/90px-%E2%80%9C%E6%84%9A%E4%BA%BA%E9%87%91%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  theShadow: {

    ranges: {
      key: 'showItem',
      options: [
        { size_m: 15, label: translate("characters.theShadow.range.label.ancientVisage") },
      ],
    },
    name: translate("characters.theShadow.name"),
    camp: 'hunter',
    speed: { [translate("characters.theShadow.speed.ivy")]: 4.64, [translate("items.theShadow.yithian.name")]: 7.59 },
    items: ['yithian', 'corruptedOstracon', 'ancientVisage'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b7/sm52k5nm0azevp1522d8fdx7p59d4nl.png/90px-%E6%97%B6%E7%A9%BA%E4%B9%8B%E5%BD%B1%E5%A4%B4%E5%83%8F.png',
  },
  goatman: {
    name: translate("characters.goatman.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['cage'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/6c/1lx58h74jh6atpnkp3ve0z23d5xrwyy.png/90px-%E2%80%9C%E8%B7%9B%E8%84%9A%E7%BE%8A%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  hullabaloo: {
    name: translate("characters.hullabaloo.name"),
    camp: 'hunter',
    speed: 5.10,
    items: ['cloneHullabaloo'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/4a/h01g2xvfrfnb48m8u3a1xghciyfd9cy.png/90px-%E2%80%9C%E5%96%A7%E5%9A%A3%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  peddler: {
    name: translate("characters.peddler.name"),
    camp: 'hunter',
    speed: 4.64,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/af/c1idozmlwq4h20eylgrl3zzuueatha9.png/90px-%E6%9D%82%E8%B4%A7%E5%95%86%E5%A4%B4%E5%83%8F.png',
  },
  cueist: {
    name: translate("characters.cueist.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['contactPoint', 'cueBall'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e5/7st2e3ycktftdvdl68mdlub4aun3g6a.png/90px-%E2%80%9C%E5%8F%B0%E7%90%83%E6%89%8B%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  queenBee: {
    name: translate("characters.queenBee.name"),
    camp: 'hunter',
    speed: 4.64,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c6/0kb43nn36sho3vxrlvy2byk5xt9wldt.png/90px-%E2%80%9C%E5%A5%B3%E7%8E%8B%E8%9C%82%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  dentist: {
    name: translate("characters.dentist.name"),
    camp: 'hunter',
    speed: 4.73,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/55/qqgw8tk7p16rrgpfodmon5y9ljj2dq8.png/90px-%E2%80%9C%E7%89%99%E5%8C%BB%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  herztier: {
    name: translate("characters.herztier.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['bestialAwakening', 'heightenedSenses'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5f/d9d4dwfp18lwnmcmymoy3iylx2pai6j.png/90px-%E2%80%9C%E5%BF%83%E5%85%BD%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  customize: {
    name: translate("characters.customize.name"),
    camp: 'other',
    ranges: {
      key: 'show',
      options: [
        { size_m: { min: 0, max: null }, label: translate("characters.customize.range.label.show") },
      ],
    },
    color: '#fbbf24',
    icon: 'https://patchwiki.biligame.com/images/dwrg/f/f6/o8ixpxb56avrj5e2tzdyps58h8rfa7i.png',
  },
  trait: {
    name: translate("characters.trait.name"),
    camp: 'other',
    items: ['peeper', 'warp'],
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
};


export const TAC_MEASURE_DEFAULT = {
  single: { color: '#eab308', width: 3 },
  chain: { color: '#f97316', width: 3 },
};


export const DUNGEON_ICON_URL = 'https://patchwiki.biligame.com/images/dwrg/2/2c/'
  + '52o7vcf15w5r12t4nh6aji1uglpa036.png';

export const ESCAPE_DOOR_ICON_URL = 'https://patchwiki.biligame.com/images/dwrg/e/e2/'
  + '0n8mxk798sa4wj1awprw72pyrthwepv.png';

export const CHAIR_ICON_URL = 'https://i0.hdslb.com/bfs/new_dyn/'
  + 'f120fa1a2f8db7da9b90e20821aa86e3262863779.png@176w_192h.avif';

export const TAC_FIXED_SPAWN_ICONS = {
  camera: 'https://patchwiki.biligame.com/images/dwrg/6/64/mx0ydtuij8mg5bp32tuu9e1lq8usba6.png',
  console: 'https://patchwiki.biligame.com/images/dwrg/f/f7/jbqdvznjphrq602qh303r24qdn3ti4b.png',
};

export const BOX_ICON_URL = 'https://i0.hdslb.com/bfs/new_dyn/'
  + 'a651cfc24c47f2fa125f20c90f5dda6896830223.png@1192w.avif';


export const TAC_DISPLAY_DEFAULT = { cipherSize: 6, dungeonSize: 6, doorSize: 6, chairSize: 6, boxSize: 1.5 };

export const TAC_ZOOM_MIN = 1, TAC_ZOOM_MAX = 5;




export const TAC_ZOOM_LOCK_ICONS = {
  unlocked: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>',
  locked: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
};


export const TAC_ABYSS_MAX_M = 57.5;



export const TAC_TREASURE_RULE = { rangeM: 70, ringM: [5.5, 7.3] };



export const TAC_MANAGE_DEFAULT = { roleSize: 6, iconSize: 3.4 };
