import { translate } from '../core/i18n.js';


export const TAC_SVG_NS = 'http://www.w3.org/2000/svg';


export const TAC_SURVIVOR_SPEED = 3.8;


export const TAC_BASE_STATES = {
  run: { name: translate("movement.states.run"), speed: 3.8 },
  walk: { name: translate("movement.states.walk"), speed: 2.11 },
  crouch: { name: translate("movement.states.crouch"), speed: 1.14 },
  crawl: { name: translate("movement.states.crawl"), speed: 0.44 },
};


export const TAC_ROLE_BASES = {
  'survivor': { name: translate("characters.camps.survivor"), speed: 3.8, role: null },
  'wildling:0': { name: translate("tactic.wildling0.name"), speed: 3.65, role: 'wildling', form: 0 },
  'prodigy:0': { name: translate("tactic.prodigy0.name"), speed: 3.92, role: 'prodigy', form: 0 },
};


export const TAC_FIXED_BASES = {
  'toyMerchant:0': { name: translate("tactic.toyMerchant0.name"), speed: 5.74, role: 'toyMerchant', form: 0 },
  'prodigy:1': { name: translate("tactic.prodigy1.name"), speed: 3.8, role: 'prodigy', form: 1 },
};


export const TAC_STATE_NAMES = { run: translate("tactic.run"), walk: translate("movement.states.walk"), crouch: translate("movement.states.crouch"), crawl: translate("movement.states.crawl"),
  role: translate("ui.common.roles"), fixed: translate("tactic.fixed"), custom: translate("application.name"), hunter: translate("characters.camps.hunter") };


export const TAC_TRAIT_BUFFS = {
  survivor: [
    { key: 'sensitivity', role: translate("characters.doctor.name"), name: translate("tactic.sensitivity.name"), mult: 1.45, duration: 2 },
    { key: 'takeNotes', role: translate("characters.lawyer.name"), name: translate("tactic.takeNotes.name"), mult: 1.035 },
    { key: 'illusion', role: translate("characters.magician.name"), name: translate("tactic.illusion.name"), mult: 1.5, duration: 0.87 },
    { key: 'tinyLilliputian', role: translate("characters.explorer.name"), name: translate("tactic.tinyLilliputian.name"), mult: 0.9 },
    { key: 'energyReserves', role: translate("characters.explorer.name"), name: translate("tactic.energyReserves.name"), mult: 1.35, duration: 4 },
    { key: 'tapTapWalk', role: translate("characters.theMindsEye.name"), name: translate("tactic.tapTapWalk.name"), mult: 1.25, states: ['walk'] },
    { key: 'tapTap', role: translate("characters.theMindsEye.name"), name: translate("tactic.tapTap.name"), mult: 1.3, duration: 2, states: ['run'] },
    { key: 'armyBond', role: translate("characters.coordinator.name"), name: translate("tactic.armyBond.name"), mult: 1.05 },
    { key: 'dashFootball', role: translate("characters.forward.name"), name: translate("tactic.dashFootball.name"), mult: 3 },
    { key: 'ridingFullRage', role: translate("characters.wildling.name"), name: translate("tactic.ridingFullRage.name"), mult: 1.33 },
    { key: 'duphrin', role: translate("characters.barmaid.name"), name: translate("items.duphrin.name"), mult: 1.5, duration: 2 },
    { key: 'undergroundSneak', role: translate("characters.graveKeeper.name"), name: translate("tactic.undergroundSneak.name"), mult: 1.1 },
    { key: 'aestheticResonance', role: translate("characters.painter.name"), name: translate("tactic.aestheticResonance.name"), levels: [1.02, 1.04] },
    { key: 'altruism', role: translate("characters.batter.name"), name: translate("tactic.altruism.name"), mult: 1.5, duration: 10 },
    { key: 'landing', role: translate("characters.toyMerchant.name"), name: translate("tactic.landing.name"), mult: 1.3, duration: 2 },
    { key: 'resonance', role: translate("characters.novelist.name"), name: translate("tactic.resonance.name"), mult: 1.5, duration: 2.5 },
    { key: 'rocketDash', role: translate("characters.weepingClown.name"), name: translate("tactic.rocketDash.name"), mult: 1.5 },
    { key: 'firefightingTraining', role: translate("characters.fireInvestigator.name"), name: translate("tactic.firefightingTraining.name"), mult: 1.5, duration: 2 },
    { key: 'smokeScreen', role: translate("characters.escapologist.name"), name: translate("tactic.smokeScreen.name"), mult: 1.35, duration: 1 },
    { key: 'positionProjection', role: translate("characters.lanternist.name"), name: translate("tactic.positionProjection.name"), mult: 1.1 },
    { key: 'stratus', role: translate("characters.meteorologist.name"), name: translate("tactic.stratus.name"), levels: [1.33, 1.77] },
    { key: 'concealedSpin', role: translate("characters.antiquarian.name"), name: translate("tactic.concealedSpin.name"), mult: 1.05 },
    { key: 'tuning', role: translate("characters.composer.name"), name: translate("tactic.tuning.name"), mult: 1.5 },
    { key: 'motivate', role: translate("characters.cheerleader.name"), name: translate("tactic.motivate.name"), mult: 1.7, duration: 4 },
    { key: 'flexibleJoints', role: translate("characters.puppeteer.name"), name: translate("tactic.flexibleJoints.name"), mult: 1.08, duration: 9 },
  ],
  hunter: [
    { key: 'windWings', role: translate("characters.smileyFace.name"), name: translate("items.partWindWing.name"), mult: 1.2, roles: ['smileyFace'], forms: [1, 2, 3] },
    { key: 'fog', role: translate("characters.theRipper.name"), name: translate("tactic.fog.name"), mult: 1.2 },
    { key: 'entangled', role: translate("characters.soulWeaver.name"), name: translate("tactic.entangled.name"), levels: [1.5, 1.9, 2.35] },
    { key: 'followerOutOfRadius', role: translate("characters.dreamWitch.name"), name: translate("tactic.followerOutOfRadius.name"), mult: 1.3, postMult: true, forms: [1] },
    { key: 'slipstream', role: translate("characters.naiad.name"), name: translate("tactic.slipstream.name"), mult: 1.3 },
    { key: 'windwalk', role: translate("characters.nightWatch.name"), name: translate("tactic.windwalk.name"), mult: 1.12 },
    { key: 'heightenedSenses', role: translate("characters.herztier.name"), name: translate("items.heightenedSenses.name"), mult: 1.08, duration: 10 },
  ],
};


