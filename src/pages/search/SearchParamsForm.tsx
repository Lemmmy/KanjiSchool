// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useEffect, useMemo, useState } from "react";
import { Form, Row, Col, Input, Select, Button, Collapse, Typography, Checkbox } from "antd";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import classNames from "classnames";

import { useNavigate } from "react-router-dom";
import { useKeywordSearch } from "@api/search/KeywordSearch";

import { InputRange } from "./InputRange";
import { SrsStagesPicker } from "./SrsStagesPicker";
import { SubjectTypePicker } from "./SubjectTypePicker";
import { JlptJoyoPicker } from "./JlptJoyoPicker";
import { PartsOfSpeechPicker } from "./PartsOfSpeechPicker";

import {
  normalizeSearchParams, SearchParams, SEARCH_ORDERS,
  useSubjects, useAssignments, useReviewStatistics, gotoSelfStudy
} from "@api";
import { pluralN, useBooleanSetting, setBooleanSetting } from "@utils";

import { PresetDropdownBtn, PresetStartSessionFn } from "@comp/preset-editor";

const { Text } = Typography;

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

export function SearchParamsForm({
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
    setBooleanSetting("selfStudyWithLessons", !!e.target.checked, false), []);

  const initialValues = useMemo(() => initialParams ?? DEFAULT_PARAMS,
    [initialParams]);

  // Refresh the form if the initial values have changed
  useEffect(() => {
    if (!form || !initialValues) return;
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  function onReset() {
    const params = normalizeSearchParams(DEFAULT_PARAMS);
    form.setFieldsValue(params);
  }

  function onFinish(values: SearchParams) {
    const params = normalizeSearchParams(values);
    onSearch(params);
  }

  const onSelfStudy: PresetStartSessionFn = async opts => {
    if (!form) return;
    try {
      const values = await form.validateFields();
      const params = normalizeSearchParams(values);
      gotoSelfStudy(navigate, keywordSearch, params, withLessons, opts);
    } catch (err) {
      console.error(err);
      return;
    }
  };

  function WithLessonsCheckbox(): JSX.Element {
    const classes = classNames("with-lessons-checkbox", {
      "self-study": selfStudy
    });

    return <Checkbox
      className={classes}
      onChange={setWithLessons}
      checked={withLessons}
    >
      With lessons
    </Checkbox>;
  }

  function SelfStudyButton(): JSX.Element | null {
    if (results === 0) return null;

    return <>
      {/* For self-study type, put the "With lessons" checkbox on the left */}
      {selfStudy && <WithLessonsCheckbox />}

      <PresetDropdownBtn
        type={selfStudy ? "primary" : undefined}
        presetType="review"
        start={onSelfStudy}
      >
        Self-study {results !== undefined && pluralN(results, "result")}
      </PresetDropdownBtn>

      {/* For search type, put the "With lessons" checkbox on the right */}
      {!selfStudy && <WithLessonsCheckbox />}
    </>;
  }

  function SearchButton(): JSX.Element | null {
    return <Button
      type={selfStudy ? undefined : "primary"}
      htmlType="submit"
      loading={loading}
    >
      {selfStudy ? "Preview" : "Search"}
    </Button>;
  }

  return <Form<SearchParams>
    form={form}
    className="search-params-form"
    initialValues={initialValues}
    onFinish={onFinish}
  >
    <Collapse
      ghost
      activeKey={collapseKey}
      defaultActiveKey={defaultCollapseKey}
      onChange={setCollapseKey}
    >
      <Collapse.Panel
        key="main"
        header={<>
          <h1>{selfStudy ? "Self-study" : "Advanced search"}</h1>
          {results !== undefined && <span className="results">
            {pluralN(results, "result")}
          </span>}
        </>}
        forceRender
      >
        {/* Keyword search row */}
        {showQueryInput && <Row gutter={24}>
          <Col span={24}>
            <Form.Item name="query">
              <Input size="large" placeholder="Keyword" />
            </Form.Item>
          </Col>
        </Row>}

        {/* Level and frequency ranges */}
        <Row gutter={24}>
          {/* Level range */}
          <Col span={12}>
            <InputRange
              label="Level"
              minName="minLevel" maxName="maxLevel" min={1} max={60}
            />
          </Col>
          {/* Frequency range */}
          <Col span={12}>
            <InputRange
              label="Frequency"
              minName="minFreq" maxName="maxFreq" min={1} max={2500}
            />
          </Col>
        </Row>

        <Row gutter={24}>
          {/* Next review less than/more than n hours ago */}
          <Col span={12}>
            <InputRange
              label={<>Next review&nbsp;<Text type="secondary">(hours)</Text></>}
              minName="nextReviewGt" maxName="nextReviewLt"
              minPlaceholder="More than" maxPlaceholder="Less than"
            />
          </Col>

          {/* Burned than/more than n days ago */}
          <Col span={12}>
            <InputRange
              label={<>Burned&nbsp;<Text type="secondary">(days)</Text></>}
              minName="burnedGt" maxName="burnedLt"
              minPlaceholder="More than" maxPlaceholder="Less than"
            />
          </Col>
        </Row>

        <Row gutter={24}>
          {/* Percentage correct less than/more than */}
          <Col span={24}>
            <InputRange
              label="Percentage correct"
              minName="percentageCorrectGt" maxName="percentageCorrectLt"
              minPlaceholder="More than" maxPlaceholder="Less than"
              min={1} max={100}
            />
          </Col>
        </Row>

        {/* SRS stages */}
        <Row gutter={24}><Col span={24}><SrsStagesPicker /></Col></Row>
        {/* Subject types */}
        <Row gutter={24}><Col span={24}><SubjectTypePicker /></Col></Row>
        {/* JLPT and Jōyō */}
        <Row gutter={24}>
          <Col span={12}><JlptJoyoPicker type="jlpt" /></Col>
          <Col span={12}><JlptJoyoPicker type="joyo" /></Col>
        </Row>
        {/* Parts of speech */}
        <Row gutter={24}><Col span={24}><PartsOfSpeechPicker /></Col></Row>

        {/* Sort order. For self-study this only affects the preview. */}
        <Row gutter={24}><Col span={24}>
          <Form.Item
            name="sortOrder"
            label={selfStudy
              ? <>Sort by&nbsp;<Text type="secondary">(preview only)</Text></>
              : "Sort by"}
          >
            <Select style={{ maxWidth: 200 }} popupMatchSelectWidth>
              {Object.entries(SEARCH_ORDERS).map(([v, o]) =>
                <Select.Option key={v} value={v}>{o.name}</Select.Option>)}
            </Select>
          </Form.Item>
        </Col></Row>

        {/* Optional hint */}
        <Row style={{ marginBottom: 16 }}><Col span={24}>
          <Text type="secondary">All fields are optional.</Text>
        </Col></Row>

        {/* Buttons */}
        <Row gutter={24}>
          {/* Self-study or preview */}
          <Col span={12}>
            {selfStudy ? <SearchButton /> : <SelfStudyButton />}
          </Col>

          <Col span={12} style={{ textAlign: "right" }}>
            {/* Submit */}
            {selfStudy ? <SelfStudyButton /> : <SearchButton />}

            {/* Reset */}
            <Button
              style={{ margin: "0 8px" }}
              onClick={onReset}
            >
              Clear
            </Button>
          </Col>
        </Row>
      </Collapse.Panel>
    </Collapse>
  </Form>;
}
