import { toHashString, translateSigilId } from "@/utils.ts";
import {
  attackSigilIdMap,
  attackSigilTrait1Map,
  dobleAwakenSeofonSigilId,
  dobleAwakenTweyenSigilId,
  heartSigilTraitMap,
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
      const checkArrCnt = overmasteries.filter(om => om === mastery).length;
      if (checkArrCnt > 1){
        cheats.push("Duplicate Overmasteries");
        if (status === NP) invalidIdx = "-3";
        if (status === NP) status = CHEAT_STAT;
      }
    }
  }

  // invalid wrightstone level
  if (player !== undefined && player.weaponInfo !== null && player.weaponInfo !== undefined){
    if ((player.weaponInfo.trait1Level ?? 0) > 10) {
      cheats.push("Wrightstone\nwith trait level > 10");
      if (status === NP) invalidIdx = "-2";
      if (status === NP) status = CHEAT_WSTONE;
    }
    if ((player.weaponInfo.trait2Level ?? 0) > 7) {
      cheats.push("Wrightstone\nwith trait level > 7");
      if (status === NP) invalidIdx = "-2";
      if (status === NP) status = CHEAT_WSTONE;
    }
    if ((player.weaponInfo.trait3Level ?? 0) > 5) {
      cheats.push("Wrightstone\nwith trait level > 5");
      if (status === NP) invalidIdx = "-2";
      if (status === NP) status = CHEAT_WSTONE;
    }

    // invalid wrightstone trait
    const notAllowedWrightstone = [
      "57ab5b10",
      "82ce278d",
      "1568e0e4",
      "70395731",
      "cd18a77d",
      "333e5862",
      "a8a3163b",
      "ec1c6779",
      "dbe1d775",
      "8d2adb6e",
      "5c862e13",
      "082033cb",
      "1b0d9897",
      "9ad8b5e6",
      "40223c28",
      "74aa75d6",
      "dc225c96",
      "4c588c27",
      "5e422ae5",
      "af794a87",
      "a1a8e39d",
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



      const isSingleSigil = sigilTrait1 === "4c588c27" ||
        sigilTrait1 === seofonSigils[3].firstTrait || sigilTrait1 === tweyenSigils[3].firstTrait;
      const isSingleSigil2 = sigilTrait2 === "4c588c27" || //유리;
        sigilTrait2 === seofonSigils[3].firstTrait || sigilTrait2 === tweyenSigils[3].firstTrait ||
        sigilTrait2 === "57ab5b10" || sigilTrait2 === "ec1c6779" || sigilTrait2 === "a1a8e39d"; //추뎀,프닷,움무;
      if ((isSingleSigil && sigilTrait2 !== EMPTY) || isSingleSigil2) {
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
        if ((sigilId !== sigilRealId) &&
          !((seofonSigils[0].firstTrait === sigilTrait1 && dobleAwakenSeofonSigilId === sigilId) ||
            (tweyenSigils[0].firstTrait === sigilTrait1 && dobleAwakenTweyenSigilId === sigilId))) {
          cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)}\nwith invalid second trait`);
          if (status === NP) invalidIdx = index.toString();
          if (status === NP) status = CHEAT_SIGIL;
        }
      }

      const regenSigilHex : string = "6085da25";
      if (sigilTrait1 === seofonSigils[2].firstTrait || sigilTrait1 === tweyenSigils[2].firstTrait){
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

const checkInvalidSingleSigil = (sigilTrait1: string, sigilTrait2: string) : boolean => {
  if (heartSigilTraitMap.get(sigilTrait2) !== undefined) return false;

  return !(sigilTrait2 !== EMPTY && heartSigilTraitMap.get(sigilTrait1) !== undefined);
}

interface DmgCap {
  characterType: CharacterType;
  maxDmg: number;
  name: string;
}

const DmgCaps: DmgCap[] = [
  { characterType: "Pl0000", maxDmg: 77350, name: "グラン"},
  { characterType: "Pl0100", maxDmg: 77350, name: "ジータ"},
  { characterType: "Pl0200", maxDmg: 96600, name: "カタリナ"},
  { characterType: "Pl0300", maxDmg: 18550, name: "ラカム"},
  { characterType: "Pl0400", maxDmg: 355500, name: "イオ"},
  { characterType: "Pl0500", maxDmg: 115950, name: "オイゲン"},
  { characterType: "Pl0600", maxDmg: 77350, name: "ロゼッタ"},
  { characterType: "Pl0700", maxDmg: 133350, name: "フェリ"},
  { characterType: "Pl0800", maxDmg: 34000, name: "ランスロット"},
  { characterType: "Pl0900", maxDmg: 177750, name: "ヴェイン"},
  { characterType: "Pl1000", maxDmg: 154650, name: "パーシヴァル"},
  { characterType: "Pl1100", maxDmg: 154650, name: "ジークフリート"},
  { characterType: "Pl1200", maxDmg: 54150, name: "シャルロッテ"},
  { characterType: "Pl1300", maxDmg: 30950, name: "ヨダルラーハ"},
  { characterType: "Pl1400", maxDmg: 71100, name: "ナルメア"},
  { characterType: "Pl1500", maxDmg: 77350, name: "ガンダゴウザ"},
  { characterType: "Pl1600", maxDmg: 215550, name: "ゼタ"},
  { characterType: "Pl1700", maxDmg: 164750, name: "バザラガ"},
  { characterType: "Pl1800", maxDmg: 88870, name: "カリオストロ"},
  { characterType: "Pl1900", maxDmg: 177950, name: "イド"},
  { characterType: "Pl2100", maxDmg: 222222, name: "サンダルフォン"},
  { characterType: "Pl2200", maxDmg: 111300, name: "シエテ"},
  { characterType: "Pl2300", maxDmg: 29750, name: "ソーン"}
];

const characterToDmgCapMap = new Map<CharacterType, number>();

DmgCaps.forEach(dmgCap => {
  characterToDmgCapMap.set(dmgCap.characterType, dmgCap.maxDmg);
});

export const checkDmgCap = (player: ComputedPlayerState, playerData: PlayerData) : boolean => {
  const totalDamage = player.skillBreakdown.reduce((acc, skill) => acc + skill.totalDamage, 0);
  const computedSkills = player.skillBreakdown.map((skill) => {
    return {
      percentage: (skill.totalDamage / totalDamage) * 100,
      ...skill,
    };
  });
  computedSkills.sort((a, b) => b.totalDamage - a.totalDamage);

  for (const skill of computedSkills){
    if (skill.maxDamage === null) continue;
    //attack1만나면 if걸고 break
    const maxDmg = skill.maxDamage!;
    const characterType : CharacterType = playerData.characterType;
    const actionType = skill.actionType as { Normal: number };
    const skillID = actionType["Normal"];

    if (skillID === 100){
      const dmgCap = characterToDmgCapMap.get(characterType);
      if (dmgCap !== undefined && maxDmg > dmgCap){
        return false;
      }
      break;
    }
  }
  // to do // Get dmg cap through the sigils

  return true;
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
