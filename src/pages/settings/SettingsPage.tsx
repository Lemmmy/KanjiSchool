// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Menu } from "antd";
import { HomeOutlined, BugOutlined, SettingOutlined, BgColorsOutlined, SearchOutlined } from "@ant-design/icons";
import { AccessibilityFilled } from "@comp/icons/AccessibilityFilled";

import { PageLayout } from "@layout/PageLayout";
import { getSettingsGroup, booleanSetting, integerSetting, dropdownSetting } from "./SettingsGroup";
import { getLessonSettingsGroup, getReviewSettingsGroup, getSelfStudySettingsGroup } from "./SettingsSessions";
import { getFontSettingsGroup } from "./SettingsFonts";

import { SettingsButtonRow } from "./ButtonRow";
import { StorageUsageCard } from "./StorageUsageCard";

const THEME_NAMES = [
  { value: "dark", label: "Dark (default)" },
  { value: "light", label: "Light" }
];
const PALETTE_NAMES = [
  { value: "kanjiSchool", label: "KanjiSchool (default)" },
  { value: "fdLight", label: "FD light palette" },
  { value: "fdDark", label: "FD dark palette" }
];

const DASHBOARD_REVIEW_FORECAST_GROUPING_SETTINGS = [
  { value: "total", label: "Total reviews (single bar)" },
  { value: "level_up", label: "Current-level radicals and kanji (green), other reviews (blue)" },
  { value: "type", label: "Radicals, kanji, and vocabulary" }
];

const SKIP_TYPES = [
  { value: "DELAY", label: "Put the question back into the queue and delay" },
  { value: "PUT_END", label: "Put the subject back to the end of the queue" },
  { value: "REMOVE", label: "Remove the subject from the session entirely" }
];

const UNDO_TYPES = [
  { value: "ENABLED", label: "Undo button and shortcut are enabled" },
  { value: "DISABLED", label: "Undo button and shortcut are disabled" },
  { value: "HIDDEN", label: "Undo button is hidden and shortcut is disabled" }
];

const QUESTION_HEADER_TYPE_COLORS = [
  { value: "DEFAULT", label: "White meaning, black reading (default)" },
  { value: "DEFAULT_HIGH_CONTRAST", label: "High contrast white meaning, black reading" },
  { value: "INVERTED", label: "Black meaning, white reading" },
  { value: "INVERTED_HIGH_CONTRAST", label: "High contrast black meaning, white reading" },
];

const NEAR_MATCH_ACTIONS = [
  { value: "ACCEPT", label: "Silently accept the answer" },
  { value: "ACCEPT_NOTIFY", label: "Accept the answer and show a message" },
  { value: "RETRY", label: "Reject the answer but shake the textbox to try again" },
  { value: "REJECT", label: "Reject the answer" },
];

