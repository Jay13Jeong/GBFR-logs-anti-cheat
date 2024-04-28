import { toHashString, translateSigilId } from "@/utils.ts";
import {
  attackSigilIdMap,
  attackSigilTrait1Map, dobleAwakenSeofonSigilId,
  dobleAwakenTweyenSigilId,
  seofonSigils,
  tweyenSigils,
} from "@/sigils.ts";
import { PlayerData, Sigil } from "@/types.ts";

export const checkCheating = (player: PlayerData) => {
  const cheats : string[] = [];

  const CHEAT_WSTONE: string = "1";
  const CHEAT_SIGIL: string = "2";
  const NP: string = "0";
  let status : string = NP;
  let invalidIdx : string = "-1";

  // invalid wrightstone level
  if (player !== undefined && player.weaponInfo !== null && player.weaponInfo !== undefined){
    if ((player.weaponInfo.trait1Level ?? 0) > 10) {
      cheats.push("Wrightstone with trait level > 10");
      if (status === NP) invalidIdx = "-2";
      if (status === NP) status = CHEAT_WSTONE;
    }
    if ((player.weaponInfo.trait2Level ?? 0) > 7) {
      cheats.push("Wrightstone with trait level > 7");
      if (status === NP) invalidIdx = "-2";
      if (status === NP) status = CHEAT_WSTONE;
    }
    if ((player.weaponInfo.trait3Level ?? 0) > 5) {
      cheats.push("Wrightstone with trait level > 5");
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
      cheats.push("Wrightstone with invalid trait");
      if (status === NP) invalidIdx = "-2";
      if (status === NP) status = CHEAT_WSTONE;
    }
  }

  // check sigils
  if (player !== undefined){
    let index = 0;
    for (const sigil of player.sigils) {
      if (sigil.firstTraitLevel > 15 || sigil.secondTraitLevel > 15 || sigil.sigilLevel > 15) {
        cheats.push(`Modified sigil:\nover level 15`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }
      const sigilTrait1 = toHashString(sigil.firstTraitId ?? 0);
      const sigilTrait2 = toHashString(sigil.secondTraitId ?? 0);

      const isLucySigil = sigilTrait1 === "dbe1d775" || sigilTrait1 === "8d2adb6e" || sigilTrait1 === "5c862e13";
      if (isLucySigil && sigilTrait2 !== "dc584f60") {
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)} with invalid second trait`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      const isLucySigil2 = sigilTrait2 === "dbe1d775" || sigilTrait2 === "8d2adb6e" || sigilTrait2 === "5c862e13";
      if (isLucySigil2) {
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)} with invalid second trait`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      const EMPTY : string = "887ae0b0";

      const isSingleSigil = sigilTrait1 === "4c588c27" ||
        sigilTrait1 === seofonSigils[3].firstTrait || sigilTrait1 === tweyenSigils[3].firstTrait;
      const isSingleSigil2 = sigilTrait2 === "4c588c27" || //유리;
        sigilTrait2 === seofonSigils[3].firstTrait || sigilTrait2 === tweyenSigils[3].firstTrait ||
        sigilTrait2 === "57ab5b10" || sigilTrait2 === "ec1c6779" || sigilTrait2 === "a1a8e39d"; //추뎀,프닷,움무;
      if ((isSingleSigil && sigilTrait2 !== EMPTY) || isSingleSigil2) {
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)} with invalid second trait`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      const sigilId = toHashString(sigil.sigilId ?? 0);

      const isFOFPlusSigil = sigilId === "0a4651bb";
      if (isFOFPlusSigil && sigilTrait2 === EMPTY){
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)} with invalid second trait`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      const isFOFSigil = sigilId === "f3336835";
      if (isFOFSigil && sigilTrait2 !== EMPTY){
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)} with invalid second trait`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      const isSupplementarySigil = sigilId === "42bb0c1c";
      if (isSupplementarySigil && sigilTrait2 !== EMPTY){
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)} with invalid second trait`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      const isSupplementaryPlusSigil = sigilId === "035a4ddd";
      if (isSupplementaryPlusSigil && sigilTrait2 === EMPTY){
        cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)} with invalid second trait`);
        if (status === NP) invalidIdx = index.toString();
        if (status === NP) status = CHEAT_SIGIL;
      }

      const sigilRealTrait = attackSigilIdMap.get(sigilId);
      const sigilRealId = attackSigilTrait1Map.get(sigilTrait1);
      //진 아이디가 v+일때.
      if (sigilRealTrait !== undefined){
        if (sigilTrait2 === EMPTY){
          cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)} with invalid trait`);
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
          cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)} with invalid second trait`);
          if (status === NP) invalidIdx = index.toString();
          if (status === NP) status = CHEAT_SIGIL;
        }
      }

      const regenSigilHex : string = "6085da25";
      if (sigilTrait1 === seofonSigils[2].firstTrait || sigilTrait1 === tweyenSigils[2].firstTrait){
        if (sigilTrait2 !== regenSigilHex){
          cheats.push(`Modified sigil:\n${translateSigilId(sigil.sigilId)} with invalid second trait`);
          if (status === NP) invalidIdx = index.toString();
          if (status === NP) status = CHEAT_SIGIL;
        }
      }
      index++;
    }
  }

  cheats.push(invalidIdx);
  cheats.push(status);
  return cheats;
};

export const getDmgCap = (player: PlayerData) => {
  let dmgCap : number = 0;
  dmgCap = 2e9; ////////////////////////////////////

  // to do // Get dmg cap through the sigils
  for (const sigil of player.sigils) {
    sigil.sigilId
  }

  return dmgCap;
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