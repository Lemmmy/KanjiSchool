// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ApiObject, ApiCollection } from "./";

// =============================================================================
// Subjects
// =============================================================================
export type SubjectType = "radical" | "kanji" | "vocabulary";

export interface ApiSubjectMeaning {
  meaning: string;
  primary: boolean;
  accepted_answer: boolean;
}
export interface ApiSubjectAuxiliaryMeaning {
  meaning: string;
  type: "whitelist" | "blacklist";
}

export interface ApiSubjectBase {
  auxiliary_meanings: ApiSubjectAuxiliaryMeaning[];
  characters: string | null;
  created_at: string;
  document_url: string;
  hidden_at: string | null;
  lesson_position: number;
  level: number;
  meaning_mnemonic: string;
  meanings: ApiSubjectMeaning[];
  slug: string;
  spaced_repetition_system_id: number;
}

export type ApiSubject =
  ApiSubjectRadical | ApiSubjectKanji | ApiSubjectVocabulary;
export type ApiSubjectCollection = ApiCollection<ApiSubject>;
export type ApiSubjectMap = Record<number, ApiSubject>;

// -----------------------------------------------------------------------------
// Radicals
// -----------------------------------------------------------------------------
export interface ApiCharacterImageBase {
  url: string;
  content_type: "image/png" | "image/svg+xml";
}
export interface ApiCharacterImageSvg extends ApiCharacterImageBase {
  content_type: "image/svg+xml";
  metadata?: {
    inline_styles?: boolean;
  };
}
export interface ApiCharacterImagePng extends ApiCharacterImageBase {
  content_type: "image/png";
  metadata?: {
    color?: string;
    dimensions?: string;
    style_name?: string;
  };
}
export type ApiCharacterImage = ApiCharacterImageSvg | ApiCharacterImagePng;

export interface ApiSubjectRadicalInner extends ApiSubjectBase {
  amalgamation_subject_ids: number[];
  character_images: ApiCharacterImage[];
}
export interface ApiSubjectRadical extends ApiObject<ApiSubjectRadicalInner> {
  id: number;
  object: "radical";
}

// -----------------------------------------------------------------------------
// Kanji
// -----------------------------------------------------------------------------
export interface ApiSubjectReadingBase {
  reading: string;
  primary: boolean;
  accepted_answer: boolean;
}

export type ApiSubjectHasReadings = (ApiSubjectKanji | ApiSubjectVocabulary) & {
  data: {
    readings: ApiSubjectReadingBase[];
  };
}

export interface ApiSubjectKanjiReading extends ApiSubjectReadingBase {
  type: "kunyomi" | "nanori" | "onyomi";
}

export interface ApiSubjectKanjiInner extends ApiSubjectBase {
  amalgamation_subject_ids: number[];
  component_subject_ids: number[];
  meaning_hint: string | null;
  reading_hint: string | null;
  reading_mnemonic: string;
  readings: ApiSubjectKanjiReading[];
  visually_similar_subject_ids: number[];
}
export interface ApiSubjectKanji extends ApiObject<ApiSubjectKanjiInner> {
  id: number;
  object: "kanji";
}

// -----------------------------------------------------------------------------
// Vocabulary
// -----------------------------------------------------------------------------
export interface ApiSubjectVocabularyContextSentence {
  en: string;
  ja: string;
}

export interface ApiSubjectVocabularyPronunciationAudio {
  url: string;
  content_type: string;
  metadata: {
    gender: string;
    source_id: number;
    pronunciation: string;
    voice_actor_id: number;
    voice_actor_name: string;
    voice_description: string;
  };
}

export interface ApiSubjectVocabularyInner extends ApiSubjectBase {
  component_subject_ids: number[];
  context_sentences: ApiSubjectVocabularyContextSentence[];
  meaning_mnemonic: string;
  parts_of_speech: string[];
  pronunciation_audios: ApiSubjectVocabularyPronunciationAudio[];
  readings: ApiSubjectReadingBase[];
  reading_mnemonic: string;
}
export interface ApiSubjectVocabulary extends ApiObject<ApiSubjectVocabularyInner> {
  id: number;
  object: "vocabulary";
}

export type AnyReading = ApiSubjectKanjiReading | ApiSubjectReadingBase;