export const TAC_TALENT_BUFFS = {
  kneeJerkReflex: { name: translate("tactic.kneeJerkReflex.name"), mult: 1.5, duration: 3, camp: 'survivor' },
  webersLaw: { name: translate("items.webersLaw.name"), levels: [1.1, 1.15, 1.2], duration: 3.5, camp: 'survivor' },
  borrowedTime: {
    name: translate("tactic.borrowedTime.name"), mult: 1.5, duration: 5, camp: 'survivor',
    extra: { name: translate("tactic.extra.name"), mult: 1.05, camp: 'survivor'},
  },
  escape: { name: translate("tactic.escape.name"), levels: [1.03, 1.04, 1.05], camp: 'survivor' },
  wellEarned: { name: translate("tactic.wellEarned.name"), mult: 1.25, duration: 4, camp: 'survivor' },
  mutualSupport: { name: translate("tactic.mutualSupport.name"), levels: [1.04, 1.08], camp: 'survivor' },
  symbioticEffect: { name: translate("tactic.symbioticEffect.name"), levels: [1.06, 1.1], camp: 'survivor' },
  sticker: { name: translate("tactic.sticker.name"), levels: [1.3, 1.6, 1.9], camp: 'survivor', states: ['crawl'] },
  touchEffect: { name: translate("tactic.touchEffect.name"), levels: [1.16, 1.28, 1.4], duration: 1.5, camp: 'survivor' },
  companionEffect: { name: translate("tactic.companionEffect.name"), mult: 1.28, duration: 2, camp: 'survivor' },
  birdcageEffect: { name: translate("tactic.birdcageEffect.name"), mult: 1.1, camp: 'survivor' },
  saviorComplex: { name: translate("tactic.saviorComplex.name"), levels: [1.05, 1.1, 1.15], duration: 3, camp: 'survivor' },
  herdMentality: { name: translate("tactic.herdMentality.name"), levels: [1.04, 1.06, 1.08], camp: 'survivor' },
  empathy: { name: translate("tactic.empathy.name"), mult: 1.14, duration: 12, camp: 'survivor' },
  huntersInstinct: { name: translate("tactic.huntersInstinct.name"), levels: [1.01, 1.015, 1.02], camp: 'hunter' },
  hospitable: { name: translate("tactic.hospitable.name"), levels: [1.04, 1.06, 1.08], camp: 'hunter' },
  wantedOrder: { name: translate("tactic.wantedOrder.name"), levels: [0.98, 0.99, 1], camp: 'hunter' },
  nostalgic: { name: translate("items.nostalgic.name"), mult: 1.1, duration: 14, camp: 'hunter' },
  mock: { name: translate("tactic.mock.name"), levels: [1.03, 1.04, 1.05], camp: 'hunter' },
  carnival: { name: translate("tactic.carnival.name"), levels: [1.03, 1.04, 1.05], duration: 120, camp: 'hunter' },
  hunt: { name: translate("tactic.hunt.name"), mult: 1.1, camp: 'hunter' },
  controlFreak: { name: translate("tactic.controlFreak.name"), mult: 1.1, duration: 3, camp: 'hunter' },
  lingeringMight: { name: translate("tactic.lingeringMight.name"), mult: 1.1, duration: 50, camp: 'hunter' },
  obsession: { name: translate("items.obsession.name"), mult: 1.05, duration: 15, camp: 'hunter' },
};


export const TAC_OTHER_BUFFS = {
  survivor: [
    { key: 'fastMusicbox', name: translate("items.fastMusicbox.name"), levels: [1.15, 1.25, 1.35] },
    { key: 'swarmAround', name: translate("tactic.swarmAround.name"), mult: 1.1 },
    { key: 'urgentLetter', name: translate("tactic.urgentLetter.name"), mult: 1.1, duration: 15 },
    { key: 'farewellLetter', name: translate("tactic.farewellLetter.name"), mult: 1.4, duration: 3 },
    { key: 'cheerful', name: translate("tactic.cheerful.name"), mult: 1.5, duration: 1.3 },
    { key: 'entangled', name: translate("tactic.entangled.nameAlternate"), levels: [0.92, 0.5] },
    { key: 'corruptingBreath', name: translate("tactic.corruptingBreath.name"), mult: 0.7, duration: 3 },
    { key: 'demonNotes', name: translate("tactic.demonNotes.name"), levels: [0.96, 0.92, 0.88] },
    { key: 'peeper', name: translate("items.peeper.name"), mult: 0.94 },
  ],
  hunter: [
    { key: 'slowMusicbox', name: translate("items.slowMusicbox.name"), levels: [0.88, 0.79, 0.7] },
    { key: 'stickyBomb', name: translate("tactic.stickyBomb.name"), mult: 0.7, duration: 5 },
    { key: 'pounce', name: translate("tactic.pounce.name"), mult: 0.65, duration: 2.5 },
  ],
};


