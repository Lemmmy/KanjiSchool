// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useMemo } from "react";
import { Button, Col, Form, Input, Row, Select } from "antd";
import { CheckboxChangeEvent } from "antd/es/checkbox";

import { SEARCH_ORDERS } from "@api";
import { PresetStartSessionFn } from "@comp/preset-editor";

import { InputRange } from "./InputRange.tsx";
import { SrsStagesPicker } from "./SrsStagesPicker.tsx";
import { SubjectTypePicker } from "./SubjectTypePicker.tsx";
import { JlptJoyoPicker } from "./JlptJoyoPicker.tsx";
import { PartsOfSpeechPicker } from "./PartsOfSpeechPicker.tsx";
import { SearchSelfStudyButton, SelfStudyButtonProps } from "./SearchSelfStudyButton.tsx";
import { SearchButtonProps, SearchParamsSearchButton } from "./SearchParamsSearchButton.tsx";

interface Props {
  selfStudy?: boolean;
  onSelfStudy: PresetStartSessionFn;

  withLessons: boolean;
  setWithLessons: (e: CheckboxChangeEvent) => void;

  onReset: () => void;

  loading?: boolean;
  results?: number;

  showQueryInput?: boolean;
}

export function SearchParamsForm({
  selfStudy,
  onSelfStudy,
  withLessons,
  setWithLessons,
  onReset,
  loading,
  results,
  showQueryInput
}: Props): React.ReactElement {
  const selfStudyButtonProps: SelfStudyButtonProps = useMemo(() => ({
    selfStudy,
    onSelfStudy,
    withLessons,
    setWithLessons,
    results
  }), [selfStudy, onSelfStudy, withLessons, setWithLessons, results]);

  const searchButtonProps: SearchButtonProps = useMemo(() => ({
    selfStudy,
    loading
  }), [selfStudy, loading]);

  return <>
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
          label={<>Next review&nbsp;<span className="text-desc">(hours)</span></>}
          minName="nextReviewGt" maxName="nextReviewLt"
          minPlaceholder="More than" maxPlaceholder="Less than"
        />
      </Col>

      {/* Burned than/more than n days ago */}
      <Col span={12}>
        <InputRange
          label={<>Burned&nbsp;<span className="text-desc">(days)</span></>}
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
          ? <>Sort by&nbsp;<span className="text-desc">(preview only)</span></>
          : "Sort by"}
      >
        <Select className="max-w-[200px]" popupMatchSelectWidth>
          {Object.entries(SEARCH_ORDERS).map(([v, o]) =>
            <Select.Option key={v} value={v}>{o.name}</Select.Option>)}
        </Select>
      </Form.Item>
    </Col></Row>

    {/* Optional hint */}
    <Row className="mb-md text-desc"><Col span={24}>
      All fields are optional.
    </Col></Row>

    {/* Buttons */}
    <Row gutter={24}>
      {/* Self-study or preview */}
      <Col span={12}>
        {selfStudy
          ? <SearchParamsSearchButton {...searchButtonProps} />
          : <SearchSelfStudyButton {...selfStudyButtonProps} />}
      </Col>

      <Col span={12} className="text-right flex flex-row justify-end gap-xs">
        {/* Submit */}
        {selfStudy
          ? <SearchSelfStudyButton {...selfStudyButtonProps} />
          : <SearchParamsSearchButton {...searchButtonProps} />}

        {/* Reset */}
        <Button onClick={onReset}>
          Clear
        </Button>
      </Col>
    </Row>
  </>;
}

