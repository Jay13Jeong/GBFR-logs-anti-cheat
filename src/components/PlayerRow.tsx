import { useMeterSettingsStore } from "@/stores/useMeterSettingsStore";
import { CharacterType, ComputedPlayerState, ComputedSkillState, MeterColumns, PlayerData } from "@/types";
import {
  checkCheating, EMPTY_ID,
  getDmgCap,
  getSkillName, getSupDmgPlusCount,
  humanizeNumbers,
  translatedPlayerName, translateSigilId, translateTraitId,
} from "@/utils";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { Dispatch, Fragment, SetStateAction, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { t } from "i18next";

type Props = {
  player: ComputedPlayerState;
  color: string;
  setCheatState: Dispatch<SetStateAction<{status: string, cheat: boolean}>>;
  playerData: PlayerData | null;
};

const SkillRow = ({
  characterType,
  skill,
  color,
}: {
  characterType: CharacterType;
  skill: ComputedSkillState;
  color: string;
}) => {
  const { show_full_values } = useMeterSettingsStore(
    useShallow((state) => ({
      show_full_values: state.show_full_values,
    }))
  );

  const [totalDamage, totalDamageUnit] = humanizeNumbers(skill.totalDamage);
  const [minDmg, minDmgUnit] = humanizeNumbers(skill.minDamage || 0);
  const [maxDmg, maxDmgUnit] = humanizeNumbers(skill.maxDamage || 0);
  const avg = skill.hits === 0 ? 0 : skill.totalDamage / skill.hits;
  const [averageDmg, averageDmgUnit] = humanizeNumbers(avg);

  return (
    <tr className="skill-row">
      <td className="text-left row-data">{getSkillName(characterType, skill)}</td>
      <td className="text-center row-data">{skill.hits}</td>
      <td className="text-center row-data">
        {show_full_values ? (
          skill.totalDamage.toLocaleString()
        ) : (
          <>
            {totalDamage}
            <span className="unit font-sm">{totalDamageUnit}</span>
          </>
        )}
      </td>
      <td className="text-center row-data">
        {show_full_values ? (
          skill.minDamage ? (
            skill.minDamage.toLocaleString()
          ) : (
            ""
          )
        ) : (
          <>
            {skill.minDamage && minDmg}
            <span className="unit font-sm">{minDmgUnit}</span>
          </>
        )}
      </td>
      <td className="text-center row-data">
        {show_full_values ? (
          skill.maxDamage ? (
            skill.maxDamage.toLocaleString()
          ) : (
            ""
          )
        ) : (
          <>
            {skill.maxDamage && maxDmg}
            <span className="unit font-sm">{maxDmgUnit}</span>
          </>
        )}
      </td>
      <td className="text-center row-data">
        {show_full_values ? (
          avg.toLocaleString()
        ) : (
          <>
            {averageDmg}
            <span className="unit font-sm">{averageDmgUnit}</span>
          </>
        )}
      </td>
      <td className="text-center row-data">
        {skill.percentage.toFixed(0)}
        <span className="unit font-sm">%</span>
      </td>
      <div className="damage-bar" style={{ backgroundColor: color, width: `${skill.percentage}%` }} />
    </tr>
  );
};

const SkillBreakdown = ({ player, color, setCheatState, playerData }: Props) => {
  const totalDamage = player.skillBreakdown.reduce((acc, skill) => acc + skill.totalDamage, 0);
  const computedSkills = player.skillBreakdown.map((skill) => {
    return {
      percentage: (skill.totalDamage / totalDamage) * 100,
      ...skill,
    };
  });

  computedSkills.sort((a, b) => b.totalDamage - a.totalDamage);

  useEffect(() => {
    if (playerData !== null){
      checkDmgCheating(playerData);
    }
  }, []);

  const checkDmgCheating = async (playerData: PlayerData) => {
    let isCheatDmg : boolean = false;
    const dmgCap : number = getDmgCap(playerData);

    for (const skill of computedSkills){
      if (skill.maxDamage && skill.maxDamage > (dmgCap * 1.03)){
        isCheatDmg = true;
        break;
      }
    }

    if (isCheatDmg){
      setCheatState((state) => (state.cheat ? state : { status: "Cheat Dmg Power", cheat: true }))
    }
  }

  return (
    <tr className="skill-table">
      <td colSpan={100}>
        <table className="table w-full">
          <thead className="header transparent-bg">
            <tr>
              <th className="header-name">Skill</th>
              <th className="header-column text-center">Hits</th>
              <th className="header-column text-center">Total</th>
              <th className="header-column text-center">Min</th>
              <th className="header-column text-center">Max</th>
              <th className="header-column text-center">Avg</th>
              <th className="header-column text-center">%</th>
            </tr>
          </thead>
          <tbody className="transparent-bg">
            {computedSkills.map((skill) => (
              <SkillRow
                key={`${skill.childCharacterType}-${getSkillName(player.characterType, skill)}`}
                characterType={player.characterType}
                skill={skill}
                color={color}
              />
            ))}
          </tbody>
        </table>
      </td>
    </tr>
  );
};

export type ColumnValue = {
  value: string | number;
  unit?: string | number;
};

export const PlayerRow = ({
  live = false,
  player,
  partyData,
}: {
  live?: boolean;
  player: ComputedPlayerState;
  partyData: Array<PlayerData | null>;
}) => {
  const { color_1, color_2, color_3, color_4, show_display_names, show_full_values, overlay_columns } =
    useMeterSettingsStore(
      useShallow((state) => ({
        color_1: state.color_1,
        color_2: state.color_2,
        color_3: state.color_3,
        color_4: state.color_4,
        show_display_names: state.show_display_names,
        show_full_values: state.show_full_values,
        overlay_columns: state.overlay_columns,
      }))
    );

  const playerColors = [color_1, color_2, color_3, color_4, "#9BCF53", "#380E7F", "#416D19", "#2C568D"];
  const partySlotIndex = partyData.findIndex((partyMember) => partyMember?.actorIndex === player.index);
  const color = partySlotIndex !== -1 ? playerColors[partySlotIndex] : playerColors[player.partyIndex];

  const [isOpen, setIsOpen] = useState(false);

  const [totalDamage, totalDamageUnit] = humanizeNumbers(player.totalDamage);
  const [dps, dpsUnit] = humanizeNumbers(player.dps);

  const [cheatChecker, setCheatState] = useState({status: "", cheat: false});

  useEffect(() => {
    checkCheatingSimpleAsync(partyData[partySlotIndex]!);
  }, []);

  const checkCheatingSimpleAsync = async (player: PlayerData) => {
    const checkInfoes = checkCheating(player);
    const lastIndex = checkInfoes.length - 1;
    const checkStatus = checkInfoes[lastIndex];
    const CHEAT_WSTONE: string = "1";
    const CHEAT_SIGIL: string = "2";
    if (checkStatus === CHEAT_WSTONE){
      setCheatState(() => ({ status: "Cheat wStone", cheat: true }))
      return;
    }

    if (checkStatus === CHEAT_SIGIL){
      setCheatState(() => ({ status: "Cheat Sigil", cheat: true }))
      return;
    }
  };

  const matchColumnTypeToValue = (showFullValues: boolean, column: MeterColumns): ColumnValue => {
    switch (column) {
      case MeterColumns.TotalDamage:
        return showFullValues
          ? { value: player.totalDamage.toLocaleString() }
          : { value: totalDamage, unit: totalDamageUnit };
      case MeterColumns.DPS:
        return showFullValues ? { value: player.dps.toLocaleString() } : { value: dps, unit: dpsUnit };
      case MeterColumns.DamagePercentage:
        return { value: player.percentage.toFixed(0), unit: "%" };
      case MeterColumns.SBA:
        return showFullValues
          ? { value: (player.sba / 10).toFixed(2) }
          : { value: (player.sba / 10).toFixed(2), unit: "%" };
      default:
        return { value: "" };
    }
  };

  // If the meter is in live mode, only show the overlay columns that are enabled, otherwise show all columns.
  const columns = live ? overlay_columns : [MeterColumns.TotalDamage, MeterColumns.DPS, MeterColumns.DamagePercentage];

  return (
    <Fragment>
      <tr className={`player-row ${isOpen ? "transparent-bg" : ""}`} onClick={() => setIsOpen(!isOpen)}>
        <td className="text-left row-data">
          {translatedPlayerName(partySlotIndex, partyData[partySlotIndex], player, show_display_names)}

          {cheatChecker.cheat ? <span> ({cheatChecker.status})</span> :
            <span> (Ok)</span>}

        </td>
        {columns.map((column) => {
          const columnValue = matchColumnTypeToValue(show_full_values, column);

          return (
            <td key={column} className="text-center row-data">
              {show_full_values ? (
                columnValue.value
              ) : (
                <>
                  {columnValue.value}
                  <span className="unit font-sm">{columnValue.unit}</span>
                </>
              )}
            </td>
          );
        })}
        <td className="text-center row-button">{isOpen ? <CaretUp size={16} /> : <CaretDown size={16} />}</td>
        <div className="damage-bar" style={{ backgroundColor: color, width: `${player.percentage}%` }} />
      </tr>
      {isOpen && <SkillBreakdown player={player} color={color} setCheatState={setCheatState} playerData={partyData[partySlotIndex]} />}
    </Fragment>
  );
};

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
                      <td style={{ backgroundColor: 'red'}}>Empty(Cheat)</td>
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
                                  playerData,
                                }: {
  playerData: PlayerData | null;
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
  }, []);

  useEffect(() => {
    checkCheatingSimpleAsync(playerData!);
    const characterTypeResult = t(`characters:${playerData?.characterType}`, `ui:characters.${playerData?.characterType}`);
    setCharacterType(() => characterTypeResult);
  }, []);

  const checkCheatingSimpleAsync = async (player: PlayerData) => {
    const checkInfoes = checkCheating(player);
    const lastIndex = checkInfoes.length - 1;
    const checkStatus = checkInfoes[lastIndex];
    const CHEAT_WSTONE: string = "1";
    const CHEAT_SIGIL: string = "2";
    if (checkStatus === CHEAT_WSTONE){
      setCheatState(() => ({ status: "Cheat wStone", cheat: true }))
      return;
    }

    if (checkStatus === CHEAT_SIGIL){
      setCheatState(() => ({ status: "Cheat Sigil", cheat: true }))
      return;
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