interface sampleSigil {
  firstTrait: string;
  sigilId: string;
}

export const attackSigilIdMap = new Map<string, string>();
export const attackSigilTrait1Map = new Map<string, string>();

// 예제 데이터
const attackSigils: sampleSigil[] = [
  { firstTrait: "3FFFA48D", sigilId: "A30B71CE" },
  { firstTrait: "2FC67C8F", sigilId: "E8823B59" },
  { firstTrait: "C0A73AFB", sigilId: "9D7EDD66" },
  { firstTrait: "6B769B25", sigilId: "C08D85EA" },
  { firstTrait: "721B6EDB", sigilId: "A4C54E2C" },
  { firstTrait: "8F9262D5", sigilId: "F64D2A29" },
  { firstTrait: "DC175BC0", sigilId: "55067468" },
  { firstTrait: "EB29E3DB", sigilId: "02AA5952" },
  { firstTrait: "3FF08C70", sigilId: "5A8BC1F3" },
  { firstTrait: "F167C2C1", sigilId: "6A2ECCB3" },
  { firstTrait: "A83A97B4", sigilId: "0131A7CC" },
  { firstTrait: "01C89F53", sigilId: "02C9E42E" },
  { firstTrait: "C3A5AC23", sigilId: "824E2BD0" },
  { firstTrait: "844D5B80", sigilId: "920F41C1" },
  { firstTrait: "B3CE3EED", sigilId: "B859C942" },
  { firstTrait: "8CC71ADF", sigilId: "B50BB945" },
  { firstTrait: "4F0C7E43", sigilId: "C411E5FA" },
  { firstTrait: "AA44ABAD", sigilId: "39D8D7AC" },
  { firstTrait: "3F303940", sigilId: "524FEE30" },
  { firstTrait: "7C66AB04", sigilId: "A26F553E" },
  { firstTrait: "8313FEAD", sigilId: "537FDADF" },
  { firstTrait: "A8EC68CB", sigilId: "1D38CDDD" }
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