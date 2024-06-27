import { ActionIcon, Menu, Tooltip } from "@mantine/core";
import { Camera, ClipboardText, Minus, PushPinSimple } from "@phosphor-icons/react";
import { invoke } from "@tauri-apps/api";
import { appWindow } from "@tauri-apps/api/window";
import { Fragment, useCallback } from "react";
import { useTranslation } from "react-i18next";

import getVersion from "@/hooks/getVersion";
import { EncounterState, PlayerData, SortDirection, SortType } from "@/types";
import {
  exportFullEncounterToClipboard,
  exportScreenshotToClipboard,
  exportSimpleEncounterToClipboard,
  humanizeNumbers,
  millisecondsToElapsedFormat,
} from "@/utils";

const TeamDamageStats = ({ encounterState }: { encounterState: EncounterState }) => {
  const [teamDps, dpsUnit] = humanizeNumbers(encounterState.dps);
  const [totalTeamDmg, dmgUnit] = humanizeNumbers(encounterState.totalDamage);

  return (
    <Fragment>
      <div data-tauri-drag-region className="encounter-totalDamage item">
        - {totalTeamDmg}
        <span className="unit font-sm">{dmgUnit} -</span>
      </div>
      <div data-tauri-drag-region className="encounter-totalDps item">
        {teamDps}
        <span className="unit font-sm">{dpsUnit}/s</span>
      </div>
    </Fragment>
  );
};

const EncounterStatus = ({ encounterState, elapsedTime }: { encounterState: EncounterState; elapsedTime: number }) => {
  if (encounterState.status === "Waiting") {
    return (
      <div data-tauri-drag-region className="encounter-status item">
        {encounterState.status}..
      </div>
    );
  } else if (encounterState.status === "InProgress") {
    return (
      <Fragment>
        <div data-tauri-drag-region className="encounter-elapsedTime item">
          {millisecondsToElapsedFormat(elapsedTime)}
        </div>
      </Fragment>
    );
  } else if (encounterState.status === "Stopped") {
    return (
      <Fragment>
        <div data-tauri-drag-region className="encounter-elapsedTime item">
          {millisecondsToElapsedFormat(encounterState.endTime - encounterState.startTime)}
        </div>
      </Fragment>
    );
  }
};

export const Titlebar = ({
  encounterState,
  partyData,
  elapsedTime,
  sortType,
  sortDirection,
}: {
  encounterState: EncounterState;
  partyData: Array<PlayerData | null>;
  elapsedTime: number;
  sortType: SortType;
  sortDirection: SortDirection;
}) => {
  const { t } = useTranslation();
  const { version } = getVersion();

  const onMinimize = () => {
    appWindow.minimize();
  };
  const onPin = () => {
    invoke("toggle_always_on_top");
  };

  const handleSimpleEncounterCopy = useCallback(() => {
    exportSimpleEncounterToClipboard(sortType, sortDirection, encounterState, partyData);
  }, [encounterState]);

  const handleFullEncounterCopy = useCallback(() => {
    exportFullEncounterToClipboard(sortType, sortDirection, encounterState, partyData);
  }, [encounterState]);

  return (
    <div data-tauri-drag-region className="titlebar transparent-bg font-sm">
      <div data-tauri-drag-region className="titlebar-left">
        <div data-tauri-drag-region className="version">
          GBFR Cheat Detector <span className="version-number">{version}</span>
        </div>
        {encounterState.totalDamage > 0 && <TeamDamageStats encounterState={encounterState} />}
      </div>
      <div data-tauri-drag-region className="titlebar-right">
        <EncounterStatus encounterState={encounterState} elapsedTime={elapsedTime} />
        <Menu shadow="md" trigger="hover" openDelay={100} closeDelay={400}>
          <Menu.Target>
            <ActionIcon aria-label="Clipboard" variant="transparent" color="light">
              <ClipboardText size={16} />
            </ActionIcon>
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Item onClick={handleSimpleEncounterCopy}>{t("ui.copy-to-clipboard-simple")}</Menu.Item>
            <Menu.Item onClick={handleFullEncounterCopy}>{t("ui.copy-to-clipboard-full")}</Menu.Item>
          </Menu.Dropdown>
        </Menu>
        <Tooltip label="Pin window" color="dark">
          <div className="titlebar-button" id="titlebar-snapshot" onClick={onPin}>
            <PushPinSimple size={16} />
          </div>
        </Tooltip>
        <Tooltip label="Copy screenshot to clipboard" color="dark">
          <div className="titlebar-button" id="titlebar-snapshot" onClick={() => exportScreenshotToClipboard(".app")}>
            <Camera size={16} />
          </div>
        </Tooltip>
        <div className="titlebar-button" id="titlebar-minimize" onClick={onMinimize}>
          <Minus size={16} />
        </div>
      </div>
    </div>
  );
};
