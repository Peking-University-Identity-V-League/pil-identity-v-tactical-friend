import { translate } from '../core/i18n.js';
import { TAC_TALENT_KEYS } from './talents.js';
import { TAC_CUSTOM_KEYS } from './items_common.js';
import { TAC_TIER_KEYS } from './items_tier.js';
import { TAC_MATCH_KEYS } from './items_match.js';


import { TAC_SURVIVOR_ROLES } from './survivor.js';
import { TAC_HUNTER_ROLES } from './hunter.js';


export const TAC_ROLES = {
  ...TAC_SURVIVOR_ROLES,

  ...TAC_HUNTER_ROLES,
  
  custom: {
    name: translate("characters.custom.name"),
    camp: 'other',
    ranges: {
      key: 'show',
      options: [
        { size_m: { min: 0, max: null }, label: translate("characters.custom.name") },
      ],
    },
    color: '#fbbf24',
    items: TAC_CUSTOM_KEYS,
    icon: 'https://patchwiki.biligame.com/images/dwrg/1/12/p5icajuxyhyj8wd46bmz212bzb0z3yz.png',
  },
  skill: {
    name: translate("characters.skill.name"),
    camp: 'other',
    items: ['listen', 'abnormal', 'excitement', 'patroller', 'teleport', 'peeper', 'blink', 'warp'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/bd/4aby06f4kbl87b14cihk5o3y1k61e8l.png',
  },
  talentSurvivor: {
    name: translate("characters.talentSurvivor.name"),
    camp: 'other',
    items: TAC_TALENT_KEYS.survivor,
    icon: 'https://patchwiki.biligame.com/images/dwrg/a/aa/cg3jqluevkjed5x981bhgtu5i7hwjjg.png',
  },
  talentHunter: {
    name: translate("characters.talentHunter.name"),
    camp: 'other',
    items: TAC_TALENT_KEYS.hunter,
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/2c/f6qtopnneu5e8l50p3ocix9b7m3nyr6.png',
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
    items: TAC_TIER_KEYS,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/2b/4lnyrl54i7z952kcy8zzj87yn07by0h.png/60px-%E6%8E%92%E4%BD%8D%E4%BF%9D%E6%8A%A4%E5%8D%A1.png',
  },
  shop: {
    name: translate("characters.shop.name"),
    camp: 'other',
    items: ['clue', 'inspiration', 'fragment', 'echo', 'sealingWax', 'spyGlasses', 'commemorationToken', 'costumeRemnant', 'stickerToken', 'inkTrace'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/e/e9/hcvexmfva8ohhsdm19at0iok2garrac.png',
  },
  match: {
    name: translate("characters.match.name"),
    camp: 'other',
    items: TAC_MATCH_KEYS.MATCH,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/1d/n6kazuplw11fyir9s5d7j19xulzqpyw.png/90px-%E7%BA%AA%E5%BF%B5%E6%A8%A1%E5%9E%8B.png',
  },
  COA: {
    name: translate("characters.COA.name"),
    camp: 'other',
    items: TAC_MATCH_KEYS.COA,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c4/r67qgzgmse7iiog4x21nf5xwedncgkd.png/90px-%E5%BA%94%E6%8F%B4%E7%A5%A8.png',
  },
  teamIVL: {
    name: translate("characters.teamIVL.name"),
    camp: 'other',
    items: TAC_MATCH_KEYS.teamIVL,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/86/e9s5lbtwl2criihcp5h70ehtst9hlk9.png/150px-IVLlogo.png',
  },
  teamIJL: {
    name: translate("characters.teamIJL.name"),
    camp: 'other',
    items: TAC_MATCH_KEYS.teamIJL,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5a/aduticjamiol9j9dn01c3mqwkknvb8w.png/150px-IJLlogo.png',
  },
  teamOther: {
    name: translate("characters.teamOther.name"),
    camp: 'other',
    items: TAC_MATCH_KEYS.teamOther,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/2a/murcy0o946l10afkudirruke3cuqfqa.png/90px-%E9%99%A4%E5%B0%98%E5%88%B7.png',
  },
  sticker: {
    name: translate("characters.sticker.name"),
    camp: 'other',
    items: ['stickerYes', 'stickerNo'],
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/12/ierbsudwlrq55fze3uguu8xbhpy8b5r.png/90px-%E6%B6%82%E9%B8%A6_%E7%BC%AA%E6%96%AF%E5%8D%B0%E8%AE%B0_%E5%9B%BE%E6%A0%87.png',
  },
};
