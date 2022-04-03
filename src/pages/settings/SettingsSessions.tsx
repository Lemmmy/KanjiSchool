// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { BulbOutlined, AuditOutlined, ReadOutlined } from "@ant-design/icons";

import { getSettingsGroup, booleanSetting, integerSetting, dropdownSetting } from "./SettingsGroup";

import { LESSON_ORDERS } from "@session/order/LessonOrder";
import { REVIEW_ORDERS } from "@session/order/ReviewOrder";
import { SESSION_PRIORITIES } from "@session/order/SessionPriority";

const LESSON_ORDER_ITEMS = Object.keys(LESSON_ORDERS)
  .map(o => ({ value: o, label: (LESSON_ORDERS as any)[o].name }));
const REVIEW_ORDER_ITEMS = Object.keys(REVIEW_ORDERS)
  .map(o => ({ value: o, label: (REVIEW_ORDERS as any)[o].name }));
const SESSION_PRIORITY_ITEMS = Object.keys(SESSION_PRIORITIES)
  .map(o => ({ value: o, label: (SESSION_PRIORITIES as any)[o].name }));

export function getLessonSettingsGroup(): JSX.Element {
  return getSettingsGroup(
    "Lesson settings",
    <BulbOutlined />,
    [
      dropdownSetting("lessonOrder", "Lesson order", undefined, LESSON_ORDER_ITEMS),
      booleanSetting("lessonOrderReversed", "Reverse order"),
      dropdownSetting("lessonOrderPriority", "Priority", undefined, SESSION_PRIORITY_ITEMS),
      booleanSetting("lessonShuffleAfterSelection", "Shuffle after selecting items"),
      booleanSetting("lessonMeaningReadingBackToBack", "Reading/meaning back to back"),
      booleanSetting("lessonReadingFirst", "Reading before meaning"),
      booleanSetting("lessonMeaningFirst", "Meaning before reading"),
      integerSetting("lessonMaxSize", "Max. # of lessons per session"),
      integerSetting("lessonMaxStarted", "Max. # of in-progress subjects in a session"),
    ]
  );
}

export function getReviewSettingsGroup(): JSX.Element {
  return getSettingsGroup(
    "Review settings",
    <AuditOutlined />,
    [
      dropdownSetting("reviewOrder", "Review order", undefined, REVIEW_ORDER_ITEMS),
      booleanSetting("reviewOrderReversed", "Reverse order"),
      booleanSetting("reviewOverdueFirst", "Overdue items first"),
      dropdownSetting("reviewOrderPriority", "Priority", undefined, SESSION_PRIORITY_ITEMS),
      booleanSetting("reviewShuffleAfterSelection", "Shuffle after selecting items"),
      booleanSetting("reviewMeaningReadingBackToBack", "Reading/meaning back to back"),
      booleanSetting("reviewReadingFirst", "Reading before meaning"),
      booleanSetting("reviewMeaningFirst", "Meaning before reading"),
      integerSetting("reviewMaxSize", "Max. # of reviews per session"),
      integerSetting("reviewMaxStarted", "Max. # of in-progress subjects in a session"),
    ]
  );
}

export function getSelfStudySettingsGroup(): JSX.Element {
  return getSettingsGroup(
    "Self-study settings",
    <ReadOutlined />,
    [
      dropdownSetting("selfStudyOrder", "Order", undefined, REVIEW_ORDER_ITEMS),
      booleanSetting("selfStudyOrderReversed", "Reverse order"),
      booleanSetting("selfStudyOverdueFirst", "Overdue items first"),
      dropdownSetting("selfStudyOrderPriority", "Priority", undefined, SESSION_PRIORITY_ITEMS),
      booleanSetting("selfStudyShuffleAfterSelection", "Shuffle after selecting items"),
      booleanSetting("selfStudyMeaningReadingBackToBack", "Reading/meaning back to back"),
      booleanSetting("selfStudyReadingFirst", "Reading before meaning"),
      booleanSetting("selfStudyMeaningFirst", "Meaning before reading"),
      integerSetting("selfStudyMaxSize", "Max. # of items per session"),
      integerSetting("selfStudyMaxStarted", "Max. # of in-progress subjects in a session"),
      booleanSetting("selfStudyWithLessons", "Show subject lessons during a self-study session"),
    ]
  );
}
