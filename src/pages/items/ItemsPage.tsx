// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Dispatch, SetStateAction, useCallback, useState, useMemo } from "react";
import { Alert } from "antd";

import { PageLayout } from "@layout/PageLayout";

import { useAssignments, useSubjectAssignmentIds, useSubjects } from "@api";

import { ItemsConfigForm } from "./form/ItemsConfigForm";
import { FormValues, ItemsBaseType, ItemsColorBy } from "./types/types";
import { TYPE_TITLES } from "./types/titles";

import { lookupItems, LookupResults } from "./lookup";
import { ItemsResults } from "./ItemsResults";
import { makeRenderTooltipFn } from "@comp/subjects/lists/tooltip/SubjectTooltip";

import { debounce } from "lodash-es";

import Debug from "debug";
const debug = Debug("kanjischool:items");

interface Props {
  type: ItemsBaseType;
}

export type PerformLookupFn = (values: FormValues) => void;

const DEBOUNCE_LOOKUP_MS = 500;
const lookupDebounced = debounce((
  type: ItemsBaseType,
  values: FormValues,
  setResults: Dispatch<SetStateAction<LookupResults[]>>
) => {
  const results = lookupItems(type, values);
  setResults(results);
}, DEBOUNCE_LOOKUP_MS);

export function ItemsPage({ type }: Props): JSX.Element {
  // Used to prevent rendering unless we have all the data. The SubjectGrids
  // themselves will handle re-rendering if the underlying data changes, though
  // it won't handle changing the sorting, but that's too expensive for this
  // niche case anyway.
  const hasSubjects = !!useSubjects();
  const hasAssignments = !!useAssignments();
  const hasSubjectAssignmentIdMap = !!useSubjectAssignmentIds();

  const [colorBy, setColorBy] = useState<ItemsColorBy>("type");
  const [hasVocabulary, setHasVocabulary] = useState(type === "wk");
  const [results, setResults] = useState<LookupResults[]>([]);

  const renderTooltipFn = useMemo(() => makeRenderTooltipFn(
    type === "jlpt", type === "joyo", type === "freq"
  ), [type]);

  const performLookup: PerformLookupFn = useCallback(values => {
    if (!hasSubjects || !hasAssignments || !hasSubjectAssignmentIdMap) return;

    debug("performing lookup", values);

    setColorBy(values.colorBy);
    setHasVocabulary(type === "wk" && values.types?.includes("vocabulary"));
    lookupDebounced(type, values, setResults);
  }, [hasSubjects, hasAssignments, hasSubjectAssignmentIdMap, type]);

  // Don't
  if (!hasSubjects || !hasAssignments || !hasSubjectAssignmentIdMap)
    return <b>Loading...</b>;

  return <PageLayout
    siteTitle={TYPE_TITLES[type]}
    title={TYPE_TITLES[type]}
  >
    {/* Listing config form */}
    <ItemsConfigForm
      type={type}
      performLookup={performLookup}
      hideForm
    />

    {/* Results */}
    {(results?.length ?? 0) > 0 && <div className="pb-lg">
      {results.map(r => <ItemsResults
        key={r.group}
        colorBy={colorBy}
        hasVocabulary={hasVocabulary}
        renderTooltipFn={renderTooltipFn}
        groupNumber={r.group}
        {...r}
      />)}
    </div>}
  </PageLayout>;
}
