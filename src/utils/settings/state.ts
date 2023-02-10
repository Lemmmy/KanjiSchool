// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ThemeName, PaletteName } from "@global/theme";
import { ReviewForecastGrouping } from "@pages/dashboard/review-forecast/ReviewForecastCard";
import { QuestionHeaderTypeColor } from "@pages/session/SessionQuestionHeader";
import { SkipType, UndoType } from "@session";
import { LessonOrder } from "@session/order/LessonOrder";
import { ReviewOrder } from "@session/order/ReviewOrder";
import { SessionPriority } from "@session/order/SessionPriority";
import { NearMatchAction } from "@utils";

import { AnySettingName, IntegerSettingConfig } from ".";

export interface SettingsStateBase {
  // ===========================================================================
  // DISPLAY SETTINGS
  // ===========================================================================
  /** Site color theme */
  siteTheme: ThemeName;
  /** Color palette for SRS stages and subject types */
  sitePalette: PaletteName;

  // ===========================================================================
  // ACCESSIBILITY SETTINGS
  // ===========================================================================
  /** Remove some animations. The browser setting may override this  */
  preferReducedMotion: boolean;

  // ===========================================================================
  // DASHBOARD SETTINGS
  // ===========================================================================
  /** Show the current streak on the dashboard. */
  dashboardCurrentStreak: boolean;
  /** Include passed levels in the level progress bars. */
  dashboardLevelProgressPassed: boolean;
  /** Number of days to show in the reviews chart. */
  dashboardReviewChartDays: number;
  /** Show the review stats row (new unlocks, burned items, etc.). */
  dashboardReviewStatsRow: boolean;
  /** Review percentage correct for an item to be considered in 'critical
   * condition'. */
  dashboardCriticalThreshold: number;
  /** Show review forecast dates in 12-hour format. */
  dashboardReviewForecast12h: boolean;
  /** Review forecast bar grouping */
  dashboardReviewForecastGrouping: ReviewForecastGrouping;
  /** Show the JLPT and Jōyō kanji row. */
  dashboardJlptJoyoRow: boolean;
  /** Show the level progress and accuracy row. */
  dashboardLevelProgressRow: boolean;
  /** Show the level progress item types in Japanese. */
  dashboardLevelProgressJa: boolean;
  /** Show reading before meaning in the review accuracy card. */
  dashboardAccuracyReadingFirst: boolean;
  /** Show the last session summary on the dashboard. */
  dashboardLastSessionSummary: boolean;
  /** Always expand correct/incorrect answers in the last session summary. */
  dashboardLastSessionExpand: boolean;
  /** Show review heatmap labels in Japanese. */
  reviewHeatmapJa: boolean;
  /** Show month separators in the review heatmap. */
  reviewHeatmapMonthSep: boolean;
  /** Show upcoming reviews in the review heatmap. */
  reviewHeatmapIncludeFuture: boolean;

  // ===========================================================================
  // FONT SETTINGS
  // ===========================================================================
  /** Use a random font in reviews. */
  randomFontEnabled: boolean;
  /** Show the default font when hovering over a random font. */
  randomFontHover: boolean;
  /** Show a different random font for reading/meaning questions. */
  randomFontSeparateReadingMeaning: boolean;
  /** Show the random font name. */
  randomFontShowName: boolean;

  // ===========================================================================
  // SUBJECT INFO SETTINGS
  // ===========================================================================
  /** Show on'yomi readings in katakana. */
  subjectOnyomiReadingsKatakana: boolean;
  /** Color hiragana and katakana separately in vocabulary words. */
  subjectCharactersUseCharBlocks: boolean;

  // ===========================================================================
  // GENERAL SESSION SETTINGS
  // ===========================================================================
  /** Colors of the 'Meaning/Reading' header on questions. */
  questionHeaderTypeColor: QuestionHeaderTypeColor;
  /** Shake the subject characters on an incorrect answer. */
  shakeCharactersIncorrect: boolean;
  /** Hide all hints when getting an answer incorrect or clicking
   * 'Don't know'. */
  hideHintsOnIncorrect: boolean;
  /** Allow skipping questions. */
  skipEnabled: boolean;
  /** Question skip behavior */
  skipType: SkipType;
  /** Allow skipping questions via the keyboard. */
  skipShortcut: boolean;
  /** Show a notification when skipping via the keyboard. */
  skipNotification: boolean;
  /** Allow undoing incorrect answers. */
  undoEnabled: UndoType;
  /** What to do when an answer is close but not quite correct. */
  nearMatchAction: NearMatchAction;
  /** Show the session progress bar. */
  sessionProgressBar: boolean;
  /** Show in-progress questions in the session progress bar. */
  sessionProgressStarted: boolean;
  /** Show skipped questions in the session progress bar. */
  sessionProgressSkipped: boolean;
  /** Max. # of audio fetch tasks at session start. */
  audioFetchMax: number;

  // ===========================================================================
  // LESSON SETTINGS
  // ===========================================================================
  lessonMeaningReadingBackToBack: boolean;
  lessonReadingFirst: boolean;
  lessonMeaningFirst: boolean;
  lessonOrder: LessonOrder;
  lessonOrderReversed: boolean;
  lessonOrderPriority: SessionPriority;
  lessonShuffleAfterSelection: boolean;
  lessonMaxSize: number;
  lessonMaxStarted: number;

