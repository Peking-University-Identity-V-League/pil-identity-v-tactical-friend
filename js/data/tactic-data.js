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
    role: translate("common.roles"), fixed: translate("movement.survivor.fixed"), custom: translate("common.custom"), hunter: translate("characters.camps.hunter")
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
      { key: 'duphrin', role: translate("characters.barmaid.name"), name: translate("movement.buff.trait.barmaid.duphrin.name"), mult: 1.5, duration: 2 },
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
      { key: 'kindlingWrath', role: translate("characters.hellEmber.name"), name: translate("movement.buff.trait.hellEmber.kindlingWrath.name"), mult: 1.08, duration: 8 },
      { key: 'puppetSwitchPosition', role: translate("characters.hellEmber.name"), name: translate("movement.buff.trait.hellEmber.puppetSwitchPosition.name"), mult: 1.5, duration: 1.5 },
      { key: 'rockerDash', role: translate("characters.smileyFace.name"), name: translate("movement.buff.trait.smileyFace.rockerDash.name"), levels: [1.55, 1.62, 2] },
      { key: 'windWings', role: translate("characters.smileyFace.name"), name: translate("movement.buff.trait.smileyFace.windWings.name"), mult: 1.2 },
      { key: 'propeller', role: translate("characters.smileyFace.name"), name: translate("movement.buff.trait.smileyFace.propeller.name"), mult: 0.9, postMult: true },
      { key: 'chainHookSwing', role: translate("characters.gameKeeper.name"), name: translate("movement.buff.trait.gameKeeper.chainHookSwing.name"), mult: 0.95, postMult: true },
      { key: 'hiddenInMist', role: translate("characters.theRipper.name"), name: translate("movement.buff.trait.theRipper.hiddenInMist.name"), mult: 1.15 },
      { key: 'fogZone', role: translate("characters.theRipper.name"), name: translate("movement.buff.trait.theRipper.fogZone.name"), mult: 1.2 },
      { key: 'entangled', role: translate("characters.soulWeaver.name"), name: translate("movement.buff.trait.soulWeaver.entangled.name"), levels: [1.25, 1.46, 1.675] },
      { key: 'dashHit', role: translate("characters.geisha.name"), name: translate("movement.buff.trait.geisha.dashHit.name"), mult: 3 },
      { key: 'withoutUmbrella', role: translate("characters.wuchang.name"), name: translate("movement.buff.trait.wuchang.withoutUmbrella.name"), mult: 1.1 },
      { key: 'siphonSoul', role: translate("characters.wuchang.name"), name: translate("movement.buff.trait.wuchang.siphonSoul.name"), mult: 1.65, forms: [0] },
      { key: 'tentaclesCharged', role: translate("characters.theFeaster.name"), name: translate("movement.buff.trait.theFeaster.tentaclesCharged.name"), mult: 0.94, postMult: true },
      { key: 'followerOutOfRadius', role: translate("characters.dreamWitch.name"), name: translate("movement.buff.trait.dreamWitch.followerOutOfRadius.name"), mult: 1.3, postMult: true, forms: [1] },
      { key: 'restfulRoad', role: translate("characters.axeBoy.name"), name: translate("movement.buff.trait.axeBoy.restfulRoad.name"), mult: 2 },
      { key: 'dispelSouls', role: translate("characters.axeBoy.name"), name: translate("movement.buff.trait.axeBoy.dispelSouls.name"), mult: 1.4, duration: 2.6 },
      { key: 'musicNoteCharged', role: translate("characters.violinist.name"), name: translate("movement.buff.trait.violinist.musicNoteCharged.name"), mult: 0.97, postMult: true },
      { key: 'sculptureCharged', role: translate("characters.sculptor.name"), name: translate("movement.buff.trait.sculptor.sculptureCharged.name"), mult: 0.97, postMult: true },
      { key: 'overload', role: translate("characters.undead.name"), name: translate("movement.buff.trait.undead.overload.name"), mult: 0.92, postMult: true },
      { key: 'slipstream', role: translate("characters.naiad.name"), name: translate("movement.buff.trait.naiad.slipstream.name"), mult: 1.3 },
      { key: 'poaching', role: translate("characters.nightmare.name"), name: translate("movement.buff.trait.nightmare.poaching.name"), mult: 1.13 },
      { key: 'justVerdict', role: translate("characters.clerk.name"), name: translate("movement.buff.trait.clerk.justVerdict.name"), mult: 1.06, duration: 15 },
      { key: 'windwalk', role: translate("characters.nightWatch.name"), name: translate("movement.buff.trait.nightWatch.windwalk.name"), mult: 1.12, duration: 6 },
      { key: 'stealth', role: translate("characters.operaSinger.name"), name: translate("movement.buff.trait.operaSinger.stealth.name"), mult: 1.08 },
      { key: 'anotherShadowRealmBonus', role: translate("characters.operaSinger.name"), name: translate("movement.buff.trait.operaSinger.anotherShadowRealmBonus.name"), mult: 1.45 },
      { key: 'attackMiss', role: translate("characters.hullabaloo.name"), name: translate("movement.buff.trait.hullabaloo.attackMiss.name"), mult: 0.3, postMult: true },
      { key: 'pettyGains', role: translate("characters.peddler.name"), name: translate("movement.buff.trait.peddler.pettyGains.name"), mult: 1.08, duration: 10 },
      { key: 'metalAffinity', role: translate("characters.peddler.name"), name: translate("movement.buff.trait.peddler.metalAffinity.name"), mult: 0.5, duration: 1, postMult: true },
      { key: 'inertia', role: translate("characters.cueist.name"), name: translate("movement.buff.trait.cueist.inertia.name"), mult: 1.18, duration: 6 },
      { key: 'assimilationEffect', role: translate("characters.queenBee.name"), name: translate("movement.buff.trait.queenBee.assimilationEffect.name"), mult: 1.12 },
      { key: 'bacterialSymbiosis', role: translate("characters.dentist.name"), name: translate("movement.buff.trait.dentist.bacterialSymbiosis.name"), mult: 1.05 },
      { key: 'heightenedSenses', role: translate("characters.herztier.name"), name: translate("movement.buff.trait.herztier.heightenedSenses.name"), mult: 1.08, duration: 10 },
    ],
  },
  talent: {
    kneeJerkReflex: { name: translate("talent.survivor.kneeJerkReflex"), mult: 1.5, duration: 3, camp: 'survivor' },
    webersLaw: { name: translate("talent.survivor.webersLaw"), levels: [1.1, 1.15, 1.2], duration: 3.5, camp: 'survivor' },
    borrowedTime: {
      name: translate("talent.survivor.borrowedTime"), mult: 1.5, duration: 5, camp: 'survivor',
      extra: { name: translate("application.buff.common.name.level", { name: translate("talent.survivor.escape"), value: 3 }), mult: 1.05, camp: 'survivor' },
    },
    escape: { name: translate("talent.survivor.escape"), levels: [1.03, 1.04, 1.05], camp: 'survivor' },
    wellEarned: { name: translate("talent.survivor.wellEarned"), mult: 1.25, duration: 4, camp: 'survivor' },
    mutualSupport: { name: translate("talent.survivor.mutualSupport"), levels: [1.04, 1.08], camp: 'survivor' },
    symbioticEffect: { name: translate("talent.survivor.symbioticEffect"), levels: [1.06, 1.1], camp: 'survivor' },
    sticker: { name: translate("talent.survivor.sticker"), levels: [1.3, 1.6, 1.9], camp: 'survivor', states: ['crawl'] },
    touchEffect: { name: translate("talent.survivor.touchEffect"), levels: [1.16, 1.28, 1.4], duration: 1.5, camp: 'survivor' },
    companionEffect: { name: translate("talent.survivor.companionEffect"), mult: 1.28, duration: 2, camp: 'survivor' },
    birdcageEffect: { name: translate("talent.survivor.birdcageEffect"), mult: 1.1, camp: 'survivor' },
    saviorComplex: { name: translate("talent.survivor.saviorComplex"), levels: [1.05, 1.1, 1.15], duration: 3, camp: 'survivor' },
    herdMentality: { name: translate("talent.survivor.herdMentality"), levels: [1.04, 1.06, 1.08], camp: 'survivor' },
    empathy: { name: translate("talent.survivor.empathy"), mult: 1.14, duration: 12, camp: 'survivor' },
    huntersInstinct: { name: translate("talent.hunter.huntersInstinct"), levels: [1.01, 1.015, 1.02], camp: 'hunter' },
    hospitable: { name: translate("talent.hunter.hospitable"), levels: [1.04, 1.06, 1.08], camp: 'hunter' },
    wantedOrder: { name: translate("talent.hunter.wantedOrder"), levels: [0.98, 0.99, 1], camp: 'hunter' },
    nostalgic: { name: translate("talent.hunter.nostalgic"), mult: 1.1, duration: 14, camp: 'hunter' },
    mock: { name: translate("talent.hunter.mock"), levels: [1.03, 1.04, 1.05], camp: 'hunter' },
    carnival: { name: translate("talent.hunter.carnival"), levels: [1.03, 1.04, 1.05], duration: 120, camp: 'hunter' },
    hunt: { name: translate("talent.hunter.hunt"), mult: 1.1, camp: 'hunter' },
    controlFreak: { name: translate("talent.hunter.controlFreak"), mult: 1.1, duration: 3, camp: 'hunter' },
    lingeringMight: { name: translate("talent.hunter.lingeringMight"), mult: 1.1, duration: 50, camp: 'hunter' },
    obsession: { name: translate("talent.hunter.obsession"), mult: 1.05, duration: 15, camp: 'hunter' },
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


export const SPAWN_SURVIVOR_ICON_URL = 'https://patchwiki.biligame.com/images/dwrg/4/45/'
  + 'omv2vmop0j63s9aprhjjkt4psykuy5p.png';

export const SPAWN_HUNTER_ICON_URL = 'https://patchwiki.biligame.com/images/dwrg/7/7a/'
  + 'f3sec5gnnhzh1xprcbxeaxa1uuzhkmo.png';

export const TAC_DISPLAY_DEFAULT = { cipherSize: 6, dungeonSize: 6, doorSize: 6, chairSize: 6, boxSize: 1.5, spawnSize: 6 };

export const TAC_ZOOM_MIN = 1, TAC_ZOOM_MAX = 5;




export const TAC_ZOOM_LOCK_ICONS = {
  unlocked: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 7.5-2"/></svg>',
  locked: '<svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><rect x="5" y="11" width="14" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>',
};


export const TAC_ABYSS_MAX_M = 57.5;



export const TAC_TREASURE_RULE = { rangeM: 70, ringM: [5.5, 7.3] };



export const TAC_MANAGE_DEFAULT = { roleSize: 6, iconSize: 3.4 };
