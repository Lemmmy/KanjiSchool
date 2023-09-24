// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Menu, MenuProps } from "antd";
import { HomeOutlined, BugOutlined, SettingOutlined, BgColorsOutlined, SearchOutlined } from "@ant-design/icons";
import { AccessibilityFilled } from "@comp/icons/AccessibilityFilled";

import { PageLayout } from "@layout/PageLayout";
import { menuClass } from "./components/settingsStyles.ts";
import { settingsSubGroup, booleanSetting, integerSetting, dropdownSetting, settingsGroup } from "./components/SettingsSubGroup.tsx";
import { getLessonSettingsGroup, getReviewSettingsGroup, getSelfStudySettingsGroup } from "./SettingsSessions";
import { getFontSettingsGroup } from "./fonts/SettingsFonts.tsx";

import { SettingsBackupButtons } from "./backup/SettingsBackupButtons.tsx";
import { SettingsUserInfo } from "./SettingsUserInfo.tsx";
import { getAudioSettingsGroup } from "./SettingsAudio.tsx";

import { reloadAssignments } from "@api";

const themeNames = [
  { value: "dark", label: "Dark (default)" },
  { value: "light", label: "Light" }
];

const paletteNames = [
  { value: "kanjiSchool", label: "KanjiSchool (default)" },
  { value: "fdLight", label: "FD light palette" },
  { value: "fdDark", label: "FD dark palette" }
];

const reviewForecastGroupingSettings = [
  { value: "total", label: "Total reviews (single bar)" },
  { value: "level_up", label: "Current-level radicals and kanji (green), other reviews (blue)" },
  { value: "type", label: "Radicals, kanji, and vocabulary" }
];

const skipTypes = [
  { value: "DELAY", label: "Put the question back into the queue and delay" },
  { value: "PUT_END", label: "Put the subject back to the end of the queue" },
  { value: "REMOVE", label: "Remove the subject from the session entirely" }
];

const undoTypes = [
  { value: "ENABLED", label: "Undo button and shortcut are enabled" },
  { value: "DISABLED", label: "Undo button and shortcut are disabled" },
  { value: "HIDDEN", label: "Undo button is hidden and shortcut is disabled" }
];

const questionHeaderTypeColors = [
  { value: "DEFAULT", label: "White meaning, black reading (default)" },
  { value: "DEFAULT_HIGH_CONTRAST", label: "High contrast white meaning, black reading" },
  { value: "INVERTED", label: "Black meaning, white reading" },
  { value: "INVERTED_HIGH_CONTRAST", label: "High contrast black meaning, white reading" },
];

const nearMatchActions = [
  { value: "ACCEPT", label: "Silently accept the answer" },
  { value: "ACCEPT_NOTIFY", label: "Accept the answer and show a message" },
  { value: "RETRY", label: "Reject the answer but shake the textbox to try again" },
  { value: "REJECT", label: "Reject the answer" },
];

