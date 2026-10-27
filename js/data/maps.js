
import { CN_NUM, cnNum } from '../core/utils.js';


import { translate } from '../core/i18n.js';

export const DED_EMPTY_HINT = translate("maps.dedEmptyHint")
  + translate("maps.dedEmptyHintAlternate");




export function dedHelpers(positions) {
  
  const ids = (...names) => names.map((n) =>
    positions.findIndex((p) => p.name === n));
  
  const fixed = (names) => ({
    kind: 'fixed', name: translate("maps.name"),
    list: names.join(translate("ui.punctuation.listSeparator")), positions: ids(...names),
  });
  const region = (name, min, max, names) => ({
    kind: 'region', name: name || translate("maps.region"), list: names.join(translate("ui.punctuation.listSeparator")),
    positions: ids(...names), min, max,
  });
  
  const exactly = (n, names, name) => ({
    kind: 'exactly', n, name: name || translate("maps.exactly", { n: CN_NUM[n] }),
    list: names.join(translate("ui.punctuation.listSeparator")), positions: ids(...names),
  });
  
  const either = (names) => exactly(1, names, translate("maps.either"));
  
  const same = (names) => ({
    kind: 'same', name: translate("maps.nameAlternate"),
    list: names.join(translate("ui.punctuation.listSeparator")), positions: ids(...names),
  });
  
  const atLeast1 = (names) => ({
    kind: 'atLeast', n: 1, name: translate("maps.nameThird"),
    list: names.join(translate("ui.punctuation.listSeparator")), positions: ids(...names),
  });
  
  const atMost1 = (names, name) => ({
    kind: 'atMost', n: 1, name: name || translate("maps.atMost1"),
    list: names.join(translate("ui.punctuation.listSeparator")), positions: ids(...names),
  });
  
  const chain = (name, mode, cyclic, names, text) => ({
    kind: 'chain', name: name || translate("maps.chain"), mode, cyclic,
    list: names.join(' - '), text: text, positions: ids(...names),
  });
  
  const chainRun = (name, names, text) => ({
    kind: 'chainRun', name: name || translate("maps.chain"),
    list: names.join(' - '), text: text, positions: ids(...names),
  });
  
  const implies = (name, pres, cons, text) => ({
    kind: 'implies', name, list: translate("maps.list"), text: text,
    pres: ids(...pres), cons: ids(...cons)[0],
    positions: ids(...pres, ...cons),
  });
  
  const allAbsent = (pres, targets, text) => ({
    kind: 'allAbsent', name: translate("maps.nameFourth"),
    list: [...pres, ...targets].join(translate("ui.punctuation.listSeparator")),
    pres: ids(...pres), targets: ids(...targets),
    positions: ids(...pres, ...targets),
    text,
  });
  
  const link = (name, regionNames, marker, positive, text) => ({
    kind: 'link', name, list: marker, text: text,
    region: ids(...regionNames), marker: ids(marker)[0], positive,
    positions: ids(...regionNames, marker),
  });
  return { fixed, region, exactly, either, same, atLeast1, atMost1, chain,
    chainRun, implies, link, allAbsent };
}


export function dedRuleBook(rules, fixed, positions) {
  const slash = (r) => r.list.split(translate("ui.punctuation.listSeparator")).join(' / ');
  return rules.map((r) => {
    switch (r.kind) {
      case 'fixed':
        return { title: r.name, text: translate("maps.text", { list: r.list }) };
      case 'region': {
        const text = r.min === r.max
          ? translate("maps.textAlternate", { value: cnNum(r.min) })
          : translate("maps.textThird", { value: cnNum(r.min), valueSecondary: cnNum(r.max) });
        return { title: r.name, text: translate("maps.textFourth", { value: slash(r), text: text }) };
      }
      case 'exactly':
        return { title: `${r.name} · ${slash(r)}`,
          text: translate("maps.textFifth", { count: cnNum(r.positions.length), value: cnNum(r.n) }) };
      case 'atLeast':
        return { title: `${r.name} · ${slash(r)}`, text: translate("maps.textSixth") };
      case 'same':
        return { title: `${r.name} · ${slash(r)}`, text: translate("maps.textSeventh") };
      case 'atMost':
        return { title: `${r.name} · ${slash(r)}`, text: translate("maps.textEighth") };
      case 'allAbsent':
        return { title: r.name, text: r.text || r.list };
      case 'chain':
        return { title: r.name, text: r.text };
      case 'chainRun':
        return { title: r.name, text: r.text };
      case 'implies':
        return { title: r.name, text: r.text };
      case 'link':
        return { title: r.name, text: r.text };
      default:
        return { title: r.name, text: r.list };
    }
  });
}


export function makeDeduction(opts) {
  const { mapImage, mapSize, ciphers, cipherCombinations,
    rules, hints } = opts;
  return {
    mapImage, mapSize, ciphers,
    configs: cipherCombinations.map((g) =>
      g.map((cid) => ciphers.findIndex((p) => p.id === cid))),
    rules,
    hints,
    ruleBook: dedRuleBook(rules),
    emptyHint: DED_EMPTY_HINT,
  };
}

