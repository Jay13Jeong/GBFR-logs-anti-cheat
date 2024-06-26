import { toHashString, translateSigilId } from "@/utils.ts";
import {
  attackSigilIdMap,
  attackSigilTrait1Map,
  dobleAwakenSeofonSigilId,
  dobleAwakenTweyenSigilId,
  heartSigilTraitMap,
  sandalphonSigils,
  seofonSigils,
  tweyenSigils,
} from "@/sigils.ts";
import { CharacterType, ComputedPlayerState, PlayerData, Sigil } from "@/types.ts";

const EMPTY : string = "887ae0b0";
export const checkCheating = (player: PlayerData) => {
  const cheats : string[] = [];

  const CHEAT_WSTONE: string = "1";
  const CHEAT_SIGIL: string = "2";
  const CHEAT_STAT: string = "3";
  const NP: string = "0";
  let status : string = NP;
  let invalidIdx : string = "-1";

  if (player !== undefined && player.overmasteryInfo !== null){
    const overmasteries = player.overmasteryInfo.overmasteries;
    for (const mastery of overmasteries) {
      const checkArrCnt = overmasteries.filter(om => om.id === mastery.id).length;
      if (checkArrCnt > 1){
        cheats.push("Duplicate Overmasteries");
        if (status === NP) invalidIdx = "-3";
        if (status === NP) status = CHEAT_STAT;
      }
    }
  }

  // invalid wrightstone level
  if (player !== undefined && player.weaponInfo !== null && player.weaponInfo !== undefined){
    if ((player.weaponInfo.trait1Level ?? 0) > 20) {
      cheats.push("Wrightstone\nwith trait level > 20");
      if (status === NP) invalidIdx = "-2";
      if (status === NP) status = CHEAT_WSTONE;
    }
    if ((player.weaponInfo.trait2Level ?? 0) > 15) {
      cheats.push("Wrightstone\nwith trait level > 15");
      if (status === NP) invalidIdx = "-2";
      if (status === NP) status = CHEAT_WSTONE;
    }
    if ((player.weaponInfo.trait3Level ?? 0) > 10) {
      cheats.push("Wrightstone\nwith trait level > 10");
      if (status === NP) invalidIdx = "-2";
      if (status === NP) status = CHEAT_WSTONE;
    }

    // invalid wrightstone trait
    const notAllowedWrightstone = [
      // "57ab5b10",
      // "82ce278d",
      // "1568e0e4",
      // "70395731",
      // "cd18a77d",
      // "333e5862",
      // "a8a3163b",
      "ec1c6779", //프닷
      "dbe1d775", //lucy1
      "8d2adb6e", //lucy2
      "5c862e13", //lucy3
      // "082033cb",
      // "1b0d9897",
      // "9ad8b5e6",
      // "40223c28",
      // "74aa75d6",
      // "dc225c96",
      "4c588c27", //유리
      // "5e422ae5",
      // "af794a87",
      "a1a8e39d", //움무
      "51c115d2", //super
      "3d8153a1", //スパルタ
      "ee85cd1f", //ベルセルク
      seofonSigils[3].firstTrait,
      tweyenSigils[3].firstTrait
    ];

    const hasCheatedWrightStone =
      notAllowedWrightstone.includes(toHashString(player.weaponInfo.trait1Id ?? 0)) ||
      notAllowedWrightstone.includes(toHashString(player.weaponInfo.trait2Id ?? 0)) ||
      notAllowedWrightstone.includes(toHashString(player.weaponInfo.trait3Id ?? 0));

    if (hasCheatedWrightStone) {
      cheats.push("Wrightstone\nwith invalid trait");
      if (status === NP) invalidIdx = "-2";
      if (status === NP) status = CHEAT_WSTONE;
    }
  }

  // check sigils
  if (player !== undefined){
    let index = 0;
    const sandalphonAweakenTrait1 = toHashString(sandalphonSigils[0].firstTrait);
    // const sandalphonAweakenSigilId1 = toHashString(sandalphonSigils[0].sigilId);
    // const sandalphonAweakenTrait2 = toHashString(sandalphonSigils[1].firstTrait);
    // const sandalphonAweakenSigilId2 = toHashString(sandalphonSigils[1].sigilId);
    for (const sigil of player.sigils) {
      const sigilTrait1 = toHashString(sigil.firstTraitId ?? 0);
      const sigilTrait2 = toHashString(sigil.secondTraitId ?? 0);

      if (sigil.firstTraitLevel > 15 || sigil.secondTraitLevel > 15 || sigil.sigilLevel > 15) {
        if (!(sigilTrait1 === "082033cb" && sigil.firstTraitLevel <= 45) && //게의 보은 공명//
            !(sigilTrait1 === "d3b8c21f" && sigil.firstTraitLevel <= 45)) {
          cheats.push(`Modified sigil:\nover level 15`);
          if (status === NP) invalidIdx = index.toString();
          if (status === NP) status = CHEAT_SIGIL;
        }
      }


      const isLucySigil = sigilTrait1 === "dbe1d775" || sigilTrait1 === "8d2adb6e" || sigilTrait1 === "5c862e13";
      if (isLucySigil && sigilTrait2 !== "dc584f60") {
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)}\nwith invalid second trait`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      const isLucySigil2 = sigilTrait2 === "dbe1d775" || sigilTrait2 === "8d2adb6e" || sigilTrait2 === "5c862e13";
      if (isLucySigil2) {
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)}\nwith invalid second trait`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      const isSingleSigil2 = sigilTrait2 === "4c588c27" || //유리;
        sigilTrait2 === "51c115d2" || sigilTrait2 === "3d8153a1" || sigilTrait2 === "ee85cd1f" || //super,スパルタ,ベルセルク
        sigilTrait2 === seofonSigils[3].firstTrait || sigilTrait2 === tweyenSigils[3].firstTrait ||
        sigilTrait2 === "ec1c6779" || sigilTrait2 === "a1a8e39d"; //프닷,움무;
      if (isSingleSigil2) {
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)}\nwith invalid second trait`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      const sigilId = toHashString(sigil.sigilId ?? 0);

      const isFOFPlusSigil = sigilId === "0a4651bb";
      if (isFOFPlusSigil && sigilTrait2 === EMPTY){
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)}\nwith invalid second trait\nThe ID is "V+", but actually "V".`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      const isFOFSigil = sigilId === "f3336835";
      if (isFOFSigil && sigilTrait2 !== EMPTY){
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)}\nwith invalid second trait\nThe ID is "V", but actually "V+".`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      const isSupplementarySigil = sigilId === "42bb0c1c";
      if (isSupplementarySigil && sigilTrait2 !== EMPTY){
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)}\nwith invalid second trait\nThe ID is "V", but actually "V+".`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      const isSupplementaryPlusSigil = sigilId === "035a4ddd";
      if (isSupplementaryPlusSigil && sigilTrait2 === EMPTY){
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)}\nwith invalid second trait\nThe ID is "V+", but actually "V".`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      const isWarSigil = sigilId === toHashString(3666949793);
      if (isWarSigil && sigilTrait2 !== EMPTY){
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)}\nwith invalid second trait\nThe ID is "V", but actually "V+".`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      const sigilRealTrait = attackSigilIdMap.get(sigilId);
      const sigilRealId = attackSigilTrait1Map.get(sigilTrait1);
      //진 아이디가 v+일때.
      if (sigilRealTrait !== undefined){
        if (sigilTrait2 === EMPTY){
          cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)}\nwith invalid trait`);
          if (status === NP) invalidIdx = index.toString();
          if (status === NP) status = CHEAT_SIGIL;
        }
      }
      //진 구성이 v+일때.
      if (sigilRealId !== undefined && sigilTrait2 !== EMPTY){
        // if
        const dobleAwakenSandalphonSigilId : string = toHashString(3099872606);
        if ((sigilId !== sigilRealId) &&
          !((seofonSigils[0].firstTrait === sigilTrait1 && dobleAwakenSeofonSigilId === sigilId) ||
            (tweyenSigils[0].firstTrait === sigilTrait1 && dobleAwakenTweyenSigilId === sigilId) ||
            (sandalphonAweakenTrait1 === sigilTrait1 && dobleAwakenSandalphonSigilId === sigilId))) {
          cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)}\nwith invalid second trait`);
          if (status === NP) invalidIdx = index.toString();
          if (status === NP) status = CHEAT_SIGIL;
        }
      }

      const angelTrait : string = toHashString(439285150); //サンダルフォンTrait
      const regenSigilHex : string = "6085da25";
      if (sigilTrait1 === seofonSigils[2].firstTrait ||
          sigilTrait1 === tweyenSigils[2].firstTrait ||
          sigilTrait1 === angelTrait){
        if (sigilTrait2 !== regenSigilHex){
          cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)}\nwith invalid second trait`);
          if (status === NP) invalidIdx = index.toString();
          if (status === NP) status = CHEAT_SIGIL;
        }
      }

      if (!checkInvalidSingleSigil(sigilTrait1, sigilTrait2)){
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)}\nwith invalid second trait`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      index++;
    }
  }

  cheats.push(invalidIdx);
  cheats.push(status);
  return cheats;
};

