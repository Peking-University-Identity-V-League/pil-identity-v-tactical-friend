import { translate } from '../core/i18n.js';


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
  elbowPadsOff: {
    name: translate("items.mercenary.elbowPadsOff.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7d/33s4aocfnxup3i4jhvjwmxnicjir4z4.png/60px-%E9%92%A2%E9%93%81%E6%8A%A4%E8%82%98_%E6%89%93%E5%BC%80.png',
  },
  flareGun: {
    name: translate("items.coordinator.flareGun.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/dd/260vjot3aa02s3h4w1a3101e4xnnqfd.png/120px-%E4%BF%A1%E5%8F%B7%E6%9E%AA.png',
  },
  mechanicsDoll: {
    name: translate("items.mechanic.mechanicsDoll.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3f/7cj09auhp2fspkqko5awq4dppp39g80.png/90px-%E6%9C%BA%E6%A2%B0%E5%B8%88%E9%81%93%E5%85%B7.png',
  },
  mechanicsDollControl: {
    name: translate("items.mechanic.mechanicsDollControl.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/ca/9seyhwsopakv68e5ybwwyi46143ic7w.png/60px-%E6%9C%BA%E6%A2%B0%E7%8E%A9%E5%81%B6%E7%9B%91%E7%AE%A1%E8%80%85%E9%9D%A0%E8%BF%91.png',
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
    ranges: {
      key: 'showItem',
      options: [
        { size_m: { min: 6.3, max: 9 }, label: translate("items.femaleDancer.fastMusicbox.name") },
      ],
    },
    render: 'circle',
    color: '#f472b6',
    fill: 'rgba(244, 114, 182, 0.22)',
    glow: 'rgba(244, 114, 182, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/25/qbcdefnhokf8gdup9tbcansc2n5co9d.png/60px-%E5%BF%AB%E8%8A%82%E5%A5%8F%E5%85%AB%E9%9F%B3%E7%9B%92.png',
  },
  slowMusicbox: {
    name: translate("items.femaleDancer.slowMusicbox.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: { min: 6.3, max: 9 }, label: translate("items.femaleDancer.slowMusicbox.name") },
      ],
    },
    render: 'circle',
    color: '#60a5fa',
    fill: 'rgba(96, 165, 250, 0.22)',
    glow: 'rgba(96, 165, 250, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/85/n0rp6b2j5psgbbffvcgxdgc981i34ts.png/90px-%E8%88%9E%E5%A5%B3%E9%81%93%E5%85%B7.png',
  },
  musicboxSwitch: {
    name: translate("items.femaleDancer.musicboxSwitch.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/25/77tcdr6lxoshk1b64muifim8wb5o06x.png/60px-%E5%85%AB%E9%9F%B3%E7%9B%92%E5%BF%AB%E6%85%A2%E5%88%87%E6%8D%A2.png',
  },
  owl: {
    name: translate("items.seer.owl.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f4/sgdqdymhqz2vs63d83rcqraj8w16amv.png/120px-%E5%BD%B9%E9%B8%9F.png',
  },
  makeupBox: {
    name: translate("items.embalmer.makeupBox.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3b/dslojb7jwiefzwcjy47bigle6mistc4.png/120px-%E5%8C%96%E5%A6%86%E7%AE%B1.png',
  },
  coffin: {
    name: translate("items.embalmer.coffin.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/88/sbbkt166a4ntucdr78whfpvhv1socye.png/60px-%E5%85%A5%E6%AE%93%E5%B8%88%E9%81%93%E5%85%B7.png',
  },
  meteoriteMagnetN: {
    name: translate("items.prospector.meteoriteMagnetN.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4.5, label: translate("items.prospector.meteoriteMagnetN.name") },
      ],
    },
    render: 'circle',
    color: '#ef4444',
    fill: 'rgba(239, 68, 68, 0.22)',
    glow: 'rgba(239, 68, 68, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c6/myjspwy5088svioy3ws8iw0dm05ofia.png/90px-%E5%8B%98%E6%8E%A2%E5%91%98%E9%81%93%E5%85%B7.png',
  },
  meteoriteMagnetS: {
    name: translate("items.prospector.meteoriteMagnetS.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4.5, label: translate("items.prospector.meteoriteMagnetS.name") },
      ],
    },
    render: 'circle',
    color: '#1d4ed8',
    fill: 'rgba(29, 78, 216, 0.22)',
    glow: 'rgba(29, 78, 216, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/ae/ao4vpwafua0tff4wj54s5oubms20kd4.png/60px-%E9%99%A8%E7%9F%B3%E7%A3%81%E9%93%81-%E8%B4%9F.png',
  },
  cursedEmblem: {
    name: translate("items.enchantress.cursedEmblem.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 5.1, label: translate("items.enchantress.cursedEmblem.range.apeCurseParalyze") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0d/5fx6ovc35w5dao0ujrhb190uyvnd0mp.png/120px-%E7%8C%BF%E7%8C%B4%E5%92%92%E5%83%8F.png',
  },
  cursedEmblemSpecial: {
    name: translate("items.enchantress.cursedEmblemSpecial.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 5.1, label: translate("items.enchantress.cursedEmblem.range.apeCurseParalyze") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/07/qkowsptxeqk646hdsybe7vc2jyxjcxj.png/60px-%E7%8C%BF%E7%8C%B4%E5%92%92%E5%83%8F_%E5%BC%95%E7%88%86.png',
  },
  wildlingPartner: {
    name: translate("items.wildling.wildlingPartner.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/91/o66wfufxbe1jgx8614fw54qieeyml7x.png/120px-%E9%87%8E%E6%80%A7%E4%BC%99%E4%BC%B4.png',
  },
  wildlingPartnerRide: {
    name: translate("items.wildling.wildlingPartnerRide.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/03/ltu0y1yoco9a5zag330v0qxaeswda47.png/120px-%E9%87%8E%E6%80%A7%E4%BC%99%E4%BC%B4_%E5%86%B2%E6%92%9E.png',
  },
  wildlingPartnerFollowingState: {
    name: translate("items.wildling.wildlingPartnerFollowingState.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e4/qh7swz2c58ugki9jarqu2ohn5jyr1rt.png/60px-%E9%87%8E%E6%80%A7%E4%BC%99%E4%BC%B4_%E5%88%87%E6%8D%A2%E8%B7%9F%E9%9A%8F%E7%8A%B6%E6%80%81.png',
  },
  wildlingPartnerRidingState: {
    name: translate("items.wildling.wildlingPartnerRidingState.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/a3/2hredfjg37hcprfzcyd1ijl12kdrai2.png/60px-%E9%87%8E%E6%80%A7%E4%BC%99%E4%BC%B4_%E5%88%87%E6%8D%A2%E9%AA%91%E4%B9%98%E7%8A%B6%E6%80%81.png',
  },
  wildlingPartnerRidingStateCross: {
    name: translate("items.wildling.wildlingPartnerRidingStateCross.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/02/7wvum9t41e1urm3z6fw9yresivttsay.png/60px-%E9%87%8E%E6%80%A7%E4%BC%99%E4%BC%B4_%E8%B7%A8%E8%B6%8A%E5%9C%B0%E5%BD%A2.png',
  },
  stickyBomb: {
    name: translate("items.acrobat.stickyBomb.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/8/8c/ltaw2at60zi7mx3afwdzd2m0qb858qh.png',
  },
  nitroBomb: {
    name: translate("items.acrobat.nitroBomb.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/6e/neolbvgm16061svf7qujxjyk8wzy86u.png/60px-%E5%86%B7%E5%8D%B4%E5%BC%B9.png',
  },
  fireBomb: {
    name: translate("items.acrobat.fireBomb.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/77/gz1qgtcf1caks27vclu8kcqrov95y5u.png/60px-%E7%87%83%E7%83%A7%E5%BC%B9.png',
  },
  stickyBombThrow: {
    name: translate("items.acrobat.stickyBombThrow.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8b/cj5n7hskxlh9557f72ghrhcumchlbmt.png/60px-%E9%BB%8F%E5%9C%9F%E5%BC%B9_%E6%8A%95%E6%8E%B7.png',
  },
  nitroBombThrow: {
    name: translate("items.acrobat.nitroBombThrow.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/ee/r2qwke34bu47k3vx3joq2f82qr2lr1d.png/60px-%E5%86%B7%E5%8D%B4%E5%BC%B9_%E6%8A%95%E6%8E%B7.png',
  },
  fireBombThrow: {
    name: translate("items.acrobat.fireBombThrow.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/70/qg4wrni6n32gtp0kuzmofoh9jvon35u.png/60px-%E7%87%83%E7%83%A7%E5%BC%B9_%E6%8A%95%E6%8E%B7.png',
  },
  poseidonWatch: {
    name: translate("items.firstOfficer.poseidonWatch.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 27, label: translate("items.firstOfficer.poseidonWatch.range.hypnotize1") },
        { size_m: 8.4, label: translate("items.firstOfficer.poseidonWatch.range.hypnotize2") },
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
  mixDovlin: {
    name: translate("items.barmaid.mixDovlin.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/1c/a7hljv27e48858sgw82jr8wgkt45vn7.png/120px-%E8%B0%83%E5%88%B6%E5%A4%9A%E5%A4%AB%E6%9E%97.png',
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
        { size_m: 1.27, label: translate("items.postman.postDog.range.postDogPounce") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/ed/fohz3k2zrkhum55m6ypco170bdqdypu.png/120px-%E9%80%81%E4%BF%A1%E7%8A%AC.png',
  },
  shovel: {
    name: translate("items.graveKeeper.shovel.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/73/obmza342xyuyb4gwic2tpwwwm9smrnp.png/120px-%E9%93%81%E9%93%B2.png',
  },
  shovelEmerge: {
    name: translate("items.graveKeeper.shovelEmerge.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/fd/me0ynqa2v7euhgurjqpa8cs8y2oj46u.png/60px-%E9%93%81%E9%93%B2_%E5%87%BA%E5%9C%9F.png',
  },
  insulatingGloves: {
    name: translate("items.prisoner.insulatingGloves.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/00/1si78i0yopgcea9exbgjxztdm723o9v.png/120px-%E7%BB%9D%E7%BC%98%E6%89%8B%E5%A5%97.png',
  },
  severeElectricCurrent: {
    name: translate("items.prisoner.severeElectricCurrent.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 5.9, label: translate("items.prisoner.severeElectricCurrent.range.severeElectricCurrentStun") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0e/dkivpbnay9pkemab2argg44aqufm7hs.png/120px-%E5%BC%BA%E7%94%B5%E6%B5%81.png',
  },
  electricalArea: {
    name: translate("items.prisoner.electricalArea.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 9.5, label: translate("items.prisoner.electricalArea.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/9/95/8vr6lombmenk96sypsd3isn54jmia9u.png',
  },
  swarmNet: {
    name: translate("items.entomologist.swarmNet.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 1.2, label: translate("items.entomologist.swarmNet.name") },
      ],
    },
    render: 'circle',
    color: '#d4a373',
    fill: 'rgba(212, 163, 115, 0.22)',
    glow: 'rgba(212, 163, 115, 0.45)',
    pushes: true,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5d/3vmln26rb8aonm2iwnfzyvq3hpo9l9i.png/90px-%E6%98%86%E8%99%AB%E5%AD%A6%E8%80%85%E9%81%93%E5%85%B7.png',
  },
  swarmNetWave: {
    name: translate("items.entomologist.swarmNetWave.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 1.2, label: translate("items.entomologist.swarmNetWave.name") },
      ],
    },
    render: 'circle',
    color: '#d4a373',
    fill: 'rgba(212, 163, 115, 0.22)',
    glow: 'rgba(212, 163, 115, 0.45)',
    pushes: true,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/05/64o5iy8rnmdr9s100rmcc6lj51t6jk0.png/60px-%E6%8D%95%E8%99%AB%E7%BD%91_%E4%BD%BF%E7%94%A8%E4%B8%AD.png',
  },
  paintBruahAndDrawingBoard: {
    name: translate("items.painter.paintBruahAndDrawingBoard.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 12, label: translate("items.painter.paintBruahAndDrawingBoard.name") },
      ],
    },
    render: 'circle',
    color: '#60a5fa',
    fill: 'rgba(96, 165, 250, 0.22)',
    glow: 'rgba(96, 165, 250, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/cc/tpvtb6qirophc1w676xlalljti1w42w.png/90px-%E7%94%BB%E5%AE%B6%E9%81%93%E5%85%B7.png',
  },
  drawingBoard: {
    name: translate("items.painter.drawingBoard.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 12, label: translate("items.painter.drawingBoard.name") },
      ],
    },
    render: 'circle',
    color: '#60a5fa',
    fill: 'rgba(96, 165, 250, 0.22)',
    glow: 'rgba(96, 165, 250, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/51/bwu36gu4j28d0z1f2i1r34n5sdcrpol.png/60px-%E7%94%BB%E4%BD%9C.png',
  },
  cricketBat: {
    name: translate("items.batter.cricketBat.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: { min: 3.73, max: 7.45 }, label: translate("items.batter.cricketBat.range.cricketBatKnockBack") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7e/19s98s5y8v0pz05ifj94fvyubyjssvd.png/120px-%E5%87%BB%E7%90%83%E6%89%8B%E9%81%93%E5%85%B7.png',
  },
  rampage: {
    name: translate("items.batter.rampage.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/5/5c/nf6cjszfcqrgt30w9d1r94ffwfqxako.png',
  },
  catapult: {
    name: translate("items.toyMerchant.catapult.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 21.9, label: translate("items.toyMerchant.catapult.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/be/q00bu5gdar393rxoi65gjmhpfcko4cl.png',
  },
  woodenWings: {
    name: translate("items.toyMerchant.woodenWings.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f7/2g09hg1uyno0gye6pe56omymco2i2rv.png/120px-%E7%8E%A9%E5%85%B7%E5%95%86%E9%81%93%E5%85%B72.png',
  },
  toyBox: {
    name: translate("items.toyMerchant.toyBox.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/cb/nu9i8q271leu3ujsxgduisl28uka9h4.png/120px-%E7%8E%A9%E5%85%B7%E5%95%86%E9%81%93%E5%85%B73.png',
  },
  toyContainer: {
    name: translate("items.toyMerchant.toyContainer.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/7/77/pqlxvzhik3rmg9v5fbnc7e46ec4yndh.png',
  },
  whistle: {
    name: translate("items.psychologist.whistle.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/fc/gnww27qe3kgz7suy0b9k11sc3050svg.png/120px-%E2%80%9C%E5%BF%83%E7%90%86%E5%AD%A6%E5%AE%B6%E2%80%9D%E9%81%93%E5%85%B7.png',
  },
  subjectiveAnchor: {
    name: translate("items.psychologist.subjectiveAnchor.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 13, label: translate("items.psychologist.subjectiveAnchor.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/4/43/h238k450f2p12y5p9nx3gm32g2b6517.png',
  },
  bonded: {
    name: translate("items.psychologist.bonded.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 13, label: translate("items.psychologist.bonded.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/a/a8/0lxd5h8cualuva1rtritsq0ddb09vd4.png',
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
        { size_m: 6.1, label: translate("items.littleGirl.memoryFragment.range.impact") },
        { size_m: 10.3, label: translate("items.littleGirl.memoryFragment.range.impactAddLaunchMax") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f9/asmvxiz04rw0af5of7ic2lzyorwjsz0.png/120px-%E5%9B%9E%E5%BF%86%E7%A2%8E%E7%89%87.png',
  },
  memorySync: {
    name: translate("items.littleGirl.memorySync.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 3.4, label: translate("items.littleGirl.memorySync.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/0/08/6pxiq61eb6erbyoh6csh9m7pfs1f92n.png',
  },
  pity: {
    name: translate("items.littleGirl.pity.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/4/40/950ck6k6n4gb9ap0kosl7cizpgrh4nv.png',
  },
  rocket: {
    name: translate("items.weepingClown.rocket.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/d/d4/igscyutpd7sygzjkmxijnavjihx42ht.png',
  },
  scale: {
    name: translate("items.professor.scale.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b5/d4rcr4pkvrw70yv8mhcqij5f8bzkq92.png/120px-%E6%95%99%E6%8E%88%E9%81%93%E5%85%B7.png',
  },
  injection: {
    name: translate("items.professor.injection.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c1/hkwx2gow0zq4gpw75b7xs827djcii64.png',
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
  jetpackPropel: {
    name: translate("items.aeroplanist.jetpackPropel.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7d/b3f0ym5tb1rqeqpiho0mrzfta4ji8ux.png/60px-%E9%A3%9E%E8%A1%8C%E5%AE%B6%E9%81%93%E5%85%B7%E4%BD%BF%E7%94%A8.png',
  },
  pompoms: {
    name: translate("items.cheerleader.pompoms.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/ab/5s8o1cg0zk9ysp3mnm9tkeomz8uznjf.png/120px-%E6%8B%89%E6%8B%89%E9%98%9F%E5%91%98%E9%81%93%E5%85%B7.png',
  },
  inspire: {
    name: translate("items.cheerleader.inspire.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c9/gld2cd15tw271kbasa4e5uc5vdj6tyj.png',
  },
  inspireIcon: {
    name: translate("items.cheerleader.inspireIcon.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/bc/hx8346hwqpcbnzhub11o8vlsk31h7ff.png',
  },
  encourage1: {
    name: translate("items.cheerleader.encourage1.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/27/dgwmcy119cx1l7w3xzjj6j459g4v9gh.png/60px-%E6%8B%89%E6%8B%89%E9%98%9F%E5%91%98_%E6%BF%80%E5%8A%B11.png',
  },
  encourage2: {
    name: translate("items.cheerleader.encourage2.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d4/ezcrukhwbh2i5cgcmuhxwc7265nk1rh.png/60px-%E6%8B%89%E6%8B%89%E9%98%9F%E5%91%98_%E6%BF%80%E5%8A%B12.png',
  },
  encourageCheerful: {
    name: translate("items.cheerleader.encourageCheerful.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/a3/omme9yge4wqab2095dblp50pjz3b9hw.png/60px-%E6%8B%89%E6%8B%89%E9%98%9F%E5%91%98_%E9%9B%80%E8%B7%83.png',
  },
  encourageExcited: {
    name: translate("items.cheerleader.encourageExcited.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/57/714rc32mha2l6yd8gc6wgtcvxd4ot9r.png/60px-%E6%8B%89%E6%8B%89%E9%98%9F%E5%91%98_%E4%BA%A2%E5%A5%8B.png',
  },
  louis: {
    name: translate("items.puppeteer.louis.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/50/eaxbgojlp5fz2y6nxrowk0dwi44ikmf.png/120px-%E2%80%9C%E8%B7%AF%E6%98%93%E2%80%9D.png',
  },
  airbag: {
    name: translate("items.fireInvestigator.airbag.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4.2, label: translate("items.fireInvestigator.airbag.name") },
      ],
    },
    render: 'circle',
    color: '#f8fafc',
    fill: 'rgba(248, 250, 252, 0.22)',
    glow: 'rgba(248, 250, 252, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7b/1jxsg19mhdmhk4iy1n5jzbd13qacdul.png/90px-%E7%81%AB%E7%81%BE%E8%B0%83%E6%9F%A5%E5%91%98%E9%81%93%E5%85%B7.png',
  },
  aromatherapyCane: {
    name: translate("items.faroLady.aromatherapyCane.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/5d/5od6849sin7d6e7kegpexjfezdbubzo.png/120px-%E9%A6%99%E8%96%B0%E6%89%8B%E6%9D%96.png',
  },
  dexterous: {
    name: translate("items.faroLady.dexterous.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/9d/o3yf6rudi630ch204c3w8s305v8ulto.png/90px-%E2%80%9C%E6%B3%95%E7%BD%97%E5%A5%B3%E5%A3%AB%E2%80%9D%E9%81%93%E5%85%B72.png',
  },
  helmet: {
    name: translate("items.knight.helmet.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3f/2srn3jrzo5atz18iopcn7430wridv6n.png/120px-%E2%80%9C%E9%AA%91%E5%A3%AB%E2%80%9D%E9%81%93%E5%85%B7.png',
  },
  tacticalForesight: {
    name: translate("items.knight.tacticalForesight.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 13, label: translate("items.knight.tacticalForesight.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/23/9hupztomw2e11j1njjwo6tv4etaqr8s.png',
  },
  tacticalForesightAttack: {
    name: translate("items.knight.tacticalForesightAttack.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 13, label: translate("items.knight.tacticalForesight.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/a8/f7gmlpfzp94ond7tkxhmi87tdbb7e9i.png/60px-%E2%80%9C%E9%AA%91%E5%A3%AB%E2%80%9D_%E6%88%98%E6%9C%AF%E9%A2%84%E8%A7%81_%E6%94%BB%E5%87%BB.png',
  },
  tacticalForesightAbility: {
    name: translate("items.knight.tacticalForesightAbility.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 13, label: translate("items.knight.tacticalForesight.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/14/b2pqz208pbgtc905n6uoc5y1dd015p5.png/60px-%E2%80%9C%E9%AA%91%E5%A3%AB%E2%80%9D_%E6%88%98%E6%9C%AF%E9%A2%84%E8%A7%81_%E6%8A%80%E8%83%BD.png',
  },
  tacticalForesightStalemate: {
    name: translate("items.knight.tacticalForesightStalemate.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 13, label: translate("items.knight.tacticalForesight.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/50/9kdy8w7qxun9ajsno3536x0lljlqwpg.png/60px-%E2%80%9C%E9%AA%91%E5%A3%AB%E2%80%9D_%E6%88%98%E6%9C%AF%E9%A2%84%E8%A7%81_%E7%9B%B8%E6%8C%81.png',
  },
  chivalrousSympathy: {
    name: translate("items.knight.chivalrousSympathy.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 7, label: translate("items.knight.chivalrousSympathy.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/8/81/nsyxqmvxnzqffqwirb96tpzpdv4c91o.png',
  },
  stormGlass: {
    name: translate("items.meteorologist.stormGlass.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4, label: translate("items.meteorologist.stormGlass.range.rainfall") },
      ],
    },
    render: 'circle',
    color: '#f8fafc',
    fill: 'rgba(248, 250, 252, 0.22)',
    glow: 'rgba(248, 250, 252, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/ae/fxa05k9lw4ubsk94yolnc6osfo327qr.png/90px-%E5%A4%A9%E6%B0%94%E7%93%B6.png',
  },
  gale1: {
    name: translate("items.meteorologist.gale1.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/29/o993o96n8arvylwiwokxlq3ywfq1k52.png/60px-%E6%B0%94%E8%B1%A1%E5%AD%A6%E5%AE%B6_%E6%B0%94%E8%B1%A1%E5%AE%9E%E9%AA%8C_%E5%BC%BA%E9%A3%8E_%E5%B0%8F.png',
  },
  gale2: {
    name: translate("items.meteorologist.gale2.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/ea/suoon6xi55g8o7z8fm1lov4m9vz4ijq.png/60px-%E6%B0%94%E8%B1%A1%E5%AD%A6%E5%AE%B6_%E6%B0%94%E8%B1%A1%E5%AE%9E%E9%AA%8C_%E5%BC%BA%E9%A3%8E_%E4%B8%AD.png',
  },
  gale3: {
    name: translate("items.meteorologist.gale3.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/70/8hqe1q7oqo2wi7lijq5ajtlxk6u2wjn.png/60px-%E6%B0%94%E8%B1%A1%E5%AD%A6%E5%AE%B6_%E6%B0%94%E8%B1%A1%E5%AE%9E%E9%AA%8C_%E5%BC%BA%E9%A3%8E_%E5%A4%A7.png',
  },
  stratus1: {
    name: translate("items.meteorologist.stratus1.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b8/8u562nhtvsnduzsu090oqy8inx5lxnx.png/60px-%E6%B0%94%E8%B1%A1%E5%AD%A6%E5%AE%B6_%E6%B0%94%E8%B1%A1%E5%AE%9E%E9%AA%8C_%E5%B1%82%E4%BA%91_%E5%B0%8F.png',
  },
  stratus2: {
    name: translate("items.meteorologist.stratus2.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/50/myq9oxztpki79k2qfqxnoedbp4akz87.png/60px-%E6%B0%94%E8%B1%A1%E5%AD%A6%E5%AE%B6_%E6%B0%94%E8%B1%A1%E5%AE%9E%E9%AA%8C_%E5%B1%82%E4%BA%91_%E4%B8%AD.png',
  },
  stratus3: {
    name: translate("items.meteorologist.stratus3.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8e/hqzk31tff2ye0grrrn4xarhn3qhf0k8.png/60px-%E6%B0%94%E8%B1%A1%E5%AD%A6%E5%AE%B6_%E6%B0%94%E8%B1%A1%E5%AE%9E%E9%AA%8C_%E5%B1%82%E4%BA%91_%E5%A4%A7.png',
  },
  rainfall: {
    name: translate("items.meteorologist.rainfall.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4, label: translate("items.meteorologist.stormGlass.range.rainfall") },
      ],
    },
    render: 'circle',
    color: '#f8fafc',
    fill: 'rgba(248, 250, 252, 0.22)',
    glow: 'rgba(248, 250, 252, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/35/arcrt86h0djzj006vyqwokofpfxht8m.png/60px-%E6%B0%94%E8%B1%A1%E5%AD%A6%E5%AE%B6_%E6%B0%94%E8%B1%A1%E5%AE%9E%E9%AA%8C_%E6%9A%96%E9%9B%A8.png',
  },
  stormGlassDecompose: {
    name: translate("items.meteorologist.stormGlassDecompose.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/27/7a1cjwqfh593kxb0otirfccxuk1un99.png/60px-%E6%B0%94%E8%B1%A1%E5%AD%A6%E5%AE%B6_%E5%8F%AF%E9%80%86%E5%8F%8D%E5%BA%94_%E5%88%86%E8%A7%A3.png',
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
  escapeAct: {
    name: translate("items.escapologist.escapeAct.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 47, label: translate("items.escapologist.escapeAct.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/8/8f/o478syozi1jsesr9q81kpo7kkgs4z32.png',
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
  gaoneraPass: {
    name: translate("items.matador.gaoneraPass.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/65/og3kqcr5juzxd7kw7mqbodwfxe77map.png/90px-%E6%96%97%E7%89%9B%E5%A3%AB%E9%81%93%E5%85%B72.png',
  },
  propUmbrella: {
    name: translate("items.mimeArtist.propUmbrella.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 12.7, label: translate("items.mimeArtist.propUmbrella.range.anxiousRoutine") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/49/os2khk79tu1tnvnxohhtq7vvt6xa3xe.png/90px-%E9%BB%98%E5%89%A7%E8%89%BA%E4%BA%BA%E9%81%93%E5%85%B7.png',
  },
  hamster: {
    name: translate("items.prodigy.hamster.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/32/7dcfplvn8p83ewanw29b8bttsb8o0q4.png/120px-%E2%80%9C%E7%A5%9E%E7%AB%A5%E2%80%9D%E9%81%93%E5%85%B7.png',
  },
  hamsterCancel: {
    name: translate("items.prodigy.hamsterCancel.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e4/0ndrq39pax1fc4s53nccmol1a0eqi83.png/60px-%E5%95%AE%E9%BD%BF%E4%BC%99%E4%BC%B4_%E5%8F%96%E6%B6%88.png',
  },
  dirtball: {
    name: translate("items.prodigy.dirtball.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c3/3m8i1omadbsq1gio14emy2y0aykn8ni.png/60px-%E5%95%AE%E9%BD%BF%E4%BC%99%E4%BC%B4_%E5%9C%9F%E7%90%83.png',
  },
  pushingState: {
    name: translate("items.prodigy.pushingState.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/50/tap9a0pzb6bqmxxtpmgen82k8zuslb3.png/60px-%E5%95%AE%E9%BD%BF%E4%BC%99%E4%BC%B4_%E6%8E%A8%E7%90%83.png',
  },
  performanceState: {
    name: translate("items.prodigy.performanceState.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f1/qn82xsqc631dn3w0xdfmfb0pjf0n1sz.png/60px-%E5%95%AE%E9%BD%BF%E4%BC%99%E4%BC%B4_%E5%B1%95%E6%BC%94.png',
  },

  phantom: {
    name: translate("items.hellEmber.phantom.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c6/rfu060f3aed5z8y5gz19d58irffzby8.png/90px-%E5%8E%82%E9%95%BF0%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  puppet1: {
    name: translate("items.hellEmber.puppet1.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 12, label: translate("items.hellEmber.puppet.range.showSurvivor") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/a6/cdnjdljtwds6ly62lzyytmb6v84omae.png/90px-%E5%8E%82%E9%95%BF1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  puppet2: {
    name: translate("items.hellEmber.puppet2.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 12, label: translate("items.hellEmber.puppet.range.showSurvivor") },
      ],
    },
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
  rocketDash: {
    name: translate("items.smileyFace.rocketDash.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/70/srcqhct6nl21fi6xojxtwh5sbsm7nlp.png/90px-%E5%B0%8F%E4%B8%911%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  chainHook: {
    name: translate("items.gameKeeper.chainHook.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4.2, label: translate("items.gameKeeper.chainHook.range.shockwave") },
        { size_m: 1, label: translate("items.gameKeeper.chainHook.range.autoCorrection") },
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
        { size_m: 20, label: translate("items.gameKeeper.trap.range.destroyedByRocketChair") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/dd/40u7gtj5cvffk3e4dy5edl1ntd56kdh.png/90px-%E9%B9%BF%E5%A4%B40%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  fogZone: {
    name: translate("items.theRipper.fogZone.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/0/07/my05slaw1f4g7wd8nnrfgzlgrnmpmmc.png',
  },
  freezingFog: {
    name: translate("items.theRipper.freezingFog.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0d/j1ptbqfsu0jo9nqj9t0u6os5unrk7ig.png/90px-%E2%80%9C%E6%9D%B0%E5%85%8B%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  hiddenInMist: {
    name: translate("items.theRipper.hiddenInMist.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/a0/6ibvokim6m6tf9zpob6sfg092lmmdhl.png/90px-%E2%80%9C%E6%9D%B0%E5%85%8B%E2%80%9D1%E9%98%B6%E6%8A%80%E8%83%BD.png',
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
    name: translate("items.geisha.swallowtailButterfly.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/3/39/2zzetskt6albjea26dh8cbhoyywljni.png',
  },
  dashHit: {
    name: translate("items.geisha.dashHit.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/86/3el6d4a7epwxyhr983jr67gy4by00u9.png/90px-%E7%BA%A2%E8%9D%B60%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  soulDeparture: {
    name: translate("items.geisha.soulDeparture.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/39/ejolhn1ff31fto5v4rfikf5338w40rb.png/90px-%E7%BA%A2%E8%9D%B61%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  umbrella: {
    name: translate("items.wuchang.umbrella.name"),
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
    render: 'circle',
    color: '#22c55e',
    fill: 'rgba(34, 197, 94, 0.22)',
    glow: 'rgba(34, 197, 94, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3f/98f3qxkbtphouvvzglqleqnf00t5mlv.png/90px-%E5%AE%BF%E4%BC%9E%E4%B9%8B%E9%AD%820%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  siphonSoulWaveringSoul: {
    name: translate("items.wuchang.siphonSoulWaveringSoul.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/1c/1pf2jr28fbupkpyftvphiaeg6uuknln.png/90px-%E5%AE%BF%E4%BC%9E%E4%B9%8B%E9%AD%821%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  camera: {
    name: translate("items.photographer.camera.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/64/mx0ydtuij8mg5bp32tuu9e1lq8usba6.png',
  },
  recordedMoment: {
    name: translate("items.photographer.recordedMoment.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/63/8f3rada99bx1d67d1xpt8eurw6yrzbz.png/90px-%E6%91%84%E5%BD%B1%E5%B8%881%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  timeJump: {
    name: translate("items.photographer.timeJump.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8c/21xhiccnzcn7z3xtbaffb88hdguodia.png/90px-%E6%91%84%E5%BD%B1%E5%B8%882%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  console: {
    name: translate("items.madEyes.console.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/f/f7/jbqdvznjphrq602qh303r24qdn3ti4b.png',
  },
  fence: {
    name: translate("items.madEyes.fence.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/5/50/22xzqnfjxbyp78lyo9jgrejs9x4g80d.png',
  },
  portableConsole: {
    name: translate("items.madEyes.portableConsole.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/39/fla3uk6j3onztlex90bkqw20ezagnpy.png/90px-%E7%96%AF%E7%9C%BC1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  overlock: {
    name: translate("items.madEyes.overlock.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d5/78ur50hry41yl0zcy9ftoq0l6d4294y.png/90px-%E7%96%AF%E7%9C%BC2%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  tentacles: {
    name: translate("items.theFeaster.tentacles.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4.25, label: translate("items.theFeaster.tentacles.range.tentacleHit") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/99/9q4qco9e4a4eb87ml89bf6lrnc7wmzc.png/90px-%E9%BB%84%E8%A1%A3%E4%B9%8B%E4%B8%BB0%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  nightmareAttack: {
    name: translate("items.theFeaster.nightmareAttack.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4.25, label: translate("items.theFeaster.nightmareAttack.range.tentacleHit") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/16/fab4xnr9nlfu9m3g83buhze0825l0gi.png/90px-%E9%BB%84%E8%A1%A3%E4%B9%8B%E4%B8%BB0%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  nightmareGaze: {
    name: translate("items.theFeaster.nightmareGaze.name"),
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 21.1, label: translate("items.theFeaster.nightmareGaze.range.nightmareGaze") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/73/aablayf145aoupvbdmt94j1azg0b4aj.png/90px-%E9%BB%84%E8%A1%A3%E4%B9%8B%E4%B8%BB2%E9%98%B6%E6%8A%80%E8%83%BD.png',
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
        { size_m: 20, label: translate("items.dreamWitch.hiddenDream.range.hiddenDreamsurvivorNotification") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/3/33/265axozop5uoe1opp2e6gj8noxlby8e.png',
  },
  preach: {
    name: translate("items.dreamWitch.preach.name"),
    ranges: {
      key: 'showTrait',
      options: [
        { size_m: 42.2, label: translate("items.dreamWitch.preach.range.followerControlTier0Tier1") },
        { size_m: 59.1, label: translate("items.dreamWitch.preach.range.followerControlTier2") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/82/kx1zlgqkwa70fxb9s2s56rkwqgv2r0w.png/90px-%E6%A2%A6%E4%B9%8B%E5%A5%B3%E5%B7%AB0%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  leech: {
    name: translate("items.dreamWitch.leech.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/a3/qwh6j4s6uwrznfdyaz1ddgeiahj8dwt.png/90px-%E6%A2%A6%E4%B9%8B%E5%A5%B3%E5%B7%AB0%E9%98%B6%E6%8A%80%E8%83%BD2.png',
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
  restfulRoad: {
    name: translate("items.axeBoy.restfulRoad.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8a/ih3x58lsclc44w8fzzro9eqefluxq0r.png/90px-%E7%88%B1%E5%93%AD%E9%AC%BC1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  preyingLeap: {
    name: translate("items.evilReptilian.preyingLeap.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/16/41dyeobdr5e0wb4hvmb6bcev990fdvb.png/90px-%E5%AD%BD%E8%9C%A50%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  crash: {
    name: translate("items.evilReptilian.crash.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f9/q4md884ev1wm1jucjl9b4wy6ny4mh5d.png/90px-%E5%AD%BD%E8%9C%A50%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  lethalCrash: {
    name: translate("items.evilReptilian.lethalCrash.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 3, label: translate("items.evilReptilian.lethalCrash.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/31/63r3zrv33m7hpbu7n1bshmyypuz0wro.png/90px-%E5%AD%BD%E8%9C%A51%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  aquaMirror: {
    name: translate("items.bloodyQueen.aquaMirror.name"),
    linkToRole: 'bloodyQueen',
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/03/tmqwk7lb2do1swhtp7sklgx75t0ig6f.png/90px-%E7%BA%A2%E5%A4%AB%E4%BA%BA0%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  mirrorImage: {
    name: translate("items.bloodyQueen.mirrorImage.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 8.4, label: translate("items.bloodyQueen.mirrorImage.range.showSurvivor") },
        { size_m: 4.2, label: translate("items.bloodyQueen.mirrorImage.range.mirrorRotationTier1") },
        { size_m: 21.1, label: translate("items.bloodyQueen.mirrorImage.range.mirrorImageSurvivorTier2") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/b/b2/924f03wryik2gfgrenb3q75ngh466vi.png',
  },
  mirrorRotation: {
    name: translate("items.bloodyQueen.mirrorRotation.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/39/pz8ldblek4grladqsz8j9tgmqmopzdf.png/90px-%E7%BA%A2%E5%A4%AB%E4%BA%BA1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  timeBomb: {
    name: translate("items.guard26.timeBomb.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 10.5, crossWidth: 2.53, label: translate("items.guard26.timeBomb.range.explosionTierZeroOne") },
        { size_m: 13, crossWidth: 2.53, label: translate("items.guard26.timeBomb.range.explosionTierTwo") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/2/23/37z8z0ipuu3r6vcrroal6ox09kvnd7l.png/90px-26%E5%8F%B7%E5%AE%88%E5%8D%AB0%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  remoteControlledBomb: {
    name: translate("items.guard26.remoteControlledBomb.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 10.5, crossWidth: 2.53, label: translate("items.guard26.remoteControlledBomb.range.explosionTierZeroOne") },
        { size_m: 13, crossWidth: 2.53, label: translate("items.guard26.remoteControlledBomb.range.explosionTierTwo") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e6/r71dvsitv6dmj2tq9gqeyjdtza4arpw.png/90px-26%E5%8F%B7%E5%AE%88%E5%8D%AB1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  cat: {
    name: translate("items.disciple.cat.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 3.38, label: translate("items.disciple.cat.range.alertRadius") },
        { size_m: 6.33, label: translate("items.disciple.cat.range.paralysisArea") },
        { size_m: 10.5, label: translate("items.disciple.cat.range.locateSurvivor") },
        { size_m: 33.8, label: translate("items.disciple.cat.range.seenBySurvivor") },
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
    linkMaxM: 23,
    linkColor: '#f8fafc',
    linkWidth: 2,
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
        { size_m: 12, label: translate("items.violinist.terrifyingMelody.range.meditationCalmDownSurvivorAlone") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/9/9c/01jc95fkcxi85en8g4o3bixexw794ib.png',
  },
  sculpture: {
    name: translate("items.sculptor.sculpture.name"),
    render: 'link',
    linkMaxM: 11,
    linkColor: '#f8fafc',
    linkWidth: 2,
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/12/7q7e3iajnfcsbu9f80i95d6acpbr41p.png/90px-%E9%9B%95%E5%88%BB%E5%AE%B60%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  sculptureOfNobility: {
    name: translate("items.sculptor.sculptureOfNobility.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 36, label: translate("items.sculptor.sculptureOfNobility.range.chargeTowardSurvivor") },
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
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4, label: translate("items.naiad.spearfishing.name") },
      ],
    },
    linkToRole: 'naiad',
    linkMaxM: 57.5,
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
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 2.3, label: translate("items.hermit.electromagneticFieldN.name") },
      ],
    },
    render: 'circle',
    color: '#ef4444',
    fill: 'rgba(239, 68, 68, 0.22)',
    glow: 'rgba(239, 68, 68, 0.45)',
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/69/sktrgc7dzmstt8bsbokywfq0jmzshg2.png',
  },
  electromagneticFieldS: {
    name: translate("items.hermit.electromagneticFieldS.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 2.3, label: translate("items.hermit.electromagneticFieldS.name") },
      ],
    },
    render: 'circle',
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
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 15, label: translate("items.theShadow.yithian.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/0c/29lp6giai6vozd29i82ucquh4px9p1k.png/90px-%E6%97%B6%E7%A9%BA%E4%B9%8B%E5%BD%B10%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  ancientVisage: {
    name: translate("items.theShadow.ancientVisage.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 15, label: translate("items.theShadow.ancientVisage.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/d/da/c2qmk7cs5shwl528wzkkmma6i2v8ael.png',
  },
  psychicIntrusion: {
    name: translate("items.theShadow.psychicIntrusion.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 5.1, label: translate("items.theShadow.psychicIntrusion.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/6a/hyd5re6tdcr9a48goe48d8ptblq337y.png/90px-%E6%97%B6%E7%A9%BA%E4%B9%8B%E5%BD%B10%E9%98%B6%E6%8A%80%E8%83%BD3.png',
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
  backstep: {
    name: translate("items.goatman.backstep.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/47/3owyamuxpjlzvu8fxpnzknlexyg39my.png/90px-%E2%80%9C%E8%B7%9B%E8%84%9A%E7%BE%8A%E2%80%9D1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  cloneHullabaloo: {
    name: translate("items.hullabaloo.cloneHullabaloo.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/18/hj1mypuwdo5p41epy37ia9ln3cylr7q.png/90px-%E2%80%9C%E5%96%A7%E5%9A%A3%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  encore: {
    name: translate("items.hullabaloo.encore.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7f/gassmti0jphonoe70lt2mgzdmb3fn1s.png/90px-%E2%80%9C%E5%96%A7%E5%9A%A3%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  trapeze: {
    name: translate("items.hullabaloo.trapeze.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f6/p6lgt5n20aaf5j18p7j7tmp60h6m4sq.png/90px-%E2%80%9C%E5%96%A7%E5%9A%A3%E2%80%9D1%E9%98%B6%E6%8A%80%E8%83%BD.png',
  },
  pettyGains: {
    name: translate("items.peddler.pettyGains.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/a9/mgootw27unl35xvi4jso14axs3jx1v5.png/90px-%E6%9D%82%E8%B4%A7%E5%95%860%E9%98%B6%E6%8A%80%E8%83%BD1.png',
  },
  natureAffinity: {
    name: translate("items.peddler.natureAffinity.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/64/43k335kw1cucaud0e4z0658r2xz1z92.png',
  },
  mineralAffinity: {
    name: translate("items.peddler.mineralAffinity.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/8/80/j3b9gnljks6rjwtk07y4hgnszkutrjk.png',
  },
  metalAffinity: {
    name: translate("items.peddler.metalAffinity.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/9c/nbypkpg2d92byri5fnio6ml08ex2rbv.png/90px-%E6%9D%82%E8%B4%A7%E5%95%860%E9%98%B6%E6%8A%80%E8%83%BD4.png',
  },
  contactPoint: {
    name: translate("items.cueist.contactPoint.name"),
    render: 'hittingPoint',
    linkColor: '#f8fafc',
    linkWidth: 2,
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
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 4, label: translate("items.cueist.cueBall.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/67/t7auxaxdhzzis13n6qnl24dciluiddd.png',
  },
  maxwellsDemon: {
    name: translate("items.cueist.maxwellsDemon.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/35/bprllgeghme433xfno3i6jfticbloev.png/90px-%E2%80%9C%E5%8F%B0%E7%90%83%E6%89%8B%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  swarmOfInsects: {
    name: translate("items.queenBee.swarmOfInsects.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/ca/swgm0hdknhwtbus7acri5aviubn3ocy.png',
  },
  stinger: {
    name: translate("items.queenBee.stinger.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/ba/0e8a53xtahxfg1adgym48s2g5e0ca28.png/90px-%E2%80%9C%E5%A5%B3%E7%8E%8B%E8%9C%82%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  beam: {
    name: translate("items.dentist.beam.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/bb/5jqs5qdr0f7icwl49sua4asl776g4et.png/90px-%E2%80%9C%E7%89%99%E5%8C%BB%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD4.png',
  },
  dentalMirror: {
    name: translate("items.dentist.dentalMirror.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f9/sgo0dsl9833h5iomk0gj6qed3o23r05.png/90px-%E2%80%9C%E7%89%99%E5%8C%BB%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD2.png',
  },
  darkMire: {
    name: translate("items.dentist.darkMire.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/6d/1wvqw7z6hy0t21hsn6i24cllk1d08qx.png/90px-%E2%80%9C%E7%89%99%E5%8C%BB%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD3.png',
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
  lunge: {
    name: translate("items.herztier.bestialAwakening.name"),
    ranges: {
      key: 'showItem',
      options: [
        { size_m: [7, 14], label: translate("items.herztier.lunge.name") },
      ],
    },
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7a/6lidakub58e7p0261c698oa1a1hkdjm.png/90px-%E2%80%9C%E5%BF%83%E5%85%BD%E2%80%9D0%E9%98%B6%E6%8A%80%E8%83%BD.png',
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

  listen: {
    name: translate("items.trait.listen.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/0/07/0obrswd76b8u690r6ramdcrectlbpiy.png',
    ranges: {
      key: 'showItem',
      options: [
        { size_m: 11, label: translate("items.trait.listen.name") },
      ],
    },
  },
  abnormal: {
    name: translate("items.trait.abnormal.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/d/d2/piv0htrn7il01b3egjeperc9d4s7td3.png',
  },
  excitement: {
    name: translate("items.trait.excitement.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/d/d9/9vlw3opxe521jiwh27lfuld8q92ctxa.png',
  },
  patroller: {
    name: translate("items.trait.patroller.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/a/aa/rb5j6n9m9gumvpy0jhhnrrhmt5riifi.png',
  },
  teleport: {
    name: translate("items.trait.teleport.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/0/04/6rs6gkhobw3hqwjpylsryrl3eq5jdtv.png',
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
  blink: {
    name: translate("items.trait.blink.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/5/5e/8ivnan4wru8d5lrbacu4oz1vsixnpjc.png',
  },
  warp: {
    name: translate("items.trait.warp.name"),
    render: 'link',
    linkMaxM: 60,
    linkColor: '#f8fafc',
    linkWidth: 2,
    icon: 'https://patchwiki.biligame.com/images/dwrg/f/f5/lqbsf4hruktmy7b6m454ya5efebmmg7.png',
  },

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

  snowball: {
    name: translate("items.violentStruggle.snowball.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/6b/eyijwoswyigic0nj4jq6ejkgkzpwvrz.png/75px-%E8%B6%A3%E5%91%B3%E6%80%A7%E8%A3%85%E9%A5%B0%E7%BB%84%E4%BB%B6_%E9%9B%AA%E7%90%83.png',
  },
  bogusBag: {
    name: translate("items.violentStruggle.bogusBag.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7d/p049eyeyjzntyowohmr4jcfggub6g6v.png/90px-%E5%8D%9A%E6%A0%BC%E5%8C%85.png',
  },
  crowbar: {
    name: translate("items.violentStruggle.crowbar.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/bb/cbty8sbs2ac2sm4w6aw89sfhgtvjvda.png/90px-%E6%92%AC%E6%A3%8D.png',
  },
  smokeBottle: {
    name: translate("items.violentStruggle.smokeBottle.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/30/4ct7msrg0gkc1wq8ft2t3iq7tqa1jyp.png/90px-%E7%83%9F%E9%9B%BE%E7%93%B6.png',
  },
  blackMud: {
    name: translate("items.violentStruggle.blackMud.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/39/bhtmrg4uq0wpz8zj2fkfbnr07xt0ag0.png/90px-%E9%BB%91%E8%89%B2%E6%B1%A1%E6%B3%A5.png',
  },
  coldsnapFlask: {
    name: translate("items.violentStruggle.coldsnapFlask.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/be/7gtrm7kpc7wumq379x8fqtp5kxnztxs.png/90px-%E9%80%9F%E5%86%BB%E7%93%B6.png',
  },
  speedPill: {
    name: translate("items.violentStruggle.speedPill.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/19/9n46j23exdp641w8d7o5a3lehbiay2y.png/90px-%E5%8A%A0%E9%80%9F%E5%89%82.png',
  },
  attentionPill: {
    name: translate("items.violentStruggle.attentionPill.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/e4/7hi2xqgfh1262eewktfn46ufe6opeqa.png/90px-%E5%87%9D%E7%A5%9E%E5%89%82.png',
  },
  luckyPill: {
    name: translate("items.violentStruggle.luckyPill.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8a/ka2hxdnwwacs6euiu2cnir8h6t3l88t.png/90px-%E5%B9%B8%E8%BF%90%E5%89%82.png',
  },
  coagulant: {
    name: translate("items.violentStruggle.coagulant.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/db/l6xh6im4yyv3nvdeq4cudo5zj0d99ch.png/90px-%E6%AD%A2%E8%A1%80%E5%89%82.png',
  },
  powerPill: {
    name: translate("items.violentStruggle.powerPill.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/9e/7pfsdh96mxy9q9l2lqo8fx0l3tqgabp.png/90px-%E5%BC%BA%E5%8A%9B%E5%89%82.png',
  },
  combustionPill: {
    name: translate("items.violentStruggle.combustionPill.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b4/9kt0z0rnmkqwgm79uaj592ot1bsri3u.png/90px-%E5%8A%A9%E7%87%83%E5%89%82.png',
  },
  recoveryPill: {
    name: translate("items.violentStruggle.recoveryPill.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/ad/ojryitkwlvmef038pt6kkk8pe6fyppy.png/90px-%E5%9B%9E%E5%A4%8D%E5%89%82.png',
  },
  ragePotion: {
    name: translate("items.violentStruggle.ragePotion.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/71/sg3qgs0ld1wuqnb13zm1f30pmq7g7jf.png/90px-%E6%84%A4%E6%80%92%E5%89%82.png',
  },
  resistancePotion: {
    name: translate("items.violentStruggle.resistancePotion.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/52/qnk4cbk5kz6uiavjnvu1y16hsk8rfya.png/90px-%E6%8A%B5%E6%8A%97%E5%89%82.png',
  },
  agilityPotion: {
    name: translate("items.violentStruggle.agilityPotion.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/4d/jufuw0jgcxruajyg5bqiukn3qj3hpxh.png/90px-%E8%BF%85%E6%8D%B7%E5%89%82.png',
  },
  powerupPill: {
    name: translate("items.violentStruggle.powerupPill.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7d/ogra0pqm28w798gw07c1fr8nihamm7v.png/90px-%E5%85%85%E8%83%BD%E5%89%82.png',
  },
  tarotRaven: {
    name: translate("items.violentStruggle.tarotRaven.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3f/0l0lhjzhb8jmdu9lvbmannylmr05k44.png/90px-%E6%B8%A1%E9%B8%A6.png',
  },
  tarotClairvoyance: {
    name: translate("items.violentStruggle.tarotClairvoyance.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/40/nnxazx3unx1qfm73cekvacnrqqqwizr.png/90px-%E7%81%B5%E7%9E%B3.png',
  },
  tarotTheGuardian: {
    name: translate("items.violentStruggle.tarotTheGuardian.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/51/9xj9vekj904k1jhkj1p7y6ph85spvao.png/90px-%E5%AE%88%E6%8A%A4%E8%80%85.png',
  },
  tarotResonance: {
    name: translate("items.violentStruggle.tarotResonance.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/9d/kx6erbyur1ff4yxqh34ogfnylioakij.png/90px-%E4%BC%A0%E9%9F%B3.png',
  },
  tarotDovlin: {
    name: translate("items.violentStruggle.tarotDovlin.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/df/aw1l9ctqs594yyrhxfwrw43way6bywu.png/90px-%E5%A4%9A%E5%A4%AB%E6%9E%97.png',
  },
  shield: {
    name: translate("items.violentStruggle.shield.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/dd/kxoweq8pjttah3tp1ldvhfs9wzwg4pp.png/90px-%E6%8A%A4%E7%9B%BE.png',
  },
  blackjackChips: {
    name: translate("items.violentStruggle.blackjackChips.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8f/sr6arbky3v0ukmms2dd3po6v245mls6.png/90px-%E7%AD%B9%E7%A0%81.png',
  },
  tarotStars: {
    name: translate("items.violentStruggle.tarotStars.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/45/fkjkxl6ftn9no8e0btullmw8vrcedws.png/90px-%E6%98%9F%E5%B8%81.png',
  },
  frenzyRhapsodyNormalBall: {
    name: translate("items.violentStruggle.frenzyRhapsodyNormalBall.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/cf/8swv9cw20xaww77yfx8mp938fmnuwpx.png/90px-%E7%8B%82%E6%83%B3%E4%B9%8B%E6%81%AF_%E6%99%AE%E9%80%9A%E7%90%83.png',
  },
  frenzyRhapsodyExplosiveBall: {
    name: translate("items.violentStruggle.frenzyRhapsodyExplosiveBall.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/09/nq0mg1513ftqi7gfqr1a0sz7wfydk3p.png/90px-%E7%8B%82%E6%83%B3%E4%B9%8B%E6%81%AF_%E7%82%B8%E5%BC%B9%E7%90%83.png',
  },
  frenzyRhapsodyDashBall: {
    name: translate("items.violentStruggle.frenzyRhapsodyDashBall.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/d/d9/1huboz91bppgf7sjaowfwzhojejb392.png/90px-%E7%8B%82%E6%83%B3%E4%B9%8B%E6%81%AF_%E5%86%B2%E5%88%BA%E7%90%83.png',
  },
  frenzyRhapsodySniperBall: {
    name: translate("items.violentStruggle.frenzyRhapsodySniperBall.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/45/l0i6ax9bs8sfo9377o6yrx191l24zdk.png/90px-%E7%8B%82%E6%83%B3%E4%B9%8B%E6%81%AF_%E7%8B%99%E5%87%BB%E7%90%83.png',
  },
  hideAndSeekMonstersTreasure: {
    name: translate("items.violentStruggle.hideAndSeekMonstersTreasure.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/c/c5/hse5gc7koehd6gx7xsgaj0mted9jev6.png',
  },
  hideAndSeekOwl: {
    name: translate("items.violentStruggle.hideAndSeekOwl.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/69/0w8lo9ui5v3h4gzmxbgzzuo2ajq8riu.png/90px-%E8%BA%B2%E7%8C%AB%E7%8C%AB%E6%A8%A1%E5%BC%8F_%E5%BD%B9%E9%B8%9F.png',
  },
  hideAndSeekSyringe: {
    name: translate("items.violentStruggle.hideAndSeekSyringe.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/46/dhf8w6iprchzcmecbjutwe2zyoskse8.png/90px-%E8%BA%B2%E7%8C%AB%E7%8C%AB%E6%A8%A1%E5%BC%8F_%E9%95%87%E9%9D%99%E5%89%82.png',
  },
  hideAndSeekDecoy: {
    name: translate("items.violentStruggle.hideAndSeekDecoy.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/a/ac/gqwnvdh2bergvd0dlgvzw1fhac4dmwy.png/90px-%E8%BA%B2%E7%8C%AB%E7%8C%AB%E6%A8%A1%E5%BC%8F_%E9%AD%94%E6%9C%AF%E6%A3%92.png',
  },
  hideAndSeekMechanicsDoll: {
    name: translate("items.violentStruggle.hideAndSeekMechanicsDoll.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/e/ed/enp3zu8c0e9thsjdk6oxaslax3wv4ux.png/90px-%E8%BA%B2%E7%8C%AB%E7%8C%AB%E6%A8%A1%E5%BC%8F_%E6%9C%BA%E6%A2%B0%E7%8E%A9%E5%81%B6.png',
  },
  hideAndSeekScaledSkin: {
    name: translate("items.violentStruggle.hideAndSeekScaledSkin.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/00/9z8btrbeto21xmgt6nljy5b1pr69n0m.png/90px-%E8%BA%B2%E7%8C%AB%E7%8C%AB%E6%A8%A1%E5%BC%8F_%E9%B3%9E%E7%9A%AE.png',
  },
  hideAndSeekWildlingPartner: {
    name: translate("items.violentStruggle.hideAndSeekWildlingPartner.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/0/01/dry7plm32c1humtdj38poxd5od3b3nd.png/90px-%E8%BA%B2%E7%8C%AB%E7%8C%AB%E6%A8%A1%E5%BC%8F_%E9%87%8E%E6%80%A7%E4%BC%99%E4%BC%B4.png',
  },

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

  clue: {
    name: translate("items.shop.clue.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8c/r7gqx5aabcmzam3bdquawubybgdola8.png/60px-%E7%BA%BF%E7%B4%A2.png',
  },
  inspiration: {
    name: translate("items.shop.inspiration.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/38/oynmw4mcbawheghwkyi64zyr0onbfow.png/60px-%E7%81%B5%E6%84%9F.png',
  },
  fragment: {
    name: translate("items.shop.fragment.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/49/417bhrchsnd048x8yuxf62mrmmp6l1p.png/60px-%E7%A2%8E%E7%89%87.png',
  },
  echo: {
    name: translate("items.shop.echo.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/bf/jz26crtseyoebb6y8oxcioi9wbc1zg2.png/60px-%E5%9B%9E%E5%A3%B0.png',
  },
  sealingWax: {
    name: translate("items.shop.sealingWax.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/67/npprmncqqxexxj97vrgggwcehn7saqu.png/60px-%E7%81%AB%E6%BC%86.png',
  },
  spyGlasses: {
    name: translate("items.shop.spyGlasses.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/5/59/cz9xpt1j604kttwo17535j9oeejolc1.png/60px-%E7%AA%A5%E9%95%9C.png',
  },
  commemorationToken: {
    name: translate("items.shop.commemorationToken.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/9b/2fr7aexz10mumekqyyehgfss3w71cdp.png/60px-%E7%BA%AA%E5%BF%B5.png',
  },
  costumeRemnant: {
    name: translate("items.shop.costumeRemnant.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/3/3b/2lani1pj37gqzvrj3takcocmqreazzp.png/60px-%E8%A3%85%E6%89%AE%E6%AE%8B%E5%BD%B1.png',
  },
  stickerToken: {
    name: translate("items.shop.stickerToken.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/1b/1xjyj89gmud2sarwnwta2ogtcu639yd.png/60px-%E8%A1%A8%E6%83%85%E5%85%91%E6%8D%A2%E5%B8%81.png',
  },
  inkTrace: {
    name: translate("items.shop.inkTrace.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/91/erplgorlku7fsniz8bxljuye6ho3i00.png/60px-%E5%A2%A8%E8%BF%B9.png',
  },

  COAI: {
    name: translate("items.COA.COAI.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/7/7c/qadm7b3peb0n2sb6uubuhqjxkbqk088.png/113px-COA%E2%85%A0logo.png',
  },
  COAII: {
    name: translate("items.COA.COAII.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/62/phlorsskd718mi0q8539tdnibqfp9u3.png',
  },
  COAIII: {
    name: translate("items.COA.COAIII.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/d/dd/pfnpjikr8sjuril00915cxpn05pypap.png',
  },
  COAIV: {
    name: translate("items.COA.COAIV.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/4/43/c6tmcq2u3zumx1eprmirssxg7ttma1b.png/113px-COA%E2%85%A3logo.png',
  },
  COAV: {
    name: translate("items.COA.COAV.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/a/ab/rlkj1aob9hzdbayy770fls7tt6urf8v.png',
  },
  COAVI: {
    name: translate("items.COA.COAVI.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/9d/rfsk5c6o04rc80lgal0laehytmp4itj.png/113px-COA%E2%85%A5logo.png',
  },
  COAVII: {
    name: translate("items.COA.COAVII.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/8c/3f9jo8i4heark1kbxeuugl43gcznlr0.png/113px-COA%E2%85%A6logo.png',
  },
  COAVIII: {
    name: translate("items.COA.COAVIII.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/1/1b/5bnd616a5hagrucnx4wqtdj04b7snma.png/113px-COA%E2%85%A7logo.png',
  },
  COAIX: {
    name: translate("items.COA.COAIX.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b7/f4b0qz1aer42dj90bl1v2fkzxnztxy1.png/113px-COA%E2%85%A8logo.png',
  },

  ACT: {
    name: translate("items.teamIVL.ACT.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/6/65/rkk90lfizwyse6p6in3fdei8tzjjyuu.png',
  },
  ASC: {
    name: translate("items.teamIVL.ASC.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/9/92/qp2v1hmvkqw5z065brcy2lkc25uehkk.png',
  },
  DOU5: {
    name: translate("items.teamIVL.DOU5.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/9/91/84g8odbtnnqbt3z0ck4lqpijuu27i1i.png',
  },
  FPXZQ: {
    name: translate("items.teamIVL.FPXZQ.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/e/e5/o9l2wt3ie3au59vlfbb1dvfp64tktnt.png',
  },
  GG: {
    name: translate("items.teamIVL.GG.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/5/57/dwlirbryl5k3wf0fi8bsw4xx92s1z6e.png',
  },
  GR: {
    name: translate("items.teamIVL.GR.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/5/5b/b3dburdn1342sa27xsdqor4uzmezx4w.png',
  },
  MRC: {
    name: translate("items.teamIVL.MRC.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/0/08/6zq1r1jwqbcnvsjhroptrb5yfc2lkti.png',
  },
  TE: {
    name: translate("items.teamIVL.TE.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/2/26/e4d5di6rkpepc94tfezsgpnnr7d05ai.png',
  },
  WBG: {
    name: translate("items.teamIVL.WBG.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/4/46/2z9mumi5oi7l3twa1m3ponzuogntdq7.png',
  },
  Wolves: {
    name: translate("items.teamIVL.Wolves.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/0/0f/5upqyt4fcxhv4g8tbgzw01c3ijy2xmz.png',
  },

  AWG: {
    name: translate("items.teamIJL.AWG.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c1/3ukxt586q9ki8ueu300i6hzb8kmyc37.png/450px-Arneb_with_WoG_LOGO.png',
  },
  AXZ: {
    name: translate("items.teamIJL.AXZ.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/d/da/mmjditzwjhh3n02xw2n7wfyebcnevjm.png',
  },
  DFM: {
    name: translate("items.teamIJL.DFM.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/0/0c/guimem9tl2y0hqnzdzknjfsvm28j6n8.png',
  },
  FL: {
    name: translate("items.teamIJL.FL.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/4/4d/041lc2p33g92lhjfydf2928ognl2zg1.png',
  },
  QTD: {
    name: translate("items.teamIJL.QTD.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/9/9e/8e9j3cn2ipa49of6dkyc6ernj9w4dg1.png/450px-QT_DIG_LOGO.png',
  },
  RC: {
    name: translate("items.teamIJL.RC.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/b/b5/pcxyqg68vaew8185ntbmhcbvz573st1.png/450px-REJECT_LOGO.png',
  },
  SZ: {
    name: translate("items.teamIJL.SZ.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/c/c4/nfes6nchbj0onsxxy6y70prn9vdbq8r.png/450px-SCARZ_LOGO.png',
  },
  Zeta: {
    name: translate("items.teamIJL.Zeta.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/6/64/98fglsfmmf9aj19rm3onwxmc9svlh8n.png/450px-ZETA_DIVISION_LOGO.png',
  },

  stickerYes: {
    name: translate("items.sticker.stickerYes.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/f/f0/i5t59p90spm2lctax5l3kblu89zuddu.png/90px-%E8%A1%A8%E6%83%85%E5%9B%BE%E6%A0%87_%E6%98%AF.png',
  },
  stickerNo: {
    name: translate("items.sticker.stickerNo.name"),
    icon: 'https://patchwiki.biligame.com/images/dwrg/thumb/8/89/1ikv68kcghq1vgjmafzz2gqfh9ijs3f.png/90px-%E8%A1%A8%E6%83%85%E5%9B%BE%E6%A0%87_%E5%90%A6.png',
  },
};
