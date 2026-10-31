
import { translate } from '../core/i18n.js';
import { dedHelpers, makeDeduction } from './deduction.js';

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
      translate("maps.armsFactory.zoneNames.zoneNames0"), translate("maps.armsFactory.zoneNames.zoneNames1"), translate("maps.armsFactory.zoneNames.zoneNames2"),
      translate("maps.armsFactory.zoneNames.zoneNames3"), translate("maps.armsFactory.zoneNames.zoneNames4"), translate("maps.armsFactory.zoneNames.zoneNames5"),
      translate("maps.armsFactory.zoneNames.zoneNames6"), translate("maps.armsFactory.zoneNames.zoneNames7"), translate("maps.armsFactory.zoneNames.zoneNames8")
    ];
    const ciphers = [
      { id: 'M_4', name: translate("maps.armsFactory.cipher.m4.name"), location: [284, 529], feature: translate("maps.armsFactory.cipher.m4.feature"), locked: true },
      { id: 'M_1', name: translate("maps.armsFactory.cipher.m1.name"), location: [444, 103], feature: translate("maps.armsFactory.cipher.m1.feature") },
      { id: 'M_2', name: translate("maps.armsFactory.cipher.m2.name"), location: [459, 296], feature: translate("maps.armsFactory.cipher.m2.feature") },
      { id: 'M_3', name: translate("maps.armsFactory.cipher.m3.name"), location: [399, 378], feature: translate("maps.armsFactory.cipher.m3.feature") },
      { id: 'E_1', name: translate("maps.armsFactory.cipher.e1.name"), location: [576, 174], feature: translate("maps.armsFactory.cipher.e1.feature") },
      { id: 'E_2', name: translate("maps.armsFactory.cipher.e2.name"), location: [606, 260], feature: translate("maps.armsFactory.cipher.e2.feature") },
      { id: 'E_3', name: translate("maps.armsFactory.cipher.e3.name"), location: [543, 523], feature: translate("maps.armsFactory.cipher.e3.feature") },
      { id: 'E_4', name: translate("maps.armsFactory.cipher.e4.name"), location: [503, 569], feature: translate("maps.armsFactory.cipher.e4.feature") },
      { id: 'W_1', name: translate("maps.armsFactory.cipher.w1.name"), location: [241, 85], feature: translate("maps.armsFactory.cipher.w1.feature") },
      { id: 'W_2', name: translate("maps.armsFactory.cipher.w2.name"), location: [251, 193], feature: translate("maps.armsFactory.cipher.w2.feature") },
      { id: 'W_3', name: translate("maps.armsFactory.cipher.w3.name"), location: [182, 249], feature: translate("maps.armsFactory.cipher.w3.feature") },
      { id: 'W_4', name: translate("maps.armsFactory.cipher.w4.name"), location: [107, 486], feature: translate("maps.armsFactory.cipher.w4.feature") },
    ];

    const cipherCombinations = [
      ['M_4', 'M_1', 'M_3', 'W_4', 'W_1', 'E_2', 'E_4'],
      ['M_4', 'M_2', 'W_4', 'W_1', 'W_2', 'E_2', 'E_4'],
      ['M_4', 'M_1', 'M_3', 'W_4', 'W_2', 'E_1', 'E_4'],
      ['M_4', 'M_2', 'M_3', 'W_1', 'W_3', 'E_1', 'E_3'],
      ['M_4', 'M_1', 'M_3', 'W_4', 'W_3', 'E_2', 'E_3']
    ];

    const dungeons = [[385, 554], [175, 133], [428, 284]];

    const rocketChairs = {
      fixed: [[603, 113], [532, 282], [191, 326], [671, 363], [379, 368], [407, 549], [233, 560], [123, 562], [619, 567]],
      sets: [
        [[216, 137], [476, 160], [128, 220]],
        [[330, 119], [117, 138]],
        [[216, 137], [117, 138], [416, 222]],
        [[330, 119], [128, 220], [416, 222]],
        [[330, 119], [117, 138], [291, 318]],
      ],
    };

    const chests = {
      fixed: [[129, 140], [570, 186], [202, 303], [382, 357]],
    };

    const basements = {
      basement_1: {
        rocketChairs: [[517, -33, 468], [565, -33, 487], [548, -33, 492], [526, -33, 499]],
        chest: [[547, -33, 458]],
      },
      basement_2: {
        rocketChairs: [[277, -33, 217], [315, -33, 221], [322, -33, 249], [286, -33, 253]],
        chest: [[343, -33, 229]],
      },
    };


    const escapeDoors = [[682, 240], [45, 320], [682, 260], [45, 300]];

    const widthM = 166.2;
    const law_urls = ['https://www.bilibili.com/video/BV1oauC6kEy9', 'https://v.douyin.com/b_OabxYks7k/'];
    const fixedHint = translate("maps.armsFactory.fixedHint");
    const hints = [
      translate("maps.armsFactory.hint.hint0"),
      translate("maps.armsFactory.hint.hint1"),
      translate("maps.armsFactory.hint.hint0"),
      translate("maps.armsFactory.hint.hint3"),
      translate("maps.armsFactory.hint.hint0")
    ];




    const fixedSpawns = {
      professor: { label: translate("maps.fixedSpawns.professor"), item: { icon: 'scale', points: [[348, 551], [389, 144]] } },
      photographer: {
        label: translate("maps.fixedSpawns.photographer"),
        item: {
          flag_orientation: true,
          icon: 'camera',
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
      },
      madEyes: {
        label: translate("maps.fixedSpawns.madEyes"),
        item: {
          flag_orientation: true,
          icon: 'console',
          rangeM: 21.11, rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
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
      },
      smileyFace: {
        label: translate("maps.fixedSpawns.smileyFace"),
        item: [
          {
            icon: 'windWings', points: [
              { p: [267, 164] },
              { p: [254, 160] },
              { p: [428, 393] },
              { p: [585, 175] },
              { p: [315, 541] },
              { p: [509, 601] },
              { p: [114, 498] },
              { p: [420, 109] },
              { p: [628, 580] },
              { p: [443, 560] },
              { p: [156, 213] },
              { p: [682, 374] },
              { p: [344, 116] },
            ],
          },
          {
            icon: 'drill', points: [
              { p: [530, 567] },
              { p: [415, 112] },
              { p: [255, 518] },
              { p: [596, 165] },
              { p: [124, 474] },
              { p: [376, 379] },
              { p: [277, 199] },
              { p: [109, 556] },
              { p: [186, 345] },
              { p: [528, 259] },
              { p: [370, 344] },
              { p: [603, 93] },
              { p: [141, 210] },
            ],
          },
          {
            icon: 'propeller', points: [
              { p: [88, 499] },
              { p: [305, 537] },
              { p: [467, 97] },
              { p: [392, 371] },
              { p: [587, 185] },
              { p: [230, 197] },
              { p: [502, 589] },
              { p: [540, 454] },
              { p: [312, 203] },
              { p: [461, 250] },
              { p: [303, 392] },
            ],
          },
        ],
      },
    };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, rocketChairs, chests, basements, widthM,
      fixedSpawns,
      law_urls, fixedHint, hints,
      deduction: (() => {
        const { fixed, region, exactly, either } = dedHelpers(ciphers);
        const rules = [
          fixed({ names: [translate("maps.armsFactory.cipher.m4.name")] }),
          region({ name: translate("maps.armsFactory.rules"), min: 2, max: 3, names: [translate("maps.armsFactory.cipher.w1.name"), translate("maps.armsFactory.cipher.w2.name"), translate("maps.armsFactory.cipher.w3.name"), translate("maps.armsFactory.cipher.w4.name")] }),
          region({ name: translate("maps.armsFactory.rulesAlternate"), min: 2, max: 3, names: [translate("maps.armsFactory.cipher.m1.name"), translate("maps.armsFactory.cipher.m2.name"), translate("maps.armsFactory.cipher.m3.name"), translate("maps.armsFactory.cipher.m4.name")] }),
          region({ name: translate("maps.armsFactory.rulesThird"), min: 2, max: 2, names: [translate("maps.armsFactory.cipher.e1.name"), translate("maps.armsFactory.cipher.e2.name"), translate("maps.armsFactory.cipher.e3.name"), translate("maps.armsFactory.cipher.e4.name")] }),
          either({ names: [translate("maps.armsFactory.cipher.e1.name"), translate("maps.armsFactory.cipher.e2.name")] }),
          either({ names: [translate("maps.armsFactory.cipher.e3.name"), translate("maps.armsFactory.cipher.e4.name")] }),
          either({ names: [translate("maps.armsFactory.cipher.m2.name"), translate("maps.armsFactory.cipher.m1.name")] }),
          exactly({ n: 2, names: [translate("maps.armsFactory.cipher.w4.name"), translate("maps.armsFactory.cipher.m3.name"), translate("maps.armsFactory.cipher.m2.name")] }),
          exactly({ n: 2, names: [translate("maps.armsFactory.cipher.m1.name"), translate("maps.armsFactory.cipher.w1.name"), translate("maps.armsFactory.cipher.w2.name"), translate("maps.armsFactory.cipher.w3.name")] }),
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
      translate("maps.sacredHeartHospital.zoneNames.zoneNames0"), translate("maps.sacredHeartHospital.zoneNames.zoneNames1"), translate("maps.sacredHeartHospital.zoneNames.zoneNames2"),
      translate("maps.sacredHeartHospital.zoneNames.zoneNames3"), translate("maps.sacredHeartHospital.zoneNames.zoneNames4"), translate("maps.sacredHeartHospital.zoneNames.zoneNames5"),
      translate("maps.sacredHeartHospital.zoneNames.zoneNames6"), translate("maps.sacredHeartHospital.zoneNames.zoneNames7"), translate("maps.sacredHeartHospital.zoneNames.zoneNames8")
    ];
    const ciphers = [
      { id: 'A_1', name: translate("maps.sacredHeartHospital.cipher.a1.name"), location: [356, 297], feature: translate("maps.sacredHeartHospital.cipher.a1.feature") },
      { id: 'A_2', name: translate("maps.sacredHeartHospital.cipher.a2.name"), location: [324, 396], feature: translate("maps.sacredHeartHospital.cipher.a2.feature") },
      { id: 'B_1', name: translate("maps.sacredHeartHospital.cipher.b1.name"), location: [510, 147], feature: translate("maps.sacredHeartHospital.cipher.b1.feature") },
      { id: 'B_2', name: translate("maps.sacredHeartHospital.cipher.b2.name"), location: [377, 77], feature: translate("maps.sacredHeartHospital.cipher.b2.feature") },
      { id: 'B_3', name: translate("maps.sacredHeartHospital.cipher.b3.name"), location: [248, 96], feature: translate("maps.sacredHeartHospital.cipher.b3.feature") },
      { id: 'C_1', name: translate("maps.sacredHeartHospital.cipher.c1.name"), location: [149, 202], feature: translate("maps.sacredHeartHospital.cipher.c1.feature") },
      { id: 'C_2', name: translate("maps.sacredHeartHospital.cipher.c2.name"), location: [129, 415], feature: translate("maps.sacredHeartHospital.cipher.c2.feature") },
      { id: 'C_3', name: translate("maps.sacredHeartHospital.cipher.c3.name"), location: [226, 480], feature: translate("maps.sacredHeartHospital.cipher.c3.feature") },
      { id: 'D_1', name: translate("maps.sacredHeartHospital.cipher.d1.name"), location: [422, 470], feature: translate("maps.sacredHeartHospital.cipher.d1.feature") },
      { id: 'D_2', name: translate("maps.sacredHeartHospital.cipher.d2.name"), location: [520, 506], feature: translate("maps.sacredHeartHospital.cipher.d2.feature") },
      { id: 'D_3', name: translate("maps.sacredHeartHospital.cipher.d3.name"), location: [527, 346], feature: translate("maps.sacredHeartHospital.cipher.d3.feature") },
    ];

    const cipherCombinations = [
      ['A_2', 'B_1', 'B_3', 'C_1', 'C_2', 'D_1', 'D_3'],
      ['A_2', 'B_2', 'B_3', 'C_1', 'C_3', 'D_2', 'D_3'],
      ['A_1', 'B_1', 'B_3', 'C_2', 'C_3', 'D_1', 'D_3'],
      ['A_1', 'B_1', 'B_2', 'C_1', 'C_3', 'D_1', 'D_2'],
      ['A_2', 'B_1', 'B_2', 'C_1', 'C_2', 'D_1', 'D_2']
    ];

    const dungeons = [[146, 321], [512, 480], [581, 297]];

    const rocketChairs = {
      fixed: [[361, 62], [538, 116], [244, 141], [343, 172], [149, 223], [588, 308], [242, 322], [241, 412], [137, 471], [552, 503], [279, 505]],
      sets: [
        [[545, 396], [425, 503]],
        [[487, 398], [425, 503]],
        [[545, 396], [487, 398]],
      ],
    };

    const chests = {
      fixed: [[239, 58], [292, 108], [373, 1, 195], [150, 345], [391, 348], [366, 476], [564, 495]],
    };

    const basements = {
      basement_1: {
        rocketChairs: [[296, -28, 282], [303, -28, 291], [312, -28, 298], [280, -28, 323]],
        chest: [[267, -28, 279]],
      },
      basement_2: {
        rocketChairs: [[505, -31, 142], [475, -31, 157], [475, -31, 170], [476, -31, 184]],
        chest: [[514, -31, 179]],
      },
    };


    const escapeDoors = [[326, 530], [615, 88], [311, 530], [615, 104]];

    const widthM = 151.5;
    const law_urls = ['https://www.bilibili.com/video/BV117tB6pE5R', 'https://v.douyin.com/WLJ-VhInJbE'];
    const fixedHint = translate("maps.sacredHeartHospital.fixedHint");
    const hints = [
      '',
      translate("maps.sacredHeartHospital.hint.hint1"),
      translate("maps.sacredHeartHospital.hint.hint2"),
      translate("maps.sacredHeartHospital.hint.hint3"),
      translate("maps.sacredHeartHospital.hint.hint4")
    ];

    const fixedSpawns = {
      professor: { label: translate("maps.fixedSpawns.professor"), item: { icon: 'scale', points: [[395, 454], [250, 202]] } },
      photographer: {
        label: translate("maps.fixedSpawns.photographer"),
        item: {
          flag_orientation: true,
          icon: 'camera',
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
      },
      madEyes: {
        label: translate("maps.fixedSpawns.madEyes"),
        item: {
          flag_orientation: true,
          icon: 'console',
          rangeM: 21.11, rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
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
      },
      smileyFace: {
        label: translate("maps.fixedSpawns.smileyFace"),
        item: [
          {
            icon: 'windWings', points: [
              { p: [316, 390] },
              { p: [303, 417] },
              { p: [418, 443] },
              { p: [148, 191] },
              { p: [519, 148] },
              { p: [383, 91] },
              { p: [546, 488] },
              { p: [139, 403] },
              { p: [146, 450] },
              { p: [288, 517] },
              { p: [538, 369] },
              { p: [373, 36] },
            ],
          },
          {
            icon: 'drill', points: [
              { p: [453, 467] },
              { p: [329, 422] },
              { p: [526, 154] },
              { p: [162, 199] },
              { p: [405, 70] },
              { p: [116, 424] },
              { p: [540, 517] },
              { p: [271, 517] },
              { p: [232, 160] },
              { p: [542, 510] },
              { p: [544, 414] },
              { p: [347, 44] },
              { p: [246, 346] },
            ],
          },
          {
            icon: 'propeller', points: [
              { p: [505, 168] },
              { p: [495, 145] },
              { p: [382, 59] },
              { p: [509, 496] },
              { p: [135, 209] },
              { p: [116, 422] },
              { p: [425, 487] },
              { p: [335, 412] },
              { p: [374, 309] },
              { p: [524, 169] },
              { p: [333, 149] },
              { p: [219, 309] },
            ],
          },
        ],
      },
    };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, rocketChairs, chests, basements, widthM,
      fixedSpawns,
      law_urls, fixedHint, hints,
      deduction: (() => {
        const { exactly, either, same, atLeast1, chain } = dedHelpers(ciphers);
        const rules = [
          either({ names: [translate("maps.sacredHeartHospital.cipher.a1.name"), translate("maps.sacredHeartHospital.cipher.a2.name")] }),
          exactly({ n: 2, names: [translate("maps.sacredHeartHospital.cipher.b1.name"), translate("maps.sacredHeartHospital.cipher.b2.name"), translate("maps.sacredHeartHospital.cipher.b3.name")] }),
          exactly({ n: 2, names: [translate("maps.sacredHeartHospital.cipher.c1.name"), translate("maps.sacredHeartHospital.cipher.c2.name"), translate("maps.sacredHeartHospital.cipher.c3.name")] }),
          exactly({ n: 2, names: [translate("maps.sacredHeartHospital.cipher.d1.name"), translate("maps.sacredHeartHospital.cipher.d2.name"), translate("maps.sacredHeartHospital.cipher.d3.name")] }),
          same({ names: [translate("maps.sacredHeartHospital.cipher.b1.name"), translate("maps.sacredHeartHospital.cipher.d1.name")] }),
          same({ names: [translate("maps.sacredHeartHospital.cipher.b2.name"), translate("maps.sacredHeartHospital.cipher.d2.name")] }),
          same({ names: [translate("maps.sacredHeartHospital.cipher.b3.name"), translate("maps.sacredHeartHospital.cipher.d3.name")] }),
          exactly({ n: 2, names: [translate("maps.sacredHeartHospital.cipher.a2.name"), translate("maps.sacredHeartHospital.cipher.c3.name"), translate("maps.sacredHeartHospital.cipher.d1.name")] }),
          atLeast1({ names: [translate("maps.sacredHeartHospital.cipher.c1.name"), translate("maps.sacredHeartHospital.cipher.b1.name")] }),
          chain({
            name: translate("maps.sacredHeartHospital.rules"), mode: 'no', cyclic: true,
            names: [translate("maps.sacredHeartHospital.cipher.b1.name"), translate("maps.sacredHeartHospital.cipher.b2.name"), translate("maps.sacredHeartHospital.cipher.b3.name"), translate("maps.sacredHeartHospital.cipher.c1.name"), translate("maps.sacredHeartHospital.cipher.c2.name"),
            translate("maps.sacredHeartHospital.cipher.c3.name"), translate("maps.sacredHeartHospital.cipher.d1.name"), translate("maps.sacredHeartHospital.cipher.d2.name"), translate("maps.sacredHeartHospital.cipher.d3.name")],
            text: translate("maps.sacredHeartHospital.rulesAlternate")
              + translate("maps.sacredHeartHospital.rulesThird")
          }),
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
      translate("maps.theRedChurch.zoneNames.zoneNames0"), translate("maps.theRedChurch.zoneNames.zoneNames1"), translate("maps.theRedChurch.zoneNames.zoneNames2"),
      translate("maps.theRedChurch.zoneNames.zoneNames3"), translate("maps.theRedChurch.zoneNames.zoneNames4"), translate("maps.theRedChurch.zoneNames.zoneNames5"),
      translate("maps.theRedChurch.zoneNames.zoneNames6"), translate("maps.theRedChurch.zoneNames.zoneNames7"), translate("maps.theRedChurch.zoneNames.zoneNames8")
    ];
    const ciphers = [
      { id: 'E_4', name: translate("maps.theRedChurch.cipher.e4.name"), location: [527, 435], feature: translate("maps.theRedChurch.cipher.e4.feature"), locked: true },
      { id: 'E_1', name: translate("maps.theRedChurch.cipher.e1.name"), location: [444, 160], feature: translate("maps.theRedChurch.cipher.e1.feature") },
      { id: 'E_2', name: translate("maps.theRedChurch.cipher.e2.name"), location: [511, 242], feature: translate("maps.theRedChurch.cipher.e2.feature") },
      { id: 'E_3', name: translate("maps.theRedChurch.cipher.e3.name"), location: [401, 272], feature: translate("maps.theRedChurch.cipher.e3.feature") },
      { id: 'M_1', name: translate("maps.theRedChurch.cipher.m1.name"), location: [287, 143], feature: translate("maps.theRedChurch.cipher.m1.feature") },
      { id: 'M_2', name: translate("maps.theRedChurch.cipher.m2.name"), location: [296, 313], feature: translate("maps.theRedChurch.cipher.m2.feature") },
      { id: 'M_3', name: translate("maps.theRedChurch.cipher.m3.name"), location: [342, 499], feature: translate("maps.theRedChurch.cipher.m3.feature") },
      { id: 'W_1', name: translate("maps.theRedChurch.cipher.w1.name"), location: [121, 177], feature: translate("maps.theRedChurch.cipher.w1.feature") },
      { id: 'W_2', name: translate("maps.theRedChurch.cipher.w2.name"), location: [168, 240], feature: translate("maps.theRedChurch.cipher.w2.feature") },
      { id: 'W_3', name: translate("maps.theRedChurch.cipher.w3.name"), location: [131, 356], feature: translate("maps.theRedChurch.cipher.w3.feature") },
      { id: 'W_4', name: translate("maps.theRedChurch.cipher.w4.name"), location: [128, 475], feature: translate("maps.theRedChurch.cipher.w4.feature") },
    ];

    const cipherCombinations = [
      ['E_4', 'E_3', 'M_1', 'M_3', 'W_1', 'W_3', 'W_4'],
      ['E_4', 'E_1', 'M_2', 'M_3', 'W_1', 'W_2', 'W_4'],
      ['E_4', 'E_1', 'E_3', 'M_1', 'M_2', 'W_1', 'W_4'],
      ['E_4', 'E_1', 'E_2', 'M_2', 'M_3', 'W_1', 'W_3'],
      ['E_4', 'E_2', 'M_1', 'M_2', 'M_3', 'W_2', 'W_4']
    ];

    const dungeons = [[121, 474], [418, 417], [539, 225]];

    // 狂欢之椅（回放数据提取）：fixed 固定椅，sets 随机椅刷点组，basements 两处地下室各4把
    const rocketChairs = {
      fixed: [[167, 144], [213, 346], [511, 441], [267, 449]],
      sets: [
        [[348, 75], [431, 174], [451, 226], [445, 306], [135, 411], [356, 440], [210, 500]],
        [[253, 171], [431, 174], [354, 181], [155, 276], [445, 306], [382, 375], [210, 500]],
        [[348, 75], [253, 171], [507, 184], [451, 226], [155, 276], [382, 375], [135, 411], [356, 440]],
      ],
    };

    const chests = {
      fixed: [[153, 142], [145, 261], [442, 370], [132, 381], [138, 470], [525, 477], [330, 497]],
    };

    const basements = {
      basement_1: {
        rocketChairs: [[310, -25, 306], [310, -25, 315], [310, -25, 323], [310, -25, 331]],
        chest: [[294, -25, 289]],
      },
      basement_2: {
        rocketChairs: [[288, -28, 175], [296, -28, 175], [304, -28, 175], [312, -28, 175]],
        chest: [[331, -28, 161]],
      },
    };


    const escapeDoors = [[297, 543], [474, 90], [283, 543], [488, 90]];

    const widthM = 153.5;
    const law_urls = ['https://www.bilibili.com/video/BV169Y66PEiS', 'https://v.douyin.com/t7aa5IHJh9M'];
    const fixedHint = translate("maps.theRedChurch.fixedHint");
    const hints = [
      translate("maps.theRedChurch.hint.hint0"),
      translate("maps.theRedChurch.hint.hint1"),
      translate("maps.theRedChurch.hint.hint2"),
      '',
      translate("maps.theRedChurch.hint.hint4")
    ];

    const fixedSpawns = {
      professor: { label: translate("maps.fixedSpawns.professor"), item: { icon: 'scale', points: [[406, 258], [128, 441]] } },
      photographer: {
        label: translate("maps.fixedSpawns.photographer"),
        item: {
          flag_orientation: true,
          icon: 'camera',
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
      },
      madEyes: {
        label: translate("maps.fixedSpawns.madEyes"),
        item: {
          flag_orientation: true,
          icon: 'console',
          rangeM: 21.11, rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
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
      },
      smileyFace: {
        label: translate("maps.fixedSpawns.smileyFace"),
        item: [
          {
            icon: 'windWings', points: [
              { p: [456, 169] },
              { p: [305, 344] },
              { p: [402, 260] },
              { p: [290, 167] },
              { p: [533, 404] },
              { p: [128, 194] },
              { p: [118, 460] },
              { p: [342, 429] },
              { p: [335, 94] },
              { p: [234, 493] },
              { p: [427, 193] },
            ],
          },
          {
            icon: 'drill', points: [
              { p: [133, 448] },
              { p: [140, 192] },
              { p: [424, 267] },
              { p: [299, 284] },
              { p: [296, 151] },
              { p: [431, 169] },
              { p: [528, 418] },
              { p: [199, 328] },
              { p: [149, 147] },
              { p: [438, 193] },
              { p: [353, 435] },
              { p: [450, 304] },
              { p: [135, 418] },
            ],
          },
          {
            icon: 'propeller', points: [
              { p: [413, 263] },
              { p: [299, 335] },
              { p: [534, 448] },
              { p: [120, 191] },
              { p: [140, 487] },
              { p: [277, 132] },
              { p: [441, 142] },
              { p: [296, 325] },
              { p: [315, 136] },
              { p: [423, 399] },
              { p: [148, 392] },
            ],
          },
        ],
      },
    };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, rocketChairs, chests, basements, widthM,
      fixedSpawns,
      law_urls, fixedHint, hints,
      deduction: (() => {
        const { fixed, region, exactly, atLeast1, chain } = dedHelpers(ciphers);
        const rules = [
          fixed({ names: [translate("maps.theRedChurch.cipher.e4.name")] }),
          region({ name: translate("maps.theRedChurch.rules"), min: 2, max: 3, names: [translate("maps.theRedChurch.cipher.w1.name"), translate("maps.theRedChurch.cipher.w2.name"), translate("maps.theRedChurch.cipher.w3.name"), translate("maps.theRedChurch.cipher.w4.name")] }),
          region({ name: translate("maps.armsFactory.rulesAlternate"), min: 2, max: 3, names: [translate("maps.theRedChurch.cipher.m1.name"), translate("maps.theRedChurch.cipher.m2.name"), translate("maps.theRedChurch.cipher.m3.name")] }),
          region({ name: translate("maps.theRedChurch.rulesAlternate"), min: 2, max: 3, names: [translate("maps.theRedChurch.cipher.e1.name"), translate("maps.theRedChurch.cipher.e2.name"), translate("maps.theRedChurch.cipher.e3.name"), translate("maps.theRedChurch.cipher.e4.name")] }),
          atLeast1({ names: [translate("maps.theRedChurch.cipher.w1.name"), translate("maps.theRedChurch.cipher.w2.name")] }),
          atLeast1({ names: [translate("maps.theRedChurch.cipher.w3.name"), translate("maps.theRedChurch.cipher.w4.name")] }),
          chain({
            name: translate("maps.chain"), mode: 'yes', cyclic: false,
            names: [translate("maps.theRedChurch.cipher.w3.name"), translate("maps.theRedChurch.cipher.w2.name"), translate("maps.theRedChurch.cipher.e3.name"), translate("maps.theRedChurch.cipher.e2.name")],
            text: translate("maps.theRedChurch.rulesThird")
          }),
          exactly({ n: 2, names: [translate("maps.theRedChurch.cipher.m2.name"), translate("maps.theRedChurch.cipher.e3.name"), translate("maps.theRedChurch.cipher.m3.name")] }),
          exactly({ n: 2, names: [translate("maps.theRedChurch.cipher.m1.name"), translate("maps.theRedChurch.cipher.e1.name"), translate("maps.theRedChurch.cipher.m3.name")] }),
          exactly({ n: 2, names: [translate("maps.theRedChurch.cipher.w1.name"), translate("maps.theRedChurch.cipher.w4.name"), translate("maps.theRedChurch.cipher.e2.name")] }),
          exactly({ n: 2, names: [translate("maps.theRedChurch.cipher.w3.name"), translate("maps.theRedChurch.cipher.w4.name"), translate("maps.theRedChurch.cipher.m2.name")] }),
          exactly({ n: 3, names: [translate("maps.theRedChurch.cipher.w1.name"), translate("maps.theRedChurch.cipher.m1.name"), translate("maps.theRedChurch.cipher.m2.name"), translate("maps.theRedChurch.cipher.m3.name")] }),
          atLeast1({ names: [translate("maps.theRedChurch.cipher.w1.name"), translate("maps.theRedChurch.cipher.m1.name")] }),
          atLeast1({ names: [translate("maps.theRedChurch.cipher.w4.name"), translate("maps.theRedChurch.cipher.m3.name")] }),
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
      translate("maps.lakesideVillage.zoneNames.zoneNames0"), translate("maps.lakesideVillage.zoneNames.zoneNames1"), translate("maps.lakesideVillage.zoneNames.zoneNames2"),
      translate("maps.lakesideVillage.zoneNames.zoneNames3"), translate("maps.lakesideVillage.zoneNames.zoneNames4"), translate("maps.lakesideVillage.zoneNames.zoneNames5"),
      translate("maps.lakesideVillage.zoneNames.zoneNames6"), translate("maps.lakesideVillage.zoneNames.zoneNames7"), translate("maps.lakesideVillage.zoneNames.zoneNames8"),
      translate("maps.lakesideVillage.zoneNames.zoneNames9"), translate("maps.lakesideVillage.zoneNames.zoneNames10"), translate("maps.lakesideVillage.zoneNames.eleven")
    ];
    const ciphers = [
      { id: 'E_1', name: translate("maps.lakesideVillage.cipher.e1.name"), location: [1132, 680], feature: translate("maps.lakesideVillage.cipher.e1.feature"), locked: true },
      { id: 'E_2', name: translate("maps.lakesideVillage.cipher.e2.name"), location: [993, 364], feature: translate("maps.lakesideVillage.cipher.e2.feature") },
      { id: 'E_3', name: translate("maps.lakesideVillage.cipher.e3.name"), location: [976, 857], feature: translate("maps.lakesideVillage.cipher.e3.feature") },
      { id: 'M_1', name: translate("maps.lakesideVillage.cipher.m1.name"), location: [709, 325], feature: translate("maps.lakesideVillage.cipher.m1.feature") },
      { id: 'M_2', name: translate("maps.lakesideVillage.cipher.m2.name"), location: [651, 719], feature: translate("maps.lakesideVillage.cipher.m2.feature") },
      { id: 'M_3', name: translate("maps.lakesideVillage.cipher.m3.name"), location: [719, 994], feature: translate("maps.lakesideVillage.cipher.m3.feature") },
      { id: 'W_1', name: translate("maps.lakesideVillage.cipher.w1.name"), location: [387, 245], feature: translate("maps.lakesideVillage.cipher.w1.feature") },
      { id: 'W_2', name: translate("maps.lakesideVillage.cipher.w2.name"), location: [467, 352], feature: translate("maps.lakesideVillage.cipher.w2.feature") },
      { id: 'W_3', name: translate("maps.lakesideVillage.cipher.w3.name"), location: [370, 656], feature: translate("maps.lakesideVillage.cipher.w3.feature") },
      { id: 'W_4', name: translate("maps.lakesideVillage.cipher.w4.name"), location: [393, 830], feature: translate("maps.lakesideVillage.cipher.w4.feature") },
      { id: 'W_5', name: translate("maps.lakesideVillage.cipher.w5.name"), location: [307, 963], feature: translate("maps.lakesideVillage.cipher.w5.feature") },
    ];

    const cipherCombinations = [
      ['E_1', 'E_2', 'M_1', 'M_3', 'W_1', 'W_3', 'W_5'],
      ['E_1', 'E_2', 'M_1', 'M_2', 'M_3', 'W_2', 'W_5'],
      ['E_1', 'E_2', 'M_1', 'M_2', 'M_3', 'W_1', 'W_4'],
      ['E_1', 'E_3', 'M_1', 'M_2', 'W_1', 'W_3', 'W_5'],
      ['E_1', 'E_2', 'E_3', 'M_2', 'M_3', 'W_2', 'W_4']
    ];

    const dungeons = [[254, 638], [386, 858], [770, 860], [940, 530], [922, 308]];

    const rocketChairs = {
      fixed: [[759, 265], [947, 369], [1080, 43, 574], [461, 621], [195, 697], [775, 733], [292, 878], [973, 896], [406, 1000]],
      sets: [
        [[171, 276], [770, 1023], [315, 203], [564, 874], [465, 379], [998, 745], [237, 497]], // 3/8 局
        [[171, 276], [859, 626], [770, 1023], [315, 203], [728, 585], [664, 449], [564, 874]], // 2/8 局
        [[859, 626], [770, 1023], [728, 585], [664, 449], [564, 874], [170, 284], [314, 211]], // 1/8 局
        [[171, 276], [859, 626], [770, 1023], [728, 585], [564, 874], [465, 379], [237, 497]], // 1/8 局
        [[171, 276], [859, 626], [315, 203], [664, 449], [465, 379], [696, -1, 988]], // 1/8 局
      ],
    };

    const chests = {
      fixed: [[157, 516], [346, 555], [230, 668], [854, 703], [195, 839], [818, 996], [324, 1065]],
    };

    const basements = {
      basement_1: {
        rocketChairs: [[622, -47, 283], [579, -47, 308], [621, -47, 316], [579, -47, 324]],
        chest: [[601, -47, 250]],
      },
      basement_2: {
        rocketChairs: [[1080, -41, 683], [1038, -41, 691], [1079, -41, 701], [1041, -41, 724]],
        chest: [[1056, -40, 760]],
      },
    };


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
      professor: { label: translate("maps.fixedSpawns.professor"), item: { icon: 'scale', points: [[885, 876], [345, 454]] } },
      photographer: {
        label: translate("maps.fixedSpawns.photographer"),
        item: {
          flag_orientation: true,
          icon: 'camera',
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
      },
      madEyes: {
        label: translate("maps.fixedSpawns.madEyes"),
        item: {
          flag_orientation: true,
          icon: 'console',
          rangeM: 21.11, rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
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
      },
      smileyFace: {
        label: translate("maps.fixedSpawns.smileyFace"),
        item: [
          {
            icon: 'windWings', points: [
              { p: [978, 835] },
              { p: [599, 713] },
              { p: [350, 855] },
              { p: [1036, 366] },
              { p: [701, 983] },
              { p: [472, 331] },
              { p: [1108, 704] },
              { p: [561, 850] },
              { p: [194, 722] },
              { p: [897, 654] },
              { p: [644, 445] },
            ],
          },
          {
            icon: 'drill', points: [
              { p: [354, 850] },
              { p: [490, 361] },
              { p: [988, 825] },
              { p: [686, 751] },
              { p: [1045, 347] },
              { p: [1108, 706] },
              { p: [757, 958] },
              { p: [873, 621] },
              { p: [751, 238] },
              { p: [164, 723] },
              { p: [431, 1007] },
              { p: [759, 602] },
              { p: [1103, 570] },
            ],
          },
          {
            icon: 'propeller', points: [
              { p: [1120, 670] },
              { p: [629, 743] },
              { p: [1027, 372] },
              { p: [993, 849] },
              { p: [400, 811] },
              { p: [433, 347] },
              { p: [730, 964] },
              { p: [1113, 726] },
              { p: [521, 307] },
              { p: [789, 426] },
              { p: [514, 863] },
            ],
          },
        ],
      },
    };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, rocketChairs, chests, basements, widthM,
      fixedSpawns,
      law_urls, fixedHint, hints,
      deduction: (() => {
        const { fixed, region, exactly, either, same, chain } = dedHelpers(ciphers);
        const rules = [
          fixed({ names: [translate("maps.lakesideVillage.cipher.e1.name")] }),
          region({
            name: translate("maps.armsFactory.rules"), min: 2, max: 3,
            names: [translate("maps.lakesideVillage.cipher.w1.name"), translate("maps.lakesideVillage.cipher.w2.name"), translate("maps.lakesideVillage.cipher.w3.name"), translate("maps.lakesideVillage.cipher.w4.name"), translate("maps.lakesideVillage.cipher.w5.name")]
          }),
          region({ name: translate("maps.lakesideVillage.rules"), min: 2, max: 3, names: [translate("maps.lakesideVillage.cipher.m1.name"), translate("maps.lakesideVillage.cipher.m2.name"), translate("maps.lakesideVillage.cipher.m3.name")] }),
          region({ name: translate("maps.armsFactory.rulesThird"), min: 2, max: 3, names: [translate("maps.lakesideVillage.cipher.e2.name"), translate("maps.lakesideVillage.cipher.e1.name"), translate("maps.lakesideVillage.cipher.e3.name")] }),
          region({ name: translate("maps.lakesideVillage.rulesAlternate"), min: 2, max: 3, names: [translate("maps.lakesideVillage.cipher.w1.name"), translate("maps.lakesideVillage.cipher.w2.name"), translate("maps.lakesideVillage.cipher.m1.name"), translate("maps.lakesideVillage.cipher.e2.name")] }),
          region({ name: translate("maps.lakesideVillage.rulesThird"), min: 2, max: 3, names: [translate("maps.lakesideVillage.cipher.w3.name"), translate("maps.lakesideVillage.cipher.m2.name"), translate("maps.lakesideVillage.cipher.e1.name")] }),
          region({
            name: translate("maps.lakesideVillage.rulesFourth"), min: 2, max: 3,
            names: [translate("maps.lakesideVillage.cipher.w4.name"), translate("maps.lakesideVillage.cipher.w5.name"), translate("maps.lakesideVillage.cipher.m3.name"), translate("maps.lakesideVillage.cipher.e3.name")]
          }),
          either({ names: [translate("maps.lakesideVillage.cipher.w1.name"), translate("maps.lakesideVillage.cipher.w2.name")] }),
          either({ names: [translate("maps.lakesideVillage.cipher.w4.name"), translate("maps.lakesideVillage.cipher.w5.name")] }),
          same({ names: [translate("maps.lakesideVillage.cipher.e2.name"), translate("maps.lakesideVillage.cipher.m3.name")] }),
          exactly({ n: 2, names: [translate("maps.lakesideVillage.cipher.m1.name"), translate("maps.lakesideVillage.cipher.e2.name"), translate("maps.lakesideVillage.cipher.e3.name")] }),
          exactly({ n: 2, names: [translate("maps.lakesideVillage.cipher.e2.name"), translate("maps.lakesideVillage.cipher.m2.name"), translate("maps.lakesideVillage.cipher.w3.name")] }),
          chain({
            name: translate("maps.lakesideVillage.rulesFifth"), mode: 'yes', cyclic: false,
            names: [translate("maps.lakesideVillage.cipher.w1.name"), translate("maps.lakesideVillage.cipher.w2.name"), translate("maps.lakesideVillage.cipher.w3.name"), translate("maps.lakesideVillage.cipher.w4.name"), translate("maps.lakesideVillage.cipher.w5.name")],
            text: translate("maps.lakesideVillage.rulesSixth")
              + translate("maps.lakesideVillage.rulesSeventh")
          }),
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
      translate("maps.moonlitRiverPark.zoneNames.zoneNames0"), translate("maps.moonlitRiverPark.zoneNames.zoneNames1"), translate("maps.moonlitRiverPark.zoneNames.zoneNames2"),
      translate("maps.moonlitRiverPark.zoneNames.zoneNames3"), translate("maps.moonlitRiverPark.zoneNames.zoneNames4"), translate("maps.moonlitRiverPark.zoneNames.zoneNames5"),
      translate("maps.moonlitRiverPark.zoneNames.zoneNames6"), translate("maps.moonlitRiverPark.zoneNames.zoneNames7"), translate("maps.moonlitRiverPark.zoneNames.zoneNames8"),
      translate("maps.moonlitRiverPark.zoneNames.zoneNames9"), translate("maps.moonlitRiverPark.zoneNames.zoneNames10"), translate("maps.moonlitRiverPark.zoneNames.eleven")
    ];
    const ciphers = [
      { id: 'M_1', name: translate("maps.moonlitRiverPark.cipher.m1.name"), location: [711, 261], feature: translate("maps.moonlitRiverPark.cipher.m1.feature"), locked: true },
      { id: 'E_1', name: translate("maps.moonlitRiverPark.cipher.e1.name"), location: [967, 757], feature: translate("maps.moonlitRiverPark.cipher.e1.feature"), locked: true },
      { id: 'E_2', name: translate("maps.moonlitRiverPark.cipher.e2.name"), location: [1371, 311], feature: translate("maps.moonlitRiverPark.cipher.e2.feature") },
      { id: 'E_3', name: translate("maps.moonlitRiverPark.cipher.e3.name"), location: [1036, 289], feature: translate("maps.moonlitRiverPark.cipher.e3.feature") },
      { id: 'E_4', name: translate("maps.moonlitRiverPark.cipher.e4.name"), location: [1174, 517], feature: translate("maps.moonlitRiverPark.cipher.e4.feature") },
      { id: 'E_5', name: translate("maps.moonlitRiverPark.cipher.e5.name"), location: [1323, 769], feature: translate("maps.moonlitRiverPark.cipher.e5.feature") },
      { id: 'W_1', name: translate("maps.moonlitRiverPark.cipher.w1.name"), location: [257, 301], feature: translate("maps.moonlitRiverPark.cipher.w1.feature") },
      { id: 'W_2', name: translate("maps.moonlitRiverPark.cipher.w2.name"), location: [72, 464], feature: translate("maps.moonlitRiverPark.cipher.w2.feature") },
      { id: 'W_3', name: translate("maps.moonlitRiverPark.cipher.w3.name"), location: [165, 753], feature: translate("maps.moonlitRiverPark.cipher.w3.feature") },
      { id: 'W_4', name: translate("maps.moonlitRiverPark.cipher.w4.name"), location: [444, 873], feature: translate("maps.moonlitRiverPark.cipher.w4.feature") },
      { id: 'W_5', name: translate("maps.moonlitRiverPark.cipher.w5.name"), location: [517, 607], feature: translate("maps.moonlitRiverPark.cipher.w5.feature") },
    ];

    const cipherCombinations = [
      ['M_1', 'E_1', 'E_4', 'E_5', 'W_1', 'W_2', 'W_4'],
      ['M_1', 'E_1', 'E_2', 'E_5', 'W_1', 'W_3', 'W_4'],
      ['M_1', 'E_1', 'E_3', 'E_5', 'W_2', 'W_3', 'W_5'],
      ['M_1', 'E_1', 'E_3', 'E_5', 'W_1', 'W_3', 'W_5'],
      ['M_1', 'E_1', 'E_2', 'E_4', 'W_2', 'W_4', 'W_5']
    ];

    const dungeons = [[1288, 709], [746, 469], [417, 911], [68, 425], [532, 138]];
    const rocketChairs = {
      fixed: [[1164, 192], [463, 276], [925, 374], [120, 382], [1333, 409], [158, 603], [1351, 679], [1044, 6, 722], [238, 815]],
      sets: [
        [[347, 437], [993, 517], [667, 1, 771]], // 3/9 局
        [[531, 516], [1177, 583], [430, 851]], // 2/9 局
        [[347, 437], [1177, 583], [667, 1, 771]], // 1/9 局
        [[531, 516], [993, 517], [667, 1, 771]], // 1/9 局
        [[531, 516], [1177, 583], [667, 1, 771]], // 1/9 局
        [[531, 516], [993, 517], [430, 851]], // 1/9 局
      ],
    };

    const chests = {
      fixed: [[834, 184], [63, 223], [1280, 319], [855, 458], [1402, 781], [734, 789], [249, 802]],
    };

    const basements = {
      basement_1: {
        rocketChairs: [[473, -60, 210], [437, -60, 223], [473, -60, 257], [433, -60, 280]],
        chest: [[475, -59, 236]],
      },
      basement_2: {
        rocketChairs: [[961, -53, 775], [917, -53, 790], [997, -53, 809], [940, -53, 823]],
        chest: [[941, -53, 784]],
      },
    };


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
      professor: { label: translate("maps.fixedSpawns.professor"), item: { icon: 'scale', points: [[647, 750], [933, 254]] } },
      photographer: {
        label: translate("maps.fixedSpawns.photographer"),
        item: {
          flag_orientation: true,
          icon: 'camera',
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
      },
      madEyes: {
        label: translate("maps.fixedSpawns.madEyes"),
        item: {
          flag_orientation: true,
          icon: 'console',
          rangeM: 21.11, rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
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
      },
      smileyFace: {
        label: translate("maps.fixedSpawns.smileyFace"),
        item: [
          {
            icon: 'windWings', points: [
              { p: [237, 263] },
              { p: [222, 249] },
              { p: [1124, 483] },
              { p: [410, 827] },
              { p: [90, 439] },
              { p: [998, 773] },
              { p: [1316, 808] },
              { p: [711, 297] },
              { p: [1041, 546] },
              { p: [1384, 625] },
              { p: [880, 377] },
              { p: [85, 412] },
              { p: [201, 633] },
            ],
          },
          {
            icon: 'drill', points: [
              { p: [313, 275] },
              { p: [55, 400] },
              { p: [741, 313] },
              { p: [469, 927] },
              { p: [1355, 731] },
              { p: [1020, 751] },
              { p: [1203, 579] },
              { p: [502, 505] },
              { p: [256, 833] },
              { p: [149, 572] },
              { p: [1339, 418] },
              { p: [435, 285] },
            ],
          },
          {
            icon: 'propeller', points: [
              { p: [69, 433] },
              { p: [728, 297] },
              { p: [241, 287] },
              { p: [1333, 804] },
              { p: [973, 727] },
              { p: [471, 842] },
              { p: [1181, 545] },
              { p: [986, 754] },
              { p: [274, 246] },
              { p: [322, 718] },
              { p: [1010, 401] },
            ],
          },
        ],
      },
    };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, rocketChairs, chests, basements, widthM,
      fixedSpawns,
      law_urls, fixedHint, hints,
      deduction: (() => {
        const { fixed, region, exactly, either, chain } = dedHelpers(ciphers);
        const rules = [
          fixed({ names: [translate("maps.moonlitRiverPark.cipher.m1.name"), translate("maps.moonlitRiverPark.cipher.e1.name")] }),
          region({
            name: translate("maps.moonlitRiverPark.rules"), min: 3, max: 3,
            names: [translate("maps.moonlitRiverPark.cipher.w1.name"), translate("maps.moonlitRiverPark.cipher.w2.name"), translate("maps.moonlitRiverPark.cipher.w3.name"), translate("maps.moonlitRiverPark.cipher.w4.name"), translate("maps.moonlitRiverPark.cipher.w5.name")]
          }),
          region({
            name: translate("maps.moonlitRiverPark.rulesAlternate"), min: 3, max: 3,
            names: [translate("maps.moonlitRiverPark.cipher.e2.name"), translate("maps.moonlitRiverPark.cipher.e3.name"), translate("maps.moonlitRiverPark.cipher.e4.name"), translate("maps.moonlitRiverPark.cipher.e1.name"), translate("maps.moonlitRiverPark.cipher.e5.name")]
          }),
          chain({
            name: translate("maps.moonlitRiverPark.rulesThird"), mode: 'no', cyclic: true,
            names: [translate("maps.moonlitRiverPark.cipher.w1.name"), translate("maps.moonlitRiverPark.cipher.w2.name"), translate("maps.moonlitRiverPark.cipher.w3.name"), translate("maps.moonlitRiverPark.cipher.w4.name"), translate("maps.moonlitRiverPark.cipher.w5.name")],
            text: translate("maps.moonlitRiverPark.rulesFourth")
              + translate("maps.moonlitRiverPark.rulesFifth")
          }),
          either({ names: [translate("maps.moonlitRiverPark.cipher.w4.name"), translate("maps.moonlitRiverPark.cipher.e3.name")] }),
          either({ names: [translate("maps.moonlitRiverPark.cipher.w3.name"), translate("maps.moonlitRiverPark.cipher.e4.name")] }),
          exactly({ n: 2, names: [translate("maps.moonlitRiverPark.cipher.w5.name"), translate("maps.moonlitRiverPark.cipher.w4.name"), translate("maps.moonlitRiverPark.cipher.e5.name")] }),
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
      translate("maps.leosMemory.zoneNames.zoneNames0"), translate("maps.leosMemory.zoneNames.zoneNames1"), translate("maps.leosMemory.zoneNames.zoneNames2"),
      translate("maps.leosMemory.zoneNames.zoneNames3"), translate("maps.leosMemory.zoneNames.zoneNames4"), translate("maps.leosMemory.zoneNames.zoneNames5"),
      translate("maps.leosMemory.zoneNames.zoneNames6"), translate("maps.leosMemory.zoneNames.zoneNames7"), translate("maps.leosMemory.zoneNames.zoneNames8")
    ];
    const ciphers = [
      { id: 'E_1', name: translate("maps.leosMemory.cipher.e1.name"), location: [508, 113], feature: translate("maps.leosMemory.cipher.e1.feature") },
      { id: 'E_2', name: translate("maps.leosMemory.cipher.e2.name"), location: [647, 198], feature: translate("maps.leosMemory.cipher.e2.feature") },
      { id: 'E_3', name: translate("maps.leosMemory.cipher.e3.name"), location: [550, 318], feature: translate("maps.leosMemory.cipher.e3.feature") },
      { id: 'E_4', name: translate("maps.leosMemory.cipher.e4.name"), location: [643, 462], feature: translate("maps.leosMemory.cipher.e4.feature") },
      { id: 'M_1', name: translate("maps.leosMemory.cipher.m1.name"), location: [346, 177], feature: translate("maps.leosMemory.cipher.m1.feature") },
      { id: 'M_2', name: translate("maps.leosMemory.cipher.m2.name"), location: [344, 281], feature: translate("maps.leosMemory.cipher.m2.feature") },
      { id: 'M_3', name: translate("maps.leosMemory.cipher.m3.name"), location: [351, 526], feature: translate("maps.leosMemory.cipher.m3.feature") },
      { id: 'M_4', name: translate("maps.leosMemory.cipher.m4.name"), location: [457, 516], feature: translate("maps.leosMemory.cipher.m4.feature") },
      { id: 'W_1', name: translate("maps.leosMemory.cipher.w1.name"), location: [135, 126], feature: translate("maps.leosMemory.cipher.w1.feature") },
      { id: 'W_2', name: translate("maps.leosMemory.cipher.w2.name"), location: [133, 340], feature: translate("maps.leosMemory.cipher.w2.feature") },
      { id: 'W_3', name: translate("maps.leosMemory.cipher.w3.name"), location: [206, 308], feature: translate("maps.leosMemory.cipher.w3.feature") },
      { id: 'W_4', name: translate("maps.leosMemory.cipher.w4.name"), location: [88, 533], feature: translate("maps.leosMemory.cipher.w4.feature") },
    ];

    const cipherCombinations = [
      ['E_2', 'E_4', 'E_1', 'M_2', 'M_3', 'W_1', 'W_4'],
      ['E_2', 'E_4', 'E_1', 'M_1', 'M_4', 'W_1', 'W_2'],
      ['E_3', 'E_4', 'E_1', 'M_1', 'M_3', 'W_1', 'W_3'],
      ['E_2', 'E_4', 'M_1', 'M_2', 'M_4', 'W_2', 'W_4'],
      ['E_2', 'E_3', 'M_1', 'M_3', 'W_1', 'W_3', 'W_4']
    ];

    const dungeons = [[533, 208], [645, 505], [346, 93], [103, 90], [188, 535]];

    const rocketChairs = {
      fixed: [[507, 271], [239, 301], [344, 365], [498, 386], [191, 477], [96, 505], [368, 516], [519, 562]],
      sets: [
        [[204, 84], [555, 127], [108, 284], [643, 322], [589, 492]], // 4/11 局
        [[91, 102], [382, 115], [555, 127], [612, 197], [145, 201], [657, 488]], // 3/11 局
        [[204, 84], [91, 102], [382, 115], [555, 127], [145, 201], [643, 322], [657, 488]], // 2/11 局       
        [[91, 102], [382, 115], [612, 197], [145, 201], [643, 322], [657, 488]], // 1/11 局
        [[91, 102], [382, 115], [555, 127], [612, 197], [108, 284], [589, 492]], // 1/11 局
      ],
    };

    const chests = {
      fixed: [[274, 115], [538, 166], [622, 234], [175, 337], [381, 402], [592, 423], [183, 556]],
    };

    const basements = {
      basement_1: {
        rocketChairs: [[343, -32, 158], [386, -32, 159], [359, -32, 193], [386, -32, 193]],
        chest: [[407, -32, 173]],
      },
      basement_2: {
        rocketChairs: [[351, -32, 470], [309, -32, 472], [357, -32, 494], [346, -32, 496]],
        chest: [[373, -32, 482]],
      },
    };


    const escapeDoors = [[64, 230], [612, 58], [64, 211], [630, 58]];

    const widthM = 168.6;
    const law_urls = ['https://www.bilibili.com/video/BV1zFgW6oEfS', 'https://v.douyin.com/FxKkE1nBno4'];
    const fixedHint = translate("maps.leosMemory.fixedHint");
    const hints = [
      '',
      '',
      '',
      '',
      ''
    ];

    const fixedSpawns = {
      professor: { label: translate("maps.fixedSpawns.professor"), item: { icon: 'scale', points: [[232, 307], [559, 382]] } },
      photographer: {
        label: translate("maps.fixedSpawns.photographer"),
        item: {
          flag_orientation: true,
          icon: 'camera',
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
      },
      madEyes: {
        label: translate("maps.fixedSpawns.madEyes"),
        item: {
          flag_orientation: true,
          icon: 'console',
          rangeM: 21.11, rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
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
      },
      smileyFace: {
        label: translate("maps.fixedSpawns.smileyFace"),
        item: [
          {
            icon: 'windWings', points: [
              { p: [563, 283] },
              { p: [578, 308] },
              { p: [363, 145] },
              { p: [158, 108] },
              { p: [366, 543] },
              { p: [663, 186] },
              { p: [116, 518] },
              { p: [215, 334] },
              { p: [96, 276] },
              { p: [532, 278] },
              { p: [589, 143] },
              { p: [209, 450] },
            ],
          },
          {
            icon: 'drill', points: [
              { p: [520, 306] },
              { p: [370, 539] },
              { p: [151, 146] },
              { p: [198, 305] },
              { p: [339, 188] },
              { p: [63, 514] },
              { p: [634, 193] },
              { p: [107, 496] },
              { p: [564, 496] },
              { p: [400, 97] },
              { p: [259, 294] },
              { p: [513, 379] },
              { p: [129, 271] },
            ],
          },
          {
            icon: 'propeller', points: [
              { p: [93, 548] },
              { p: [335, 196] },
              { p: [189, 304] },
              { p: [555, 309] },
              { p: [340, 537] },
              { p: [142, 115] },
              { p: [635, 218] },
              { p: [385, 505] },
              { p: [336, 152] },
              { p: [233, 264] },
              { p: [535, 250] },
            ],
          },
        ],
      },
    };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, rocketChairs, chests, basements, widthM,
      fixedSpawns,
      law_urls, fixedHint, hints,
      deduction: (() => {
        const { region, exactly, chain, implies, link } = dedHelpers(ciphers);
        const EAST = [translate("maps.leosMemory.cipher.e1.name"), translate("maps.leosMemory.cipher.e2.name"), translate("maps.leosMemory.cipher.e3.name"), translate("maps.leosMemory.cipher.e4.name")];
        const WEST = [translate("maps.leosMemory.cipher.w1.name"), translate("maps.leosMemory.cipher.w2.name"), translate("maps.leosMemory.cipher.w3.name"), translate("maps.leosMemory.cipher.w4.name")];
        const rules = [
          region({ name: translate("maps.theRedChurch.rules"), min: 2, max: 3, names: WEST }),
          region({ name: translate("maps.armsFactory.rulesAlternate"), min: 2, max: 3, names: [translate("maps.leosMemory.cipher.m1.name"), translate("maps.leosMemory.cipher.m2.name"), translate("maps.leosMemory.cipher.m3.name"), translate("maps.leosMemory.cipher.m4.name")] }),
          region({ name: translate("maps.theRedChurch.rulesAlternate"), min: 2, max: 3, names: EAST }),
          implies({
            name: translate("maps.nameAlternate"), pres: [translate("maps.leosMemory.cipher.w2.name"), translate("maps.leosMemory.cipher.w3.name")], cons: [translate("maps.leosMemory.cipher.m1.name")],
            text: translate("maps.rules")
          }),
          exactly({ n: 2, names: [translate("maps.leosMemory.cipher.w1.name"), translate("maps.leosMemory.cipher.m1.name"), translate("maps.leosMemory.cipher.m2.name")] }),
          exactly({ n: 2, names: [translate("maps.leosMemory.cipher.w4.name"), translate("maps.leosMemory.cipher.m1.name"), translate("maps.leosMemory.cipher.e1.name")] }),
          chain({
            name: translate("maps.chain"), mode: 'yes', cyclic: false, names: [translate("maps.leosMemory.cipher.w2.name"), translate("maps.leosMemory.cipher.w3.name"), translate("maps.leosMemory.cipher.m2.name"), translate("maps.leosMemory.cipher.e3.name")],
            text: translate("maps.rulesAlternate")
          }),
          link({
            name: translate("maps.rulesThird"), region: EAST, marker: translate("maps.leosMemory.cipher.e1.name"), positive: true,
            text: translate("maps.rulesFourth")
          }),
          link({
            name: translate("maps.rulesFifth"), region: WEST, marker: translate("maps.leosMemory.cipher.e4.name"), positive: false,
            text: translate("maps.rulesSixth")
          }),
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
      translate("maps.eversleepingTown.zoneNames.zoneNames0"), translate("maps.eversleepingTown.zoneNames.zoneNames1"), translate("maps.eversleepingTown.zoneNames.zoneNames2"),
      translate("maps.eversleepingTown.zoneNames.zoneNames3"), translate("maps.eversleepingTown.zoneNames.zoneNames4"), translate("maps.eversleepingTown.zoneNames.zoneNames5"),
      translate("maps.eversleepingTown.zoneNames.zoneNames6"), translate("maps.eversleepingTown.zoneNames.zoneNames7"), translate("maps.eversleepingTown.zoneNames.zoneNames8"),
      translate("maps.eversleepingTown.zoneNames.zoneNames9")
    ];
    const ciphers = [
      { id: 'W_1', name: translate("maps.eversleepingTown.cipher.w1.name"), location: [101, 462], feature: translate("maps.eversleepingTown.cipher.w1.feature"), locked: true },
      { id: 'W_2', name: translate("maps.eversleepingTown.cipher.w2.name"), location: [161, 234], feature: translate("maps.eversleepingTown.cipher.w2.feature") },
      { id: 'W_3', name: translate("maps.eversleepingTown.cipher.w3.name"), location: [258, 206], feature: translate("maps.eversleepingTown.cipher.w3.feature") },
      { id: 'E_1', name: translate("maps.eversleepingTown.cipher.e1.name"), location: [520, 174], feature: translate("maps.eversleepingTown.cipher.e1.feature") },
      { id: 'E_2', name: translate("maps.eversleepingTown.cipher.e2.name"), location: [662, 196], feature: translate("maps.eversleepingTown.cipher.e2.feature") },
      { id: 'E_3', name: translate("maps.eversleepingTown.cipher.e3.name"), location: [552, 412], feature: translate("maps.eversleepingTown.cipher.e3.feature") },
      { id: 'E_4', name: translate("maps.eversleepingTown.cipher.e4.name"), location: [656, 496], feature: translate("maps.eversleepingTown.cipher.e4.feature") },
      { id: 'E_5', name: translate("maps.eversleepingTown.cipher.e5.name"), location: [546, 711], feature: translate("maps.eversleepingTown.cipher.e5.feature") },
      { id: 'E_6', name: translate("maps.eversleepingTown.cipher.e6.name"), location: [470, 623], feature: translate("maps.eversleepingTown.cipher.e6.feature") },
      { id: 'M_1', name: translate("maps.eversleepingTown.cipher.m1.name"), location: [454, 144], feature: translate("maps.eversleepingTown.cipher.m1.feature") },
      { id: 'M_2', name: translate("maps.eversleepingTown.cipher.m2.name"), location: [388, 359], feature: translate("maps.eversleepingTown.cipher.m2.feature") },
      { id: 'M_3', name: translate("maps.eversleepingTown.cipher.m3.name"), location: [374, 500], feature: translate("maps.eversleepingTown.cipher.m3.feature") },
      { id: 'M_4', name: translate("maps.eversleepingTown.cipher.m4.name"), location: [318, 559], feature: translate("maps.eversleepingTown.cipher.m4.feature") },
    ];

    const cipherCombinations = [
      ['W_1', 'W_3', 'E_2', 'E_4', 'E_5', 'M_2', 'M_3'],
      ['W_1', 'W_2', 'E_2', 'E_3', 'E_6', 'M_1', 'M_2'],
      ['W_1', 'W_2', 'E_2', 'E_4', 'E_5', 'M_1', 'M_3'],
      ['W_1', 'W_3', 'E_1', 'E_3', 'E_5', 'M_2', 'M_4'],
      ['W_1', 'W_2', 'E_1', 'E_3', 'E_6', 'M_2', 'M_3']
    ];

    const dungeons = [[173, 304], [627, 526], [410, 340]];

    const rocketChairs = {
      fixed: [[515, 101], [186, 136], [375, 226], [222, 250], [645, 385], [309, 421], [178, 431], [517, 440], [276, 540], [585, 622], [379, 637], [540, 739]],
      sets: [
        [[279, 118], [613, 219]], // 4/5 局
        [[549, 313]], // 1/5 局
      ],
    };

    const chests = {
      fixed: [[231, 139], [576, 217], [302, 358], [180, 371], [428, 704]],
    };

    const basements = {
      basement_1: {
        rocketChairs: [[538, -39, 74], [571, -39, 74], [568, -39, 115], [587, -39, 116]],
        chest: [[512, -39, 95]],
      },
      basement_2: {
        rocketChairs: [[707, -40, 614], [686, -40, 639], [724, -40, 645], [686, -40, 659]],
        chest: [[704, -39, 587]],
      },
    };


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
      professor: { label: translate("maps.fixedSpawns.professor"), item: { icon: 'scale', points: [[529, 288], [105, 412]] } },
      photographer: {
        label: translate("maps.fixedSpawns.photographer"),
        item: {
          flag_orientation: true,
          icon: 'camera',
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
      },
      madEyes: {
        label: translate("maps.fixedSpawns.madEyes"),
        item: {
          flag_orientation: true,
          icon: 'console',
          rangeM: 21.11, rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
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
      },
      smileyFace: {
        label: translate("maps.fixedSpawns.smileyFace"),
        item: [
          {
            icon: 'windWings', points: [
              { p: [588, 406] },
              { p: [525, 401] },
              { p: [482, 606] },
              { p: [147, 201] },
              { p: [454, 110] },
              { p: [398, 325] },
              { p: [693, 205] },
              { p: [135, 454] },
              { p: [619, 651] },
              { p: [680, 393] },
              { p: [270, 138] },
              { p: [538, 443] },
              { p: [575, 730] },
            ],
          },
          {
            icon: 'drill', points: [
              { p: [133, 430] },
              { p: [672, 214] },
              { p: [529, 402] },
              { p: [464, 593] },
              { p: [480, 169] },
              { p: [405, 323] },
              { p: [121, 233] },
              { p: [299, 95] },
              { p: [182, 447] },
              { p: [362, 248] },
              { p: [300, 537] },
              { p: [588, 653] },
            ],
          },
          {
            icon: 'propeller', points: [
              { p: [456, 131] },
              { p: [452, 608] },
              { p: [634, 185] },
              { p: [548, 396] },
              { p: [138, 239] },
              { p: [399, 333] },
              { p: [127, 444] },
              { p: [263, 405] },
              { p: [358, 167] },
              { p: [492, 607] },
              { p: [515, 204] },
            ],
          },
        ],
      },
    };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, rocketChairs, chests, basements, widthM,
      fixedSpawns,
      law_urls, fixedHint, hints,
      deduction: (() => {
        const { fixed, region, either, atMost1 } = dedHelpers(ciphers);
        const rules = [
          fixed({ names: [translate("maps.eversleepingTown.cipher.w1.name")] }),
          region({ name: translate("maps.theRedChurch.rules"), min: 2, max: 2, names: [translate("maps.eversleepingTown.cipher.w1.name"), translate("maps.eversleepingTown.cipher.w2.name"), translate("maps.eversleepingTown.cipher.w3.name")] }),
          region({
            name: translate("maps.armsFactory.rulesAlternate"), min: 2, max: 2,
            names: [translate("maps.eversleepingTown.cipher.m1.name"), translate("maps.eversleepingTown.cipher.m2.name"), translate("maps.eversleepingTown.cipher.m3.name"), translate("maps.eversleepingTown.cipher.m4.name")]
          }),
          region({
            name: translate("maps.theRedChurch.rulesAlternate"), min: 3, max: 3,
            names: [translate("maps.eversleepingTown.cipher.e1.name"), translate("maps.eversleepingTown.cipher.e2.name"), translate("maps.eversleepingTown.cipher.e3.name"), translate("maps.eversleepingTown.cipher.e4.name"), translate("maps.eversleepingTown.cipher.e5.name"), translate("maps.eversleepingTown.cipher.e6.name")]
          }),
          either({ names: [translate("maps.eversleepingTown.cipher.w2.name"), translate("maps.eversleepingTown.cipher.w3.name")] }),
          either({ names: [translate("maps.eversleepingTown.cipher.e1.name"), translate("maps.eversleepingTown.cipher.e2.name")] }),
          either({ names: [translate("maps.eversleepingTown.cipher.e3.name"), translate("maps.eversleepingTown.cipher.e4.name")] }),
          either({ names: [translate("maps.eversleepingTown.cipher.e5.name"), translate("maps.eversleepingTown.cipher.e6.name")] }),
          atMost1({ names: [translate("maps.eversleepingTown.cipher.m3.name"), translate("maps.eversleepingTown.cipher.m4.name")] }),
          atMost1({ names: [translate("maps.eversleepingTown.cipher.m1.name"), translate("maps.eversleepingTown.cipher.m4.name")] }),
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
      translate("maps.chinaTown.zoneNames.zoneNames0"), translate("maps.chinaTown.zoneNames.zoneNames1"), translate("maps.chinaTown.zoneNames.zoneNames2"),
      translate("maps.chinaTown.zoneNames.zoneNames3"), translate("maps.chinaTown.zoneNames.zoneNames4"), translate("maps.chinaTown.zoneNames.zoneNames5"),
      translate("maps.chinaTown.zoneNames.zoneNames6"), translate("maps.chinaTown.zoneNames.zoneNames7"), translate("maps.chinaTown.zoneNames.zoneNames8")
    ];
    const ciphers = [
      { id: 'E_2', name: translate("maps.chinaTown.cipher.e2.name"), location: [1094, 563], feature: translate("maps.chinaTown.cipher.e2.feature"), locked: true },
      { id: 'E_1', name: translate("maps.chinaTown.cipher.e1.name"), location: [1042, 249], feature: translate("maps.chinaTown.cipher.e1.feature") },
      { id: 'E_3', name: translate("maps.chinaTown.cipher.e3.name"), location: [1103, 841], feature: translate("maps.chinaTown.cipher.e3.feature") },
      { id: 'M_1', name: translate("maps.chinaTown.cipher.m1.name"), location: [760, 332], feature: translate("maps.chinaTown.cipher.m1.feature") },
      { id: 'M_2', name: translate("maps.chinaTown.cipher.m2.name"), location: [705, 630], feature: translate("maps.chinaTown.cipher.m2.feature") },
      { id: 'M_3', name: translate("maps.chinaTown.cipher.m3.name"), location: [500, 694], feature: translate("maps.chinaTown.cipher.m3.feature") },
      { id: 'M_4', name: translate("maps.chinaTown.cipher.m4.name"), location: [454, 818], feature: translate("maps.chinaTown.cipher.m4.feature") },
      { id: 'M_5', name: translate("maps.chinaTown.cipher.m5.name"), location: [881, 976], feature: translate("maps.chinaTown.cipher.m5.feature") },
      { id: 'W_1', name: translate("maps.chinaTown.cipher.w1.name"), location: [344, 220], feature: translate("maps.chinaTown.cipher.w1.feature") },
      { id: 'W_2', name: translate("maps.chinaTown.cipher.w2.name"), location: [407, 341], feature: translate("maps.chinaTown.cipher.w2.feature") },
      { id: 'W_3', name: translate("maps.chinaTown.cipher.w3.name"), location: [118, 534], feature: translate("maps.chinaTown.cipher.w3.feature") },
      { id: 'W_4', name: translate("maps.chinaTown.cipher.w4.name"), location: [176, 792], feature: translate("maps.chinaTown.cipher.w4.feature") },
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

    const rocketChairs = {
      fixed: [[1009, 164], [789, 215], [1298, 1, 280], [1081, 487], [783, 516], [105, 622], [270, 749], [728, 770], [936, 988], [435, 1030], [1072, 1057]],
      sets: [
        [[230, 178], [489, 341], [1295, 909]], // 7/15 局
        [[468, 197], [449, 511], [1185, 797]], // 5/15 局
        [[230, 178], [489, 341], [1185, 797]], // 3/15 局
      ],
    };

    const chests = {
      fixed: [[959, 1, 324], [225, 1, 527], [505, 1, 918], [950, 1, 1038]],
    };

    const basements = {
      basement_1: {
        rocketChairs: [[878, -67, 868], [911, -67, 874], [961, -67, 945], [886, -67, 957]],
        chest: [[969, -67, 892]],
      },
      basement_2: {
        rocketChairs: [[217, -67, 663], [138, -67, 667], [217, -67, 691], [142, -67, 742]],
        chest: [[173, -67, 776]],
      },
    };


    const escapeDoors = [[705, 1134], [780, 18], [667, 1134], [818, 18]];

    const widthM = 144.1;
    const law_urls = ['https://www.bilibili.com/video/BV1QGpF6CEos', ''];
    const fixedHint = translate("maps.chinaTown.fixedHint");
    const hints = [
      translate("maps.chinaTown.hint.hint0"),
      translate("maps.chinaTown.hint.hint1"),
      '',
      translate("maps.chinaTown.hint.hint3"),
      translate("maps.chinaTown.hint.hint4"),
      ''
    ];

    const fixedSpawns = {
      professor: { label: translate("maps.fixedSpawns.professor"), item: { icon: 'scale', points: [[786, 374], [420, 1000]] } },
      photographer: {
        label: translate("maps.fixedSpawns.photographer"),
        item: {
          flag_orientation: true,
          icon: 'camera',
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
      },
      madEyes: {
        label: translate("maps.fixedSpawns.madEyes"),
        item: {
          flag_orientation: true,
          icon: 'console',
          rangeM: 21.11, rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
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
      },
      smileyFace: {
        label: translate("maps.fixedSpawns.smileyFace"),
        item: [
          {
            icon: 'windWings', points: [
              { p: [123, 765] },
              { p: [142, 852] },
              { p: [1108, 812] },
              { p: [550, 665] },
              { p: [868, 991] },
              { p: [268, 207] },
              { p: [1013, 235] },
              { p: [1074, 586] },
              { p: [1244, 226] },
              { p: [426, 1059] },
              { p: [265, 242] },
              { p: [135, 656] },
              { p: [910, 998] },
            ],
          },
          {
            icon: 'drill', points: [
              { p: [916, 994] },
              { p: [167, 739] },
              { p: [1044, 535] },
              { p: [1031, 809] },
              { p: [464, 685] },
              { p: [423, 221] },
              { p: [985, 277] },
              { p: [104, 583] },
              { p: [1267, 901] },
              { p: [1285, 314] },
              { p: [222, 160] },
              { p: [776, 466] },
              { p: [1062, 464] },
            ],
          },
          {
            icon: 'propeller', points: [
              { p: [1058, 209] },
              { p: [1074, 605] },
              { p: [356, 240] },
              { p: [150, 802] },
              { p: [470, 679] },
              { p: [1065, 868] },
              { p: [871, 962] },
              { p: [341, 525] },
              { p: [742, 878] },
              { p: [760, 484] },
              { p: [445, 770] },
            ],
          },
        ],
      },
    };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, rocketChairs, chests, basements, widthM,
      fixedSpawns,
      law_urls, fixedHint, hints,
      deduction: (() => {
        const { fixed, region, either, same, atLeast1, atMost1, chainRun, allAbsent }
          = dedHelpers(ciphers);

        const special = allAbsent({
          pres: [translate("maps.chinaTown.cipher.m1.name"), translate("maps.chinaTown.cipher.m2.name")], targets: [translate("maps.chinaTown.cipher.e1.name"), translate("maps.chinaTown.cipher.e3.name"), translate("maps.chinaTown.cipher.m5.name")],
          text: translate("maps.chinaTown.special")
        });
        const rules = [
          fixed({ names: [translate("maps.chinaTown.cipher.e2.name")] }),
          region({ name: translate("maps.theRedChurch.rules"), min: 2, max: 3, names: [translate("maps.chinaTown.cipher.w1.name"), translate("maps.chinaTown.cipher.w2.name"), translate("maps.chinaTown.cipher.w3.name"), translate("maps.chinaTown.cipher.w4.name")] }),
          region({ name: translate("maps.armsFactory.rulesAlternate"), min: 2, max: 3, names: [translate("maps.chinaTown.cipher.m1.name"), translate("maps.chinaTown.cipher.m2.name"), translate("maps.chinaTown.cipher.m3.name"), translate("maps.chinaTown.cipher.m4.name"), translate("maps.chinaTown.cipher.m5.name")] }),
          region({ name: translate("maps.theRedChurch.rulesAlternate"), min: 2, max: 3, names: [translate("maps.chinaTown.cipher.e1.name"), translate("maps.chinaTown.cipher.e2.name"), translate("maps.chinaTown.cipher.e3.name")] }),
          either({ names: [translate("maps.chinaTown.cipher.w1.name"), translate("maps.chinaTown.cipher.w2.name")] }),
          either({ names: [translate("maps.chinaTown.cipher.m4.name"), translate("maps.chinaTown.cipher.m3.name")] }),
          same({ names: [translate("maps.chinaTown.cipher.m2.name"), translate("maps.chinaTown.cipher.m4.name")] }),
          atLeast1({ names: [translate("maps.chinaTown.cipher.m5.name"), translate("maps.chinaTown.cipher.e3.name")] }),
          atLeast1({ names: [translate("maps.chinaTown.cipher.w4.name"), translate("maps.chinaTown.cipher.m4.name")] }),
          atLeast1({ names: [translate("maps.chinaTown.cipher.e1.name"), translate("maps.chinaTown.cipher.e3.name")] }),
          atMost1({ names: [translate("maps.chinaTown.cipher.m1.name"), translate("maps.chinaTown.cipher.m2.name")] }),
          atMost1({ names: [translate("maps.chinaTown.cipher.w2.name"), translate("maps.chinaTown.cipher.w3.name")] }),
          chainRun({
            name: translate("maps.chain"), names: [translate("maps.chinaTown.cipher.w1.name"), translate("maps.chinaTown.cipher.m1.name"), translate("maps.chinaTown.cipher.e1.name"), translate("maps.chinaTown.cipher.e3.name")],
            text: translate("maps.chinaTown.rulesAlternate")
          }),
          chainRun({
            name: translate("maps.chain"),
            names: [translate("maps.chinaTown.cipher.w4.name"), translate("maps.chinaTown.cipher.m4.name"), translate("maps.chinaTown.cipher.m5.name"), translate("maps.chinaTown.cipher.e3.name"), translate("maps.chinaTown.cipher.m2.name"), translate("maps.chinaTown.cipher.w3.name"), translate("maps.chinaTown.cipher.w4.name")],
            text: translate("maps.chinaTown.rulesThird")
          }),
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
      translate("maps.darkwoods.zoneNames.zoneNames0"), translate("maps.darkwoods.zoneNames.zoneNames1"), translate("maps.darkwoods.zoneNames.zoneNames2"),
      translate("maps.darkwoods.zoneNames.zoneNames3"), translate("maps.darkwoods.zoneNames.zoneNames4"), translate("maps.darkwoods.zoneNames.zoneNames5"),
      translate("maps.darkwoods.zoneNames.zoneNames6"), translate("maps.darkwoods.zoneNames.zoneNames7"), translate("maps.darkwoods.zoneNames.zoneNames8")
    ];
    const ciphers = [
      { id: 'W_1', name: translate("maps.darkwoods.cipher.w1.name"), location: [379, 265], feature: translate("maps.darkwoods.cipher.w1.feature") },
      { id: 'W_2', name: translate("maps.darkwoods.cipher.w2.name"), location: [261, 442], feature: translate("maps.darkwoods.cipher.w2.feature") },
      { id: 'W_3', name: translate("maps.darkwoods.cipher.w3.name"), location: [412, 728], feature: translate("maps.darkwoods.cipher.w3.feature") },
      { id: 'W_4', name: translate("maps.darkwoods.cipher.w4.name"), location: [412, 952], feature: translate("maps.darkwoods.cipher.w4.feature") },
      { id: 'M_1', name: translate("maps.darkwoods.cipher.m1.name"), location: [534, 278], feature: translate("maps.darkwoods.cipher.m1.feature") },
      { id: 'M_2', name: translate("maps.darkwoods.cipher.m2.name"), location: [648, 406], feature: translate("maps.darkwoods.cipher.m2.feature") },
      { id: 'E_3', name: translate("maps.darkwoods.cipher.e3.name"), location: [1059, 548], feature: translate("maps.darkwoods.cipher.e3.feature") },
      { id: 'M_3', name: translate("maps.darkwoods.cipher.m3.name"), location: [788, 651], feature: translate("maps.darkwoods.cipher.m3.feature") },
      { id: 'E_1', name: translate("maps.darkwoods.cipher.e1.name"), location: [1097, 213], feature: translate("maps.darkwoods.cipher.e1.feature") },
      { id: 'E_2', name: translate("maps.darkwoods.cipher.e2.name"), location: [896, 399], feature: translate("maps.darkwoods.cipher.e2.feature") },
      { id: 'E_4', name: translate("maps.darkwoods.cipher.e4.name"), location: [881, 915], feature: translate("maps.darkwoods.cipher.e4.feature") },
      { id: 'E_5', name: translate("maps.darkwoods.cipher.e5.name"), location: [1074, 880], feature: translate("maps.darkwoods.cipher.e5.feature") },
      { id: 'M_4', name: translate("maps.darkwoods.cipher.m4.name"), location: [673, 733], feature: translate("maps.darkwoods.cipher.m4.feature") },
      { id: 'M_5', name: translate("maps.darkwoods.cipher.m5.name"), location: [778, 988], feature: translate("maps.darkwoods.cipher.m5.feature") },
      { id: 'M_6', name: translate("maps.darkwoods.cipher.m6.name"), location: [633, 1098], feature: translate("maps.darkwoods.cipher.m6.feature") },
    ];

    const cipherCombinations = [
      ['W_1', 'W_3', 'E_1', 'E_3', 'E_4', 'M_2', 'M_6'],
      ['W_2', 'W_4', 'E_1', 'E_3', 'E_5', 'M_2', 'M_6'],
      ['W_2', 'W_4', 'E_2', 'E_3', 'E_5', 'M_1', 'M_4'],
      ['W_2', 'W_4', 'E_2', 'E_5', 'M_1', 'M_3', 'M_5'],
      ['W_2', 'W_4', 'E_1', 'E_5', 'M_1', 'M_3', 'M_5']
    ];

    const dungeons = [[661, 134], [164, 943], [737, 957], [978, 351]];

    const rocketChairs = {
      fixed: [[1078, 140], [505, 235], [857, 254], [232, 310], [1059, 449], [582, 452], [885, 569], [140, 681], [1062, 715], [629, 735], [385, 825], [695, 1002], [217, 3, 1022], [1050, 1062], [484, 1132]],
      sets: [
      ],
    };

    const chests = {
      fixed: [[305, 125], [1023, 223], [503, 574], [966, 882], [418, 57, 983]],
    };

    const basements = {
      basement_1: {
        rocketChairs: [[887, -68, 453], [945, -68, 467], [907, -68, 526], [952, -68, 526]],
        chest: [[1007, -68, 490]],
      },
      basement_2: {
        rocketChairs: [[428, -66, 930], [357, -66, 943], [428, -66, 964], [359, -66, 988]],
        chest: [[393, -66, 1042]],
      },
    };


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
      professor: { label: translate("maps.fixedSpawns.professor"), item: { icon: 'scale', points: [[612, 941], [518, 233]] } },
      photographer: {
        label: translate("maps.fixedSpawns.photographer"),
        item: {
          flag_orientation: true,
          icon: 'camera',
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
      },
      madEyes: {
        label: translate("maps.fixedSpawns.madEyes"),
        item: {
          flag_orientation: true,
          icon: 'console',
          rangeM: 21.11, rangeScreenM: { pc: [25.33, 14.25], ios: [30.40, 14.03] },
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
      },
      smileyFace: {
        label: translate("maps.fixedSpawns.smileyFace"),
        item: [
          {
            icon: 'windWings', points: [
              { p: [712, 403] },
              { p: [699, 348] },
              { p: [344, 719] },
              { p: [598, 1082] },
              { p: [1050, 616] },
              { p: [334, 244] },
              { p: [843, 979] },
              { p: [1121, 269] },
              { p: [999, 453] },
              { p: [902, 576] },
              { p: [292, 294] },
              { p: [111, 750] },
              { p: [1028, 1028] },
            ],
          },
          {
            icon: 'drill', points: [
              { p: [845, 984] },
              { p: [894, 945] },
              { p: [1117, 213] },
              { p: [409, 698] },
              { p: [653, 458] },
              { p: [665, 1033] },
              { p: [1040, 597] },
              { p: [373, 313] },
              { p: [1102, 181] },
              { p: [470, 1148] },
              { p: [1101, 731] },
              { p: [902, 520] },
              { p: [399, 817] },
              { p: [903, 232] },
            ],
          },
          {
            icon: 'propeller', points: [
              { p: [368, 312] },
              { p: [643, 1065] },
              { p: [906, 942] },
              { p: [1035, 503] },
              { p: [662, 387] },
              { p: [450, 725] },
              { p: [1084, 189] },
              { p: [423, 477] },
              { p: [969, 762] },
              { p: [348, 968] },
              { p: [1035, 392] },
            ],
          },
        ],
      },
    };

    return {
      mapId, mapName, mapNameEn,
      mapImage, mapSize,
      zonesInfo, zoneNames, ciphers,
      cipherCombinations, dungeons, escapeDoors, rocketChairs, chests, basements, widthM,
      fixedSpawns,
      law_urls, fixedHint, hints,
      deduction: (() => {
        const { region, either, atMost1, same, chain } = dedHelpers(ciphers);
        const rules = [
          region({
            name: translate("maps.theRedChurch.rules"), min: 2, max: 2,
            names: [translate("maps.darkwoods.cipher.w2.name"), translate("maps.darkwoods.cipher.w1.name"), translate("maps.darkwoods.cipher.w4.name"), translate("maps.darkwoods.cipher.w3.name")]
          }),
          region({
            name: translate("maps.armsFactory.rulesAlternate"), min: 2, max: 3,
            names: [translate("maps.darkwoods.cipher.m1.name"), translate("maps.darkwoods.cipher.m2.name"), translate("maps.darkwoods.cipher.m3.name"), translate("maps.darkwoods.cipher.m4.name"),
            translate("maps.darkwoods.cipher.m5.name"), translate("maps.darkwoods.cipher.m6.name")]
          }),
          region({
            name: translate("maps.theRedChurch.rulesAlternate"), min: 2, max: 3,
            names: [translate("maps.darkwoods.cipher.e1.name"), translate("maps.darkwoods.cipher.e2.name"), translate("maps.darkwoods.cipher.e3.name"), translate("maps.darkwoods.cipher.e4.name"), translate("maps.darkwoods.cipher.e5.name")]
          }),
          either({ names: [translate("maps.darkwoods.cipher.w2.name"), translate("maps.darkwoods.cipher.w1.name")] }),
          either({ names: [translate("maps.darkwoods.cipher.w4.name"), translate("maps.darkwoods.cipher.w3.name")] }),
          either({ names: [translate("maps.darkwoods.cipher.m1.name"), translate("maps.darkwoods.cipher.m2.name")] }),
          either({ names: [translate("maps.darkwoods.cipher.e1.name"), translate("maps.darkwoods.cipher.e2.name")] }),
          either({ names: [translate("maps.darkwoods.cipher.e3.name"), translate("maps.darkwoods.cipher.m3.name")] }),
          either({ names: [translate("maps.darkwoods.cipher.e4.name"), translate("maps.darkwoods.cipher.e5.name")] }),
          region({
            name: translate("maps.darkwoods.rules"), min: 1, max: 2,
            names: [translate("maps.darkwoods.cipher.m4.name"), translate("maps.darkwoods.cipher.m3.name"), translate("maps.darkwoods.cipher.m5.name"), translate("maps.darkwoods.cipher.m6.name")]
          }),
          atMost1({ names: [translate("maps.darkwoods.cipher.m4.name"), translate("maps.darkwoods.cipher.m3.name")] }),
          same({ names: [translate("maps.darkwoods.cipher.m3.name"), translate("maps.darkwoods.cipher.m5.name")] }),
          chain({
            name: translate("maps.chain"), mode: 'yes', cyclic: false,
            names: [translate("maps.darkwoods.cipher.e5.name"), translate("maps.darkwoods.cipher.e4.name"), translate("maps.darkwoods.cipher.w4.name"), translate("maps.darkwoods.cipher.w3.name"), translate("maps.darkwoods.cipher.w2.name"),
            translate("maps.darkwoods.cipher.w1.name"), translate("maps.darkwoods.cipher.m1.name"), translate("maps.darkwoods.cipher.m2.name"), translate("maps.darkwoods.cipher.e2.name"), translate("maps.darkwoods.cipher.e1.name")],
            text: translate("maps.darkwoods.rulesAlternate")
              + translate("maps.darkwoods.rulesThird")
              + translate("maps.lakesideVillage.rulesSeventh")
          }),
        ];
        return makeDeduction({
          mapImage, mapSize, ciphers, cipherCombinations, rules,
        });
      })(),
    };
  })()
];



export const CIPHER_EXTRA = {
  4: [{ id: 'E_0', location: [768, 550], name: translate("maps.darkwoods.cipher.e0.name"), feature: translate("maps.e0.feature") }],
};




export function getImageUrl(mapId) {
  return MAPS_DATA[mapId].mapImage
}