const checkInvalidSingleSigil = (sigilTrait : string, sigilTrait2 : string) : boolean => {
  sigilTrait;
  // if (heartSigilTraitMap.get(sigilTrait2) !== undefined) return false;
  // return !(sigilTrait2 !== EMPTY && heartSigilTraitMap.get(sigilTrait1) !== undefined);
  return (heartSigilTraitMap.get(sigilTrait2) === undefined)
}

interface DmgCap {
  characterType: CharacterType;
  baseDmg: number;
  maxDmg: number;
  maxDmg2: number;
  baseLinkDmg: number;
  name: string;
}

const DmgCaps: DmgCap[] = [
  { characterType: "Pl0000", baseDmg: 9999, maxDmg: 73700, maxDmg2: 77350, baseLinkDmg: 99999, name: "グラン"},
  { characterType: "Pl0100", baseDmg: 9999, maxDmg: 73700, maxDmg2: 77350, baseLinkDmg: 99999, name: "ジータ"},
  { characterType: "Pl0200", baseDmg: 9999, maxDmg: 92100, maxDmg2: 96600, baseLinkDmg: 99999, name: "カタリナ"},
  { characterType: "Pl0300", baseDmg: 1999, maxDmg: 17700, maxDmg2: 18550, baseLinkDmg: 99999, name: "ラカム"},
  { characterType: "Pl0400", baseDmg: 39999, maxDmg: 339000, maxDmg2: 355500, baseLinkDmg: 99996, name: "イオ"},
  { characterType: "Pl0500", baseDmg: 14999, maxDmg: 110550, maxDmg2: 115950, baseLinkDmg: 99999, name: "オイゲン"},
  { characterType: "Pl0600", baseDmg: 9999, maxDmg: 73700, maxDmg2: 77350, baseLinkDmg: 99999, name: "ロゼッタ"},
  { characterType: "Pl0700", baseDmg: 14999, maxDmg: 127100, maxDmg2: 133350, baseLinkDmg: 24999, name: "フェリ"},
  { characterType: "Pl0800", baseDmg: 3999, maxDmg: 32450, maxDmg2: 34000, baseLinkDmg: 99999, name: "ランスロット"},
  // { characterType: "Pl0900", maxDmg: 199850, name: "ヴェイン"},
  { characterType: "Pl0900", baseDmg: 22999, maxDmg: 190340, maxDmg2: 199850, baseLinkDmg: 99999, name: "ヴェイン"},
  { characterType: "Pl1000", baseDmg: 19999, maxDmg: 147400, maxDmg2: 154650, baseLinkDmg: 99999, name: "パーシヴァル"},
  { characterType: "Pl1100", baseDmg: 19999, maxDmg: 147400, maxDmg2: 154650, baseLinkDmg: 99999, name: "ジークフリート"},
  { characterType: "Pl1200", baseDmg: 6999, maxDmg: 51600, maxDmg2: 54150, baseLinkDmg: 99999, name: "シャルロッテ"},
  { characterType: "Pl1300", baseDmg: 3999, maxDmg: 29500, maxDmg2: 30950, baseLinkDmg: 99999, name: "ヨダルラーハ"},
  { characterType: "Pl1400", baseDmg: 7999, maxDmg: 67800, maxDmg2: 71100, baseLinkDmg: 99999, name: "ナルメア"},
  { characterType: "Pl1500", baseDmg: 9999, maxDmg: 73700, maxDmg2: 77350, baseLinkDmg: 99999, name: "ガンダゴウザ"},
  { characterType: "Pl1600", baseDmg: 22999, maxDmg: 205500, maxDmg2: 215550, baseLinkDmg: 99999, name: "ゼタ"},
  { characterType: "Pl1700", baseDmg: 14999, maxDmg: 157750, maxDmg2: 164750, baseLinkDmg: 99999, name: "バザラガ"},
  { characterType: "Pl1800", baseDmg: 9999, maxDmg: 84750, maxDmg2: 88870, baseLinkDmg: 99999, name: "カリオストロ"},
  { characterType: "Pl1900", baseDmg: 14999, maxDmg: 169500, maxDmg2: 177950, baseLinkDmg: 99999, name: "イド"},
  { characterType: "Pl2100", baseDmg: 11999, maxDmg: 88336, maxDmg2: 92750, baseLinkDmg: 99999, name: "サンダルフォン"},
  { characterType: "Pl2200", baseDmg: 11999, maxDmg: 108700, maxDmg2: 111300, baseLinkDmg: 99999, name: "シエテ"},
  { characterType: "Pl2300", baseDmg: 3499, maxDmg: 28360, maxDmg2: 29750, baseLinkDmg: 99999, name: "ソーン"}
];

