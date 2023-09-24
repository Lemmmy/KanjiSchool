// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Collapse, CollapseProps } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";

import { useNavigate } from "react-router-dom";
import { useKeywordSearch } from "@api/search/KeywordSearch";

import {
  normalizeSearchParams, SearchParams,
  useSubjects, useAssignments, useReviewStatistics, gotoSelfStudy
} from "@api";
import { pluralN, useBooleanSetting, setBooleanSetting } from "@utils";

import { PresetStartSessionFn } from "@comp/preset-editor";
import { SearchParamsForm } from "./SearchParamsForm.tsx";

interface Props {
  loading?: boolean;
  results?: number;
  initialParams?: SearchParams;
  hideForm?: boolean;
  showQueryInput?: boolean;
  selfStudy?: boolean;
  onSearch: (params: SearchParams) => void;
}

const DEFAULT_PARAMS: SearchParams = {
  sortOrder: "TYPE"
};

export function SearchParamsConfig({
  loading,
  results,
  initialParams,
  hideForm,
  showQueryInput,
  selfStudy,
  onSearch
}: Props): JSX.Element {
  const [form] = Form.useForm<SearchParams>();

  // Used for `onSelfStudy`
  const navigate = useNavigate();
  const [keywordSearch] = useKeywordSearch();

  const defaultCollapseKey = hideForm ? undefined : "main";
  const [collapseKey, setCollapseKey] =
    useState<string | string[] | undefined>(defaultCollapseKey);

  // Used to prevent searching if data is not yet available.
  const subjects = !!useSubjects();
  const assignments = !!useAssignments();
  const reviewStatistics = !!useReviewStatistics();
  if (!subjects || !assignments || !reviewStatistics) loading = true;

  // Self-study "With lessons" checkbox
  const withLessons = useBooleanSetting("selfStudyWithLessons");
  const setWithLessons = useCallback((e: CheckboxChangeEvent) =>
    setBooleanSetting("selfStudyWithLessons", e.target.checked, false), []);

  const initialValues = useMemo(() => initialParams ?? DEFAULT_PARAMS,
    [initialParams]);

  // Refresh the form if the initial values have changed
  useEffect(() => {
    if (!form || !initialValues) return;
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  const onReset = useCallback(() => {
    const params = normalizeSearchParams(DEFAULT_PARAMS);
    form.setFieldsValue(params);
  }, [form]);

  const onFinish = useCallback((values: SearchParams) => {
    const params = normalizeSearchParams(values);
    onSearch(params);
  }, [onSearch]);

  const onSelfStudy: PresetStartSessionFn = useCallback(async opts => {
    if (!form) return;
    try {
      const values = await form.validateFields();
      const params = normalizeSearchParams(values);
      gotoSelfStudy(navigate, keywordSearch, params, withLessons, opts);
    } catch (err) {
      console.error(err);
      return;
    }
  }, [form, navigate, keywordSearch, withLessons]);

  const items: CollapseProps["items"] = useMemo(() => [{
    key: "main",
    label: <CollapseHeader results={results} />,
    forceRender: true,
    children: <SearchParamsForm
      selfStudy={selfStudy}
      onSelfStudy={onSelfStudy}
      withLessons={withLessons}
      setWithLessons={setWithLessons}
      onSearch={onSearch}
      onReset={onReset}
      loading={loading}
      results={results}
      showQueryInput={showQueryInput}
    />
  }], [loading, onReset, onSearch, onSelfStudy, results, selfStudy, setWithLessons, showQueryInput, withLessons]);

  return <Form<SearchParams>
    form={form}
    className="bg-container border border-solid border-split rounded max-w-[920px] mx-auto"
    initialValues={initialValues}
    onFinish={onFinish}
  >
    <Collapse
      ghost
      activeKey={collapseKey}
      defaultActiveKey={defaultCollapseKey}
      onChange={setCollapseKey}
      items={items}
      className="[&_.ant-collapse-header]:!items-center [&_.ant-collapse-content-box]:!pb-md"
    />
  </Form>;
}

interface HeaderProps {
  results?: number;
}

function CollapseHeader({ results }: HeaderProps): JSX.Element {
  return <>
    <h2 className="inline-block my-0 font-medium">Search</h2>
    {results !== undefined && <span className="ml-xs">
      {pluralN(results, "result")}
    </span>}
  </>;
}