const menuItems: MenuProps["items"] = [
  // Display settings
  settingsGroup("Display settings", [
    // Site theme
    settingsSubGroup("Site theme", <BgColorsOutlined />, [
      dropdownSetting("siteTheme", "Site color theme", undefined, themeNames),
      dropdownSetting("sitePalette", "Color palette for SRS stages and subject types", undefined, paletteNames)
      // TODO: Color palette previews
    ]),

    // Accessibility
    settingsSubGroup("Accessibility", <AccessibilityFilled />, [
      booleanSetting("preferReducedMotion", "Prefer reduced motion", "Disable some animations, such as transitions " +
        "during sessions. The browser or operating system settings may override this."),
    ]),

    // Dashboard settings
    settingsSubGroup("Dashboard settings", <HomeOutlined />, [
      booleanSetting("dashboardCurrentStreak", "Show the current streak on the dashboard"),
      booleanSetting("dashboardLevelProgressPassed", "Include passed levels in the level progress bars"),
      booleanSetting(
        "dashboardReviewForecastNow",
        "Include reviews made available before now in the upcoming reviews chart and reviews forecast",
        "This may be useful if you have a large number of reviews, but still want to see upcoming reviews clearly.",
        () => reloadAssignments()
      ),
      integerSetting("dashboardReviewChartDays", "Number of days to show in the reviews chart"),
      integerSetting("dashboardCriticalThreshold", "Review percentage correct for an item to be considered in " +
        "'critical condition'"),
      booleanSetting("dashboardReviewForecast12h", "Show review forecast dates in 12-hour format."),
      dropdownSetting("dashboardReviewForecastGrouping", "Review forecast bar grouping", undefined,
        reviewForecastGroupingSettings),
      booleanSetting("dashboardAccuracyReadingFirst", "Show reading before meaning in the review accuracy card"),
      booleanSetting("dashboardLastSessionSummary", "Show last session summary"),
      booleanSetting("dashboardLastSessionExpand", "Always expand correct/incorrect answers in the last session summary"),
      booleanSetting("reviewHeatmapJa", "Show review heatmap labels in Japanese"),
      booleanSetting("reviewHeatmapMonthSep", "Show month separators in the review heatmap"),
      booleanSetting("reviewHeatmapIncludeFuture", "Show upcoming reviews in the review heatmap")
    ]),

    // Subject info settings
    settingsSubGroup("Subject info settings", <SettingOutlined />, [
      booleanSetting("subjectOnyomiReadingsKatakana", "Show on'yomi readings in katakana"),
      booleanSetting("subjectCharactersUseCharBlocks", "Color hiragana and katakana separately in vocabulary words"),
    ]),

    // Font settings
    getFontSettingsGroup()
  ]),

  // Session settings
  settingsGroup("Session settings", [
    // General session settings
    settingsSubGroup("General session settings", <SettingOutlined />, [
      dropdownSetting("questionHeaderTypeColor", "Colors of the 'Meaning/Reading' header on questions", undefined,
        questionHeaderTypeColors),
      booleanSetting("shakeCharactersIncorrect", "Shake the subject characters on an incorrect answer"),
      booleanSetting("hideHintsOnIncorrect", "Hide all hints when getting an answer incorrect or clicking 'Don't know'"),
      booleanSetting("skipEnabled", "Allow skipping questions"),
      dropdownSetting("skipType", "Question skip behavior", undefined, skipTypes),
      booleanSetting("skipShortcut", "Allow skipping questions via the keyboard"),
      booleanSetting("skipNotification", "Show a notification when skipping via the keyboard"),
      dropdownSetting("undoEnabled", "Undo button", undefined, undoTypes),
      dropdownSetting("nearMatchAction", "What to do when an answer is close but not quite correct", undefined,
        nearMatchActions),
      booleanSetting("sessionProgressBar", "Show the session progress bar"),
      booleanSetting("sessionProgressStarted", "Show in-progress questions in the session progress bar"),
      booleanSetting("sessionProgressSkipped", "Show skipped questions in the session progress bar"),
    ]),

    // Lesson settings
    getLessonSettingsGroup(),

    // Review settings
    getReviewSettingsGroup(),

    // Self-study settings
    getSelfStudySettingsGroup(),

    // Audio settings
    getAudioSettingsGroup(),

    // Search settings
    settingsSubGroup("Search settings", <SearchOutlined />, [
      booleanSetting("searchAlwaysHandwriting", "Always open the handwriting input when searching"),
      booleanSetting("sessionDisableSearch", "Disable the search box when in a session")
    ]),
  ]),

  // Advanced settings
  settingsGroup("Advanced settings", [
    // Debug settings
    settingsSubGroup("Debug settings", <BugOutlined />, [
      booleanSetting("sessionInfoDebug", "Show debug info during a session"),
      booleanSetting("subjectInfoDebug", "Show debug settings in the subject info screen")
    ])
  ])
];

function SettingsPage(): JSX.Element {
  return <PageLayout
    contentsClassName="max-w-[960px] mx-auto md:pt-md"
    headerClassName="max-w-[960px] mx-auto"
    siteTitle="Settings"
    title="Settings"
  >
    {/* User info */}
    <SettingsUserInfo />

    {/* Import/export buttons */}
    <SettingsBackupButtons />

    {/* Main settings menu */}
    <Menu
      mode="inline"
      className={menuClass}
      selectable={false}
      items={menuItems}
    />

    {/* Page contents margin/spacer */}
    <div className="h-lg" />
  </PageLayout>;
}

export const Component = SettingsPage;