export const characterToBaseDmgCapMap = new Map<CharacterType, number>();
const characterToDmgCapMap = new Map<CharacterType, number>();
const characterToDmgCap2Map = new Map<CharacterType, number>();
export const characterToBaseLinkDmgCapMap = new Map<CharacterType, number>();

DmgCaps.forEach(dmgCap => {
  characterToBaseDmgCapMap.set(dmgCap.characterType, dmgCap.baseDmg);
  characterToDmgCapMap.set(dmgCap.characterType, dmgCap.maxDmg);
  characterToDmgCap2Map.set(dmgCap.characterType, dmgCap.maxDmg2);
  characterToBaseLinkDmgCapMap.set(dmgCap.characterType, dmgCap.baseLinkDmg);
});

export const checkDmgDPS = (
  player: ComputedPlayerState,
  playerData: PlayerData,
  finalDmgCap: number,
  finalLinkDmgCap: number,
  ) : string => {
  const totalDamage = player.skillBreakdown.reduce((acc, skill) => acc + skill.totalDamage, 0);
  const computedSkills = player.skillBreakdown.map((skill) => {
    return {
      percentage: (skill.totalDamage / totalDamage) * 100,
      ...skill,
    };
  });
  computedSkills.sort((a, b) => b.totalDamage - a.totalDamage);
  const characterType : CharacterType = playerData.characterType;
  const isKata = characterType === "Pl0200";
  const isSdp = characterType === "Pl2100";
  const isPcv = characterType === "Pl1000";
  const isSeofon = characterType === "Pl2200";
  const limitDmg = characterToDmgCap2Map.get(characterType);
  if (limitDmg === undefined){
    return "Character";
  }

  for (const skill of computedSkills){
    if (skill.maxDamage === null) continue;

    const maxDmg = skill.maxDamage!;
    const actionType = skill.actionType as { Normal: number };
    const skillID = actionType["Normal"];

    if (skillID === 100){
      if (maxDmg > (finalDmgCap + 100) || maxDmg > limitDmg){
      // if (maxDmg > finalDmgCap * (characterType === "Pl2100" ? 0.953 : 1)){
        return "DMG";
      }
      break;
    }

    if (skill.actionType === "LinkAttack"){
      if (maxDmg > finalLinkDmgCap + (isKata ? 22000 : 0) + (isSdp ? 40000 : 0) +
        (isPcv ? 230000 : 0) + (isSeofon ? 22000 : 0) + 100){
        // if (maxDmg > finalDmgCap * (characterType === "Pl2100" ? 0.953 : 1)){
        return "DMG";
      }
      break;
    }
  }
  return "";
}

