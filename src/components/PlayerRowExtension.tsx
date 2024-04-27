import { PlayerData } from "@/types";
import {
  EMPTY_ID,
  translateSigilId, translateTraitId,
} from "@/utils";
import { Fragment, useEffect, useState } from "react";
import { checkCheating, getSupDmgPlusCount } from "@/utils2.ts";
import { t } from "i18next";

const EquipmentList = ({playerData}: { playerData: PlayerData | null; }) => {
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
              return(
                <tr key={index}>
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
  const [supDmgPlusCount, setSupDmgPlusCount] = useState<number>(0);

  useEffect(() => {
    const getSupDmgPlusCountAsync = async () => {
      const cnt : number = getSupDmgPlusCount(playerData!.sigils)
      setSupDmgPlusCount(() => cnt);
    }
    getSupDmgPlusCountAsync();
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
    const CHEAT_WSTONE: string = "1";
    const CHEAT_SIGIL: string = "2";
    if (checkStatus === CHEAT_WSTONE){
      setCheatState(() => ({ status: "Cheat wStone", cheat: true }))
    } else if (checkStatus === CHEAT_SIGIL){
      setCheatState(() => ({ status: "Cheat Sigil", cheat: true }))
    } else {
      setCheatState(() => ({ status: "Ok", cheat: false }))
    }
  };

  return (
    <Fragment>
      <tr className={`player-row ${isOpen ? "transparent-bg" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        {cheatChecker.cheat ?
          <td style={{ backgroundColor: 'red' }}>{playerData?.displayName} ({characterType}) ({supDmgPlusCount} SupDmgV+) ({cheatChecker.status})</td>
          :
          <td style={{ backgroundColor: 'rgba(224, 255, 255, 0.5)' }}>{playerData?.displayName}  &nbsp;({characterType}) ({supDmgPlusCount} SupDmgV+)</td>
        }
        <td></td>
        <td></td>
        <td></td>
      </tr>
      {isOpen && <EquipmentList playerData={playerData} />}
    </Fragment>
  );
};