export const TAC_ITEM_TYPES = {
  luckyParcel: {
    name: translate("items.luckyParcel.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/af/ob4bthfz0xcdkn40xtl39ox9ksuol8i.png/120px-%E5%B9%B8%E8%BF%90%E5%84%BF%E9%81%93%E5%85%B7.png',
  },
  syringe: {
    name: translate("items.syringe.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/cd/4y6m5sv3phtkfpctx0o653f6o6grlwq.png/120px-%E9%95%87%E9%9D%99%E5%89%82.png',
  },
  map: {
    name: translate("items.map.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/ed/n3gn9ipv1767dsebpc0fje5es04w0ws.png/120px-%E5%BE%8B%E5%B8%88%E9%81%93%E5%85%B7.png',
  },
  flashlight: {
    name: translate("items.flashlight.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 8 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e3/an2z7q5vnl5bcm6q7f6e9c3jboe6bl9.png/120px-%E6%89%8B%E7%94%B5%E7%AD%92.png',
  },
  toolkit: {
    name: translate("items.toolkit.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/02/9pl20myzkes0843oi6d617eupnkzzln.png/120px-%E5%B7%A5%E5%85%B7%E7%AE%B1.png',
  },
  wand: {
    name: translate("items.wand.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/83/4uuq9qpnv9outj01e0b1ch1sqv17i1o.png/120px-%E9%AD%94%E6%A3%92.png',
  },
  gulliversTravels: {
    name: translate("items.gulliversTravels.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/16/efejhb0yhmpztz2a919brwu81lfcn7s.png/120px-%E6%A0%BC%E5%88%97%E4%BD%9B%E6%B8%B8%E8%AE%B0.png',
  },
  elbowPads: {
    name: translate("items.elbowPads.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/23/tgvqrsppifmb5k5q07vyqiavzp9okqb.png/120px-%E9%92%A2%E9%93%81%E6%8A%A4%E8%82%98.png',
  },
  flareGun: {
    name: translate("items.flareGun.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/dd/260vjot3aa02s3h4w1a3101e4xnnqfd.png/120px-%E4%BF%A1%E5%8F%B7%E6%9E%AA.png',
  },
  doll: {
    name: translate("items.doll.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3f/7cj09auhp2fspkqko5awq4dppp39g80.png/90px-%E6%9C%BA%E6%A2%B0%E5%B8%88%E9%81%93%E5%85%B7.png',
  },
  football: {
    name: translate("items.football.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/34/22a119qxfnul75554zw0oq15mvdvyn0.png/120px-%E6%A9%84%E6%A6%84%E7%90%83.png',
  },
  cane: {
    name: translate("items.cane.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d9/d20xdfnt18k56bgsrnwg3zh8u63lv9a.png/120px-%E7%9B%B2%E6%9D%96.png',
  },
  straightPassage: {
    name: translate("items.straightPassage.name"),
    render: 'link',
    linkColor: '#f8fafc',
    linkWidth: 2,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e3/67cz7xprk86w25010iwsz1rb90irsp7.png/90px-%E9%97%A8%E4%B9%8B%E9%92%A5.png',
  },
  ultralongPassage: {
    name: translate("items.ultralongPassage.name"),
    render: 'link',
    linkColor: '#f8fafc',
    linkWidth: 2,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e9/bdkyvpjd6vquuhhl60mlltayqysbolj.png/90px-%E9%97%A8%E4%B9%8B%E9%92%A5_%E8%B6%85%E9%95%BF%E9%80%9A%E9%81%93.png',
  },
  euphoriaPerfume: {
    name: translate("items.euphoriaPerfume.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/07/d5h74pj313guss4ls6lvrzfn9xs9zmt.png/120px-%E5%BF%98%E5%BF%A7%E4%B9%8B%E9%A6%99.png',
  },
  lasso: {
    name: translate("items.lasso.name"),
    maxCount: 1,
    linkToRole: 'cowboy',
    linkMaxM: 15.2,
    linkColor: '#f8fafc',
    linkWidth: 2,
    icon: 'https://patchwiki.biligame.com/images/dwrg/0/08/bt5rd2ca6v9a9v44f4f1rfxtc4yn4zk.png',
  },
  fastMusicbox: {
    name: translate("items.fastMusicbox.name"),
    render: 'circle',
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: { min: 6.3, max: 9 } },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    color: '#f472b6',
    fill: 'rgba(244, 114, 182, 0.22)',
    glow: 'rgba(244, 114, 182, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/85/n0rp6b2j5psgbbffvcgxdgc981i34ts.png/90px-%E8%88%9E%E5%A5%B3%E9%81%93%E5%85%B7.png',
  },
  slowMusicbox: {
    name: translate("items.slowMusicbox.name"),
    render: 'circle',
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: { min: 6.3, max: 9 } },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    color: '#60a5fa',
    fill: 'rgba(96, 165, 250, 0.22)',
    glow: 'rgba(96, 165, 250, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/85/n0rp6b2j5psgbbffvcgxdgc981i34ts.png/90px-%E8%88%9E%E5%A5%B3%E9%81%93%E5%85%B7.png',
  },
  owl: {
    name: translate("items.owl.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f4/sgdqdymhqz2vs63d83rcqraj8w16amv.png/120px-%E5%BD%B9%E9%B8%9F.png',
  },
  coffin: {
    name: translate("items.coffin.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/88/sbbkt166a4ntucdr78whfpvhv1socye.png/90px-%E5%85%A5%E6%AE%93%E5%B8%88%E9%81%93%E5%85%B7.png',
  },
  meteoriteMagnetN: {
    name: translate("items.meteoriteMagnetN.name"),
    render: 'circle',
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 4.5 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    color: '#ef4444',
    fill: 'rgba(239, 68, 68, 0.22)',
    glow: 'rgba(239, 68, 68, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c6/myjspwy5088svioy3ws8iw0dm05ofia.png/90px-%E5%8B%98%E6%8E%A2%E5%91%98%E9%81%93%E5%85%B7.png',
  },
  meteoriteMagnetS: {
    name: translate("items.meteoriteMagnetS.name"),
    render: 'circle',
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 4.5 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    color: '#1d4ed8',
    fill: 'rgba(29, 78, 216, 0.22)',
    glow: 'rgba(29, 78, 216, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c6/myjspwy5088svioy3ws8iw0dm05ofia.png/90px-%E5%8B%98%E6%8E%A2%E5%91%98%E9%81%93%E5%85%B7.png',
  },
  cursedEmblem: {
    name: translate("items.cursedEmblem.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0d/5fx6ovc35w5dao0ujrhb190uyvnd0mp.png/120px-%E7%8C%BF%E7%8C%B4%E5%92%92%E5%83%8F.png',
  },
  wildlingPartner: {
    name: translate("items.wildlingPartner.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/91/o66wfufxbe1jgx8614fw54qieeyml7x.png/120px-%E9%87%8E%E6%80%A7%E4%BC%99%E4%BC%B4.png',
  },
  bomb: {
    name: translate("items.bomb.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/8/8c/ltaw2at60zi7mx3afwdzd2m0qb858qh.png',
  },
  poseidonWatch: {
    name: translate("items.poseidonWatch.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b7/kfypkpcjk8dtc4pq1lrzall2wzviihu.png/120px-%E6%B5%B7%E7%A5%9E%E6%80%80%E8%A1%A8.png',
  },
  duphrin: {
    name: translate("items.duphrin.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5b/d19s0bfdx0qnotkptydfaw4f8wg3oe4.png/120px-%E5%A4%9A%E5%A4%AB%E6%9E%97%E5%BA%95%E9%85%92.png',
  },
  strongDovlin: {
    name: translate("items.strongDovlin.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3f/jpu6baeh2ksxcotujaejh8gmh14xv9l.png/120px-%E7%83%88%E6%80%A7%E5%A4%9A%E5%A4%AB%E6%9E%97.png',
  },
  letter: {
    name: translate("items.letter.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f6/rosmnxacl5g5xpsiphsv75bmbcxobme.png/120px-%E4%BF%A1%E4%BB%B6.png',
  },
  postDog: {
    name: translate("items.postDog.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/ed/fohz3k2zrkhum55m6ypco170bdqdypu.png/120px-%E9%80%81%E4%BF%A1%E7%8A%AC.png',
  },
  shovel: {
    name: translate("items.shovel.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/73/obmza342xyuyb4gwic2tpwwwm9smrnp.png/120px-%E9%93%81%E9%93%B2.png',
  },
  insulatingGloves: {
    name: translate("items.insulatingGloves.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/00/1si78i0yopgcea9exbgjxztdm723o9v.png/120px-%E7%BB%9D%E7%BC%98%E6%89%8B%E5%A5%97.png',
  },
  severeElectricCurrent: {
    name: translate("items.severeElectricCurrent.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0e/dkivpbnay9pkemab2argg44aqufm7hs.png/120px-%E5%BC%BA%E7%94%B5%E6%B5%81.png',
  },
  swarm: {
    name: translate("items.swarm.name"),
    render: 'circle',
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 1.2 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    color: '#d4a373',
    fill: 'rgba(212, 163, 115, 0.22)',
    glow: 'rgba(212, 163, 115, 0.45)',
    pushes: true,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5d/3vmln26rb8aonm2iwnfzyvq3hpo9l9i.png/90px-%E6%98%86%E8%99%AB%E5%AD%A6%E8%80%85%E9%81%93%E5%85%B7.png',
  },
  drawingBoard: {
    name: translate("items.drawingBoard.name"),
    render: 'circle',
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 12 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    color: '#60a5fa',
    fill: 'rgba(96, 165, 250, 0.22)',
    glow: 'rgba(96, 165, 250, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/cc/tpvtb6qirophc1w676xlalljti1w42w.png/90px-%E7%94%BB%E5%AE%B6%E9%81%93%E5%85%B7.png',
  },
  cricketBat: {
    name: translate("items.cricketBat.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.labelAlternate"), card: translate("tactic.show.card"), size_m: { min: 3.73, max: 7.45 } },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7e/19s98s5y8v0pz05ifj94fvyubyjssvd.png/120px-%E5%87%BB%E7%90%83%E6%89%8B%E9%81%93%E5%85%B7.png',
  },
  catapult: {
    name: translate("items.catapult.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 21.9 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/be/q00bu5gdar393rxoi65gjmhpfcko4cl.png/90px-%E7%8E%A9%E5%85%B7%E5%95%86%E9%81%93%E5%85%B71.png',
  },
  whistle: {
    name: translate("items.whistle.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/fc/gnww27qe3kgz7suy0b9k11sc3050svg.png/120px-%E2%80%9C%E5%BF%83%E7%90%86%E5%AD%A6%E5%AE%B6%E2%80%9D%E9%81%93%E5%85%B7.png',
  },
  grapplingHook: {
    name: translate("items.grapplingHook.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/36/jpqijz4szik8gcx77lquf0ausw4zeeu.png/120px-%E7%97%85%E6%82%A3%E9%81%93%E5%85%B7.png',
  },
  sketchBook: {
    name: translate("items.sketchBook.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5b/oum8nsl5cpvaqdq7uoemo5sm249ls2k.png/120px-%E5%B0%8F%E8%AF%B4%E5%AE%B6%E9%81%93%E5%85%B7.png',
  },
  memoryFragment: {
    name: translate("items.memoryFragment.name"),
    
    ranges: { modes: [
      { key: 'shardImpact', label: translate("tactic.shardImpact.label"), card: translate("tactic.shardImpact.card"),
        size_m: { options: [6.1, 10.3], labels: [translate("tactic.sizeM.tacItemTypesZero"), translate("tactic.sizeM.tacItemTypesOne")] } },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f9/asmvxiz04rw0af5of7ic2lzyorwjsz0.png/120px-%E5%9B%9E%E5%BF%86%E7%A2%8E%E7%89%87.png',
  },
  rocket: {
    name: translate("items.rocket.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/d/d4/igscyutpd7sygzjkmxijnavjihx42ht.png',
  },
  scale: {
    name: translate("items.scale.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b5/d4rcr4pkvrw70yv8mhcqij5f8bzkq92.png/90px-%E6%95%99%E6%8E%88%E9%81%93%E5%85%B7.png',
  },
  partDrill: {
    name: translate("items.partDrill.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c6/3rm7g6xp5vugw5ru40ccyop6kig37ll.png',
  },
  partWindWing: {
    name: translate("items.partWindWing.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c6/3rm7g6xp5vugw5ru40ccyop6kig37ll.png',
  },
  partPropeller: {
    name: translate("items.partPropeller.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c6/3rm7g6xp5vugw5ru40ccyop6kig37ll.png',
  },
  mechanicalFlute: {
    name: translate("items.mechanicalFlute.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/58/osytykpscd59ewg0n2w83oqqe98hvms.png/90px-%E5%8F%A4%E8%91%A3%E5%95%86%E9%81%93%E5%85%B7.png',
  },
  tuningFork: {
    name: translate("items.tuningFork.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/8/8b/rbsdnqidb6vsujgtxzhvhjj38r1r6b3.png',
  },
  camera: {
    name: translate("items.camera.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/aa/dvu1rkgsnz3sn7niwjn0sj4c0q0qtxg.png/120px-%E8%AE%B0%E8%80%85%E9%81%93%E5%85%B7.png',
  },
  jetpack: {
    name: translate("items.jetpack.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/6e/aqdnbg7aq11lbi4mubphuvwgrhji0cd.png/120px-%E9%A3%9E%E8%A1%8C%E5%AE%B6%E9%81%93%E5%85%B7.png',
  },
  pompoms: {
    name: translate("items.pompoms.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/ab/5s8o1cg0zk9ysp3mnm9tkeomz8uznjf.png/120px-%E6%8B%89%E6%8B%89%E9%98%9F%E5%91%98%E9%81%93%E5%85%B7.png',
  },
  louis: {
    name: translate("items.louis.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/50/eaxbgojlp5fz2y6nxrowk0dwi44ikmf.png/120px-%E2%80%9C%E8%B7%AF%E6%98%93%E2%80%9D.png',
  },
  airbag: {
    name: translate("items.airbag.name"),
    render: 'circle',
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 4.2 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    color: '#f8fafc',
    fill: 'rgba(248, 250, 252, 0.22)',
    glow: 'rgba(248, 250, 252, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7b/1jxsg19mhdmhk4iy1n5jzbd13qacdul.png/90px-%E7%81%AB%E7%81%BE%E8%B0%83%E6%9F%A5%E5%91%98%E9%81%93%E5%85%B7.png',
  },
  aromatherapyCane: {
    name: translate("items.aromatherapyCane.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5d/5od6849sin7d6e7kegpexjfezdbubzo.png/120px-%E9%A6%99%E8%96%B0%E6%89%8B%E6%9D%96.png',
  },
  helmet: {
    name: translate("items.helmet.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3f/2srn3jrzo5atz18iopcn7430wridv6n.png/120px-%E2%80%9C%E9%AA%91%E5%A3%AB%E2%80%9D%E9%81%93%E5%85%B7.png',
  },
  stormGlassRainfall: {
    name: translate("items.stormGlassRainfall.name"),
    render: 'circle',
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 4 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    color: '#f8fafc',
    fill: 'rgba(248, 250, 252, 0.22)',
    glow: 'rgba(248, 250, 252, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/ae/fxa05k9lw4ubsk94yolnc6osfo327qr.png/90px-%E5%A4%A9%E6%B0%94%E7%93%B6.png',
  },
  keelBow: {
    name: translate("items.keelBow.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/17/72onpht7012kcr7evkru8y978r0t8yk.png/120px-%E5%BC%93%E7%AE%AD%E6%89%8B%E9%81%93%E5%85%B71.png',
  },
  crossBow: {
    name: translate("items.crossBow.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/06/n82qspoynhryogp57gew3x4y551wnyh.png/120px-%E5%BC%93%E7%AE%AD%E6%89%8B%E9%81%93%E5%85%B72.png',
  },
  thurible: {
    name: translate("items.thurible.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 16.9 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c2/2w71hgyr6ozvswrc8fvzz14gaxh27ng.png/90px-%E8%BF%B7%E7%83%9F%E7%82%89.png',
  },
  projectionLanternLivingImage: {
    name: translate("items.projectionLanternLivingImage.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/68/jrtuitxf11kf9gliflsgogw269fn0xk.png/120px-%E5%B9%BB%E7%81%AF%E4%BB%AA_%E4%BA%BA%E7%89%A9%E6%8A%95%E5%BD%B1.png',
  },
  projectionLanternStaticProjection: {
    name: translate("items.projectionLanternStaticProjection.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e0/b484rmtnnaxuuem8qs7j223430paaui.png/120px-%E5%B9%BB%E7%81%AF%E4%BB%AA_%E9%9D%99%E7%89%A9%E6%8A%95%E5%BD%B1.png',
  },
  muleta: {
    name: translate("items.muleta.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7f/ox395f4ntj1h4t9i04uatoneu35zyz3.png/120px-%E6%96%97%E7%89%9B%E5%A3%AB%E9%81%93%E5%85%B71.png',
  },
  propUmbrellaAnxiousRoutine: {
    name: translate("items.propUmbrellaAnxiousRoutine.name"),
    render: 'circle',
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 12.7 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    color: '#18181b',
    fill: 'rgba(24, 24, 27, 0.22)',
    glow: 'rgba(24, 24, 27, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/49/os2khk79tu1tnvnxohhtq7vvt6xa3xe.png/90px-%E9%BB%98%E5%89%A7%E8%89%BA%E4%BA%BA%E9%81%93%E5%85%B7.png',
  },
  hamster: {
    name: translate("items.hamster.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/32/7dcfplvn8p83ewanw29b8bttsb8o0q4.png/120px-%E2%80%9C%E7%A5%9E%E7%AB%A5%E2%80%9D%E9%81%93%E5%85%B7.png',
  },
  phantom: {
    name: translate("items.phantom.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c6/rfu060f3aed5z8y5gz19d58irffzby8.png/90px-%E5%8E%82%E9%95%BF0%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  puppet1: {
    name: translate("items.puppet1.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/a6/cdnjdljtwds6ly62lzyytmb6v84omae.png/90px-%E5%8E%82%E9%95%BF1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  puppet2: {
    name: translate("items.puppet2.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/a6/cdnjdljtwds6ly62lzyytmb6v84omae.png/90px-%E5%8E%82%E9%95%BF1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  lianzhua: {
    name: translate("items.lianzhua.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.labelThird"), card: translate("application.card"), size_m: 4.2 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    maxCount: 1,
    linkToRole: 'gameKeeper',
    linkMaxM: 16.9,
    linkColor: '#f8fafc',
    linkWidth: 2,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f3/pqa6vwrrdj0jzf4foko5zqm0uygn4rf.png/90px-%E9%B9%BF%E5%A4%B40%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  trap: {
    name: translate("items.trap.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.labelFourth"), card: translate("application.card"), size_m: 20 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/dd/40u7gtj5cvffk3e4dy5edl1ntd56kdh.png/90px-%E9%B9%BF%E5%A4%B40%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  umbrella: {
    name: translate("items.umbrella.name"),
    render: 'circle',
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 9.3 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    maxCount: 1,           
    linkToRole: 'wuchang', 
    linkMaxM: 84.4,        
    linkColor: '#f8fafc',
    linkWidth: 2,
    color: '#22c55e',
    fill: 'rgba(34, 197, 94, 0.22)',
    glow: 'rgba(34, 197, 94, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3f/98f3qxkbtphouvvzglqleqnf00t5mlv.png/90px-%E5%AE%BF%E4%BC%9E%E4%B9%8B%E9%AD%820%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  follower: {
    name: translate("items.follower.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/d/d3/ers6mddb9wt8i5nnojwsvnm1tveyxv0.png',
  },
  witchMark: {
    name: translate("items.witchMark.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/2f/80u76g7virvqtdi3roi8go36cpa3rxy.png',
  },
  hiddenDream: {
    name: translate("items.hiddenDream.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 20 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/3/33/265axozop5uoe1opp2e6gj8noxlby8e.png',
  },
  peacefulPine: {
    name: translate("items.peacefulPine.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 20.5 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/29/00c30uaryazol4s5ec4iuk19kr773o2.png/90px-%E7%88%B1%E5%93%AD%E9%AC%BC2%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  spearfishing: {
    name: translate("items.spearfishing.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 4 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/be/3b3skletdo6z31k2wti92rsxisja1tg.png/90px-%E6%B8%94%E5%A5%B30%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  hieroglyphicGraveyard: {
    name: translate("items.hieroglyphicGraveyard.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 26 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/d/d1/dqvmem9kl2u7mpz88bgrlwhgti6cac8.png',
  },
  nailBoard: {
    name: translate("items.nailBoard.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/fb/069n3cm9y1pgho74g25jbgsnaqilrjx.png/120px-%E7%A0%B4%E8%BD%AE0%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  electromagneticFieldN: {
    name: translate("items.electromagneticFieldN.name"),
    render: 'circle',
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 4.5 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    color: '#ef4444',
    fill: 'rgba(239, 68, 68, 0.22)',
    glow: 'rgba(239, 68, 68, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/69/sktrgc7dzmstt8bsbokywfq0jmzshg2.png',
  },
  electromagneticFieldS: {
    name: translate("items.electromagneticFieldS.name"),
    render: 'circle',
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 4.5 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    color: '#1d4ed8',
    fill: 'rgba(29, 78, 216, 0.22)',
    glow: 'rgba(29, 78, 216, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/69/sktrgc7dzmstt8bsbokywfq0jmzshg2.png',
  },
  yithian: {
    name: translate("items.yithian.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/bd/9fsij05z733x1stahpjarmbgur876op.png/90px-%E6%97%B6%E7%A9%BA%E4%B9%8B%E5%BD%B10%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  corruptedOstracon: {
    name: translate("items.corruptedOstracon.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 9 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/35/6tyw4qniiw51aohhjwxjv4wq8yj28ud.png/90px-%E6%97%B6%E7%A9%BA%E4%B9%8B%E5%BD%B10%E9%98%B6%E6%8A%80%E8%83%BD4.png',
  },
  ancientVisage: {
    name: translate("items.ancientVisage.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 9 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/d/da/c2qmk7cs5shwl528wzkkmma6i2v8ael.png',
  },
  contactPoint: {
    name: translate("items.contactPoint.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 3 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c6/t5t9qmg4vouffmvsxnzq6mizonmjzvr.png',
  },
  cueBall: {
    name: translate("items.cueBall.name"),
    render: 'circle',
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 4 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    color: '#18181b',
    fill: 'rgba(24, 24, 27, 0.22)',
    glow: 'rgba(24, 24, 27, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/67/t7auxaxdhzzis13n6qnl24dciluiddd.png',
  },
  cage: {
    name: translate("items.cage.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: { options: [9, 12, 15] } },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/67/kqp54mjbpln0aytlr986ko5j4y7cy4t.png/90px-%E2%80%9C%E8%B7%9B%E8%84%9A%E7%BE%8A%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  bestialAwakening: {
    name: translate("items.bestialAwakening.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 48 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/8/89/agxycu6xg1opqj3xo7tpix753cvfkzz.png',
  },
  heightenedSenses: {
    name: translate("items.heightenedSenses.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 25 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/91/hu0fnv6ev967sdypg7bgso8f6ch8jzr.png/90px-%E2%80%9C%E5%BF%83%E5%85%BD%E2%80%9D1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  peeper: {
    name: translate("items.peeper.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 13 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/ba/4sgjzcxl8526632orcqqgwkt5pv9s4f.png',
  },
  warp: {
    name: translate("items.warp.name"),
    render: 'link',
    linkColor: '#f8fafc',
    linkWidth: 2,
    linkMaxM: 60,
    icon: 'https://patchwiki.biligame.com/images/dwrg/f/f5/lqbsf4hruktmy7b6m454ya5efebmmg7.png',
  },
  fearRadius: {
    name: translate("items.fearRadius.name"),
    
    
    
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 32,
        fearMods: {
          hunter: [['hunter', translate("characters.camps.hunter"), 1], ['beauty', translate("tactic.fearMods.tacItemTypesOne"), 0.8], ['prajna', translate("tactic.fearMods.tacItemTypesOneAlternate"), 1.1]],
          survivor: [['survivor', translate("characters.camps.survivor"), 1], ['prisoner', translate("tactic.fearMods.tacItemTypesOneThird"), 0.8], ['archer', translate("tactic.fearMods.tacItemTypesOneFourth"), 0.76]],
        } },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/24/dv1pstoj7a8ftqf9l3jazt1cpe4sxwo.png',
  },
  webersLaw: {
    name: translate("items.webersLaw.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 18 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/28/4opnhwv5mnc78m81u6ulz3t2b50yhxj.png',
  },
  sneak: {
    name: translate("items.sneak.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 22 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/1/13/o8d12vi02km7ozis0f2io312tsynodg.png',
  },
  tinnitus: {
    name: translate("items.tinnitus.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 36 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/f/f5/2546goc080xvxx8kde4sk2h1vry3k4n.png',
  },
  addiction: {
    name: translate("items.addiction.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 20 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/e/eb/flp1movyr3427678u7a854cde31icqk.png',
  },
  nostalgic: {
    name: translate("items.nostalgic.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 32 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/e/ef/80q87s7z71ecm5yhz07bd9lo3hs1g8c.png',
  },
  skittish: {
    name: translate("items.skittish.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 12 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/0/0c/dmvkzw1a11nxskx0hhoq6bnfslsvw9c.png',
  },
  deerHunt: {
    name: translate("items.deerHunt.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 18 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/b7/d9ojgfgmihbwmaw6vkmbg96it0s2eb3.png',
  },
  streetSweeper: {
    name: translate("items.streetSweeper.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: { options: [30, 45, 60] } },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/bd/re4lu3k5iknzh748yg85tcdvla2b0t2.png',
  },
  obsession: {
    name: translate("items.obsession.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 16 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/6b/ra1r6rk9depicpmew855rzug25sy8ut.png',
  },
  famine: {
    name: translate("items.famine.name"),
    ranges: { modes: [
      { key: 'show', label: translate("tactic.show.label"), card: translate("application.card"), size_m: 16 },
      { key: 'off', label: translate("tactic.off.label") },
    ] },
    icon: 'https://patchwiki.biligame.com/images/dwrg/4/45/73txs9wv78r9rrh0ghil23wf6tx4c3s.png',
  },
};


export const TAC_ROLES = {
  lukcy: {
    name: translate("characters.lukcy.name"),
    camp: 'survivor',
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
      modes: [
        { key: 'show1', label: translate("tactic.show1.label"), card: translate("tactic.show1.card"), size_m: 8 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['flashlight'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/29/1ng3fsmkec1slkxdgtwg5pv2b69w0n4.png/90px-%E2%80%9C%E6%85%88%E5%96%84%E5%AE%B6%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  gardener: {
    name: translate("characters.gardener.name"),
    camp: 'survivor',
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
      modes: [
        { key: 'show1', label: translate("tactic.show1.labelAlternate"), card: translate("tactic.show1.cardAlternate"), size_m: 60 },
        { key: 'show2', label: translate("tactic.show2.label"), card: translate("tactic.show2.card"), size_m: 70 },
        { key: 'off', label: translate("tactic.off.label") },
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
      modes: [
        { key: 'show1', label: translate("tactic.show1.labelThird"), card: translate("tactic.show1.cardThird"), size_m: 10 },
        { key: 'off', label: translate("tactic.off.label") },
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
      modes: [
        { key: 'perspectiveOutline', label: translate("tactic.perspectiveOutline.label"), card: translate("tactic.perspectiveOutline.card"), size_m: 25.3 },
        { key: 'soundWaveSlow', label: translate("tactic.soundWaveSlow.label"), card: translate("tactic.soundWaveSlow.card"),
          size_m: { options: [6.8, 25.3],
            labels: [translate("tactic.sizeM.tacRolesZero"), translate("tactic.sizeM.tacRolesOne")] } },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['cane'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d8/qvgdwg0j78wq87wwueb2o5h3s5uduy3.png/90px-%E7%9B%B2%E5%A5%B3%E5%A4%B4%E5%83%8F.png',
  },
  priestess: {
    name: translate("characters.priestess.name"),
    camp: 'survivor',
    items: ['straightPassage','ultralongPassage'],
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
      modes: [
        { key: 'show1', label: translate("tactic.show1.labelFourth"), card: translate("tactic.show1.cardFourth"), size_m: 15.2 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['lasso'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0f/6g0s5afin66fseijjq4kqwo2hmx6kae.png/90px-%E7%89%9B%E4%BB%94%E5%A4%B4%E5%83%8F.png',
  },
  femaleDancer: {
    name: translate("characters.femaleDancer.name"),
    camp: 'survivor',
    ranges: {
      modes: [
        { key: 'show1', label: translate("tactic.show1.labelFifth"), card: translate("tactic.show1.cardFifth"), size_m: 8.44 },
        { key: 'off', label: translate("tactic.off.label") },
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
      modes: [
        { key: 'show1', label: translate("tactic.show1.labelSixth"), card: translate("tactic.show1.cardSixth"), size_m: 14.5 },
        { key: 'show2', label: translate("tactic.show2.labelAlternate"), card: translate("tactic.show2.cardAlternate"), size_m: 18 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['meteoriteMagnetN', 'meteoriteMagnetS'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8d/1mes1uvmogs9veklzk3ieep2i5y7evt.png/90px-%E5%8B%98%E6%8E%A2%E5%91%98%E5%A4%B4%E5%83%8F.png',
  },
  enchantress: {
    name: translate("characters.enchantress.name"),
    camp: 'survivor',
    ranges: {
      modes: [
        { key: 'cursedEmblemParalyze', label: translate("tactic.cursedEmblemParalyze.label"), card: translate("tactic.cursedEmblemParalyze.card"), size_m: 5.1 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['cursedEmblem'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/61/ezw8a4g51y9o4zufeug2rbeemzmdzs5.png/90px-%E5%92%92%E6%9C%AF%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  wildling: {
    name: translate("characters.wildling.name"),
    camp: 'survivor',
    ranges: {
      modes: [
        { key: 'show1', label: translate("tactic.show1.labelSeventh"), card: translate("tactic.show1.cardSeventh"),
          size_m: { options: [15, 17],
            labels: [translate("tactic.sizeM.tacRolesZeroAlternate"), translate("tactic.sizeM.tacRolesOneAlternate")] } },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['wildlingPartner'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b0/qix27d33osv7o1ti0g244pf7xzp8d0x.png/90px-%E9%87%8E%E4%BA%BA%E5%A4%B4%E5%83%8F.png',
  },
  acrobat: {
    name: translate("characters.acrobat.name"),
    camp: 'survivor',
    ranges: {
      modes: [
        { key: 'show1', label: translate("tactic.show1.labelEighth"), card: translate("tactic.show1.cardEighth"),
          size_m: { options: [4, 7.5, 12],
            labels: [translate("tactic.sizeM.tacRolesZeroThird"), translate("tactic.sizeM.tacRolesOneThird"), translate("tactic.sizeM.tacRolesTwo")] } },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['bomb'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c4/c6whxfr6ba7v3pv5xcskfvv0rvgt4e8.png/90px-%E6%9D%82%E6%8A%80%E6%BC%94%E5%91%98%E5%A4%B4%E5%83%8F.png',
  },
  firstOfficer: {
    name: translate("characters.firstOfficer.name"),
    camp: 'survivor',
    ranges: {
      modes: [
        { key: 'poseidonWatchHypnotize', label: translate("tactic.poseidonWatchHypnotize.label"), card: translate("tactic.poseidonWatchHypnotize.card"), size_m: 27 },
        { key: 'off', label: translate("tactic.off.label") },
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
      modes: [
        { key: 'cursedEmblemParalyze', label: translate("tactic.cursedEmblemParalyze.labelAlternate"), card: translate("tactic.cursedEmblemParalyze.cardAlternate"), size_m: 16.9 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['letter', 'postDog'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d7/mhxuubsfzzp0yxdeilggtix32euxgf4.png/90px-%E9%82%AE%E5%B7%AE%E5%A4%B4%E5%83%8F.png',
  },
  graveKeeper: {
    name: translate("characters.graveKeeper.name"),
    camp: 'survivor',
    ranges: {
      modes: [
        { key: 'severeElectricCurrent', label: translate("tactic.severeElectricCurrent.label"), card: translate("tactic.severeElectricCurrent.card"), size_m: 9.7 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['shovel'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5c/dc57y6fvws61am1wmtpnqjzbeu0pnmy.png/90px-%E5%AE%88%E5%A2%93%E4%BA%BA%E5%A4%B4%E5%83%8F.png',
  },
  prisoner: {
    name: translate("characters.prisoner.name"),
    camp: 'survivor',
    ranges: {
      modes: [
        { key: 'severeElectricCurrent', label: translate("tactic.severeElectricCurrent.labelAlternate"), card: translate("tactic.severeElectricCurrent.cardAlternate"), size_m: 5.9 },
        { key: 'off', label: translate("tactic.off.label") },
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
      modes: [
        { key: 'show1', label: translate("tactic.show1.labelNinth"), card: translate("tactic.show1.cardNinth"), size_m: 15.2 },
        { key: 'off', label: translate("tactic.off.label") },
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
      modes: [
        { key: 'subjectiveAnchoring', label: translate("tactic.subjectiveAnchoring.label"), card: translate("tactic.subjectiveAnchoring.card"), size_m: 13 },
        { key: 'bond', label: translate("tactic.bond.label"), card: translate("tactic.bond.card"), size_m: 13 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['whistle'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e4/bqml61178c80rz5gd4m6rjyejqfjuw2.png/90px-%E2%80%9C%E5%BF%83%E7%90%86%E5%AD%A6%E5%AE%B6%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  patient: {
    name: translate("characters.patient.name"),
    camp: 'survivor',
    ranges: {
      modes: [
        { key: 'bond', label: translate("tactic.bond.label"), card: translate("tactic.bond.card"), size_m: 13 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['grapplingHook'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/63/3ihjylgclyicqv0c9xxhw3lg6ccrzts.png/90px-%E7%97%85%E6%82%A3%E5%A4%B4%E5%83%8F.png',
  },
  novelist: {
    name: translate("characters.novelist.name"),
    camp: 'survivor',
    ranges: {
      modes: [
        { key: 'metaphor', label: translate("tactic.metaphor.label"), card: translate("tactic.metaphor.card"),
          size_m: { options: [13.5, 9.8],
            labels: [translate("tactic.sizeM.tacRolesZeroFourth"), translate("tactic.sizeM.tacRolesOneFourth")] } },
        { key: 'off', label: translate("tactic.off.label") },
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
      modes: [
        { key: 'show', label: translate("tactic.show.labelFifth"), card: translate("tactic.show.cardAlternate"),
          size_m: { options: [6, 3],
            labels: [translate("tactic.sizeM.tacRolesZeroFifth"), translate("tactic.sizeM.tacRolesOneFifth")] } },
        { key: 'off', label: translate("tactic.off.label") },
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
      modes: [
        { key: 'cangFeng', label: translate("tactic.cangFeng.label"), card: translate("tactic.cangFeng.card"),
          size_m: { options: [4.9, 3.5, 4.7],
            labels: [translate("tactic.sizeM.tacRolesZeroSixth"), translate("tactic.sizeM.tacRolesOneSixth"), translate("tactic.sizeM.tacRolesTwoAlternate")] } },
        { key: 'cangZhuo', label: translate("tactic.cangZhuo.label"), card: translate("tactic.cangZhuo.card"), size_m: 12.7 },
        { key: 'off', label: translate("tactic.off.label") },
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
      modes: [
        { key: 'phantomPlacement', label: translate("tactic.phantomPlacement.label"), card: translate("tactic.phantomPlacement.card"), size_m: 15 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['camera'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/be/fiibeyy2dkxlkbexfvoxjb7nszh3b4d.png/90px-%E8%AE%B0%E8%80%85%E5%A4%B4%E5%83%8F.png',
  },
  aeroplanist: {
    name: translate("characters.aeroplanist.name"),
    camp: 'survivor',
    ranges: {
      modes: [
        { key: 'show1', label: translate("tactic.show1.labelTenth"), card: translate("tactic.show1.cardTenth"), size_m: 18.5 },
        { key: 'show2', label: translate("tactic.show2.labelThird"), card: translate("tactic.show2.cardThird"), size_m: 12.7 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['jetpack'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/11/pkpubifvltwi4g20xgegmmfr5hp0w7e.png/90px-%E9%A3%9E%E8%A1%8C%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  cheerleader: {
    name: translate("characters.cheerleader.name"),
    camp: 'survivor',
    ranges: {
      modes: [
        { key: 'inspire', label: translate("tactic.inspire.label"), card: translate("tactic.inspire.card"), size_m: 20 },
        { key: 'off', label: translate("tactic.off.label") },
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
      modes: [
        { key: 'airbagSpray', label: translate("tactic.airbagSpray.label"), card: translate("tactic.airbagSpray.card"),
          size_m: { options: [4.2, 12.64],
            labels: [translate("tactic.sizeM.tacRolesZeroSeventh"), translate("tactic.sizeM.tacRolesOneSeventh")] } },
        { key: 'off', label: translate("tactic.off.label") },
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
      modes: [
        { key: 'conceal', label: translate("tactic.conceal.label"), card: translate("tactic.conceal.card"), size_m: 18 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['aromatherapyCane'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f0/04o60ry6yqz28mfqd98eo2pwm5s2rpl.png/90px-%E2%80%9C%E6%B3%95%E7%BD%97%E5%A5%B3%E5%A3%AB%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  knight: {
    name: translate("characters.knight.name"),
    camp: 'survivor',
    ranges: {
      modes: [
        { key: 'tacticalForesight', label: translate("tactic.tacticalForesight.label"), card: translate("tactic.tacticalForesight.card"), size_m: 13 },
        { key: 'honorResonance', label: translate("tactic.honorResonance.label"), card: translate("tactic.honorResonance.card"), size_m: 7 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['helmet'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/97/10yk7nm7qb4focpftij0jl8d4y15itk.png/90px-%E2%80%9C%E9%AA%91%E5%A3%AB%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  meteorologist: {
    name: translate("characters.meteorologist.name"),
    camp: 'survivor',
    ranges: {
      modes: [
        { key: 'warmRain', label: translate("tactic.warmRain.label"), card: translate("tactic.warmRain.card"), size_m: 32 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['stormGlassRainfall'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d1/31tsfob5vzra69oorilz2powtnzcaxj.png/90px-%E6%B0%94%E8%B1%A1%E5%AD%A6%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  archer: {
    name: translate("characters.archer.name"),
    camp: 'survivor',
    ranges: {
      modes: [
        { key: 'dragonBoneBow', label: translate("tactic.dragonBoneBow.label"), card: translate("tactic.dragonBoneBow.card"),
          size_m: { options: [18, 12],
            labels: [translate("tactic.sizeM.tacRolesZeroEighth"), translate("tactic.sizeM.tacRolesOneEighth")] } },
        { key: 'armCrossbow', label: translate("tactic.armCrossbow.label"), card: translate("tactic.armCrossbow.card"), size_m: 4.5 },
        { key: 'off', label: translate("tactic.off.label") },
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
      modes: [
        { key: 'muletaDash', label: translate("tactic.muletaDash.label"), card: translate("tactic.muletaDash.card"), size_m: 6 },
        { key: 'muletaSweep', label: translate("tactic.muletaSweep.label"), card: translate("tactic.muletaSweep.card"), size_m: 2.25 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['muleta'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/ce/sj6wwgwa3uqsi94yw71dsh3bbab1l54.png/90px-%E6%96%97%E7%89%9B%E5%A3%AB%E5%A4%B4%E5%83%8F.png',
  },
  mimeArtist: {
    name: translate("characters.mimeArtist.name"),
    camp: 'survivor',
    ranges: {
      modes: [
        { key: 'emotionAccumulation', label: translate("tactic.emotionAccumulation.label"), card: translate("tactic.emotionAccumulation.card"), size_m: 20.3 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['propUmbrellaAnxiousRoutine'],
    maxItems: 3,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b4/ezpalvrvblo048p3uaf9ejyqlggq095.png/90px-%E9%BB%98%E5%89%A7%E8%89%BA%E4%BA%BA%E5%A4%B4%E5%83%8F.png',
  },
  prodigy: {
    name: translate("characters.prodigy.name"),
    camp: 'survivor',
    items: ['hamster'],
    speed: { [translate("tactic.speed.tacRoles")]: 3.92, [translate("tactic.speed.tacRolesAlternate")]: 3.8 },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/08/ejzgnfep2tdh21cx73mskh1svrj4uur.png/90px-%E2%80%9C%E7%A5%9E%E7%AB%A5%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  hellEmber: {
    name: translate("characters.hellEmber.name"),
    camp: 'hunter',
    speed: 4.73,
    ranges: {
      modes: [
        { key: 'emotionAccumulation', label: translate("tactic.emotionAccumulation.labelAlternate"), card: translate("tactic.emotionAccumulation.cardAlternate"), size_m: { min: 0, max: 55 } },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    items: ['phantom','puppet1','puppet2'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/43/9ji6s1uz7c0dnn0r70zxv4a3cx67xm2.png/90px-%E5%8E%82%E9%95%BF%E5%A4%B4%E5%83%8F.png',
  },
  smileyFace: {
    name: translate("characters.smileyFace.name"),
    camp: 'hunter',
    speed: { [translate("characters.smileyFace.name")]: 4.56, [translate("tactic.speed.tacRolesThird")]: 7.07, [translate("tactic.speed.tacRolesFourth")]: 7.39, [translate("tactic.speed.tacRolesFifth")]: 9.12 },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/55/ob4f8gqvpcfw0sarr5ule5mpmzxby7l.png/90px-%E5%B0%8F%E4%B8%91%E5%A4%B4%E5%83%8F.png',
  },
  gameKeeper: {
    name: translate("characters.gameKeeper.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['lianzhua', 'trap'],
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
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/97/dpvb1d7e4f03tqh9s0l0ulua91ouuab.png/90px-%E8%9C%98%E8%9B%9B%E5%A4%B4%E5%83%8F.png',
  },
  Geisha: {
    name: translate("characters.geisha.name"),
    camp: 'hunter',
    speed: { [translate("tactic.speed.tacRolesSixth")]: 4.73, [translate("tactic.speed.tacRolesSeventh")]: 4.56 },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/bd/qcstapls4hnm6fckekl6l6890h19vst.png/90px-%E7%BA%A2%E8%9D%B6%E5%A4%B4%E5%83%8F.png',
  },
  theFeaster: {
    name: translate("characters.theFeaster.name"),
    camp: 'hunter',
    speed: 4.64,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/30/3yr81lwbegfcgotyiis8yknwc2224is.png/90px-%E9%BB%84%E8%A1%A3%E4%B9%8B%E4%B8%BB%E5%A4%B4%E5%83%8F.png',
  },
  wuchang: {
    name: translate("characters.wuchang.name"),
    camp: 'hunter',
    speed: { [translate("tactic.speed.tacRolesEighth")]: 4.73, [translate("tactic.speed.tacRolesNinth")]: 4.56 },
    items: ['umbrella'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/2a/gd5yd3hfaohhj2pozgqf2cfivpadbn6.png/90px-%E5%AE%BF%E4%BC%9E%E4%B9%8B%E9%AD%82%E5%A4%B4%E5%83%8F.png',
  },
  photographer: {
    name: translate("characters.photographer.name"),
    camp: 'hunter',
    speed: 4.64,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c6/rmzvfbp2mi0ucb13xcj6t6dzgd41tlz.png/90px-%E6%91%84%E5%BD%B1%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  madEyes: {
    name: translate("characters.madEyes.name"),
    camp: 'hunter',
    speed: 4.64,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/4a/kybq2j420o43mr2b0wi5qy4wgtmq65k.png/90px-%E7%96%AF%E7%9C%BC%E5%A4%B4%E5%83%8F.png',
  },
  dreamWitch: {
    
    ranges: {
      modes: [
        { key: 'followerControl', label: translate("tactic.followerControl.label"), card: translate("tactic.followerControl.card"),
          size_m: { options: [42.2, 59.1],
            labels: [translate("tactic.sizeM.tacRolesZeroNinth"), translate("tactic.sizeM.tacRolesOneNinth")] } },
        { key: 'hiddenDream', label: translate("tactic.hiddenDream.label"), card: translate("tactic.hiddenDream.card"), size_m: 20 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    name: translate("characters.dreamWitch.name"),
    camp: 'hunter',
    speed: { [translate("tactic.speed.tacRolesTenth")]: 6.08, [translate("items.follower.name")]: 4.56 },
    items: ['follower', 'witchMark', 'hiddenDream'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/6c/igl4l2j95ftovgiv85sdeidapbse4gu.png/90px-%E6%A2%A6%E4%B9%8B%E5%A5%B3%E5%B7%AB%E5%A4%B4%E5%83%8F.png',
  },
  axeBoy: {
    name: translate("characters.axeBoy.name"),
    camp: 'hunter',
    speed: 4.56,
    items: ['peacefulPine'],
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
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/93/5sfpytt0vm3cjq75sr912v6eaxzqh7z.png/90px-%E7%BA%A2%E5%A4%AB%E4%BA%BA%E5%A4%B4%E5%83%8F.png',
  },
  guard26: {
    name: translate("characters.guard26.name"),
    camp: 'hunter',
    speed: 4.64,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/bf/jycs4x41s0qky58o3pfprwwz9fpvr54.png/90px-26%E5%8F%B7%E5%AE%88%E5%8D%AB%E5%A4%B4%E5%83%8F.png',
  },
  disciple: {
    name: translate("characters.disciple.name"),
    camp: 'hunter',
    speed: 4.73,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/fa/hbvpsmvnox9azfb2kj93nsmbv2a350r.png/90px-%E2%80%9C%E4%BD%BF%E5%BE%92%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  violinist: {
    name: translate("characters.violinist.name"),
    camp: 'hunter',
    speed: 4.64,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0a/7mjm285tyi076r96jb62rl469no2wn2.png/90px-%E5%B0%8F%E6%8F%90%E7%90%B4%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  sculptor: {
    name: translate("characters.sculptor.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['hieroglyphicGraveyard'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/6a/b3mgw309lp8v5sqfzvrfroizdijrv50.png/90px-%E9%9B%95%E5%88%BB%E5%AE%B6%E5%A4%B4%E5%83%8F.png',
  },
  undead: {
    name: translate("characters.undead.name"),
    camp: 'hunter',
    speed: 4.73,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b7/6bjonfiuioth8cvmi8vvfae13ii1f3d.png/90px-%E2%80%9C%E5%8D%9A%E5%A3%AB%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  theBreakingWheel: {
    name: translate("characters.theBreakingWheel.name"),
    camp: 'hunter',
    speed: { [translate("tactic.speed.tacRolesEleventh")]: 4.64, [translate("tactic.speed.tacRolesTwelfth")]: 10.13 },
    items: ['nailBoard'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b4/a9kc3enyzxn84eu29l6lxszhvs3lhaf.png/90px-%E7%A0%B4%E8%BD%AE%E5%A4%B4%E5%83%8F.png',
  },
  Naiad: {
    name: translate("characters.naiad.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['spearfishing'],
    maxItems: 1,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/dc/dah1qypfv56191rerxkkvdytfvki1jh.png/90px-%E6%B8%94%E5%A5%B3%E5%A4%B4%E5%83%8F.png',
  },
  waxArtist: {
    name: translate("characters.waxArtist.name"),
    camp: 'hunter',
    speed: 4.73,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/04/taokr9xvuhc9tlo57yedyyi08tdh90f.png/90px-%E8%9C%A1%E5%83%8F%E5%B8%88%E5%A4%B4%E5%83%8F.png',
  },
  nightmare: {
    name: translate("characters.nightmare.name"),
    camp: 'hunter',
    speed: 4.64,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8f/ea16nemw9m7j8rvj3sg1nm89jh44e7u.png/90px-%E2%80%9C%E5%99%A9%E6%A2%A6%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  clerk: {
    name: translate("characters.clerk.name"),
    camp: 'hunter',
    speed: 4.73,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/ac/3wfd3yosh529sx4uxfxu0hq9qrzocnl.png/90px-%E2%80%9C%E8%AE%B0%E5%BD%95%E5%91%98%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  hermit: {
    name: translate("characters.hermit.name"),
    camp: 'hunter',
    speed: 4.64,
    items: ['electromagneticFieldN', 'electromagneticFieldS'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/4f/5ed5nvceb7pj3ohyyz493eupwfbowte.png/90px-%E9%9A%90%E5%A3%AB%E5%A4%B4%E5%83%8F.png',
  },
  nightWatch: {
    name: translate("characters.nightWatch.name"),
    camp: 'hunter',
    speed: 4.64,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c3/d99smic5vrfjsir2pwo8endmiaoipp5.png/90px-%E5%AE%88%E5%A4%9C%E4%BA%BA%E5%A4%B4%E5%83%8F.png',
  },
  operaSinger: {
    name: translate("characters.operaSinger.name"),
    camp: 'hunter',
    speed: 4.56,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/be/k47ppq37pc3g92kjsu3iakot58em2pk.png/90px-%E6%AD%8C%E5%89%A7%E6%BC%94%E5%91%98%E5%A4%B4%E5%83%8F.png',
  },
  foolsGold: {
    name: translate("characters.foolsGold.name"),
    camp: 'hunter',
    speed: 4.64,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b8/bkshz3pnyhz1mhmq3xrr3bgr2mctkc0.png/90px-%E2%80%9C%E6%84%9A%E4%BA%BA%E9%87%91%E2%80%9D%E5%A4%B4%E5%83%8F.png',
  },
  theShadow: {
    
    ranges: {
      modes: [
        { key: 'ancientVisage', label: translate("tactic.ancientVisage.label"), card: translate("tactic.ancientVisage.card"), size_m: 15 },
        { key: 'off', label: translate("tactic.off.label") },
      ],
    },
    name: translate("characters.theShadow.name"),
    camp: 'hunter',
    speed: { [translate("tactic.speed.tacRolesThirteenth")]: 4.64, [translate("items.yithian.name")]: 7.59 },
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
    items: ['tinnitus', 'addiction', 'nostalgic', 'skittish', 'deerHunt', 'streetSweeper', 'obsession', 'famine'],
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


export const TAC_DISPLAY_DEFAULT = { cipherSize: 6, dungeonSize: 6, doorSize: 6 };

export const TAC_ZOOM_MIN = 1, TAC_ZOOM_MAX = 5;

 


export const TAC_ZOOM_LOCK_ICONS = {
  unlocked: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>',
  locked: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
};


export const TAC_ABYSS_MAX_M = 57.5;



export const TAC_MANAGE_DEFAULT = { roleSize: 6, iconSize: 3.4 };
