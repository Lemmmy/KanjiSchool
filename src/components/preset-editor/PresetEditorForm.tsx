// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useEffect, useMemo } from "react";
import { Col, Form, Input, Row, message } from "antd";

import { Preset, PresetType, usePreset } from ".";
import { PresetCheckboxSetting, PresetDropdownSetting, PresetNumberSetting, PresetSettingProps } from "./FormSettings";

import { LessonOpts, ReviewOpts } from "@session/order/options";

import { LESSON_ORDERS } from "@session/order/LessonOrder";
import { REVIEW_ORDERS } from "@session/order/ReviewOrder";
import { SESSION_PRIORITIES } from "@session/order/SessionPriority";
import { savePreset } from "./save";

const LESSON_ORDER_ITEMS = Object.keys(LESSON_ORDERS)
  .map(o => ({ value: o, label: (LESSON_ORDERS as any)[o].name }));
const REVIEW_ORDER_ITEMS = Object.keys(REVIEW_ORDERS)
  .map(o => ({ value: o, label: (REVIEW_ORDERS as any)[o].name }));
const SESSION_PRIORITY_ITEMS = Object.keys(SESSION_PRIORITIES)
  .map(o => ({ value: o, label: (SESSION_PRIORITIES as any)[o].name }));

// eslint-disable-next-line @typescript-eslint/ban-types
declare type RecursivePartial<T> = T extends object ? {
  // eslint-disable-next-line @typescript-eslint/ban-types
  [P in keyof T]?: T[P] extends (infer U)[] ? RecursivePartial<U>[] : T[P] extends object ? RecursivePartial<T[P]> : T[P];
} : any;

type EnabledOpts = Partial<Record<keyof LessonOpts | keyof ReviewOpts, boolean>>;
interface FormValues {
  name: string;
  enabledOpts: EnabledOpts;
  opts: Partial<LessonOpts | ReviewOpts>;
}

function getEnabledOpts(preset: Preset): EnabledOpts {
  const out: EnabledOpts = {};
  for (const opt in preset.opts) {
    const key = opt as keyof EnabledOpts;
    out[key] = (preset.opts as any)[key] !== undefined;
  }
  return out;
}

export function usePresetEditorForm(
  presetType: PresetType,
  selectedUuid?: string
): [JSX.Element | null, () => void] {
  const [form] = Form.useForm<FormValues>();

  const preset = usePreset(presetType, selectedUuid);
  const isDefault = !selectedUuid || selectedUuid.startsWith("default-");

  // Props for each setting item
  const settingProps: Partial<PresetSettingProps> = useMemo(() => ({
    disabled: isDefault
  }), [isDefault]);

  const initialValues: Partial<FormValues> = useMemo(() => ({
    name: preset?.name,
    enabledOpts: preset ? getEnabledOpts(preset) : {},
    opts: preset?.opts ?? {}
  }), [preset]);

  // If the initial values change, refresh the form
  useEffect(() => {
    if (!form) return;
    form.resetFields();
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  // If a value is changed, automatically mark it as enabled
  const onValuesChange = useCallback(async ({ opts }: RecursivePartial<FormValues>) => {
    if (!opts) return;
    for (const opt in opts) {
      const key = opt as keyof EnabledOpts;
      form.setFieldsValue({
        enabledOpts: { [key]: true }
      });
    }
  }, [form]);

  const onSubmit = useCallback(async () => {
    // Don't allow saving of non-default presets
    if (isDefault || !preset) return;

    const { name, opts, enabledOpts } = await form.validateFields();

    // Merge the new values into the old preset
    const newPreset: Preset = {
      ...preset,
      name,
      opts: {}
    };

    // Only put in new enabledOpts
    for (const opt in enabledOpts) {
      const key = opt as keyof EnabledOpts;
      if (enabledOpts[key]) {
        (newPreset.opts as any)[key] = (opts as any)[key];
      }
    }

    savePreset(presetType, newPreset);
    message.success("Preset saved.");
  }, [form, presetType, preset, isDefault]);

  const formEl = useMemo(() => selectedUuid === undefined ? null : <Form
    form={form}
    initialValues={initialValues}
    onValuesChange={onValuesChange}
    onFinish={onSubmit}
  >
    {/* Name */}
    <Form.Item name="name" label="Preset name">
      <Input disabled={isDefault} />
    </Form.Item>

    {/* Review order + reverse order */}
    <Row gutter={24}>
      <Col span={24} sm={14}>
        {/* Lesson/review order */}
        {presetType === "lesson"
          ? <PresetDropdownSetting {...settingProps}
            name="order" label="Lesson order" items={LESSON_ORDER_ITEMS} />
          : <PresetDropdownSetting {...settingProps}
            name="order" label="Review order" items={REVIEW_ORDER_ITEMS} />}
      </Col>
      <Col span={24} sm={10}>
        {/* Reverse order */}
        <PresetCheckboxSetting {...settingProps}
          name="orderReversed" label="Reverse order" />
      </Col>
    </Row>

    {/* Overdue items first */}
    {presetType === "review" && <PresetCheckboxSetting {...settingProps}
      name="overdueFirst" label="Overdue items first" />}
    {/* Order priority */}
    <PresetDropdownSetting {...settingProps}
      name="orderPriority" label="Priority" items={SESSION_PRIORITY_ITEMS} />

    {/* Shuffle after selecting items */}
    <PresetCheckboxSetting {...settingProps}
      name="shuffleAfterSelection" label="Shuffle after selecting items" />

    {/* Reading/meaning back to back */}
    <PresetCheckboxSetting {...settingProps}
      name="meaningReadingBackToBack" label="Reading/meaning back to back" />
    {/* Reading before meaning */}
    <PresetCheckboxSetting {...settingProps}
      name="readingFirst" label="Reading before meaning" />
    {/* Meaning before reading */}
    <PresetCheckboxSetting {...settingProps}
      name="meaningFirst" label="Meaning before reading" />

    {/* Max lessons/reviews per session */}
    <Row gutter={24}>
      <Col span={24} sm={18}>
        <PresetNumberSetting
          {...settingProps}
          name="maxSize"
          label={presetType === "lesson"
            ? "Max lessons per session"
            : "Max reviews per session"}
        />
      </Col>
      <Col span={24} sm={6}>
        <PresetCheckboxSetting {...settingProps}
          name="all" label="All" />
      </Col>
    </Row>

    {/* Max in-progress subjects in a session */}
    <PresetNumberSetting {...settingProps} name="maxStarted"
      label="Max in-progress subjects in a session" />
  </Form>, [
    form, initialValues, onValuesChange, onSubmit, isDefault, presetType,
    settingProps, selectedUuid
  ]);

  return [formEl, onSubmit];
}
