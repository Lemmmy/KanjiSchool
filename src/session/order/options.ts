// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { LessonOrder } from "./LessonOrder";
import { ReviewOrder } from "./ReviewOrder";
import { SessionPriority } from "./SessionPriority";

import { getBooleanSetting, getIntegerSetting, getStringSetting } from "@utils";

export interface SessionOpts {
  meaningReadingBackToBack: boolean;
  readingFirst: boolean;
  meaningFirst: boolean;

  orderReversed: boolean;
  orderPriority: SessionPriority;

  shuffleAfterSelection: boolean;

  maxSize: number;
  all?: boolean;
  maxStarted?: number;
}

export interface LessonOpts extends SessionOpts {
  order: LessonOrder;
}

export interface ReviewOpts extends SessionOpts {
  order: ReviewOrder;
  overdueFirst: boolean;
}

export function getLessonSessionOrderOptions(): LessonOpts {
  return {
    meaningReadingBackToBack: getBooleanSetting("lessonMeaningReadingBackToBack"),
    readingFirst: getBooleanSetting("lessonReadingFirst"),
    meaningFirst: getBooleanSetting("lessonMeaningFirst"),

    order: getStringSetting<LessonOrder>("lessonOrder"),
    orderReversed: getBooleanSetting("lessonOrderReversed"),
    orderPriority: getStringSetting<SessionPriority>("lessonOrderPriority"),

    shuffleAfterSelection: getBooleanSetting("lessonShuffleAfterSelection"),

    maxSize: getIntegerSetting("lessonMaxSize"),
    maxStarted: getIntegerSetting("lessonMaxStarted") ?? 10,
  };
}

export function getReviewSessionOrderOptions(): ReviewOpts {
  return {
    meaningReadingBackToBack: getBooleanSetting("reviewMeaningReadingBackToBack"),
    readingFirst: getBooleanSetting("reviewReadingFirst"),
    meaningFirst: getBooleanSetting("reviewMeaningFirst"),

    order: getStringSetting<ReviewOrder>("reviewOrder"),
    orderReversed: getBooleanSetting("reviewOrderReversed"),
    orderPriority: getStringSetting<SessionPriority>("reviewOrderPriority"),
    overdueFirst: getBooleanSetting("reviewOverdueFirst"),

    shuffleAfterSelection: getBooleanSetting("reviewShuffleAfterSelection"),

    maxSize: getIntegerSetting("reviewMaxSize"),
    maxStarted: getIntegerSetting("reviewMaxStarted") ?? 10
  };
}

export function getSelfStudySessionOrderOptions(): ReviewOpts {
  return {
    meaningReadingBackToBack: getBooleanSetting("selfStudyMeaningReadingBackToBack"),
    readingFirst: getBooleanSetting("selfStudyReadingFirst"),
    meaningFirst: getBooleanSetting("selfStudyMeaningFirst"),

    order: getStringSetting<ReviewOrder>("selfStudyOrder"),
    orderReversed: getBooleanSetting("selfStudyOrderReversed"),
    orderPriority: getStringSetting<SessionPriority>("selfStudyOrderPriority"),
    overdueFirst: getBooleanSetting("selfStudyOverdueFirst"),

    shuffleAfterSelection: getBooleanSetting("selfStudyShuffleAfterSelection"),

    maxSize: getIntegerSetting("selfStudyMaxSize"),
    maxStarted: getIntegerSetting("selfStudyMaxStarted") ?? 10
  };
}

export const FALLBACK_SELF_STUDY_OPTS: ReviewOpts = {
  meaningReadingBackToBack: false,
  readingFirst: false,
  meaningFirst: false,

  order: "SHUFFLE",
  orderReversed: false,
  orderPriority: "NONE",
  overdueFirst: false,

  shuffleAfterSelection: false,

  maxSize: 10
};
