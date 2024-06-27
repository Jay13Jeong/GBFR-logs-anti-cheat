import { ComputedPlayerState, PlayerData } from "@/types";
import {
  EMPTY_ID,
  translateSigilId, translateTraitId,
} from "@/utils";
import { Fragment, useEffect, useState } from "react";
import {
  characterToBaseDmgCapMap,
  characterToBaseLinkDmgCapMap, checkAlpha,
  checkBoundary,
  checkCheating,
  checkDmgBuff,
  checkDmgDPS, checkGamma,
  checkGlassCannon,
  checkNormalDmgOverMst,
  checkSuperJust,
  checkWarElmt, checkWarpath,
} from "@/utils2.ts";
import { t } from "i18next";

const EquipmentList = ({playerData, invalidSigilIdx}: {
  playerData: PlayerData | null,
  invalidSigilIdx: number; }) => {
  return (
    <tr className="skill-table">
      <td colSpan={100}>
        <table className="table w-full">
          <thead className="header transparent-bg">
          <tr>
            <th className="header-column">Sigil</th>
            <th className="header-column">Trait 1st</th>
            <th className="header-column">Trait 2nd</th>
          </tr>
          </thead>
          <tbody className="transparent-bg">
          {
            playerData?.sigils.map((sigil, index) => {
              const backgroundColor = index === invalidSigilIdx ? "red" : 'transparent';
              const locationStyle = {
                backgroundColor: backgroundColor
              };
              return(
                <tr key={index} style={locationStyle}>
                  <td>{translateSigilId(sigil.sigilId)} (Lvl. {sigil.sigilLevel})</td>
                  {sigil.firstTraitId !== EMPTY_ID ?
                    <td>{translateTraitId(sigil.firstTraitId)}</td>
                    :
                    <td>-</td>
                  }
                  <td>{sigil.secondTraitId !== EMPTY_ID && `${translateTraitId(sigil.secondTraitId)}`}</td>
                </tr>
              )
            })
          }
          </tbody>
        </table>
      </td>
    </tr>
  );
};

