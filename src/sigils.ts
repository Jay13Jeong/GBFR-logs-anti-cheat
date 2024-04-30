import { toHashString } from "@/utils.ts";

interface sampleSigil {
  firstTrait: string;
  sigilId: string;
}

interface sampleDecSigil {
  firstTrait: number;
  sigilId: number;
}

export const attackSigilIdMap = new Map<string, string>();
export const attackSigilTrait1Map = new Map<string, string>();

// 예제 데이터
const attackSigils: sampleSigil[] = [
  { firstTrait: "3fffa48d", sigilId: "a30b71ce" },
  { firstTrait: "2fc67c8f", sigilId: "e8823b59" },
  { firstTrait: "c0a73afb", sigilId: "9d7edd66" },
  { firstTrait: "6b769b25", sigilId: "c08d85ea" },
  { firstTrait: "721b6edb", sigilId: "a4c54e2c" },
  { firstTrait: "8f9262d5", sigilId: "f64d2a29" },
  { firstTrait: "dc175bc0", sigilId: "55067468" },
  { firstTrait: "eb29e3db", sigilId: "02aa5952" },
  { firstTrait: "3ff08c70", sigilId: "5a8bc1f3" },
  { firstTrait: "f167c2c1", sigilId: "6a2eccb3" },
  { firstTrait: "a83a97b4", sigilId: "0131a7cc" },
  { firstTrait: "01c89f53", sigilId: "02c9e42e" },
  { firstTrait: "c3a5ac23", sigilId: "824e2bd0" },
  { firstTrait: "844d5b80", sigilId: "920f41c1" },
  { firstTrait: "b3ce3eed", sigilId: "b859c942" },
  { firstTrait: "8cc71adf", sigilId: "b50bb945" },
  { firstTrait: "4f0c7e43", sigilId: "c411e5fa" },
  { firstTrait: "aa44abad", sigilId: "39d8d7ac" },
  { firstTrait: "3f303940", sigilId: "524fee30" },
  { firstTrait: "7c66ab04", sigilId: "a26f553e" },
  { firstTrait: "8313fead", sigilId: "537fdadf" },
  { firstTrait: "a8ec68cb", sigilId: "1d38cddd" }
];

attackSigils.forEach(sigil => {
  attackSigilIdMap.set(sigil.sigilId, sigil.firstTrait);
  attackSigilTrait1Map.set(sigil.firstTrait, sigil.sigilId);
});

// export const seofonSigils: sampleSigil[] = [
//   { firstTrait: "2452677621", sigilId: "2929560031" },
//   { firstTrait: "2009598453", sigilId: "316658448" },
//   { firstTrait: "4010142797", sigilId: "3302852154" },
//   { firstTrait: "2068825210", sigilId: "1740760547" },
//   { firstTrait: "2009598453", sigilId: "1789807503" }
// ];

// export const tweyenSigils: sampleSigil[] = [
//   { firstTrait: "3898603744", sigilId: "3947551085" },
//   { firstTrait: "2238888111", sigilId: "3689219015" },
//   { firstTrait: "281214AB", sigilId: "1138615773" },
//   { firstTrait: "2175964121", sigilId: "2959295748" },
//   { firstTrait: "3898603744", sigilId: "2395713699" }
// ];

export const seofonSigils: sampleSigil[] = [
  { firstTrait: "77c809f5", sigilId: "12dfd310" },
  { firstTrait: "9230e3f5", sigilId: "ae9d89df" },
  { firstTrait: "ef05ec4d", sigilId: "c50c6b8a" },
  { firstTrait: "7b4fc47a", sigilId: "67c1e5e3" }
];

export const dobleAwakenSeofonSigilId: string = "6aae4b8f";

export const tweyenSigils: sampleSigil[] = [
  { firstTrait: "e85ff8e0", sigilId: "eb4ad96d" },
  { firstTrait: "8572b8af", sigilId: "dbe503c7" },
  { firstTrait: "281214ab", sigilId: "43dde5dd" },
  { firstTrait: "81b293d9", sigilId: "b0634504" }
];

export const dobleAwakenTweyenSigilId: string = "8ecbb0a3";

[seofonSigils[0], seofonSigils[1], tweyenSigils[0], tweyenSigils[1]].forEach(sigil => {
  attackSigilIdMap.set(sigil.sigilId, sigil.firstTrait);
  attackSigilTrait1Map.set(sigil.firstTrait, sigil.sigilId);
});

export const heartSigilsDec: sampleDecSigil[] = [
  { firstTrait: 3671987420, sigilId: 2603305871},
  { firstTrait: 2600336030, sigilId: 1645882007},
  { firstTrait: 3614395684, sigilId: 395400303},
  { firstTrait: 3221316531, sigilId: 2755787601},
  { firstTrait: 239255067, sigilId: 2088681555},
  { firstTrait: 2233052490, sigilId: 2982223883},
  { firstTrait: 3092382396, sigilId: 885485713},
  { firstTrait: 251817200, sigilId: 2217767143},
  { firstTrait: 2738476610, sigilId: 1081314525},
  { firstTrait: 4258376996, sigilId: 4145664405},
  { firstTrait: 1662438379, sigilId: 3849363521},
  { firstTrait: 3640028188, sigilId: 1032687881},
  { firstTrait: 3125822983, sigilId: 1300006450},
  { firstTrait: 3352525297, sigilId: 1158383148},
  { firstTrait: 3870895668, sigilId: 1605911268},
  { firstTrait: 3673144103, sigilId: 3561523741},
  { firstTrait: 1326666263, sigilId: 1718928953},
  { firstTrait: 3623467912, sigilId: 1493965256},
  { firstTrait: 2959386164, sigilId: 2849506516}
];

export const heartSigilMap = new Map<string, string>();
export const heartSigilTraitMap = new Map<string, string>();

heartSigilsDec.forEach(sigil => {
  const trait1Hex = toHashString(sigil.firstTrait ?? 0);
  const sigilIdHex = toHashString(sigil.firstTrait ?? 0);
  heartSigilMap.set(sigilIdHex, trait1Hex);
  heartSigilTraitMap.set(trait1Hex, sigilIdHex);
});
