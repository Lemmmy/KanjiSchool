// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { RootState } from "@store";
import { useSelector, shallowEqual } from "react-redux";

import { ApiStudyMaterialMap, ApiStudyMaterial } from "@api";

export const useStudyMaterials = (): ApiStudyMaterialMap | undefined =>
  useSelector((s: RootState) => s.sync.studyMaterials);

export const useStudyMaterialBySubjectId = (id: number): ApiStudyMaterial | undefined =>
  useSelector((s: RootState) =>
    s.sync.studyMaterials[s.sync.subjectStudyMaterialIdMap[id] ?? -1],
  shallowEqual);
