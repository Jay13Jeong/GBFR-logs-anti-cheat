import html2canvas from "html2canvas";
import toast from "react-hot-toast";
import {
  ComputedPlayerData,
  EncounterState,
  CharacterType,
  ComputedSkillState,
} from "./types";
import { t } from "i18next";

export const getSkillName = (
  characterType: CharacterType,
  skill: ComputedSkillState
) => {
  switch (true) {
    case skill.actionType === "LinkAttack":
      return t([
        `skills.${characterType}.link-attack`,
        "skills.default.link-attack",
      ]);
    case skill.actionType === "SBA":
      return t([
        `skills.${characterType}.skybound-arts`,
        "skills.default.skybound-arts",
      ]);
    case skill.actionType.hasOwnProperty("DamageOverTime"):
      return t([
        `skills.${skill.childCharacterType}.damage-over-time`,
        `skills.${characterType}.damage-over-time`,
        "skills.default.damage-over-time",
      ]);
    case skill.actionType.hasOwnProperty("Normal"):
      let actionType = skill.actionType as { Normal: number };
      let skillID = actionType["Normal"];
      return t(
        [
          `skills.${skill.childCharacterType}.${skillID}`,
          `skills.${characterType}.${skillID}`,
          `skills.default.${skillID}`,
          `skills.default.unknown-skill`,
        ],
        { id: skillID }
      );
    default:
      return t("ui.unknown");
  }
};
const tryParseInt = (intString: string | number, defaultValue = 0) => {
  if (typeof intString === "number") {
    if (isNaN(intString)) return defaultValue;
    return intString;
  }

  let intNum;

  try {
    intNum = parseInt(intString);
    if (isNaN(intNum)) intNum = defaultValue;
  } catch {
    intNum = defaultValue;
  }

  return intNum;
};

// Takes a number and returns a shortened version of it that is friendlier to read.
// For example, 1200 would be returned as 1.2k, 1200000 as 1.2m, and so on.
export const humanizeNumbers = (n: number) => {
  if (n >= 1e3 && n < 1e6) return [+(n / 1e3).toFixed(1), "k"];
  if (n >= 1e6 && n < 1e9) return [+(n / 1e6).toFixed(1), "m"];
  if (n >= 1e9 && n < 1e12) return [+(n / 1e9).toFixed(1), "b"];
  if (n >= 1e12) return [+(n / 1e12).toFixed(1), "t"];
  else return [tryParseInt(n).toFixed(0), ""];
};

export const millisecondsToElapsedFormat = (ms: number): string => {
  const date = new Date(Date.UTC(0, 0, 0, 0, 0, 0, ms));
  return `${date.getUTCMinutes().toString().padStart(2, "0")}:${date
    .getUTCSeconds()
    .toString()
    .padStart(2, "0")}`;
};

export const exportScreenshotToClipboard = () => {
  const app = document.querySelector(".app") as HTMLElement;

  html2canvas(app, {
    backgroundColor: "transparent",
  }).then((canvas) => {
    canvas.toBlob((blob) => {
      if (blob) {
        const item = new ClipboardItem({ "image/png": blob });
        navigator.clipboard.write([item]).then(() => {
          toast.success("Screenshot copied to clipboard!");
        });
      }
    });
  });
};

export const exportEncounterToClipboard = (encounterState: EncounterState) => {
  let playerHeader = `Name,DMG,DPS,%`;
  let players: Array<ComputedPlayerData> = Object.keys(
    encounterState.party
  ).map((key) => {
    let playerData = encounterState.party[key];

    return {
      percentage: (playerData.totalDamage / encounterState.totalDamage) * 100,
      ...playerData,
    };
  });

  players.sort((a, b) => b.totalDamage - a.totalDamage);

  let playerData = players
    .map((player) => {
      const totalDamage = player.skills.reduce(
        (acc, skill) => acc + skill.totalDamage,
        0
      );
      const computedSkills = player.skills.map((skill) => {
        return {
          percentage: (skill.totalDamage / totalDamage) * 100,
          ...skill,
        };
      });

      computedSkills.sort((a, b) => b.totalDamage - a.totalDamage);

      let playerLine = [
        t(`characters.${player.characterType}`) + "#" + player.index,
        player.totalDamage,
        Math.round(player.dps),
        player.percentage,
      ].join(",");

      let skillHeader = [
        "Skill",
        "Hits",
        "Total",
        "Min",
        "Max",
        "Avg",
        "%",
      ].join(",");

      let skillLine = computedSkills
        .map((skill) => {
          let skillName = getSkillName(player.characterType, skill);
          let averageHit =
            skill.hits === 0 ? 0 : skill.totalDamage / skill.hits;

          return [
            skillName,
            skill.hits,
            skill.totalDamage,
            skill.minDamage,
            skill.maxDamage,
            Math.round(averageHit),
            skill.percentage.toFixed(2),
          ].join(",");
        })
        .join("\n");

      return [playerHeader, playerLine, skillHeader, skillLine].join("\n");
    })
    .join("\n\n");

  navigator.clipboard.writeText(playerData).then(() => {
    toast.success("Copied text to clipboard!");
  });
};
