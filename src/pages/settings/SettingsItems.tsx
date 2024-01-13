// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { MenuProps } from "antd";
import { HomeOutlined, BugOutlined, SettingOutlined, SearchOutlined } from "@ant-design/icons";
import { AccessibilityFilled } from "@comp/icons/AccessibilityFilled";

import { settingsSubGroup, booleanSetting, integerSetting, dropdownSetting, settingsGroup } from "./components/SettingsSubGroup.tsx";
import { getLessonSettingsGroup, getReviewSettingsGroup, getSelfStudySettingsGroup } from "./SettingsSessions";
import { getFontSettingsGroup } from "./fonts/SettingsFonts.tsx";

import { getAudioSettingsGroup } from "./audio/SettingsAudio.tsx";

import { reloadAssignments } from "@api";
import { getThemeSettingsGroup } from "./theme/SettingsTheme.tsx";
import { KanjiumAttribution } from "@layout/AttributionFooter.tsx";
import {
  PitchDiagramOnkaiShikiLegend,
  PitchDiagramSenShikiLegend
} from "@pages/subject/readings/PitchDiagramStyleLegend.tsx";

export const menuItems: NonNullable<MenuProps["items"]> = [
  // Display settings
  settingsGroup("Display settings", [
    // Site theme
    getThemeSettingsGroup(),

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
      dropdownSetting(
        "dashboardReviewChartCurve",
        "Curve type for the review chart's cumulative line",
        undefined,
        [
          { value: "monotone", label: "Curved (default)" },
          { value: "linear", label: "Straight" },
          { value: "step", label: "Stepped" }
        ]
      ),
      integerSetting("dashboardCriticalThreshold", "Review percentage correct for an item to be considered in " +
        "'critical condition'"),
      booleanSetting("dashboardReviewForecast12h", "Show review forecast dates in 12-hour format."),
      dropdownSetting(
        "dashboardReviewForecastGrouping",
        "Review forecast bar grouping",
        undefined,
        [
          { value: "total", label: "Total reviews (single bar)" },
          { value: "level_up", label: "Current-level radicals and kanji (green), other reviews (blue)" },
          { value: "type", label: "Radicals, kanji, and vocabulary" }
        ]
      ),
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
      booleanSetting("pitchAccentEnabled", "Show pitch accent diagrams on vocabulary pages", <KanjiumAttribution />),
      dropdownSetting(
        "pitchAccentDiagramStyle",
        "Pitch accent diagram style",
        undefined,
        [
          { value: "onkai-shiki", label: <PitchDiagramOnkaiShikiLegend /> },
          { value: "sen-shiki", label: <PitchDiagramSenShikiLegend /> },
        ]
      )
    ]),

    // Font settings
    getFontSettingsGroup()
  ]),

  // Session settings
  settingsGroup("Session settings", [
    // General session settings
    settingsSubGroup("General session settings", <SettingOutlined />, [
      dropdownSetting(
        "questionHeaderTypeColor",
        "Colors of the 'Meaning/Reading' header on questions",
        undefined,
        [
          { value: "DEFAULT", label: "White meaning, black reading (default)" },
          { value: "DEFAULT_HIGH_CONTRAST", label: "High contrast white meaning, black reading" },
          { value: "INVERTED", label: "Black meaning, white reading" },
          { value: "INVERTED_HIGH_CONTRAST", label: "High contrast black meaning, white reading" },
        ]
      ),
      booleanSetting("shakeCharactersIncorrect", "Shake the subject characters on an incorrect answer"),
      booleanSetting("hideHintsOnIncorrect", "Hide all hints when getting an answer incorrect or clicking 'Don't know'"),
      booleanSetting("hideSrsStage", "Hide the current SRS stage on the question header"),
      booleanSetting("skipEnabled", "Allow skipping questions"),
      dropdownSetting(
        "skipType",
        "Question skip behavior",
        undefined,
        [
          { value: "DELAY", label: "Put the question back into the queue and delay" },
          { value: "PUT_END", label: "Put the subject back to the end of the queue" },
          { value: "REMOVE", label: "Remove the subject from the session entirely" }
        ]
      ),
      booleanSetting("skipShortcut", "Allow skipping questions via the keyboard"),
      booleanSetting("skipNotification", "Show a notification when skipping via the keyboard"),
      dropdownSetting(
        "undoEnabled",
        "Undo button",
        undefined,
        [
          { value: "ENABLED", label: "Undo button and shortcut are enabled" },
          { value: "DISABLED", label: "Undo button and shortcut are disabled" },
          { value: "HIDDEN", label: "Undo button is hidden and shortcut is disabled" }
        ]
      ),
      dropdownSetting(
        "nearMatchAction",
        "What to do when an answer is close but not quite correct",
        undefined,
        [
          { value: "ACCEPT", label: "Silently accept the answer" },
          { value: "ACCEPT_NOTIFY", label: "Accept the answer and show a message" },
          { value: "RETRY", label: "Reject the answer but shake the textbox to try again" },
          { value: "REJECT", label: "Reject the answer" },
        ]
      ),
      booleanSetting("sessionProgressBar", "Show the session progress bar"),
      booleanSetting("sessionProgressStarted", "Show in-progress questions in the session progress bar"),
      booleanSetting("sessionProgressSkipped", "Show skipped questions in the session progress bar"),
      integerSetting("sessionEnterDebounce", "Debounce time for a double Enter keypress in milliseconds",
        "Set to 0 to disable debouncing."),
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