export const getSupDmgPlusCount = (sigils :  Sigil[]) => {
  let cnt : number = 0;

  for (const sigil of sigils) {
    const sigilId = toHashString(sigil.sigilId ?? 0);
    const isSupplementaryPlusSigil = sigilId === "035a4ddd";

    if (isSupplementaryPlusSigil) cnt = cnt + 1;
  }

  return cnt;
}

export const checkCheatingController = (player: PlayerData) => {
  const checkInfo = checkCheating(player);
  const lastIndex = checkInfo.length - 2;

  return checkInfo.slice(0, lastIndex).join("\n");
};

export const checkDmgBuff = (partyData : Array<PlayerData | null>) => {
  for (const player of partyData){
    if (player === null) continue;
    if (player.characterType === "Pl0200"){
      for (const sigil of player.sigils) {
        if (sigil.firstTraitId === 2600336030){
          return 1.25;
        }
      }
    }
  }
  return 1;
}

export const checkGlassCannon = (player: PlayerData) => {
  if (player !== null){
    for (const sigil of player.sigils) {
      if (sigil.firstTraitId === 2829260347 || sigil.secondTraitId === 2829260347){
        return 0.3;
      }
    }
  }
  return 0;
}

export const checkSuperJust = (player: PlayerData) => {
  if (player !== null){
    for (const sigil of player.sigils) {
      if (toHashString(sigil.firstTraitId) === "51c115d2"){
        return 0.5;
      }
    }
  }
  return 0;
}