  // ===========================================================================
  // REVIEW SETTINGS
  // ===========================================================================
  reviewMeaningReadingBackToBack: boolean;
  reviewReadingFirst: boolean;
  reviewMeaningFirst: boolean;
  reviewOrder: ReviewOrder;
  reviewOrderReversed: boolean;
  reviewOrderPriority: SessionPriority;
  reviewOverdueFirst: boolean;
  reviewShuffleAfterSelection: boolean;
  reviewMaxSize: number;
  reviewMaxStarted: number;

  // ===========================================================================
  // SELF-STUDY SETTINGS
  // ===========================================================================
  selfStudyMeaningReadingBackToBack: boolean;
  selfStudyReadingFirst: boolean;
  selfStudyMeaningFirst: boolean;
  selfStudyOrder: ReviewOrder;
  selfStudyOrderReversed: boolean;
  selfStudyOrderPriority: SessionPriority;
  selfStudyOverdueFirst: boolean;
  selfStudyShuffleAfterSelection: boolean;
  selfStudyMaxSize: number;
  selfStudyMaxStarted: number;
  /** Show subject lessons during a self-study session. */
  selfStudyWithLessons: boolean;

  // ===========================================================================
  // SEARCH SETTINGS
  // ===========================================================================
  /** Always open the handwriting input when searching. */
  searchAlwaysHandwriting: boolean;
  /** Disable the search box when in a session. */
  sessionDisableSearch: boolean;

  // ===========================================================================
  // OTHER ADVANCED SETTINGS
  // ===========================================================================
  /** Threshold (percent) for when to consider an item overdue. */
  overdueThreshold: number;

  // ===========================================================================
  // DEBUG SETTINGS
  // ===========================================================================
  /** Show debug info during a session. */
  sessionInfoDebug: boolean;
  /** Show debug settings in the subject info screen. */
  subjectInfoDebug: boolean;
}

export type SettingsState = Readonly<SettingsStateBase>;

export const DEFAULT_SETTINGS: SettingsState = {
  siteTheme: "dark",
  sitePalette: "kanjiSchool",

  preferReducedMotion: false,

  dashboardCurrentStreak: true,
  dashboardLevelProgressPassed: true,
  dashboardReviewChartDays: 2,
  dashboardCriticalThreshold: 75,
  dashboardReviewStatsRow: true,
  dashboardReviewForecast12h: false,
  dashboardReviewForecastGrouping: "level_up",
  dashboardJlptJoyoRow: true,
  dashboardLevelProgressRow: true,
  dashboardLevelProgressJa: true,
  dashboardAccuracyReadingFirst: false,
  dashboardLastSessionSummary: true,
  dashboardLastSessionExpand: true,
  reviewHeatmapJa: true,
  reviewHeatmapMonthSep: true,
  reviewHeatmapIncludeFuture: true,

  randomFontEnabled: false,
  randomFontHover: true,
  randomFontSeparateReadingMeaning: true,
  randomFontShowName: false,

  subjectOnyomiReadingsKatakana: true,
  subjectCharactersUseCharBlocks: false,

  questionHeaderTypeColor: "DEFAULT",
  shakeCharactersIncorrect: true,
  hideHintsOnIncorrect: false,
  skipEnabled: true,
  skipType: "PUT_END",
  skipShortcut: true,
  skipNotification: true,
  undoEnabled: "ENABLED",
  nearMatchAction: "ACCEPT_NOTIFY",
  sessionProgressBar: true,
  sessionProgressStarted: true,
  sessionProgressSkipped: true,
  audioFetchMax: 200,

  lessonMeaningReadingBackToBack: false,
  lessonReadingFirst: false,
  lessonMeaningFirst: false,
  lessonOrder: "RADICALS_THEN_LEVEL_THEN_TYPE",
  lessonOrderReversed: false,
  lessonOrderPriority: "CURRENT_LEVEL_RADICAL_KANJI_FIRST",
  lessonShuffleAfterSelection: false,
  lessonMaxSize: 5,
  lessonMaxStarted: 10,

  reviewMeaningReadingBackToBack: false,
  reviewReadingFirst: false,
  reviewMeaningFirst: false,
  reviewOrder: "SHUFFLE",
  reviewOrderReversed: false,
  reviewOrderPriority: "CURRENT_LEVEL_RADICAL_KANJI_FIRST",
  reviewOverdueFirst: true,
  reviewShuffleAfterSelection: false,
  reviewMaxSize: 10,
  reviewMaxStarted: 10,

  selfStudyMeaningReadingBackToBack: false,
  selfStudyReadingFirst: false,
  selfStudyMeaningFirst: false,
  selfStudyOrder: "SHUFFLE",
  selfStudyOrderReversed: false,
  selfStudyOrderPriority: "NONE",
  selfStudyOverdueFirst: false,
  selfStudyShuffleAfterSelection: false,
  selfStudyMaxSize: 50,
  selfStudyMaxStarted: 10,
  selfStudyWithLessons: false,

  searchAlwaysHandwriting: false,
  sessionDisableSearch: false,

  overdueThreshold: 20,

  sessionInfoDebug: false,
  subjectInfoDebug: false
};

export const SETTING_CONFIGS: Partial<Record<AnySettingName, IntegerSettingConfig | undefined>> = {
  dashboardReviewChartDays: { min: 1, max: 7 },
  dashboardCriticalThreshold: { min: 1, max: 100 },
  audioFetchMax: { min: 1, max: 1000 },
  lessonMaxSize: { min: 1, max: 1000 },
  lessonMaxStarted: { min: 1, max: 1000 },
  reviewMaxSize: { min: 1, max: 1000 },
  reviewMaxStarted: { min: 1, max: 1000 },
  selfStudyMaxSize: { min: 1, max: 1000 },
  selfStudyMaxStarted: { min: 1, max: 1000 },
};