export const PlayerEquipment = ({
                                  playerData, partyData
                                }: {
  playerData: PlayerData | null;
  partyData: Array<PlayerData | null>;
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [cheatChecker, setCheatState] = useState({status: "", cheat: false});
  const [characterType, setCharacterType] = useState<string>("");
  // const [supDmgPlusCount, setSupDmgPlusCount] = useState<number>(0);
  const [invalidSigilIdx, setInvalidSigilIdx] = useState("-1");

  useEffect(() => {
    checkCheatingSimpleAsync(playerData!);
    const characterTypeResult = t(`characters:${playerData?.characterType}`, `ui:characters.${playerData?.characterType}`);
    setCharacterType(() => characterTypeResult);
  }, [playerData, partyData]);

  const checkCheatingSimpleAsync = async (player: PlayerData) => {
    const checkInfoes = checkCheating(player);
    const lastIndex = checkInfoes.length - 1;
    const checkStatus = checkInfoes[lastIndex];
    const checkIdx = checkInfoes[lastIndex - 1];
    const CHEAT_WSTONE: string = "1";
    const CHEAT_SIGIL: string = "2";
    const CHEAT_STAT: string ="3";
    if (checkStatus === CHEAT_WSTONE){
      setCheatState(() => ({ status: "Cheat wStone", cheat: true }))
      setInvalidSigilIdx(() => checkIdx)
    } else if (checkStatus === CHEAT_SIGIL){
      const lineNo = parseInt(checkIdx) + 1;
      setCheatState(() => (
        { status: "Cheat Sigil Line " + lineNo.toString(), cheat: true }))
      setInvalidSigilIdx(() => checkIdx)
    } else if (checkStatus === CHEAT_STAT){
      setCheatState(() => (
        { status: "Cheat STAT", cheat: true }))
      setInvalidSigilIdx(() => checkIdx)
    } else {
      setCheatState(() => ({ status: "Ok", cheat: false }))
      setInvalidSigilIdx(() => "-1")
    }
  };

  if (characterType === "ui:characters.[object Object]") return null;

  return (
    <Fragment>
      <tr className={`player-row ${isOpen ? "transparent-bg" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        {cheatChecker.cheat ?
          <td style={{ backgroundColor: 'red' }}>{playerData?.displayName} ({characterType}) ({cheatChecker.status})</td>
          :
          <td style={{ backgroundColor: 'rgba(224, 255, 255, 0.5)' }}>{playerData?.displayName}  &nbsp;({characterType}) (Ok)</td>
        }
        <td></td>
        <td></td>
        <td></td>
      </tr>
      {isOpen && <EquipmentList playerData={playerData} invalidSigilIdx={parseInt(invalidSigilIdx)} />}
    </Fragment>
  );
};

export const DmgCheckRow = ({
                            player,
                            partyData,
                          }: {
  player: ComputedPlayerState;
  partyData: Array<PlayerData | null>;
}) => {
  const partySlotIndex = partyData.findIndex((partyMember) => partyMember?.actorIndex === player.index);
  const [DmgChecker, setDmgChecker] = useState({status: "", cheat: false});
  const [characterType, setCharacterType] = useState<string>("");
  const playerData = partyData[partySlotIndex];
  // const [calcStatus, setCalcStatus] = useState("");
  // const [calcStatus2, setCalcStatus2] = useState("");

  useEffect(() => {
    dmgCheckAsync();
    const characterTypeResult = t(`characters:${playerData?.characterType}`, `ui:characters.${playerData?.characterType}`);
    setCharacterType(() => characterTypeResult);
  }, [player]);

  const dmgCheckAsync = async () => {
    setDmgChecker(() => ({status: "", cheat: false}));
    const zetaDmg = playerData!.characterType === "Pl1600" ? 1.0627 : 1 //arvess
    const dmgBuff : number = checkDmgBuff(partyData);
    const djeetaDmg : number = dmgBuff !== 1 &&
      (playerData!.characterType === "Pl0000" || playerData!.characterType === "Pl0100") ? 1.25 : 1 //kataBuff except
    const kataAwake : number = (playerData!.characterType === "Pl0200") ? 0.15 : 0
    const baseCap = characterToBaseDmgCapMap.get(playerData!.characterType);
    const baseLinkCap = characterToBaseLinkDmgCapMap.get(playerData!.characterType);
    const dmgCap : number = 2.5;
    const normalCap : number = 0.74;
    let superJustCap : number = 0;
    let glassCannonCap : number = 0;
    let overMstCap : number = 0;
    let warElmt : number = 0;
    let warPath : number = 0;
    let boundary : number = 0;
    let gamma : number = 0;
    let alpha : number = 0;

    if (baseCap === undefined || baseLinkCap === undefined){
      setDmgChecker(() => ({status: "Unregistered", cheat: true}));
      return;
    }
    if (playerData !== null){
      superJustCap = parseFloat(checkSuperJust(playerData).toFixed(2));
      glassCannonCap = parseFloat(checkGlassCannon(playerData).toFixed(2));
      overMstCap = parseFloat(checkNormalDmgOverMst(playerData).toFixed(2));
      warElmt = parseFloat(checkWarElmt(playerData).toFixed(2));
      warPath = parseFloat(checkWarpath(playerData).toFixed(2));
      boundary = parseFloat(checkBoundary(playerData).toFixed(2));
      // setCalcStatus(() => "super: " + superJustCap + ", glass: " + glassCannonCap + ", normal: " +
      // normalCap + ", warElmet: " + warElmt + ", warPath: " + warPath + ", boundary: " + boundary)
      gamma = parseFloat(checkGamma(playerData).toFixed(2));
      alpha = parseFloat(checkAlpha(playerData).toFixed(2));
    }

    const finalDmgCap = (baseCap + (baseCap * (dmgCap + gamma + boundary + glassCannonCap + superJustCap + kataAwake)) +
      (baseCap * (normalCap + overMstCap + alpha))) * warElmt * warPath * zetaDmg * djeetaDmg * dmgBuff;
    const finalLinkDmgCap = (baseLinkCap + (baseLinkCap * (dmgCap + gamma + boundary + glassCannonCap + superJustCap + kataAwake)) +
      (baseLinkCap * (normalCap + overMstCap + alpha))) * warElmt * warPath * zetaDmg * djeetaDmg  * dmgBuff;
    // setCalcStatus(() => "N: " + ((finalDmgCap + 0.1) / 1000).toFixed(1) + "k" + dmgBuff) ;
    // setCalcStatus2(() => "Link: " + ((finalLinkDmgCap + 0.1) / 1000).toFixed(1) + "k");
    const checkResult : string = checkDmgDPS(player, playerData!, finalDmgCap, finalLinkDmgCap);
    if (checkResult !== "") {
      setDmgChecker(() => ({status: checkResult + " Cheat", cheat: true}));
    }
  }


  return (
    <>
    {DmgChecker.cheat ?
      <Fragment>
        <tr className={`player-row`}>
          <td style={{ backgroundColor: 'red' }}>{playerData?.displayName} ({characterType}) ({DmgChecker.status})</td>
          <td>
            {/*{calcStatus}*/}
          </td>
          <td>
            {/*{calcStatus2}*/}
          </td>
          <td></td>
        </tr>
      </Fragment>
      :
      null
    }
    </>
  );
};