export const checkWarElmt = (player: PlayerData) => {
  player;
  return 1.2;
  // todo : To make it work according to the field
  // if (player !== null){
  //   for (const sigil of player.sigils) {
  //     if (toHashString(sigil.firstTraitId) === "4c588c27"){
  //       return 1.2;
  //     }
  //   }
  // }
  // return 1;
}

export const checkWarpath = (player: PlayerData) => {
  if (player !== null){
    if (player.characterType === "Pl0000" || player.characterType === "Pl0100"){
      return 1;
    }
    if (player.characterType === "Pl2300"){ //송
      for (const sigil of player.sigils) {
        if (toHashString(sigil.firstTraitId) === tweyenSigils[0].firstTrait){//마안
          return 1.20;
        }
        if (toHashString(sigil.secondTraitId) === tweyenSigils[0].firstTrait){//마안
          return 1.20;
        }
      }
      return 1;
    }
    for (const sigil of player.sigils) {
      if (heartSigilTraitMap.get(toHashString(sigil.firstTraitId)) !== undefined){
        return 1.20;
      }
    }
  }
  return 1;
}

export const checkNormalDmgOverMst = (player: PlayerData) => {
  if (player.overmasteryInfo === null) return 0;
  const overmasteries = player.overmasteryInfo.overmasteries;
  for (const mastery of overmasteries) {
    if (mastery.id === 1136089117){
      if (mastery.value > 0) return mastery.value / 100;
    }
  }
  return 0;
}

export const checkBoundary = (player: PlayerData) => {
  const boundaryTraits = [toHashString(439285150), seofonSigils[2].firstTrait, tweyenSigils[2].firstTrait]
  const boundaryCharators = ["Pl2100", "Pl2200", "Pl2300"]
  if (player !== null){
    if (boundaryCharators.find(elem => elem === player.characterType) === undefined){
      return 1;
    }
    for (const sigil of player.sigils) {
      if (boundaryTraits.find(elem => elem === toHashString(sigil.firstTraitId)) !== undefined){
        return 1;
      }
    }
  }
  return 0;
}

export const checkGamma = (player: PlayerData) => {
  let cnt = 0;
  if (player !== null){
    for (const sigil of player.sigils) {
      if (toHashString(sigil.firstTraitId) === "5c862e13"){
        cnt += 1;
      }
      if (cnt === 2) break;
    }
  }
  if (cnt === 0) return 0;
  return cnt === 1 ? 0.16 : 0.3;
}

export const checkAlpha = (player: PlayerData) => {
  let cnt = 0;
  if (player !== null){
    for (const sigil of player.sigils) {
      if (toHashString(sigil.firstTraitId) === "dbe1d775"){
        cnt += 1;
      }
      if (cnt === 2) break;
    }
  }
  if (cnt === 0) return 0;
  return cnt === 1 ? 0.26 : 0.40;
}