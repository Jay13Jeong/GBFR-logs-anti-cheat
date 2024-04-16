import { useMeterSettingsStore } from "@/stores/useMeterSettingsStore";
import { CharacterType, ComputedPlayerState, ComputedSkillState, MeterColumns, PlayerData } from "@/types";
import {
  getSkillName,
  humanizeNumbers, toHashString,
  translatedPlayerName,
} from "@/utils";
import { CaretDown, CaretUp } from "@phosphor-icons/react";
import { Fragment, useEffect, useState } from "react";
import { useShallow } from "zustand/react/shallow";

type Props = {
  player: ComputedPlayerState;
  color: string;
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

const SkillBreakdown = ({ player, color }: Props) => {
  const totalDamage = player.skillBreakdown.reduce((acc, skill) => acc + skill.totalDamage, 0);
  const computedSkills = player.skillBreakdown.map((skill) => {
    return {
      percentage: (skill.totalDamage / totalDamage) * 100,
      ...skill,
    };
  });

  computedSkills.sort((a, b) => b.totalDamage - a.totalDamage);

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

  // const cheatChecker = useRecoilValue(cheatState);
  const [cheatChecker, setCheatState] = useState({status: "", cheat: false});

  useEffect(() => {
    checkCheatingSimpleAsync(partyData[partySlotIndex]!);
  }, []);

  const checkCheatingSimpleAsync = async (player: PlayerData) => {
    // invalid wrightstone level
    if ((player.weaponInfo?.trait1Level ?? 0) > 10) {
      setCheatState(() => ({ status: "op ws 1", cheat: true }))
      return;
    }
    if ((player.weaponInfo?.trait2Level ?? 0) > 7) {
      setCheatState(() => ({ status: "op ws 2", cheat: true }))
      return;
    }
    if ((player.weaponInfo?.trait3Level ?? 0) > 5) {
      setCheatState(() => ({ status: "op ws 3", cheat: true }))
      return;
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
      "57ab5b10",
    ];

    if (notAllowedWrightstone.includes(toHashString(player.weaponInfo?.trait1Id ?? 0))) {
      setCheatState(() => ({ status: "cheat ws 1", cheat: true }))
      return;
    }
    if (notAllowedWrightstone.includes(toHashString(player.weaponInfo?.trait2Id ?? 0))) {
      setCheatState(() => ({ status: "cheat ws 2", cheat: true }))
      return;
    }
    if (notAllowedWrightstone.includes(toHashString(player.weaponInfo?.trait3Id ?? 0))) {
      setCheatState(() => ({ status: "cheat ws 3", cheat: true }))
      return;
    }

    // check sigils
    for (const sigil of player.sigils) {
      if (sigil.firstTraitLevel > 15 || sigil.secondTraitLevel > 15 || sigil.sigilLevel > 15) {
        setCheatState(() => ({ status: "op sigil", cheat: true }))
        return;
      }
      const sigilTrait1 = toHashString(sigil.firstTraitId ?? 0);
      const sigilTrait2 = toHashString(sigil.secondTraitId ?? 0);

      const isLucySigil = sigilTrait1 === "dbe1d775" || sigilTrait1 === "8d2adb6e" || sigilTrait1 === "5c862e13";
      if (isLucySigil && sigilTrait2 !== "dc584f60") {
        setCheatState(() => ({ status: "cheat Lucy Sigil", cheat: true }))
        return;
      }

      const isWarElemental = sigilTrait1 === "4c588c27";
      if (isWarElemental && sigilTrait2 !== "887ae0b0") {
        setCheatState(() => ({ status: "cheat 2nd Sigil", cheat: true }))
        return;
      }
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
      {isOpen && <SkillBreakdown player={player} color={color} />}
    </Fragment>
  );
};