function SettingsPage(): JSX.Element {
  return <PageLayout
    className="settings-page"
    siteTitle="Settings"
    title="Settings"
  >
    <Menu mode="inline" className="big-menu" selectable={false}>
      {/* Display settings */}
      <Menu.ItemGroup key="group-display" title="Display settings">
        {getSettingsGroup(
          "Site theme",
          <BgColorsOutlined />,
          [
            dropdownSetting("siteTheme", "Site color theme", undefined, THEME_NAMES),
            dropdownSetting("sitePalette", "Color palette for SRS stages and subject types", undefined, PALETTE_NAMES)
          ]
          // TODO: Color palette previews
        )}

        {getSettingsGroup(
          "Accessibility",
          <AccessibilityFilled />,
          [
            booleanSetting("preferReducedMotion", "Prefer reduced motion", "Disable some animations, such as transitions during sessions. The browser or operating system settings may override this."),
          ]
          // TODO: Color palette previews
        )}

        {getSettingsGroup(
          "Dashboard settings",
          <HomeOutlined />,
          [
            booleanSetting("dashboardCurrentStreak", "Show the current streak on the dashboard"),
            booleanSetting("dashboardLevelProgressPassed", "Include passed levels in the level progress bars"),
            integerSetting("dashboardReviewChartDays", "Number of days to show in the reviews chart"),
            integerSetting("dashboardCriticalThreshold", "Review percentage correct for an item to be considered in 'critical condition'"),
            booleanSetting("dashboardReviewForecast12h", "Show review forecast dates in 12-hour format."),
            dropdownSetting("dashboardReviewForecastGrouping", "Review forecast bar grouping", undefined, DASHBOARD_REVIEW_FORECAST_GROUPING_SETTINGS),
            booleanSetting("dashboardAccuracyReadingFirst", "Show reading before meaning in the review accuracy card"),
            booleanSetting("dashboardLastSessionSummary", "Show last session summary"),
            booleanSetting("dashboardLastSessionExpand", "Always expand correct/incorrect answers in the last session summary"),
            booleanSetting("reviewHeatmapJa", "Show review heatmap labels in Japanese"),
            booleanSetting("reviewHeatmapMonthSep", "Show month separators in the review heatmap"),
            booleanSetting("reviewHeatmapIncludeFuture", "Show upcoming reviews in the review heatmap")
          ]
        )}

        {getFontSettingsGroup()}
      </Menu.ItemGroup>

      <Menu.ItemGroup key="group-session" title="Session settings">
        {getSettingsGroup(
          "General session settings",
          <SettingOutlined />,
          [
            dropdownSetting("questionHeaderTypeColor", "Colors of the 'Meaning/Reading' header on questions", undefined, QUESTION_HEADER_TYPE_COLORS),
            booleanSetting("shakeCharactersIncorrect", "Shake the subject characters on an incorrect answer"),
            booleanSetting("hideHintsOnIncorrect", "Hide all hints when getting an answer incorrect or clicking 'Don't know'"),
            booleanSetting("skipEnabled", "Allow skipping questions"),
            dropdownSetting("skipType", "Question skip behavior", undefined, SKIP_TYPES),
            booleanSetting("skipShortcut", "Allow skipping questions via the keyboard"),
            booleanSetting("skipNotification", "Show a notification when skipping via the keyboard"),
            dropdownSetting("undoEnabled", "Undo button", undefined, UNDO_TYPES),
            dropdownSetting("nearMatchAction", "What to do when an answer is close but not quite correct", undefined, NEAR_MATCH_ACTIONS),
            booleanSetting("sessionProgressBar", "Show the session progress bar"),
            booleanSetting("sessionProgressStarted", "Show in-progress questions in the session progress bar"),
            booleanSetting("sessionProgressSkipped", "Show skipped questions in the session progress bar"),
            integerSetting("audioFetchMax", "Max. # of audio fetch tasks at session start"),
          ]
        )}

        {getLessonSettingsGroup()}
        {getReviewSettingsGroup()}
        {getSelfStudySettingsGroup()}

        {getSettingsGroup(
          "Subject info settings",
          <SettingOutlined />,
          [
            booleanSetting("subjectOnyomiReadingsKatakana", "Show on'yomi readings in katakana"),
            booleanSetting("subjectCharactersUseCharBlocks", "Color hiragana and katakana separately in vocabulary words"),
          ]
        )}
      </Menu.ItemGroup>

      <Menu.ItemGroup key="group-advanced" title="Advanced settings">
        {getSettingsGroup(
          "Search settings",
          <SearchOutlined />,
          [
            booleanSetting("searchAlwaysHandwriting", "Always open the handwriting input when searching"),
            booleanSetting("sessionDisableSearch", "Disable the search box when in a session"),
          ]
        )}

        {getSettingsGroup(
          "Debug settings",
          <BugOutlined />,
          [
            booleanSetting("sessionInfoDebug", "Show debug info during a session"),
            booleanSetting("subjectInfoDebug", "Show debug settings in the subject info screen")
          ]
        )}
      </Menu.ItemGroup>
    </Menu>

    {/* Log out button, import/export buttons */}
    <SettingsButtonRow />

    {/* Storage estimate */}
    <StorageUsageCard />
  </PageLayout>;
}

export const Component = SettingsPage;
