import { ComputedPlayerState, PlayerData } from "@/types";
import {
  EMPTY_ID,
  translateSigilId, translateTraitId,
} from "@/utils";
import { Fragment, useEffect, useState } from "react";
import {
  checkCheating, checkDmgBuff, checkDmgCap,
  // getSupDmgPlusCount
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
    // const getSupDmgPlusCountAsync = async () => {
    //   const cnt : number = getSupDmgPlusCount(playerData!.sigils)
    //   setSupDmgPlusCount(() => cnt);
    // }
    // getSupDmgPlusCountAsync();
  }, [playerData, partyData]);

  useEffect(() => {
    checkCheatingSimpleAsync(playerData!);
    const characterTypeResult = t(`characters:${playerData?.characterType}`, `ui:characters.${playerData?.characterType}`);
    setCharacterType(() => characterTypeResult);
  }, [playerData]);

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

  useEffect(() => {
    dmgCheckAsync();
    const characterTypeResult = t(`characters:${playerData?.characterType}`, `ui:characters.${playerData?.characterType}`);
    setCharacterType(() => characterTypeResult);
  }, [player]);

  const dmgCheckAsync = async () => {
    setDmgChecker(() => ({status: "", cheat: false}));
    const dmgBuff : number = checkDmgBuff(partyData);
    if (!checkDmgCap(player, playerData!, dmgBuff)){
      setDmgChecker(() => ({status: "Dmg Cheat", cheat: true}));
    }
  }

  return (
    <>
    {DmgChecker.cheat ?
      <Fragment>
        <tr className={`player-row`}>
          <td style={{ backgroundColor: 'red' }}>{playerData?.displayName} ({characterType}) ({DmgChecker.status})</td>
          <td></td>
          <td></td>
          <td></td>
        </tr>
      </Fragment>
      :
      null
    }
    </>
  );
};