export const MAPS_DATA = [
  (() => {
    
    
    
      const mapId = 0;
      const mapName = translate("maps.armsFactory.mapName");
      const mapNameEn = 'Arms Factory';
      const mapImage = 'https://patchwiki.biligame.com/images/dwrg/thumb/4/44/'
        + 'bk8sfefxhz54qr2uxqq6grugfshrczs.png/750px-%E5%86%9B%E5%B7%A5%E5%8E%82'
        + '_%E4%BF%AF%E8%A7%86%E5%9B%BE_%E5%85%A8.png';
      const mapSize = [750, 644];
      const zonesInfo = [27, 30, 226.1, 197, 3, 3];
      const zoneNames = [
        translate("maps.armsFactory.zoneNamesZero"), translate("maps.armsFactory.zoneNamesOne"), translate("maps.armsFactory.zoneNamesTwo"),
        translate("maps.armsFactory.zoneNamesThree"), translate("maps.armsFactory.zoneNamesFour"), translate("maps.armsFactory.zoneNamesFive"),
        translate("maps.armsFactory.zoneNamesSix"), translate("maps.armsFactory.zoneNamesSeven"), translate("maps.armsFactory.zoneNamesEight")
      ];
      const ciphers = [
        { id: 'M_4', name: translate("maps.armsFactory.m4.name"),     location: [284, 529], feature: translate("maps.armsFactory.m4.feature"), locked: true },
        { id: 'M_1', name: translate("maps.armsFactory.m1.name"),   location: [444, 103], feature: translate("maps.armsFactory.m1.feature") },
        { id: 'M_2', name: translate("maps.armsFactory.m2.name"),   location: [459, 296], feature: translate("maps.armsFactory.m2.feature") },
        { id: 'M_3', name: translate("maps.armsFactory.m3.name"),   location: [399, 378], feature: translate("maps.armsFactory.m3.feature") },
        { id: 'E_1', name: translate("maps.armsFactory.e1.name"), location: [576, 174], feature: translate("maps.armsFactory.e1.feature") },
        { id: 'E_2', name: translate("maps.armsFactory.e2.name"),     location: [606, 260], feature: translate("maps.armsFactory.e1.feature") },
        { id: 'E_3', name: translate("maps.armsFactory.e3.name"),   location: [543, 523], feature: translate("maps.armsFactory.e3.feature") },
        { id: 'E_4', name: translate("maps.armsFactory.e4.name"),   location: [503, 569], feature: translate("maps.armsFactory.e3.feature") },
        { id: 'W_1', name: translate("maps.armsFactory.w1.name"),   location: [241, 85], feature: translate("maps.armsFactory.w1.feature") },
        { id: 'W_2', name: translate("maps.armsFactory.w2.name"),     location: [251, 193], feature: translate("maps.armsFactory.w1.feature") },
        { id: 'W_3', name: translate("maps.armsFactory.w3.name"), location: [182, 249], feature: translate("maps.armsFactory.w1.feature") },
        { id: 'W_4', name: translate("maps.armsFactory.w4.name"),   location: [107, 486], feature: translate("maps.armsFactory.w4.feature") },
      ];
      
      const cipherCombinations = [
      ['M_4', 'M_1', 'M_3', 'W_4', 'W_1', 'E_2', 'E_4'],
      ['M_4', 'M_2', 'W_4', 'W_1', 'W_2', 'E_2', 'E_4'],
      ['M_4', 'M_1', 'M_3', 'W_4', 'W_2', 'E_1', 'E_4'],
      ['M_4', 'M_2', 'M_3', 'W_1', 'W_3', 'E_1', 'E_3'],
      ['M_4', 'M_1', 'M_3', 'W_4', 'W_3', 'E_2', 'E_3']
      ];
      
      const dungeons = [[385, 554], [175, 133], [428, 284]];
      
      
      const escapeDoors = [[682, 240], [45, 320], [682, 260], [45, 300]];
      
      const widthM = 166.2;
      const law_urls = ['https://www.bilibili.com/video/BV1oauC6kEy9', 'https://v.douyin.com/b_OabxYks7k/'];
      const fixedHint = translate("maps.armsFactory.fixedHint");
      const hints = [
      translate("maps.armsFactory.hintsZero"),
      translate("maps.armsFactory.hintsOne"),
      translate("maps.armsFactory.hintsZero"),
      translate("maps.armsFactory.hintsThree"),
      translate("maps.armsFactory.hintsZero")
    ];
      
      
      
      
      const fixedSpawns = {
        professor: { label: translate("maps.armsFactory.professor.label"), icon: 'scale', points: [[348, 551], [389, 144]] },
        photographer: {
          label: translate("maps.armsFactory.photographer.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/6/64/mx0ydtuij8mg5bp32tuu9e1lq8usba6.png',
          points: [
            { p: [201, 266], d: [0.32, 0.21] },
            { p: [462, 139], d: [-0.01, -0.38] },
            { p: [351, 364], d: [-0.38, 0] },
            { p: [522, 518], d: [0, -0.38] },
            { p: [272, 172], d: [0, -0.38] },
            { p: [442, 308], d: [-0.38, 0] },
            { p: [296, 507], d: [-0.19, 0.33] },
            { p: [233, 110], d: [-0.38, 0] },
            { p: [240, 450], d: [0.38, 0] },
            { p: [607, 248], d: [-0.36, -0.13] },
            { p: [479, 585], d: [0.37, -0.1] },
            { p: [132, 566], d: [0.01, 0.38] },
            { p: [619, 556], d: [-0.37, -0.09] },
            { p: [131, 383], d: [-0.3, 0.23] },
            { p: [157, 217], d: [-0.38, -0.01] },
          ],
        },
        madEyes: {
          label: translate("maps.armsFactory.madEyes.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/f/f7/jbqdvznjphrq602qh303r24qdn3ti4b.png',
          rangeM: 21.11,
          rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
          points: [
            { p: [223, 547], d: [0.38, 0.00] },
            { p: [606, 529], d: [0.15, -0.35] },
            { p: [466, 144], d: [0.10, 0.37] },
            { p: [526, 388], d: [-0.29, -0.24] },
            { p: [387, 509], d: [-0.00, -0.38] },
            { p: [647, 212], d: [-0.00, -0.38] },
            { p: [262, 128], d: [0.10, 0.37] },
            { p: [351, 309], d: [0.38, 0.00] },
            { p: [100, 121], d: [-0.05, -0.38] },
            { p: [118, 301], d: [-0.25, 0.29] },
          ],
        },
        smileyFace: {
          label: translate("maps.armsFactory.smileyFace.label"),
          icon: 'partWindWing', 
          points: [
            
            { p: [267, 164], icon: 'partWindWing' },
            { p: [254, 160], icon: 'partWindWing' },
            { p: [428, 393], icon: 'partWindWing' },
            { p: [585, 175], icon: 'partWindWing' },
            { p: [315, 541], icon: 'partWindWing' },
            { p: [509, 601], icon: 'partWindWing' },
            { p: [114, 498], icon: 'partWindWing' },
            { p: [420, 109], icon: 'partWindWing' },
            { p: [628, 580], icon: 'partWindWing' },
            { p: [443, 560], icon: 'partWindWing' },
            { p: [156, 213], icon: 'partWindWing' },
            { p: [682, 374], icon: 'partWindWing' },
            { p: [344, 116], icon: 'partWindWing' },
            
            { p: [530, 567], icon: 'partDrill' },
            { p: [415, 112], icon: 'partDrill' },
            { p: [255, 518], icon: 'partDrill' },
            { p: [596, 165], icon: 'partDrill' },
            { p: [124, 474], icon: 'partDrill' },
            { p: [376, 379], icon: 'partDrill' },
            { p: [277, 199], icon: 'partDrill' },
            { p: [109, 556], icon: 'partDrill' },
            { p: [186, 345], icon: 'partDrill' },
            { p: [528, 259], icon: 'partDrill' },
            { p: [370, 344], icon: 'partDrill' },
            { p: [603, 93], icon: 'partDrill' },
            { p: [141, 210], icon: 'partDrill' },
            
            { p: [88, 499], icon: 'partPropeller' },
            { p: [305, 537], icon: 'partPropeller' },
            { p: [467, 97], icon: 'partPropeller' },
            { p: [392, 371], icon: 'partPropeller' },
            { p: [587, 185], icon: 'partPropeller' },
            { p: [230, 197], icon: 'partPropeller' },
            { p: [502, 589], icon: 'partPropeller' },
            { p: [540, 454], icon: 'partPropeller' },
            { p: [312, 203], icon: 'partPropeller' },
            { p: [461, 250], icon: 'partPropeller' },
            { p: [303, 392], icon: 'partPropeller' },
          ],
        },
      };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, widthM,
      fixedSpawns, 
      law_urls, fixedHint, hints,
    deduction: (() => {
      const { fixed, region, exactly, either } = dedHelpers(ciphers);
      const rules = [
        fixed([translate("maps.armsFactory.m4.name")]),
        region(translate("maps.armsFactory.rules"), 2, 3, [translate("maps.armsFactory.w1.name"), translate("maps.armsFactory.w2.name"), translate("maps.armsFactory.w3.name"), translate("maps.armsFactory.w4.name")]),
        region(translate("maps.armsFactory.rulesAlternate"), 2, 3, [translate("maps.armsFactory.m1.name"), translate("maps.armsFactory.m2.name"), translate("maps.armsFactory.m3.name"), translate("maps.armsFactory.m4.name")]),
        region(translate("maps.armsFactory.rulesThird"), 2, 2, [translate("maps.armsFactory.e1.name"), translate("maps.armsFactory.e2.name"), translate("maps.armsFactory.e3.name"), translate("maps.armsFactory.e4.name")]),
        either([translate("maps.armsFactory.e1.name"), translate("maps.armsFactory.e2.name")]),
        either([translate("maps.armsFactory.e3.name"), translate("maps.armsFactory.e4.name")]),
        either([translate("maps.armsFactory.m2.name"), translate("maps.armsFactory.m1.name")]),
        exactly(2, [translate("maps.armsFactory.w4.name"), translate("maps.armsFactory.m3.name"), translate("maps.armsFactory.m2.name")]),
        exactly(2, [translate("maps.armsFactory.m1.name"), translate("maps.armsFactory.w1.name"), translate("maps.armsFactory.w2.name"), translate("maps.armsFactory.w3.name")]),
      ];
      return makeDeduction({
        mapImage, mapSize, ciphers, cipherCombinations, rules,
      });
    })(),
    };
  })(),
  (() => {
      const mapId = 1;
      const mapName = translate("maps.sacredHeartHospital.mapName");
      const mapNameEn = 'Sacred Heart Hospital';
      const mapImage = 'https://patchwiki.biligame.com/images/dwrg/6/64/'
        + '1znuvz3676hq8xyjdd26vxz99l3n3ds.png';
      const mapSize = [644, 604];
      const zonesInfo = [65.5, 19.5, 188, 174.5, 3, 3];
      const zoneNames = [
        translate("maps.sacredHeartHospital.zoneNamesZero"), translate("maps.sacredHeartHospital.zoneNamesOne"), translate("maps.sacredHeartHospital.zoneNamesTwo"),
        translate("maps.sacredHeartHospital.zoneNamesThree"), translate("maps.sacredHeartHospital.zoneNamesFour"), translate("maps.sacredHeartHospital.zoneNamesFive"),
        translate("maps.sacredHeartHospital.zoneNamesSix"), translate("maps.sacredHeartHospital.zoneNamesSeven"), translate("maps.sacredHeartHospital.zoneNamesEight")
      ];
      const ciphers = [
        { id: 'A_1', name: translate("maps.sacredHeartHospital.a1.name"),   location: [356, 297], feature: translate("maps.sacredHeartHospital.a1.feature") },
        { id: 'A_2', name: translate("maps.sacredHeartHospital.a2.name"),       location: [324, 396], feature: translate("maps.sacredHeartHospital.a1.feature") },
        { id: 'B_1', name: translate("maps.armsFactory.w2.name"),       location: [510, 147], feature: translate("maps.sacredHeartHospital.b1.feature") },
        { id: 'B_2', name: translate("maps.sacredHeartHospital.b2.name"), location: [377, 77], feature: translate("maps.sacredHeartHospital.b1.feature") },
        { id: 'B_3', name: translate("maps.sacredHeartHospital.b3.name"), location: [248, 96], feature: translate("maps.sacredHeartHospital.b1.feature") },
        { id: 'C_1', name: translate("maps.sacredHeartHospital.c1.name"),   location: [149, 202], feature: translate("maps.sacredHeartHospital.c1.feature") },
        { id: 'C_2', name: translate("maps.sacredHeartHospital.c2.name"),     location: [129, 415], feature: translate("maps.sacredHeartHospital.c1.feature") },
        { id: 'C_3', name: translate("maps.sacredHeartHospital.c3.name"), location: [226, 480], feature: translate("maps.sacredHeartHospital.c1.feature") },
        { id: 'D_1', name: translate("maps.sacredHeartHospital.d1.name"),   location: [422, 470], feature: translate("maps.sacredHeartHospital.d1.feature") },
        { id: 'D_2', name: translate("maps.sacredHeartHospital.d2.name"),   location: [520, 506], feature: translate("maps.sacredHeartHospital.d1.feature") },
        { id: 'D_3', name: translate("maps.sacredHeartHospital.d3.name"),     location: [527, 346], feature: translate("maps.sacredHeartHospital.d1.feature") },
      ];
      
      const cipherCombinations = [
      ['A_2', 'B_1', 'B_3', 'C_1', 'C_2', 'D_1', 'D_3'],
      ['A_2', 'B_2', 'B_3', 'C_1', 'C_3', 'D_2', 'D_3'],
      ['A_1', 'B_1', 'B_3', 'C_2', 'C_3', 'D_1', 'D_3'],
      ['A_1', 'B_1', 'B_2', 'C_1', 'C_3', 'D_1', 'D_2'],
      ['A_2', 'B_1', 'B_2', 'C_1', 'C_2', 'D_1', 'D_2']
      ];
      
      const dungeons = [[146, 321], [512, 480], [581, 297]];
      
      const escapeDoors = [[326, 530], [615, 88], [311, 530], [615, 104]];
      
      const widthM = 151.5;
      const law_urls = ['https://www.bilibili.com/video/BV117tB6pE5R', 'https://v.douyin.com/WLJ-VhInJbE'];
      const fixedHint = translate("maps.sacredHeartHospital.fixedHint");
      const hints = [
      '',
      translate("maps.sacredHeartHospital.hintsOne"),
      translate("maps.sacredHeartHospital.hintsTwo"),
      translate("maps.sacredHeartHospital.hintsThree"),
      translate("maps.sacredHeartHospital.hintsFour")
    ];
      
      const fixedSpawns = {
        professor: { label: translate("maps.armsFactory.professor.label"), icon: 'scale', points: [[395, 454], [250, 202]] },
        photographer: {
          label: translate("maps.armsFactory.photographer.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/6/64/mx0ydtuij8mg5bp32tuu9e1lq8usba6.png',
          points: [
            { p: [537, 366], d: [0.00, 0.36] },
            { p: [272, 509], d: [0.00, 0.36] },
            { p: [178, 384], d: [-0.03, -0.36] },
            { p: [312, 385], d: [0.36, -0.02] },
            { p: [401, 58], d: [0.36, -0.00] },
            { p: [511, 179], d: [-0.00, -0.36] },
            { p: [441, 444], d: [-0.14, -0.33] },
            { p: [196, 111], d: [-0.23, -0.27] },
            { p: [516, 485], d: [-0.36, 0.00] },
            { p: [177, 181], d: [0.03, 0.36] },
            { p: [129, 469], d: [-0.03, -0.36] },
            { p: [329, 165], d: [0.11, -0.34] },
            { p: [235, 281], d: [-0.32, -0.16] },
            { p: [379, 314], d: [-0.36, 0.00] },
            { p: [302, 79], d: [-0.36, 0.00] },
          ],
        },
        madEyes: {
          label: translate("maps.armsFactory.madEyes.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/f/f7/jbqdvznjphrq602qh303r24qdn3ti4b.png',
          rangeM: 21.11,
          rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
          points: [
            { p: [321, 299], d: [0.03, 0.36] },
            { p: [375, 111], d: [0.36, -0.00] },
            { p: [556, 131], d: [-0.36, 0.02] },
            { p: [554, 377], d: [0.26, -0.25] },
            { p: [469, 464], d: [-0.32, 0.16] },
            { p: [239, 127], d: [0.08, -0.35] },
            { p: [296, 505], d: [-0.03, -0.36] },
            { p: [484, 254], d: [-0.24, -0.27] },
            { p: [132, 439], d: [0.01, -0.36] },
            { p: [157, 263], d: [0.17, -0.31] },
          ],
        },
        smileyFace: {
          label: translate("maps.armsFactory.smileyFace.label"),
          icon: 'partWindWing', 
          points: [
            
            { p: [316, 390], icon: 'partWindWing' },
            { p: [303, 417], icon: 'partWindWing' },
            { p: [418, 443], icon: 'partWindWing' },
            { p: [148, 191], icon: 'partWindWing' },
            { p: [519, 148], icon: 'partWindWing' },
            { p: [383, 91], icon: 'partWindWing' },
            { p: [546, 488], icon: 'partWindWing' },
            { p: [139, 403], icon: 'partWindWing' },
            { p: [146, 450], icon: 'partWindWing' },
            { p: [288, 517], icon: 'partWindWing' },
            { p: [538, 369], icon: 'partWindWing' },
            { p: [373, 36], icon: 'partWindWing' },
            
            { p: [453, 467], icon: 'partDrill' },
            { p: [329, 422], icon: 'partDrill' },
            { p: [526, 154], icon: 'partDrill' },
            { p: [162, 199], icon: 'partDrill' },
            { p: [405, 70], icon: 'partDrill' },
            { p: [116, 424], icon: 'partDrill' },
            { p: [540, 517], icon: 'partDrill' },
            { p: [271, 517], icon: 'partDrill' },
            { p: [232, 160], icon: 'partDrill' },
            { p: [542, 510], icon: 'partDrill' },
            { p: [544, 414], icon: 'partDrill' },
            { p: [347, 44], icon: 'partDrill' },
            { p: [246, 346], icon: 'partDrill' },
            
            { p: [505, 168], icon: 'partPropeller' },
            { p: [495, 145], icon: 'partPropeller' },
            { p: [382, 59], icon: 'partPropeller' },
            { p: [509, 496], icon: 'partPropeller' },
            { p: [135, 209], icon: 'partPropeller' },
            { p: [116, 422], icon: 'partPropeller' },
            { p: [425, 487], icon: 'partPropeller' },
            { p: [335, 412], icon: 'partPropeller' },
            { p: [374, 309], icon: 'partPropeller' },
            { p: [524, 169], icon: 'partPropeller' },
            { p: [333, 149], icon: 'partPropeller' },
            { p: [219, 309], icon: 'partPropeller' },
          ],
        },
      };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, widthM,
      fixedSpawns, 
      law_urls, fixedHint, hints,
    deduction: (() => {
      const { exactly, either, same, atLeast1, chain } = dedHelpers(ciphers);
      const rules = [
        either([translate("maps.sacredHeartHospital.a1.name"), translate("maps.sacredHeartHospital.a2.name")]),
        exactly(2, [translate("maps.armsFactory.w2.name"), translate("maps.sacredHeartHospital.b2.name"), translate("maps.sacredHeartHospital.b3.name")]),
        exactly(2, [translate("maps.sacredHeartHospital.c1.name"), translate("maps.sacredHeartHospital.c2.name"), translate("maps.sacredHeartHospital.c3.name")]),
        exactly(2, [translate("maps.sacredHeartHospital.d1.name"), translate("maps.sacredHeartHospital.d2.name"), translate("maps.sacredHeartHospital.d3.name")]),
        same([translate("maps.armsFactory.w2.name"), translate("maps.sacredHeartHospital.d1.name")]),
        same([translate("maps.sacredHeartHospital.b2.name"), translate("maps.sacredHeartHospital.d2.name")]),
        same([translate("maps.sacredHeartHospital.b3.name"), translate("maps.sacredHeartHospital.d3.name")]),
        exactly(2, [translate("maps.sacredHeartHospital.a2.name"), translate("maps.sacredHeartHospital.c3.name"), translate("maps.sacredHeartHospital.d1.name")]),
        atLeast1([translate("maps.sacredHeartHospital.c1.name"), translate("maps.armsFactory.w2.name")]),
        chain(translate("maps.sacredHeartHospital.rules"), 'no', true,
          [translate("maps.armsFactory.w2.name"), translate("maps.sacredHeartHospital.b2.name"), translate("maps.sacredHeartHospital.b3.name"), translate("maps.sacredHeartHospital.c1.name"), translate("maps.sacredHeartHospital.c2.name"),
            translate("maps.sacredHeartHospital.c3.name"), translate("maps.sacredHeartHospital.d1.name"), translate("maps.sacredHeartHospital.d2.name"), translate("maps.sacredHeartHospital.d3.name")],
          translate("maps.sacredHeartHospital.rulesAlternate")
            + translate("maps.sacredHeartHospital.rulesThird")),
      ];
      return makeDeduction({
        mapImage, mapSize, ciphers, cipherCombinations, rules,
      });
    })(),
    };
  })(),
  (() => {
      const mapId = 2;
      const mapName = translate("maps.theRedChurch.mapName");
      const mapNameEn = 'The Red Church';
      const mapImage = 'https://patchwiki.biligame.com/images/dwrg/2/21/'
        + 'tqsaom4k0h9tijgczzutlq6tyatxtty.png';
      const mapSize = [596, 599];
      const zonesInfo = [72.5, 104.3, 163.7, 141.7, 3, 3];
      const zoneNames = [
        translate("maps.theRedChurch.zoneNamesZero"), translate("maps.theRedChurch.zoneNamesOne"), translate("maps.theRedChurch.zoneNamesTwo"),
        translate("maps.theRedChurch.zoneNamesThree"), translate("maps.theRedChurch.zoneNamesFour"), translate("maps.theRedChurch.zoneNamesFive"),
        translate("maps.theRedChurch.zoneNamesSix"), translate("maps.theRedChurch.zoneNamesSeven"), translate("maps.theRedChurch.zoneNamesEight")
      ];
      const ciphers = [
        { id: 'E_4', name: translate("maps.theRedChurch.e4.name"),       location: [527, 435], feature: translate("maps.theRedChurch.e4.feature"), zoneLabel: translate("maps.theRedChurch.e4.zoneLabel"), locked: true },
        { id: 'E_1', name: translate("maps.theRedChurch.e1.name"),       location: [444, 160], feature: translate("maps.theRedChurch.e1.feature"), zoneLabel: translate("maps.theRedChurch.e1.zoneLabel") },
        { id: 'E_2', name: translate("maps.armsFactory.w3.name"),   location: [511, 242], feature: translate("maps.theRedChurch.e2.feature"), zoneLabel: translate("maps.theRedChurch.e2.zoneLabel") },
        { id: 'E_3', name: translate("maps.armsFactory.m2.name"),     location: [401, 272], feature: translate("maps.theRedChurch.e3.feature"), zoneLabel: translate("maps.theRedChurch.e2.zoneLabel") },
        { id: 'M_1', name: translate("maps.armsFactory.w2.name"),       location: [287, 143], feature: translate("maps.theRedChurch.m1.feature"), zoneLabel: translate("maps.theRedChurch.m1.zoneLabel") },
        { id: 'M_2', name: translate("maps.theRedChurch.m2.name"),       location: [296, 313], feature: translate("maps.theRedChurch.m2.feature"), zoneLabel: translate("maps.theRedChurch.m2.zoneLabel") },
        { id: 'M_3', name: translate("maps.theRedChurch.m3.name"),   location: [342, 499], feature: translate("maps.theRedChurch.m3.feature"), zoneLabel: translate("maps.theRedChurch.m3.zoneLabel") },
        { id: 'W_1', name: translate("maps.theRedChurch.w1.name"),     location: [121, 177], feature: translate("maps.theRedChurch.w1.feature"), zoneLabel: translate("maps.theRedChurch.w1.zoneLabel") },
        { id: 'W_2', name: translate("maps.theRedChurch.w2.name"), location: [168, 240], feature: translate("maps.theRedChurch.w2.feature"), zoneLabel: translate("maps.theRedChurch.w2.zoneLabel") },
        { id: 'W_3', name: translate("maps.theRedChurch.w3.name"), location: [131, 356], feature: translate("maps.theRedChurch.w3.feature"), zoneLabel: translate("maps.theRedChurch.w2.zoneLabel") },
        { id: 'W_4', name: translate("maps.theRedChurch.w4.name"),     location: [128, 475], feature: translate("maps.theRedChurch.w4.feature"), zoneLabel: translate("maps.theRedChurch.w4.zoneLabel") },
      ];
      
      const cipherCombinations = [
      ['E_4', 'E_3', 'M_1', 'M_3', 'W_1', 'W_3', 'W_4'],
      ['E_4', 'E_1', 'M_2', 'M_3', 'W_1', 'W_2', 'W_4'],
      ['E_4', 'E_1', 'E_3', 'M_1', 'M_2', 'W_1', 'W_4'],
      ['E_4', 'E_1', 'E_2', 'M_2', 'M_3', 'W_1', 'W_3'],
      ['E_4', 'E_2', 'M_1', 'M_2', 'M_3', 'W_2', 'W_4']
      ];
      
      const dungeons = [[121, 474], [418, 417], [539, 225]];
      
      const escapeDoors = [[297, 543], [474, 90], [283, 543], [488, 90]];
      
      const widthM = 153.5;
      const law_urls = ['https://www.bilibili.com/video/BV169Y66PEiS', 'https://v.douyin.com/t7aa5IHJh9M'];
      const fixedHint = translate("maps.theRedChurch.fixedHint");
      const hints = [
      translate("maps.theRedChurch.hintsZero"),
      translate("maps.theRedChurch.hintsOne"),
      translate("maps.theRedChurch.hintsTwo"),
      '',
      translate("maps.theRedChurch.hintsFour")
    ];
      
      const fixedSpawns = {
        professor: { label: translate("maps.armsFactory.professor.label"), icon: 'scale', points: [[406, 258], [128, 441]] },
        photographer: {
          label: translate("maps.armsFactory.photographer.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/6/64/mx0ydtuij8mg5bp32tuu9e1lq8usba6.png',
          points: [
            { p: [152, 341], d: [-0.33, 0.00] },
            { p: [401, 315], d: [-0.33, 0.00] },
            { p: [156, 509], d: [0.00, 0.33] },
            { p: [350, 513], d: [-0.00, -0.33] },
            { p: [155, 223], d: [-0.00, -0.33] },
            { p: [128, 178], d: [0.00, 0.33] },
            { p: [321, 128], d: [-0.33, 0.00] },
            { p: [411, 160], d: [-0.33, 0.00] },
            { p: [245, 312], d: [0.33, -0.00] },
            { p: [545, 235], d: [-0.33, 0.00] },
            { p: [528, 453], d: [-0.00, -0.33] },
            { p: [241, 434], d: [-0.00, -0.33] },
            { p: [429, 421], d: [-0.33, 0.00] },
            { p: [326, 227], d: [-0.00, -0.33] },
            { p: [483, 334], d: [0.33, -0.00] },
          ],
        },
        madEyes: {
          label: translate("maps.armsFactory.madEyes.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/f/f7/jbqdvznjphrq602qh303r24qdn3ti4b.png',
          rangeM: 21.11,
          rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
          points: [
            { p: [288, 482], d: [-0.33, 0.00] },
            { p: [475, 281], d: [0.00, 0.33] },
            { p: [364, 386], d: [0.33, -0.00] },
            { p: [483, 419], d: [0.33, -0.00] },
            { p: [498, 163], d: [0.33, -0.00] },
            { p: [275, 154], d: [0.00, 0.33] },
            { p: [136, 187], d: [0.00, 0.33] },
            { p: [276, 313], d: [0.33, -0.00] },
            { p: [145, 436], d: [0.00, 0.33] },
          ],
        },
        smileyFace: {
          label: translate("maps.theRedChurch.smileyFace.label"),
          icon: 'partDrill', 
          points: [
            
            { p: [456, 169], icon: 'partWindWing' },
            { p: [305, 344], icon: 'partWindWing' },
            { p: [402, 260], icon: 'partWindWing' },
            { p: [290, 167], icon: 'partWindWing' },
            { p: [533, 404], icon: 'partWindWing' },
            { p: [128, 194], icon: 'partWindWing' },
            { p: [118, 460], icon: 'partWindWing' },
            { p: [342, 429], icon: 'partWindWing' },
            { p: [335, 94], icon: 'partWindWing' },
            { p: [234, 493], icon: 'partWindWing' },
            { p: [427, 193], icon: 'partWindWing' },
            
            { p: [133, 448], icon: 'partDrill' },
            { p: [140, 192], icon: 'partDrill' },
            { p: [424, 267], icon: 'partDrill' },
            { p: [299, 284], icon: 'partDrill' },
            { p: [296, 151], icon: 'partDrill' },
            { p: [431, 169], icon: 'partDrill' },
            { p: [528, 418], icon: 'partDrill' },
            { p: [199, 328], icon: 'partDrill' },
            { p: [149, 147], icon: 'partDrill' },
            { p: [438, 193], icon: 'partDrill' },
            { p: [353, 435], icon: 'partDrill' },
            { p: [450, 304], icon: 'partDrill' },
            { p: [135, 418], icon: 'partDrill' },
            
            { p: [413, 263], icon: 'partPropeller' },
            { p: [299, 335], icon: 'partPropeller' },
            { p: [534, 448], icon: 'partPropeller' },
            { p: [120, 191], icon: 'partPropeller' },
            { p: [140, 487], icon: 'partPropeller' },
            { p: [277, 132], icon: 'partPropeller' },
            { p: [441, 142], icon: 'partPropeller' },
            { p: [296, 325], icon: 'partPropeller' },
            { p: [315, 136], icon: 'partPropeller' },
            { p: [423, 399], icon: 'partPropeller' },
            { p: [148, 392], icon: 'partPropeller' },
          ],
        },
      };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, widthM,
      fixedSpawns, 
      law_urls, fixedHint, hints,
    deduction: (() => {
      const { fixed, region, exactly, atLeast1, chain } = dedHelpers(ciphers);
      const rules = [
        fixed([translate("maps.theRedChurch.e4.name")]),
        region(translate("maps.theRedChurch.rules"), 2, 3, [translate("maps.theRedChurch.w1.name"), translate("maps.theRedChurch.w2.name"), translate("maps.theRedChurch.w3.name"), translate("maps.theRedChurch.w4.name")]),
        region(translate("maps.armsFactory.rulesAlternate"), 2, 3, [translate("maps.armsFactory.w2.name"), translate("maps.theRedChurch.m2.name"), translate("maps.theRedChurch.m3.name")]),
        region(translate("maps.theRedChurch.rulesAlternate"), 2, 3, [translate("maps.theRedChurch.e1.name"), translate("maps.armsFactory.w3.name"), translate("maps.armsFactory.m2.name"), translate("maps.theRedChurch.e4.name")]),
        atLeast1([translate("maps.theRedChurch.w1.name"), translate("maps.theRedChurch.w2.name")]),
        atLeast1([translate("maps.theRedChurch.w3.name"), translate("maps.theRedChurch.w4.name")]),
        chain(translate("maps.chain"), 'yes', false,
          [translate("maps.theRedChurch.w3.name"), translate("maps.theRedChurch.w2.name"), translate("maps.armsFactory.m2.name"), translate("maps.armsFactory.w3.name")],
          translate("maps.theRedChurch.rulesThird")),
        exactly(2, [translate("maps.theRedChurch.m2.name"), translate("maps.armsFactory.m2.name"), translate("maps.theRedChurch.m3.name")]),
        exactly(2, [translate("maps.armsFactory.w2.name"), translate("maps.theRedChurch.e1.name"), translate("maps.theRedChurch.m3.name")]),
        exactly(2, [translate("maps.theRedChurch.w1.name"), translate("maps.theRedChurch.w4.name"), translate("maps.armsFactory.w3.name")]),
        exactly(2, [translate("maps.theRedChurch.w3.name"), translate("maps.theRedChurch.w4.name"), translate("maps.theRedChurch.m2.name")]),
        exactly(3, [translate("maps.theRedChurch.w1.name"), translate("maps.armsFactory.w2.name"), translate("maps.theRedChurch.m2.name"), translate("maps.theRedChurch.m3.name")]),
        atLeast1([translate("maps.theRedChurch.w1.name"), translate("maps.armsFactory.w2.name")]),
        atLeast1([translate("maps.theRedChurch.w4.name"), translate("maps.theRedChurch.m3.name")]),
        ];
      return makeDeduction({
        mapImage, mapSize, ciphers, cipherCombinations, rules, hints,
      });
    })(),
    };
  })(),
  (() => {
      const mapId = 3;
      const mapName = translate("maps.lakesideVillage.mapName");
      const mapNameEn = 'Lakeside Village';
      const mapImage = 'https://patchwiki.biligame.com/images/dwrg/0/0e/'
        + 'h7t6n6gum5qpc0h8mhhk5fissh04xbq.png';
      const mapSize = [1280, 1208];
      const zonesInfo = [154, 202, 244, 281, 4, 3];
      const zoneNames = [
        translate("maps.lakesideVillage.zoneNamesZero"), translate("maps.lakesideVillage.zoneNamesOne"), translate("maps.lakesideVillage.zoneNamesTwo"),
        translate("maps.lakesideVillage.zoneNamesThree"), translate("maps.lakesideVillage.zoneNamesFour"), translate("maps.lakesideVillage.zoneNamesFive"),
        translate("maps.lakesideVillage.zoneNamesSix"), translate("maps.lakesideVillage.zoneNamesSeven"), translate("maps.lakesideVillage.zoneNamesEight"),
        translate("maps.lakesideVillage.zoneNamesNine"), translate("maps.lakesideVillage.zoneNamesTen"), translate("maps.lakesideVillage.zoneNamesEleven")
      ];
      const ciphers = [
        { id: 'E_1', name: translate("maps.lakesideVillage.e1.name"),     location: [1132, 680], feature: translate("maps.lakesideVillage.e1.feature"), locked: true },
        { id: 'E_2', name: translate("maps.lakesideVillage.e2.name"), location: [993, 364], feature: translate("maps.lakesideVillage.e2.feature") },
        { id: 'E_3', name: translate("maps.lakesideVillage.e3.name"), location: [976, 857], feature: translate("maps.lakesideVillage.e3.feature") },
        { id: 'M_1', name: translate("maps.lakesideVillage.m1.name"), location: [709, 325], feature: translate("maps.lakesideVillage.m1.feature") },
        { id: 'M_2', name: translate("maps.lakesideVillage.m2.name"),     location: [651, 719], feature: translate("maps.lakesideVillage.m2.feature") },
        { id: 'M_3', name: translate("maps.armsFactory.e2.name"),     location: [719, 994], feature: translate("maps.lakesideVillage.m3.feature") },
        { id: 'W_1', name: translate("maps.lakesideVillage.w1.name"),   location: [387, 245], feature: translate("maps.lakesideVillage.w1.feature") },
        { id: 'W_2', name: translate("maps.armsFactory.w2.name"),     location: [467, 352], feature: translate("maps.lakesideVillage.w1.feature") },
        { id: 'W_3', name: translate("maps.lakesideVillage.w3.name"),     location: [370, 656], feature: translate("maps.lakesideVillage.w3.feature") },
        { id: 'W_4', name: translate("maps.lakesideVillage.w4.name"), location: [393, 830], feature: translate("maps.lakesideVillage.w4.feature") },
        { id: 'W_5', name: translate("maps.lakesideVillage.w5.name"), location: [307, 963], feature: translate("maps.lakesideVillage.w4.feature") },
      ];
      
      const cipherCombinations = [
      ['E_1', 'E_2', 'M_1', 'M_3', 'W_1', 'W_3', 'W_5'],
      ['E_1', 'E_2', 'M_1', 'M_2', 'M_3', 'W_2', 'W_5'],
      ['E_1', 'E_2', 'M_1', 'M_2', 'M_3', 'W_1', 'W_4'],
      ['E_1', 'E_3', 'M_1', 'M_2', 'W_1', 'W_3', 'W_5'],
      ['E_1', 'E_2', 'E_3', 'M_2', 'M_3', 'W_2', 'W_4']
      ];
      
      const dungeons = [[254, 638], [386, 858], [770, 860], [940, 530], [922, 308]];
      
      const escapeDoors = [[878, 1066], [200, 134], [834, 1066], [238, 134]];
      
      const widthM = 199.1;
      const law_urls = ['https://www.bilibili.com/video/BV1HvbD6pE9k', 'https://v.douyin.com/JM1zFSML9hw'];
      const fixedHint = translate("maps.lakesideVillage.fixedHint");
      const hints = [
      '',
      '',
      '',
      '',
      ''
    ];
      
      const fixedSpawns = {
        professor: { label: translate("maps.armsFactory.professor.label"), icon: 'scale', points: [[885, 876], [345, 454]] },
        photographer: {
          label: translate("maps.armsFactory.photographer.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/6/64/mx0ydtuij8mg5bp32tuu9e1lq8usba6.png',
          points: [
            { p: [254, 968], d: [-0.54, 0.02] },
            { p: [443, 835], d: [0.01, 0.54] },
            { p: [350, 625], d: [0.01, 0.54] },
            { p: [493, 296], d: [0.01, 0.54] },
            { p: [431, 212], d: [-0.44, 0.32] },
            { p: [812, 404], d: [-0.44, 0.32] },
            { p: [1019, 358], d: [0.54, 0.01] },
            { p: [922, 744], d: [0.54, -0.04] },
            { p: [811, 974], d: [0.54, -0.04] },
            { p: [1102, 738], d: [-0.01, -0.54] },
            { p: [617, 756], d: [0.30, 0.44] },
            { p: [869, 572], d: [-0.52, 0.15] },
            { p: [344, 425], d: [-0.05, 0.54] },
            { p: [637, 541], d: [-0.47, -0.25] },
            { p: [196, 201], d: [-0.54, -0.03] },
          ],
        },
        madEyes: {
          label: translate("maps.armsFactory.madEyes.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/f/f7/jbqdvznjphrq602qh303r24qdn3ti4b.png',
          rangeM: 21.11,
          rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
          points: [
            { p: [633, 555], d: [0.44, 0.30] },
            { p: [975, 352], d: [-0.54, 0.08] },
            { p: [502, 437], d: [-0.21, -0.50] },
            { p: [226, 854], d: [-0.51, 0.19] },
            { p: [743, 301], d: [-0.50, 0.22] },
            { p: [569, 232], d: [0.19, -0.51] },
            { p: [460, 654], d: [-0.54, 0.03] },
            { p: [639, 793], d: [-0.20, 0.51] },
            { p: [283, 276], d: [0.51, -0.18] },
            { p: [464, 969], d: [-0.51, -0.17] },
            { p: [834, 962], d: [-0.00, -0.54] },
            { p: [177, 515], d: [0.13, 0.52] },
            { p: [974, 653], d: [0.50, 0.20] },
            { p: [862, 522], d: [-0.17, 0.52] },
          ],
        },
        smileyFace: {
          label: translate("maps.armsFactory.smileyFace.label"),
          icon: 'partWindWing', 
          points: [
            
            { p: [978, 835], icon: 'partWindWing' },
            { p: [599, 713], icon: 'partWindWing' },
            { p: [350, 855], icon: 'partWindWing' },
            { p: [1036, 366], icon: 'partWindWing' },
            { p: [701, 983], icon: 'partWindWing' },
            { p: [472, 331], icon: 'partWindWing' },
            { p: [1108, 704], icon: 'partWindWing' },
            { p: [561, 850], icon: 'partWindWing' },
            { p: [194, 722], icon: 'partWindWing' },
            { p: [897, 654], icon: 'partWindWing' },
            { p: [644, 445], icon: 'partWindWing' },
            
            { p: [354, 850], icon: 'partDrill' },
            { p: [490, 361], icon: 'partDrill' },
            { p: [988, 825], icon: 'partDrill' },
            { p: [686, 751], icon: 'partDrill' },
            { p: [1045, 347], icon: 'partDrill' },
            { p: [1108, 706], icon: 'partDrill' },
            { p: [757, 958], icon: 'partDrill' },
            { p: [873, 621], icon: 'partDrill' },
            { p: [751, 238], icon: 'partDrill' },
            { p: [164, 723], icon: 'partDrill' },
            { p: [431, 1007], icon: 'partDrill' },
            { p: [759, 602], icon: 'partDrill' },
            { p: [1103, 570], icon: 'partDrill' },
            
            { p: [1120, 670], icon: 'partPropeller' },
            { p: [629, 743], icon: 'partPropeller' },
            { p: [1027, 372], icon: 'partPropeller' },
            { p: [993, 849], icon: 'partPropeller' },
            { p: [400, 811], icon: 'partPropeller' },
            { p: [433, 347], icon: 'partPropeller' },
            { p: [730, 964], icon: 'partPropeller' },
            { p: [1113, 726], icon: 'partPropeller' },
            { p: [521, 307], icon: 'partPropeller' },
            { p: [789, 426], icon: 'partPropeller' },
            { p: [514, 863], icon: 'partPropeller' },
          ],
        },
      };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, widthM,
      fixedSpawns, 
      law_urls, fixedHint, hints,
    deduction: (() => {
      const { fixed, region, exactly, either, same, chain } = dedHelpers(ciphers);
      const rules = [
        fixed([translate("maps.lakesideVillage.e1.name")]),
        region(translate("maps.armsFactory.rules"), 2, 3,
          [translate("maps.lakesideVillage.w1.name"), translate("maps.armsFactory.w2.name"), translate("maps.lakesideVillage.w3.name"), translate("maps.lakesideVillage.w4.name"), translate("maps.lakesideVillage.w5.name")]),
        region(translate("maps.lakesideVillage.rules"), 2, 3, [translate("maps.lakesideVillage.m1.name"), translate("maps.lakesideVillage.m2.name"), translate("maps.armsFactory.e2.name")]),
        region(translate("maps.armsFactory.rulesThird"), 2, 3, [translate("maps.lakesideVillage.e2.name"), translate("maps.lakesideVillage.e1.name"), translate("maps.lakesideVillage.e3.name")]),
        region(translate("maps.lakesideVillage.rulesAlternate"), 2, 3, [translate("maps.lakesideVillage.w1.name"), translate("maps.armsFactory.w2.name"), translate("maps.lakesideVillage.m1.name"), translate("maps.lakesideVillage.e2.name")]),
        region(translate("maps.lakesideVillage.rulesThird"), 2, 3, [translate("maps.lakesideVillage.w3.name"), translate("maps.lakesideVillage.m2.name"), translate("maps.lakesideVillage.e1.name")]),
        region(translate("maps.lakesideVillage.rulesFourth"), 2, 3,
          [translate("maps.lakesideVillage.w4.name"), translate("maps.lakesideVillage.w5.name"), translate("maps.armsFactory.e2.name"), translate("maps.lakesideVillage.e3.name")]),
        either([translate("maps.lakesideVillage.w1.name"), translate("maps.armsFactory.w2.name")]),
        either([translate("maps.lakesideVillage.w4.name"), translate("maps.lakesideVillage.w5.name")]),
        same([translate("maps.lakesideVillage.e2.name"), translate("maps.armsFactory.e2.name")]),
        exactly(2, [translate("maps.lakesideVillage.m1.name"), translate("maps.lakesideVillage.e2.name"), translate("maps.lakesideVillage.e3.name")]),
        exactly(2, [translate("maps.lakesideVillage.e2.name"), translate("maps.lakesideVillage.m2.name"), translate("maps.lakesideVillage.w3.name")]),
        chain(translate("maps.lakesideVillage.rulesFifth"), 'yes', false,
          [translate("maps.lakesideVillage.w1.name"), translate("maps.armsFactory.w2.name"), translate("maps.lakesideVillage.w3.name"), translate("maps.lakesideVillage.w4.name"), translate("maps.lakesideVillage.w5.name")],
          translate("maps.lakesideVillage.rulesSixth")
            + translate("maps.lakesideVillage.rulesSeventh")),
      ];
      return makeDeduction({
        mapImage, mapSize, ciphers, cipherCombinations, rules,
      });
    })(),
    };
  })(),
  (() => {
      const mapId = 4;
      const mapName = translate("maps.moonlitRiverPark.mapName");
      const mapNameEn = 'Moonlit River Park';
      const mapImage = 'https://patchwiki.biligame.com/images/dwrg/1/10/'
        + '3qp1mkiy5mhg421bfbytquibtwyh5j8.png';
      const mapSize = [1492, 1028];
      const zonesInfo = [14, 89.8, 364.6, 281.2, 4, 3];
      const zoneNames = [
        translate("maps.moonlitRiverPark.zoneNamesZero"), translate("maps.moonlitRiverPark.zoneNamesOne"), translate("maps.moonlitRiverPark.zoneNamesTwo"),
        translate("maps.moonlitRiverPark.zoneNamesThree"), translate("maps.moonlitRiverPark.zoneNamesFour"), translate("maps.moonlitRiverPark.zoneNamesFive"),
        translate("maps.moonlitRiverPark.zoneNamesSix"), translate("maps.moonlitRiverPark.zoneNamesSeven"), translate("maps.moonlitRiverPark.zoneNamesEight"),
        translate("maps.moonlitRiverPark.zoneNamesNine"), translate("maps.moonlitRiverPark.zoneNamesTen"), translate("maps.moonlitRiverPark.zoneNamesEleven")
      ];
      const ciphers = [
        { id: 'M_1', name: translate("maps.moonlitRiverPark.m1.name"),       location: [711, 261], feature: translate("maps.moonlitRiverPark.m1.feature"), locked: true },
        { id: 'E_1', name: translate("maps.moonlitRiverPark.e1.name"),     location: [967, 757], feature: translate("maps.lakesideVillage.e1.feature"), locked: true },
        { id: 'E_2', name: translate("maps.moonlitRiverPark.e2.name"),    location: [1371, 311], feature: translate("maps.moonlitRiverPark.e2.feature") },
        { id: 'E_3', name: translate("maps.moonlitRiverPark.e3.name"),  location: [1036, 289], feature: translate("maps.moonlitRiverPark.e3.feature") },
        { id: 'E_4', name: translate("maps.moonlitRiverPark.e4.name"),   location: [1174, 517], feature: translate("maps.moonlitRiverPark.e4.feature") },
        { id: 'E_5', name: translate("maps.moonlitRiverPark.e5.name"), location: [1323, 769], feature: translate("maps.moonlitRiverPark.e5.feature") },
        { id: 'W_1', name: translate("maps.moonlitRiverPark.w1.name"),     location: [257, 301], feature: translate("maps.moonlitRiverPark.w1.feature") },
        { id: 'W_2', name: translate("maps.moonlitRiverPark.w2.name"),       location: [72, 464], feature: translate("maps.moonlitRiverPark.w1.feature") },
        { id: 'W_3', name: translate("maps.moonlitRiverPark.w3.name"),    location: [165, 753], feature: translate("maps.moonlitRiverPark.w3.feature") },
        { id: 'W_4', name: translate("maps.moonlitRiverPark.w4.name"),   location: [444, 873], feature: translate("maps.moonlitRiverPark.w4.feature") },
        { id: 'W_5', name: translate("maps.moonlitRiverPark.w5.name"),    location: [517, 607], feature: translate("maps.moonlitRiverPark.w1.feature") },
      ];
      
      const cipherCombinations = [
      ['M_1', 'E_1', 'E_4', 'E_5', 'W_1', 'W_2', 'W_4'],
      ['M_1', 'E_1', 'E_2', 'E_5', 'W_1', 'W_3', 'W_4'],
      ['M_1', 'E_1', 'E_3', 'E_5', 'W_2', 'W_3', 'W_5'],
      ['M_1', 'E_1', 'E_3', 'E_5', 'W_1', 'W_3', 'W_5'],
      ['M_1', 'E_1', 'E_2', 'E_4', 'W_2', 'W_4', 'W_5']
      ];
      
      const dungeons = [[1288, 709], [746, 469], [417, 911], [68, 425], [532, 138]];
      
      const escapeDoors = [[1312, 88], [130, 946], [1340, 88], [101, 946]];
      
      const widthM = 184.4;
      const law_urls = ['https://www.bilibili.com/video/BV1gN8t6BEJp', 'https://v.douyin.com/W5bCLGlPRYg'];
      const fixedHint = translate("maps.moonlitRiverPark.fixedHint");
      const hints = [
      '',
      '',
      '',
      '',
      ''
    ];
      
      const fixedSpawns = {
        professor: { label: translate("maps.armsFactory.professor.label"), icon: 'scale', points: [[647, 750], [933, 254]] },
        photographer: {
          label: translate("maps.armsFactory.photographer.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/6/64/mx0ydtuij8mg5bp32tuu9e1lq8usba6.png',
          points: [
            { p: [491, 497], d: [0.68, -0.01] },
            { p: [571, 296], d: [-0.00, 0.68] },
            { p: [972, 256], d: [-0.59, -0.35] },
            { p: [1258, 517], d: [-0.40, -0.55] },
            { p: [1280, 764], d: [0.06, -0.68] },
            { p: [936, 822], d: [0.24, -0.64] },
            { p: [763, 436], d: [-0.68, 0.05] },
            { p: [525, 826], d: [-0.68, -0.06] },
            { p: [208, 758], d: [0.00, -0.68] },
            { p: [52, 438], d: [0.00, -0.68] },
            { p: [315, 376], d: [0.00, -0.68] },
            { p: [295, 566], d: [0.00, -0.68] },
            { p: [1155, 349], d: [0.66, -0.19] },
            { p: [730, 726], d: [0.68, -0.00] },
            { p: [992, 457], d: [0.68, -0.00] },
          ],
        },
        madEyes: {
          label: translate("maps.armsFactory.madEyes.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/f/f7/jbqdvznjphrq602qh303r24qdn3ti4b.png',
          rangeM: 21.11,
          rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
          points: [
            { p: [1275, 777], d: [-0.00, 0.68] },
            { p: [1316, 451], d: [0.00, -0.68] },
            { p: [1068, 562], d: [-0.68, 0.00] },
            { p: [1069, 262], d: [0.34, 0.59] },
            { p: [448, 537], d: [0.05, -0.68] },
            { p: [853, 377], d: [-0.53, 0.44] },
            { p: [716, 625], d: [-0.68, 0.05] },
            { p: [324, 252], d: [-0.44, -0.52] },
            { p: [168, 443], d: [-0.68, 0.00] },
            { p: [670, 239], d: [-0.65, -0.20] },
            { p: [531, 821], d: [0.68, -0.04] },
            { p: [183, 825], d: [-0.68, 0.00] },
          ],
        },
        smileyFace: {
          label: translate("maps.armsFactory.smileyFace.label"),
          icon: 'partWindWing', 
          points: [
            
            { p: [237, 263], icon: 'partWindWing' },
            { p: [222, 249], icon: 'partWindWing' },
            { p: [1124, 483], icon: 'partWindWing' },
            { p: [410, 827], icon: 'partWindWing' },
            { p: [90, 439], icon: 'partWindWing' },
            { p: [998, 773], icon: 'partWindWing' },
            { p: [1316, 808], icon: 'partWindWing' },
            { p: [711, 297], icon: 'partWindWing' },
            { p: [1041, 546], icon: 'partWindWing' },
            { p: [1384, 625], icon: 'partWindWing' },
            { p: [880, 377], icon: 'partWindWing' },
            { p: [85, 412], icon: 'partWindWing' },
            { p: [201, 633], icon: 'partWindWing' },
            
            { p: [313, 275], icon: 'partDrill' },
            { p: [55, 400], icon: 'partDrill' },
            { p: [741, 313], icon: 'partDrill' },
            { p: [469, 927], icon: 'partDrill' },
            { p: [1355, 731], icon: 'partDrill' },
            { p: [1020, 751], icon: 'partDrill' },
            { p: [1203, 579], icon: 'partDrill' },
            { p: [502, 505], icon: 'partDrill' },
            { p: [256, 833], icon: 'partDrill' },
            { p: [149, 572], icon: 'partDrill' },
            { p: [1339, 418], icon: 'partDrill' },
            { p: [435, 285], icon: 'partDrill' },
            
            { p: [69, 433], icon: 'partPropeller' },
            { p: [728, 297], icon: 'partPropeller' },
            { p: [241, 287], icon: 'partPropeller' },
            { p: [1333, 804], icon: 'partPropeller' },
            { p: [973, 727], icon: 'partPropeller' },
            { p: [471, 842], icon: 'partPropeller' },
            { p: [1181, 545], icon: 'partPropeller' },
            { p: [986, 754], icon: 'partPropeller' },
            { p: [274, 246], icon: 'partPropeller' },
            { p: [322, 718], icon: 'partPropeller' },
            { p: [1010, 401], icon: 'partPropeller' },
          ],
        },
      };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, widthM,
      fixedSpawns, 
      law_urls, fixedHint, hints,
    deduction: (() => {
      const { fixed, region, exactly, either, chain } = dedHelpers(ciphers);
      const rules = [
        fixed([translate("maps.moonlitRiverPark.m1.name"), translate("maps.moonlitRiverPark.e1.name")]),
        region(translate("maps.moonlitRiverPark.rules"), 3, 3,
          [translate("maps.moonlitRiverPark.w1.name"), translate("maps.moonlitRiverPark.w2.name"), translate("maps.moonlitRiverPark.w3.name"), translate("maps.moonlitRiverPark.w4.name"), translate("maps.moonlitRiverPark.w5.name")]),
        region(translate("maps.moonlitRiverPark.rulesAlternate"), 3, 3,
          [translate("maps.moonlitRiverPark.e2.name"), translate("maps.moonlitRiverPark.e3.name"), translate("maps.moonlitRiverPark.e4.name"), translate("maps.moonlitRiverPark.e1.name"), translate("maps.moonlitRiverPark.e5.name")]),
        chain(translate("maps.moonlitRiverPark.rulesThird"), 'no', true,
          [translate("maps.moonlitRiverPark.w1.name"), translate("maps.moonlitRiverPark.w2.name"), translate("maps.moonlitRiverPark.w3.name"), translate("maps.moonlitRiverPark.w4.name"), translate("maps.moonlitRiverPark.w5.name")],
          translate("maps.moonlitRiverPark.rulesFourth")
            + translate("maps.moonlitRiverPark.rulesFifth")),
        either([translate("maps.moonlitRiverPark.w4.name"), translate("maps.moonlitRiverPark.e3.name")]),
        either([translate("maps.moonlitRiverPark.w3.name"), translate("maps.moonlitRiverPark.e4.name")]),
        exactly(2, [translate("maps.moonlitRiverPark.w5.name"), translate("maps.moonlitRiverPark.w4.name"), translate("maps.moonlitRiverPark.e5.name")]),
      ];
      return makeDeduction({
        mapImage, mapSize, ciphers, cipherCombinations, rules,
      });
    })(),
    };
  })(),
  (() => {
      const mapId = 5;
      const mapName = translate("maps.mapName");
      const mapNameEn = "Leo's Memory";
      const mapImage = 'https://patchwiki.biligame.com/images/dwrg/thumb/5/53/'
        + 't9v9ezb7qvnlatez60eex59ab1f7w8p.png/750px-%E9%87%8C%E5%A5%A5%E7%9A%84'
        + '%E5%9B%9E%E5%BF%86_%E4%BF%AF%E8%A7%86%E5%9B%BE_%E5%85%A8.png';
      const mapSize = [750, 635];
      const zonesInfo = [38.5, 28.5, 222.3, 194.7, 3, 3];
      const zoneNames = [
        translate("maps.armsFactory.zoneNamesZero"), translate("maps.armsFactory.zoneNamesOne"), translate("maps.armsFactory.zoneNamesTwo"),
        translate("maps.theRedChurch.zoneNamesThree"), translate("maps.armsFactory.zoneNamesFour"), translate("maps.zoneNamesFive"),
        translate("maps.armsFactory.zoneNamesSix"), translate("maps.zoneNamesSeven"), translate("maps.zoneNamesEight")
      ];
      const ciphers = [
        { id: 'E_1', name: translate("maps.e1.name"),   location: [508, 113], feature: translate("maps.e1.feature") },
        { id: 'E_2', name: translate("maps.armsFactory.e1.name"), location: [647, 198], feature: translate("maps.e2.feature") },
        { id: 'E_3', name: translate("maps.e3.name"),   location: [550, 318], feature: translate("maps.e2.feature") },
        { id: 'E_4', name: translate("maps.e4.name"), location: [643, 462], feature: translate("maps.e2.feature") },
        { id: 'M_1', name: translate("maps.armsFactory.w2.name"),     location: [346, 177], feature: translate("maps.m1.feature") },
        { id: 'M_2', name: translate("maps.lakesideVillage.m2.name"),     location: [344, 281], feature: translate("maps.m2.feature") },
        { id: 'M_3', name: translate("maps.armsFactory.e3.name"),   location: [351, 526], feature: translate("maps.m3.feature") },
        { id: 'M_4', name: translate("maps.armsFactory.e4.name"),   location: [457, 516], feature: translate("maps.m3.feature") },
        { id: 'W_1', name: translate("maps.armsFactory.w3.name"), location: [135, 126], feature: translate("maps.w1.feature") },
        { id: 'W_2', name: translate("maps.theRedChurch.e1.name"),     location: [133, 340], feature: translate("maps.w2.feature") },
        { id: 'W_3', name: translate("maps.w3.name"),     location: [206, 308], feature: translate("maps.w2.feature") },
        { id: 'W_4', name: translate("maps.armsFactory.w4.name"),   location: [88, 533], feature: translate("maps.w4.feature") },
      ];
      
      const cipherCombinations = [
      ['E_2', 'E_4', 'E_1', 'M_2', 'M_3', 'W_1', 'W_4'],
      ['E_2', 'E_4', 'E_1', 'M_1', 'M_4', 'W_1', 'W_2'],
      ['E_3', 'E_4', 'E_1', 'M_1', 'M_3', 'W_1', 'W_3'],
      ['E_2', 'E_4', 'M_1', 'M_2', 'M_4', 'W_2', 'W_4'],
      ['E_2', 'E_3', 'M_1', 'M_3', 'W_1', 'W_3', 'W_4']
      ];
      
      const dungeons = [[533, 208], [645, 505], [346, 93], [103, 90], [188, 535]];
      
      const escapeDoors = [[64, 230], [612, 58], [64, 211], [630, 58]];
      
      const widthM = 168.6;
      const law_urls = ['https://www.bilibili.com/video/BV1zFgW6oEfS', 'https://v.douyin.com/FxKkE1nBno4'];
      const fixedHint = translate("maps.fixedHint");
      const hints = [
      '',
      '',
      '',
      '',
      ''
    ];
      
      const fixedSpawns = {
        professor: { label: translate("maps.armsFactory.professor.label"), icon: 'scale', points: [[232, 307], [559, 382]] },
        photographer: {
          label: translate("maps.armsFactory.photographer.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/6/64/mx0ydtuij8mg5bp32tuu9e1lq8usba6.png',
          points: [
            { p: [64, 504], d: [-0.00, -0.37] },
            { p: [219, 271], d: [0.38, -0.01] },
            { p: [451, 145], d: [0.38, -0.01] },
            { p: [530, 197], d: [0.00, 0.37] },
            { p: [139, 413], d: [-0.00, -0.37] },
            { p: [528, 400], d: [0.38, -0.00] },
            { p: [342, 337], d: [-0.00, -0.37] },
            { p: [244, 129], d: [0.01, 0.37] },
            { p: [134, 256], d: [-0.00, -0.37] },
            { p: [166, 71], d: [0.01, 0.37] },
            { p: [143, 567], d: [0.38, -0.02] },
            { p: [485, 550], d: [0.00, 0.37] },
            { p: [620, 535], d: [-0.38, 0.00] },
            { p: [644, 298], d: [-0.38, 0.00] },
            { p: [369, 483], d: [-0.00, -0.37] },
          ],
        },
        madEyes: {
          label: translate("maps.armsFactory.madEyes.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/f/f7/jbqdvznjphrq602qh303r24qdn3ti4b.png',
          rangeM: 21.11,
          rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
          points: [
            { p: [162, 501], d: [0.00, 0.37] },
            { p: [147, 132], d: [-0.38, 0.00] },
            { p: [312, 490], d: [0.38, -0.00] },
            { p: [112, 359], d: [-0.38, 0.00] },
            { p: [310, 321], d: [-0.32, -0.20] },
            { p: [549, 290], d: [-0.38, 0.00] },
            { p: [630, 484], d: [-0.00, -0.37] },
            { p: [573, 174], d: [-0.06, -0.37] },
            { p: [331, 95], d: [-0.38, 0.00] },
            { p: [467, 542], d: [-0.38, 0.00] },
          ],
        },
        smileyFace: {
          label: translate("maps.armsFactory.smileyFace.label"),
          icon: 'partWindWing', 
          points: [
            
            { p: [563, 283], icon: 'partWindWing' },
            { p: [578, 308], icon: 'partWindWing' },
            { p: [363, 145], icon: 'partWindWing' },
            { p: [158, 108], icon: 'partWindWing' },
            { p: [366, 543], icon: 'partWindWing' },
            { p: [663, 186], icon: 'partWindWing' },
            { p: [116, 518], icon: 'partWindWing' },
            { p: [215, 334], icon: 'partWindWing' },
            { p: [96, 276], icon: 'partWindWing' },
            { p: [532, 278], icon: 'partWindWing' },
            { p: [589, 143], icon: 'partWindWing' },
            { p: [209, 450], icon: 'partWindWing' },
            
            { p: [520, 306], icon: 'partDrill' },
            { p: [370, 539], icon: 'partDrill' },
            { p: [151, 146], icon: 'partDrill' },
            { p: [198, 305], icon: 'partDrill' },
            { p: [339, 188], icon: 'partDrill' },
            { p: [63, 514], icon: 'partDrill' },
            { p: [634, 193], icon: 'partDrill' },
            { p: [107, 496], icon: 'partDrill' },
            { p: [564, 496], icon: 'partDrill' },
            { p: [400, 97], icon: 'partDrill' },
            { p: [259, 294], icon: 'partDrill' },
            { p: [513, 379], icon: 'partDrill' },
            { p: [129, 271], icon: 'partDrill' },
            
            { p: [93, 548], icon: 'partPropeller' },
            { p: [335, 196], icon: 'partPropeller' },
            { p: [189, 304], icon: 'partPropeller' },
            { p: [555, 309], icon: 'partPropeller' },
            { p: [340, 537], icon: 'partPropeller' },
            { p: [142, 115], icon: 'partPropeller' },
            { p: [635, 218], icon: 'partPropeller' },
            { p: [385, 505], icon: 'partPropeller' },
            { p: [336, 152], icon: 'partPropeller' },
            { p: [233, 264], icon: 'partPropeller' },
            { p: [535, 250], icon: 'partPropeller' },
          ],
        },
      };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, widthM,
      fixedSpawns, 
      law_urls, fixedHint, hints,
    deduction: (() => {
      const { region, exactly, chain, implies, link } = dedHelpers(ciphers);
      const EAST = [translate("maps.e1.name"), translate("maps.armsFactory.e1.name"), translate("maps.e3.name"), translate("maps.e4.name")];
      const WEST = [translate("maps.armsFactory.w3.name"), translate("maps.theRedChurch.e1.name"), translate("maps.w3.name"), translate("maps.armsFactory.w4.name")];
      const rules = [
        region(translate("maps.theRedChurch.rules"), 2, 3, WEST),
        region(translate("maps.armsFactory.rulesAlternate"), 2, 3, [translate("maps.armsFactory.w2.name"), translate("maps.lakesideVillage.m2.name"), translate("maps.armsFactory.e3.name"), translate("maps.armsFactory.e4.name")]),
        region(translate("maps.theRedChurch.rulesAlternate"), 2, 3, EAST),
        implies(translate("maps.nameAlternate"), [translate("maps.theRedChurch.e1.name"), translate("maps.w3.name")], [translate("maps.armsFactory.w2.name")],
          translate("maps.rules")),
        exactly(2, [translate("maps.armsFactory.w3.name"), translate("maps.armsFactory.w2.name"), translate("maps.lakesideVillage.m2.name")]),
        exactly(2, [translate("maps.armsFactory.w4.name"), translate("maps.armsFactory.w2.name"), translate("maps.e1.name")]),
        chain(translate("maps.chain"), 'yes', false, [translate("maps.theRedChurch.e1.name"), translate("maps.w3.name"), translate("maps.lakesideVillage.m2.name"), translate("maps.e3.name")],
          translate("maps.rulesAlternate")),
        link(translate("maps.rulesThird"), EAST, translate("maps.e1.name"), true,
          translate("maps.rulesFourth")),
        link(translate("maps.rulesFifth"), WEST, translate("maps.e4.name"), false,
          translate("maps.rulesSixth")),
      ];
      return makeDeduction({
        mapImage, mapSize, ciphers, cipherCombinations, rules,
      });
    })(),
    };
  })(),
  (() => {
      const mapId = 6;
      const mapName = translate("maps.eversleepingTown.mapName");
      const mapNameEn = 'Eversleeping Town';
      const mapImage = 'https://patchwiki.biligame.com/images/dwrg/thumb/2/2f/'
        + 'cdwrcy0q4j8t8wqmo6gv50xbe0mptak.png/750px-%E6%B0%B8%E7%9C%A0%E9%95%87'
        + '_%E4%BF%AF%E8%A7%86%E5%9B%BE_%E5%85%A8.png';
      
      const mapSize = [750, 874];
      const zonesInfo = [89.4, 30.2, 206.1, 196.3, 3, 3];
      const zoneNames = [
        translate("maps.eversleepingTown.zoneNamesZero"), translate("maps.eversleepingTown.zoneNamesOne"), translate("maps.eversleepingTown.zoneNamesTwo"),
        translate("maps.eversleepingTown.zoneNamesThree"), translate("maps.eversleepingTown.zoneNamesFour"), translate("maps.eversleepingTown.zoneNamesFive"),
        translate("maps.eversleepingTown.zoneNamesSix"), translate("maps.eversleepingTown.zoneNamesSeven"), translate("maps.eversleepingTown.zoneNamesEight"),
        translate("maps.eversleepingTown.zoneNamesNine")
      ];
      const ciphers = [
        { id: 'W_1', name: translate("maps.theRedChurch.e1.name"),     location: [101, 462], feature: translate("maps.eversleepingTown.w1.feature"), locked: true },
        { id: 'W_2', name: translate("maps.eversleepingTown.w2.name"),    location: [161, 234], feature: translate("maps.eversleepingTown.w2.feature") },
        { id: 'W_3', name: translate("maps.eversleepingTown.w3.name"),    location: [258, 206], feature: translate("maps.eversleepingTown.w2.feature") },
        { id: 'E_1', name: translate("maps.eversleepingTown.e1.name"), location: [520, 174], feature: translate("maps.eversleepingTown.e1.feature") },
        { id: 'E_2', name: translate("maps.eversleepingTown.e2.name"), location: [662, 196], feature: translate("maps.eversleepingTown.e1.feature") },
        { id: 'E_3', name: translate("maps.eversleepingTown.e3.name"),    location: [552, 412], feature: translate("maps.eversleepingTown.e3.feature") },
        { id: 'E_4', name: translate("maps.eversleepingTown.e4.name"),      location: [656, 496], feature: translate("maps.eversleepingTown.e3.feature") },
        { id: 'E_5', name: translate("maps.eversleepingTown.e5.name"),      location: [546, 711], feature: translate("maps.eversleepingTown.e5.feature") },
        { id: 'E_6', name: translate("maps.eversleepingTown.e6.name"),      location: [470, 623], feature: translate("maps.eversleepingTown.e5.feature") },
        { id: 'M_1', name: translate("maps.eversleepingTown.m1.name"),    location: [454, 144], feature: translate("maps.eversleepingTown.m1.feature") },
        { id: 'M_2', name: translate("maps.eversleepingTown.m2.name"),  location: [388, 359], feature: translate("maps.eversleepingTown.m1.feature") },
        { id: 'M_3', name: translate("maps.eversleepingTown.m3.name"),  location: [374, 500], feature: translate("maps.eversleepingTown.m3.feature") },
        { id: 'M_4', name: translate("maps.eversleepingTown.m4.name"),  location: [318, 559], feature: translate("maps.eversleepingTown.m3.feature") },
      ];
      
      const cipherCombinations = [
      ['W_1', 'W_3', 'E_2', 'E_4', 'E_5', 'M_2', 'M_3'],
      ['W_1', 'W_2', 'E_2', 'E_3', 'E_6', 'M_1', 'M_2'],
      ['W_1', 'W_2', 'E_2', 'E_4', 'E_5', 'M_1', 'M_3'],
      ['W_1', 'W_3', 'E_1', 'E_3', 'E_5', 'M_2', 'M_4'],
      ['W_1', 'W_2', 'E_1', 'E_3', 'E_6', 'M_2', 'M_3']
      ];
      
      const dungeons = [[173, 304], [627, 526], [410, 340]];
      
      const escapeDoors = [[387, 20], [225, 616], [404, 20], [209, 616]];
      
      
      const widthM = 137;
      const law_urls = [];
      const fixedHint = translate("maps.eversleepingTown.fixedHint");
      const hints = [
      '',
      '',
      '',
      '',
      ''
    ];
      
      const fixedSpawns = {
        professor: { label: translate("maps.armsFactory.professor.label"), icon: 'scale', points: [[529, 288], [105, 412]] },
        photographer: {
          label: translate("maps.armsFactory.photographer.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/6/64/mx0ydtuij8mg5bp32tuu9e1lq8usba6.png',
          points: [
            { p: [521, 730], d: [-0.46, -0.00] },
            { p: [619, 613], d: [-0.46, -0.00] },
            { p: [360, 662], d: [0.00, -0.46] },
            { p: [260, 554], d: [0.46, 0.00] },
            { p: [187, 394], d: [-0.46, -0.00] },
            { p: [372, 471], d: [0.00, -0.46] },
            { p: [599, 448], d: [-0.00, 0.46] },
            { p: [649, 331], d: [0.00, -0.46] },
            { p: [463, 288], d: [0.46, 0.00] },
            { p: [284, 263], d: [0.00, -0.46] },
            { p: [194, 119], d: [-0.46, -0.00] },
            { p: [447, 68], d: [0.46, 0.00] },
            { p: [604, 167], d: [0.46, 0.00] },
          ],
        },
        madEyes: {
          label: translate("maps.armsFactory.madEyes.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/f/f7/jbqdvznjphrq602qh303r24qdn3ti4b.png',
          rangeM: 21.11,
          rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
          points: [
            { p: [572, 757], d: [0.00, -0.46] },
            { p: [642, 510], d: [-0.46, -0.00] },
            { p: [466, 612], d: [0.46, 0.00] },
            { p: [165, 497], d: [-0.00, 0.46] },
            { p: [236, 365], d: [0.00, -0.46] },
            { p: [352, 250], d: [-0.46, -0.00] },
            { p: [473, 426], d: [-0.00, 0.46] },
            { p: [639, 297], d: [0.00, -0.46] },
            { p: [511, 161], d: [-0.00, 0.46] },
            { p: [244, 105], d: [0.00, -0.46] },
          ],
        },
        smileyFace: {
          label: translate("maps.armsFactory.smileyFace.label"),
          icon: 'partWindWing', 
          points: [
            
            { p: [588, 406], icon: 'partWindWing' },
            { p: [525, 401], icon: 'partWindWing' },
            { p: [482, 606], icon: 'partWindWing' },
            { p: [147, 201], icon: 'partWindWing' },
            { p: [454, 110], icon: 'partWindWing' },
            { p: [398, 325], icon: 'partWindWing' },
            { p: [693, 205], icon: 'partWindWing' },
            { p: [135, 454], icon: 'partWindWing' },
            { p: [619, 651], icon: 'partWindWing' },
            { p: [680, 393], icon: 'partWindWing' },
            { p: [270, 138], icon: 'partWindWing' },
            { p: [538, 443], icon: 'partWindWing' },
            { p: [575, 730], icon: 'partWindWing' },
            
            { p: [133, 430], icon: 'partDrill' },
            { p: [672, 214], icon: 'partDrill' },
            { p: [529, 402], icon: 'partDrill' },
            { p: [464, 593], icon: 'partDrill' },
            { p: [480, 169], icon: 'partDrill' },
            { p: [405, 323], icon: 'partDrill' },
            { p: [121, 233], icon: 'partDrill' },
            { p: [299, 95], icon: 'partDrill' },
            { p: [182, 447], icon: 'partDrill' },
            { p: [362, 248], icon: 'partDrill' },
            { p: [300, 537], icon: 'partDrill' },
            { p: [588, 653], icon: 'partDrill' },
            
            { p: [456, 131], icon: 'partPropeller' },
            { p: [452, 608], icon: 'partPropeller' },
            { p: [634, 185], icon: 'partPropeller' },
            { p: [548, 396], icon: 'partPropeller' },
            { p: [138, 239], icon: 'partPropeller' },
            { p: [399, 333], icon: 'partPropeller' },
            { p: [127, 444], icon: 'partPropeller' },
            { p: [263, 405], icon: 'partPropeller' },
            { p: [358, 167], icon: 'partPropeller' },
            { p: [492, 607], icon: 'partPropeller' },
            { p: [515, 204], icon: 'partPropeller' },
          ],
        },
      };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, widthM,
      fixedSpawns, 
      law_urls, fixedHint, hints,
    deduction: (() => {
      const { fixed, region, either, atMost1 } = dedHelpers(ciphers);
      const rules = [
        fixed([translate("maps.theRedChurch.e1.name")]),
        region(translate("maps.theRedChurch.rules"), 2, 2, [translate("maps.theRedChurch.e1.name"), translate("maps.eversleepingTown.w2.name"), translate("maps.eversleepingTown.w3.name")]),
        region(translate("maps.armsFactory.rulesAlternate"), 2, 2,
          [translate("maps.eversleepingTown.m1.name"), translate("maps.eversleepingTown.m2.name"), translate("maps.eversleepingTown.m3.name"), translate("maps.eversleepingTown.m4.name")]),
        region(translate("maps.theRedChurch.rulesAlternate"), 3, 3,
          [translate("maps.eversleepingTown.e1.name"), translate("maps.eversleepingTown.e2.name"), translate("maps.eversleepingTown.e3.name"), translate("maps.eversleepingTown.e4.name"), translate("maps.eversleepingTown.e5.name"), translate("maps.eversleepingTown.e6.name")]),
        either([translate("maps.eversleepingTown.w2.name"), translate("maps.eversleepingTown.w3.name")]),
        either([translate("maps.eversleepingTown.e1.name"), translate("maps.eversleepingTown.e2.name")]),
        either([translate("maps.eversleepingTown.e3.name"), translate("maps.eversleepingTown.e4.name")]),
        either([translate("maps.eversleepingTown.e5.name"), translate("maps.eversleepingTown.e6.name")]),
        atMost1([translate("maps.eversleepingTown.m3.name"), translate("maps.eversleepingTown.m4.name")]),
        atMost1([translate("maps.eversleepingTown.m1.name"), translate("maps.eversleepingTown.m4.name")]),
        ];
      return makeDeduction({
        mapImage, mapSize, ciphers, cipherCombinations, rules,
      });
    })(),
    };
  })(),
  (() => {
      const mapId = 7;
      const mapName = translate("maps.chinaTown.mapName");
      const mapNameEn = 'China Town';
      const mapImage = 'https://patchwiki.biligame.com/images/dwrg/c/cb/'
        + '4g9knengpuuk8uyssm4zvpf1evw3d80.png';
      const mapSize = [1345, 1152];
      const zonesInfo = [83, 39, 406.5, 355.1, 3, 3];
      const zoneNames = [
        translate("maps.chinaTown.zoneNamesZero"), translate("maps.chinaTown.zoneNamesOne"), translate("maps.chinaTown.zoneNamesTwo"),
        translate("maps.chinaTown.zoneNamesThree"), translate("maps.chinaTown.zoneNamesFour"), translate("maps.chinaTown.zoneNamesFive"),
        translate("maps.chinaTown.zoneNamesSix"), translate("maps.chinaTown.zoneNamesSeven"), translate("maps.chinaTown.zoneNamesEight")
      ];
      const ciphers = [
        { id: 'E_2', name: translate("maps.chinaTown.e2.name"),   location: [1094, 563], feature: translate("maps.lakesideVillage.e1.feature"), locked: true },
        { id: 'E_1', name: translate("maps.chinaTown.e1.name"),     location: [1042, 249], feature: translate("maps.chinaTown.e1.feature") },
        { id: 'E_3', name: translate("maps.chinaTown.e3.name"),   location: [1103, 841], feature: translate("maps.chinaTown.e3.feature") },
        { id: 'M_1', name: translate("maps.chinaTown.m1.name"),     location: [760, 332], feature: translate("maps.chinaTown.m1.feature") },
        { id: 'M_2', name: translate("maps.chinaTown.m2.name"),     location: [705, 630], feature: translate("maps.chinaTown.m2.feature") },
        { id: 'M_3', name: translate("maps.chinaTown.m3.name"),   location: [500, 694], feature: translate("maps.chinaTown.m3.feature") },
        { id: 'M_4', name: translate("maps.chinaTown.m4.name"),   location: [454, 818], feature: translate("maps.chinaTown.m3.feature") },
        { id: 'M_5', name: translate("maps.chinaTown.m5.name"),     location: [881, 976], feature: translate("maps.chinaTown.m5.feature") },
        { id: 'W_1', name: translate("maps.chinaTown.w1.name"), location: [344, 220], feature: translate("maps.chinaTown.w1.feature") },
        { id: 'W_2', name: translate("maps.chinaTown.w2.name"), location: [407, 341], feature: translate("maps.chinaTown.w1.feature") },
        { id: 'W_3', name: translate("maps.chinaTown.w3.name"),   location: [118, 534], feature: translate("maps.chinaTown.w3.feature") },
        { id: 'W_4', name: translate("maps.chinaTown.w4.name"),   location: [176, 792], feature: translate("maps.chinaTown.w4.feature") },
      ];
      
      const cipherCombinations = [
      ['E_2', 'E_1', 'E_3', 'M_2', 'M_4', 'W_2', 'W_4'],
      ['E_2', 'E_3', 'M_1', 'M_3', 'M_5', 'W_1', 'W_4'],
      ['E_2', 'E_1', 'M_1', 'M_3', 'M_5', 'W_2', 'W_4'],
      ['E_2', 'E_1', 'E_3', 'M_3', 'M_5', 'W_1', 'W_4'],
      ['E_2', 'E_3', 'M_1', 'M_3', 'W_1', 'W_3', 'W_4'],
      ['E_2', 'E_1', 'M_2', 'M_4', 'M_5', 'W_1', 'W_3']
      ];
      
      const dungeons = [[157, 994], [351, 456], [1209, 404]];
      
      const escapeDoors = [[705, 1134], [780, 18], [667, 1134], [818, 18]];
      
      const widthM = 144.1;
      const law_urls = ['https://www.bilibili.com/video/BV1QGpF6CEos',''];
      const fixedHint = translate("maps.chinaTown.fixedHint");
      const hints = [
      translate("maps.chinaTown.hintsZero"),
      translate("maps.chinaTown.hintsOne"),
      '',
      translate("maps.chinaTown.hintsThree"),
      translate("maps.chinaTown.hintsFour"),
      ''
    ];
      
      const fixedSpawns = {
        professor: { label: translate("maps.armsFactory.professor.label"), icon: 'scale', points: [[786, 374], [420, 1000]] },
        photographer: {
          label: translate("maps.armsFactory.photographer.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/6/64/mx0ydtuij8mg5bp32tuu9e1lq8usba6.png',
          points: [
            { p: [1224, 1050], d: [0.79, 0.00] },
            { p: [937, 962], d: [-0.79, -0.00] },
            { p: [1049, 685], d: [-0.00, -0.78] },
            { p: [1262, 567], d: [0.79, 0.00] },
            { p: [1085, 359], d: [-0.79, -0.00] },
            { p: [824, 128], d: [0.79, 0.00] },
            { p: [720, 363], d: [-0.00, -0.78] },
            { p: [620, 700], d: [0.79, 0.00] },
            { p: [417, 373], d: [0.79, 0.00] },
            { p: [227, 132], d: [0.79, 0.00] },
            { p: [138, 492], d: [0.79, 0.00] },
            { p: [150, 887], d: [0.79, 0.00] },
            { p: [389, 1074], d: [0.79, 0.00] },
            { p: [686, 1032], d: [0.79, 0.00] },
          ],
        },
        madEyes: {
          label: translate("maps.armsFactory.madEyes.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/f/f7/jbqdvznjphrq602qh303r24qdn3ti4b.png',
          rangeM: 21.11,
          rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
          points: [
            { p: [208, 565], d: [0.00, 0.79] },
            { p: [229, 967], d: [-0.00, -0.79] },
            { p: [175, 195], d: [-0.00, -0.79] },
            { p: [509, 310], d: [-0.00, -0.79] },
            { p: [597, 693], d: [-0.00, -0.79] },
            { p: [719, 1055], d: [0.00, 0.79] },
            { p: [1091, 900], d: [-0.00, -0.79] },
            { p: [1175, 567], d: [-0.00, -0.79] },
            { p: [1125, 150], d: [-0.00, -0.79] },
            { p: [793, 278], d: [0.79, -0.00] },
          ],
        },
        smileyFace: {
          label: translate("maps.armsFactory.smileyFace.label"),
          icon: 'partWindWing', 
          points: [
            
            { p: [123, 765], icon: 'partWindWing' },
            { p: [142, 852], icon: 'partWindWing' },
            { p: [1108, 812], icon: 'partWindWing' },
            { p: [550, 665], icon: 'partWindWing' },
            { p: [868, 991], icon: 'partWindWing' },
            { p: [268, 207], icon: 'partWindWing' },
            { p: [1013, 235], icon: 'partWindWing' },
            { p: [1074, 586], icon: 'partWindWing' },
            { p: [1244, 226], icon: 'partWindWing' },
            { p: [426, 1059], icon: 'partWindWing' },
            { p: [265, 242], icon: 'partWindWing' },
            { p: [135, 656], icon: 'partWindWing' },
            { p: [910, 998], icon: 'partWindWing' },
            
            { p: [916, 994], icon: 'partDrill' },
            { p: [167, 739], icon: 'partDrill' },
            { p: [1044, 535], icon: 'partDrill' },
            { p: [1031, 809], icon: 'partDrill' },
            { p: [464, 685], icon: 'partDrill' },
            { p: [423, 221], icon: 'partDrill' },
            { p: [985, 277], icon: 'partDrill' },
            { p: [104, 583], icon: 'partDrill' },
            { p: [1267, 901], icon: 'partDrill' },
            { p: [1285, 314], icon: 'partDrill' },
            { p: [222, 160], icon: 'partDrill' },
            { p: [776, 466], icon: 'partDrill' },
            { p: [1062, 464], icon: 'partDrill' },
            
            { p: [1058, 209], icon: 'partPropeller' },
            { p: [1074, 605], icon: 'partPropeller' },
            { p: [356, 240], icon: 'partPropeller' },
            { p: [150, 802], icon: 'partPropeller' },
            { p: [470, 679], icon: 'partPropeller' },
            { p: [1065, 868], icon: 'partPropeller' },
            { p: [871, 962], icon: 'partPropeller' },
            { p: [341, 525], icon: 'partPropeller' },
            { p: [742, 878], icon: 'partPropeller' },
            { p: [760, 484], icon: 'partPropeller' },
            { p: [445, 770], icon: 'partPropeller' },
          ],
        },
      };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, widthM,
      fixedSpawns, 
      law_urls, fixedHint, hints,
    deduction: (() => {
      const { fixed, region, either, same, atLeast1, atMost1, chainRun, allAbsent }
        = dedHelpers(ciphers);
      
      const special = allAbsent([translate("maps.chinaTown.m1.name"), translate("maps.chinaTown.m2.name")], [translate("maps.chinaTown.e1.name"), translate("maps.chinaTown.e3.name"), translate("maps.chinaTown.m5.name")],
        translate("maps.chinaTown.special"));
      const rules = [
        fixed([translate("maps.chinaTown.e2.name")]),
        region(translate("maps.theRedChurch.rules"), 2, 3, [translate("maps.chinaTown.w1.name"), translate("maps.chinaTown.w2.name"), translate("maps.chinaTown.w3.name"), translate("maps.chinaTown.w4.name")]),
        region(translate("maps.armsFactory.rulesAlternate"), 2, 3, [translate("maps.chinaTown.m1.name"), translate("maps.chinaTown.m2.name"), translate("maps.chinaTown.m3.name"), translate("maps.chinaTown.m4.name"), translate("maps.chinaTown.m5.name")]),
        region(translate("maps.theRedChurch.rulesAlternate"), 2, 3, [translate("maps.chinaTown.e1.name"), translate("maps.chinaTown.e2.name"), translate("maps.chinaTown.e3.name")]),
        either([translate("maps.chinaTown.w1.name"), translate("maps.chinaTown.w2.name")]),
        either([translate("maps.chinaTown.m4.name"), translate("maps.chinaTown.m3.name")]),
        same([translate("maps.chinaTown.m2.name"), translate("maps.chinaTown.m4.name")]),
        atLeast1([translate("maps.chinaTown.m5.name"), translate("maps.chinaTown.e3.name")], translate("maps.chinaTown.rules")),
        atLeast1([translate("maps.chinaTown.w4.name"), translate("maps.chinaTown.m4.name")], translate("maps.chinaTown.rules")),
        atLeast1([translate("maps.chinaTown.e1.name"), translate("maps.chinaTown.e3.name")], translate("maps.chinaTown.rules")),
        atMost1([translate("maps.chinaTown.m1.name"), translate("maps.chinaTown.m2.name")]),
        atMost1([translate("maps.chinaTown.w2.name"), translate("maps.chinaTown.w3.name")]),
        chainRun(translate("maps.chain"), [translate("maps.chinaTown.w1.name"), translate("maps.chinaTown.m1.name"), translate("maps.chinaTown.e1.name"), translate("maps.chinaTown.e3.name")],
          translate("maps.chinaTown.rulesAlternate")),
        chainRun(translate("maps.chain"),
          [translate("maps.chinaTown.w4.name"), translate("maps.chinaTown.m4.name"), translate("maps.chinaTown.m5.name"), translate("maps.chinaTown.e3.name"), translate("maps.chinaTown.m2.name"), translate("maps.chinaTown.w3.name"), translate("maps.chinaTown.w4.name")],
          translate("maps.chinaTown.rulesThird")),
        special,
      ];
      return makeDeduction({
        mapImage, mapSize, ciphers, cipherCombinations, rules,
      });
    })(),
    };
  })(),
  (() => {
      const mapId = 8;
      const mapName = translate("maps.darkwoods.mapName");
      const mapNameEn = 'Darkwoods';
      const mapImage = 'https://patchwiki.biligame.com/images/dwrg/f/f7/'
        + '40wez8dwwtlpyuljfmydkle6lpp0gdv.png';
      const mapSize = [1247, 1265];
      const zonesInfo = [41.5, 40.5, 393.2, 381.5, 3, 3];
      const zoneNames = [
        translate("maps.armsFactory.zoneNamesZero"), translate("maps.darkwoods.zoneNamesOne"), translate("maps.darkwoods.zoneNamesTwo"),
        translate("maps.darkwoods.zoneNamesThree"), translate("maps.armsFactory.zoneNamesFour"), translate("maps.darkwoods.zoneNamesFive"),
        translate("maps.darkwoods.zoneNamesSix"), translate("maps.darkwoods.zoneNamesSeven"), translate("maps.darkwoods.zoneNamesEight")
      ];
      const ciphers = [
        { id: 'W_1', name: translate("maps.armsFactory.w3.name"),     location: [379, 265], feature: translate("maps.darkwoods.w1.feature") },
        { id: 'W_2', name: translate("maps.darkwoods.w2.name"),       location: [261, 442], feature: translate("maps.darkwoods.w1.feature") },
        { id: 'W_3', name: translate("maps.darkwoods.w3.name"),   location: [412, 728], feature: translate("maps.darkwoods.w3.feature") },
        { id: 'W_4', name: translate("maps.darkwoods.w4.name"),   location: [412, 952], feature: translate("maps.darkwoods.w3.feature") },
        { id: 'M_1', name: translate("maps.darkwoods.m1.name"), location: [534, 278], feature: translate("maps.darkwoods.m1.feature") },
        { id: 'M_2', name: translate("maps.darkwoods.m2.name"), location: [648, 406], feature: translate("maps.darkwoods.m1.feature") },
        { id: 'E_3', name: translate("maps.armsFactory.e1.name"),     location: [1059, 548], feature: translate("maps.darkwoods.e3.feature") },
        { id: 'M_3', name: translate("maps.darkwoods.m3.name"), location: [788, 651], feature: translate("maps.darkwoods.e3.feature") },
        { id: 'E_1', name: translate("maps.darkwoods.e1.name"),     location: [1097, 213], feature: translate("maps.darkwoods.e1.feature") },
        { id: 'E_2', name: translate("maps.darkwoods.e2.name"),     location: [896, 399], feature: translate("maps.darkwoods.e1.feature") },
        { id: 'E_4', name: translate("maps.darkwoods.e4.name"),     location: [881, 915], feature: translate("maps.darkwoods.e4.feature") },
        { id: 'E_5', name: translate("maps.darkwoods.e5.name"),       location: [1074, 880], feature: translate("maps.darkwoods.e4.feature") },
        { id: 'M_4', name: translate("maps.darkwoods.m4.name"),     location: [673, 733], feature: translate("maps.darkwoods.m4.feature") },
        { id: 'M_5', name: translate("maps.darkwoods.m5.name"),     location: [778, 988], feature: translate("maps.darkwoods.m4.feature") },
        { id: 'M_6', name: translate("maps.darkwoods.m6.name"),     location: [633, 1098], feature: translate("maps.darkwoods.m4.feature") },
      ];
      
      const cipherCombinations = [
      ['W_1', 'W_3', 'E_1', 'E_3', 'E_4', 'M_2', 'M_6'],
      ['W_2', 'W_4', 'E_1', 'E_3', 'E_5', 'M_2', 'M_6'],
      ['W_2', 'W_4', 'E_2', 'E_3', 'E_5', 'M_1', 'M_4'],
      ['W_2', 'W_4', 'E_2', 'E_5', 'M_1', 'M_3', 'M_5'],
      ['W_2', 'W_4', 'E_1', 'E_5', 'M_1', 'M_3', 'M_5']
      ];
      
      const dungeons = [[661, 134], [164, 943], [737, 957], [978, 351]];
      
      const escapeDoors = [[1214, 772], [50, 224], [1214, 816], [50, 180]];
      
      const widthM = 133.8;
      const law_urls = [];
      const fixedHint = translate("maps.darkwoods.fixedHint");
      const hints = [
      '',
      '',
      '',
      '',
      ''
    ];
      
      const fixedSpawns = {
        professor: { label: translate("maps.armsFactory.professor.label"), icon: 'scale', points: [[612, 941], [518, 233]] },
        photographer: {
          label: translate("maps.armsFactory.photographer.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/6/64/mx0ydtuij8mg5bp32tuu9e1lq8usba6.png',
          points: [
            { p: [1143, 165], d: [-0.79, 0.00] },
            { p: [952, 351], d: [0.79, -0.00] },
            { p: [693, 189], d: [-0.00, 0.78] },
            { p: [208, 210], d: [0.79, -0.00] },
            { p: [487, 415], d: [0.79, -0.00] },
            { p: [1153, 876], d: [0.30, -0.73] },
            { p: [1018, 683], d: [-0.00, 0.78] },
            { p: [750, 591], d: [0.00, -0.78] },
            { p: [708, 875], d: [0.79, -0.00] },
            { p: [967, 1089], d: [0.79, -0.00] },
            { p: [578, 1141], d: [0.79, -0.00] },
            { p: [319, 1036], d: [-0.03, -0.78] },
            { p: [125, 507], d: [0.79, -0.00] },
            { p: [401, 711], d: [0.00, -0.78] },
            { p: [148, 910], d: [-0.00, 0.78] },
          ],
        },
        madEyes: {
          label: translate("maps.armsFactory.madEyes.label"),
          camera: true,
          icon: 'https://patchwiki.biligame.com/images/dwrg/f/f7/jbqdvznjphrq602qh303r24qdn3ti4b.png',
          rangeM: 21.11,
          rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
          points: [
            { p: [1031, 980], d: [0.00, -0.78] },
            { p: [571, 1009], d: [0.79, -0.00] },
            { p: [277, 800], d: [-0.00, 0.78] },
            { p: [159, 304], d: [-0.79, 0.00] },
            { p: [492, 190], d: [-0.79, 0.00] },
            { p: [574, 543], d: [0.00, -0.78] },
            { p: [814, 134], d: [0.78, 0.09] },
            { p: [1094, 261], d: [0.68, 0.39] },
            { p: [1150, 566], d: [0.00, -0.78] },
            { p: [865, 699], d: [0.68, -0.39] },
          ],
        },
        smileyFace: {
          label: translate("maps.armsFactory.smileyFace.label"),
          icon: 'partWindWing', 
          points: [
            
            { p: [712, 403], icon: 'partWindWing' },
            { p: [699, 348], icon: 'partWindWing' },
            { p: [344, 719], icon: 'partWindWing' },
            { p: [598, 1082], icon: 'partWindWing' },
            { p: [1050, 616], icon: 'partWindWing' },
            { p: [334, 244], icon: 'partWindWing' },
            { p: [843, 979], icon: 'partWindWing' },
            { p: [1121, 269], icon: 'partWindWing' },
            { p: [999, 453], icon: 'partWindWing' },
            { p: [902, 576], icon: 'partWindWing' },
            { p: [292, 294], icon: 'partWindWing' },
            { p: [111, 750], icon: 'partWindWing' },
            { p: [1028, 1028], icon: 'partWindWing' },
            
            { p: [845, 984], icon: 'partDrill' },
            { p: [894, 945], icon: 'partDrill' },
            { p: [1117, 213], icon: 'partDrill' },
            { p: [409, 698], icon: 'partDrill' },
            { p: [653, 458], icon: 'partDrill' },
            { p: [665, 1033], icon: 'partDrill' },
            { p: [1040, 597], icon: 'partDrill' },
            { p: [373, 313], icon: 'partDrill' },
            { p: [1102, 181], icon: 'partDrill' },
            { p: [470, 1148], icon: 'partDrill' },
            { p: [1101, 731], icon: 'partDrill' },
            { p: [902, 520], icon: 'partDrill' },
            { p: [399, 817], icon: 'partDrill' },
            { p: [903, 232], icon: 'partDrill' },
            
            { p: [368, 312], icon: 'partPropeller' },
            { p: [643, 1065], icon: 'partPropeller' },
            { p: [906, 942], icon: 'partPropeller' },
            { p: [1035, 503], icon: 'partPropeller' },
            { p: [662, 387], icon: 'partPropeller' },
            { p: [450, 725], icon: 'partPropeller' },
            { p: [1084, 189], icon: 'partPropeller' },
            { p: [423, 477], icon: 'partPropeller' },
            { p: [969, 762], icon: 'partPropeller' },
            { p: [348, 968], icon: 'partPropeller' },
            { p: [1035, 392], icon: 'partPropeller' },
          ],
        },
      };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, widthM,
      fixedSpawns, 
      law_urls, fixedHint, hints,
    deduction: (() => {
      const { region, either, atMost1, same, chain } = dedHelpers(ciphers);
      const rules = [
        region(translate("maps.theRedChurch.rules"), 2, 2,
          [translate("maps.darkwoods.w2.name"), translate("maps.armsFactory.w3.name"), translate("maps.darkwoods.w4.name"), translate("maps.darkwoods.w3.name")]),
        region(translate("maps.armsFactory.rulesAlternate"), 2, 3,
          [translate("maps.darkwoods.m1.name"), translate("maps.darkwoods.m2.name"), translate("maps.darkwoods.m3.name"), translate("maps.darkwoods.m4.name"),
            translate("maps.darkwoods.m5.name"), translate("maps.darkwoods.m6.name")]),
        region(translate("maps.theRedChurch.rulesAlternate"), 2, 3,
          [translate("maps.darkwoods.e1.name"), translate("maps.darkwoods.e2.name"), translate("maps.armsFactory.e1.name"), translate("maps.darkwoods.e4.name"), translate("maps.darkwoods.e5.name")]),
        either([translate("maps.darkwoods.w2.name"), translate("maps.armsFactory.w3.name")]),
        either([translate("maps.darkwoods.w4.name"), translate("maps.darkwoods.w3.name")]),
        either([translate("maps.darkwoods.m1.name"), translate("maps.darkwoods.m2.name")]),
        either([translate("maps.darkwoods.e1.name"), translate("maps.darkwoods.e2.name")]),
        either([translate("maps.armsFactory.e1.name"), translate("maps.darkwoods.m3.name")]),
        either([translate("maps.darkwoods.e4.name"), translate("maps.darkwoods.e5.name")]),
        region(translate("maps.darkwoods.rules"), 1, 2,
          [translate("maps.darkwoods.m4.name"), translate("maps.darkwoods.m3.name"), translate("maps.darkwoods.m5.name"), translate("maps.darkwoods.m6.name")]),
        atMost1([translate("maps.darkwoods.m4.name"), translate("maps.darkwoods.m3.name")]),
        same([translate("maps.darkwoods.m3.name"), translate("maps.darkwoods.m5.name")]),
        chain(translate("maps.chain"), 'yes', false,
          [translate("maps.darkwoods.e5.name"), translate("maps.darkwoods.e4.name"), translate("maps.darkwoods.w4.name"), translate("maps.darkwoods.w3.name"), translate("maps.darkwoods.w2.name"),
            translate("maps.armsFactory.w3.name"), translate("maps.darkwoods.m1.name"), translate("maps.darkwoods.m2.name"), translate("maps.darkwoods.e2.name"), translate("maps.darkwoods.e1.name")],
          translate("maps.darkwoods.rulesAlternate")
            + translate("maps.darkwoods.rulesThird")
            + translate("maps.lakesideVillage.rulesSeventh")),
      ];
      return makeDeduction({
        mapImage, mapSize, ciphers, cipherCombinations, rules,
      });
    })(),
    };
  })()
];



export const CIPHER_EXTRA = {
  4: [{ id: 'E_0', location: [768, 550], name: translate("maps.e0.name"), feature: translate("maps.e0.feature") }],
};




export function getImageUrl(mapId) {
  return MAPS_DATA[mapId].mapImage
}
