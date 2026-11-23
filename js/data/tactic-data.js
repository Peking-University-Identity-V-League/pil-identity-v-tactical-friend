import { translate } from '../core/i18n.js';
import { TAC_TALENT_TYPES } from './talents.js';


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
