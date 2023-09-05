// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect, useCallback, useMemo } from "react";
import { Form, Collapse, Row, Col, InputNumber, Button } from "antd";

import { FormValues, ItemsBaseType, DEFAULT_PARAMS } from "../types";
import { PerformLookupFn } from "../ItemsPage";

import { GroupByPicker } from "./GroupByPicker";
import { SortByPicker } from "./SortByPicker";
import { ColorByPicker } from "./ColorByPicker";
import { TypePicker } from "./TypePicker";
import { SrsPicker } from "./SrsPicker";
import { ItemsConfigFormDivider } from "./base/ItemsConfigFormDivider.tsx";

import { lsGetObject, lsSetObject } from "@utils";

interface Props {
  type: ItemsBaseType;
  performLookup: PerformLookupFn;
  hideForm?: boolean;
}

const FORM_LAYOUT = {
  labelCol: { span: 3 },
  wrapperCol: { span: 21 }
};

export function ItemsConfigForm({
  type,
  performLookup,
  hideForm,
}: Props): JSX.Element {
  const [form] = Form.useForm<FormValues>();

  const defaultCollapseKey = hideForm ? undefined : "1";
  const [collapseKey, setCollapseKey] =
    useState<string | string[] | undefined>(defaultCollapseKey);

  // Get the initialValues from localStorage if possible and merge with defaults
  const initialValues = useMemo(() => {
    const stored = lsGetObject<FormValues>("itemsPageConfig-" + type);
    return { ...DEFAULT_PARAMS[type], ...stored };
  }, [type]);

  // Since onValuesChange isn't called on internal updates
  const valuesUpdated = useCallback(async () => {
    if (!form) return;

    const formValues = await form.validateFields();
    const values = { ...initialValues, ...formValues };

    // Save the form values for next time
    lsSetObject("itemsPageConfig-" + type, values);

    performLookup(values);
  }, [form, initialValues, performLookup, type]);

  // Refresh the form if the initial values have changed
  useEffect(() => {
    if (!form) return;
    form.setFieldsValue(initialValues);
    valuesUpdated().catch(console.error);
  }, [form, initialValues, valuesUpdated]);

  const onValuesChange = useCallback((
    changed: Partial<FormValues>,
    values: FormValues
  ) => {
    const { groupByPrimary, groupBySecondary, sortBy } = changed;
    if (groupByPrimary) {
      // If the secondary or sort is now equal to the primary, reset them
      if (groupByPrimary !== "none") {
        if (values.groupBySecondary === groupByPrimary)
          form.setFieldsValue({ groupBySecondary: "none" });
        if (values.sortBy === groupByPrimary)
          form.setFieldsValue({ sortBy: "slug" });
      } else {
        form.setFieldsValue({ groupBySecondary: "none" });
      }
    }

    // If any groupBy or sortBy change, reset their orders back to ascending
    if (groupByPrimary) form.setFieldsValue({ groupByPrimaryOrder: "asc" });
    if (groupBySecondary) form.setFieldsValue({ groupBySecondaryOrder: "asc" });
    if (sortBy) form.setFieldsValue({ sortByOrder: "asc" });
  }, [form]);

  const onReset = useCallback(() => {
    const values = DEFAULT_PARAMS[type];
    lsSetObject("itemsPageConfig-" + type, values);
    form.setFieldsValue(values);
    form.submit();
  }, [form, type]);

  return <Form
    form={form}
    className="bg-container border border-solid border-split rounded max-w-[1080px] mx-auto mb-lg"
    initialValues={initialValues}
    onValuesChange={onValuesChange}
    onFinish={valuesUpdated}
    {...FORM_LAYOUT}
  >
    <Collapse
      ghost
      activeKey={collapseKey}
      defaultActiveKey={defaultCollapseKey}
      onChange={setCollapseKey}
    >
      <Collapse.Panel
        key="1"
        header="Config"
        className="[&_.ant-collapse-content-active]:![border-top:_1px_solid_var(--antd-split)]"
        forceRender
      >
        {/* Frequency group size */}
        {type === "freq" && <Row gutter={24} className="mb-md">
          <Col span={24}>
            <ItemsConfigFormDivider label="Frequency grouping" />
            <Form.Item name="frequencyGroupSize" label="Group size" className="mb-sm">
              <InputNumber placeholder="Size" min={1} max={2500} />
            </Form.Item>
          </Col>
        </Row>}

        {/* The pickers */}
        <GroupByPicker type={type} />
        <SortByPicker type={type} />
        {type === "wk" && <ColorByPicker />}

        {/* Show/hide */}
        <Row gutter={16}>
          <Col span={24}><ItemsConfigFormDivider label="Show/hide" /></Col>
        </Row>
        {type === "wk" && <TypePicker />}
        <SrsPicker showNotOnWk={type !== "wk"} />

        {/* Button row */}
        <Row gutter={24}>
          <Col span={24} className="text-right flex justify-end gap-xs mb-xss">
            {/* Submit */}
            <Button type="primary" htmlType="submit">
              Save
            </Button>

            {/* Reset to default */}
            <Button onClick={onReset}>
              Reset
            </Button>
          </Col>
        </Row>

      </Collapse.Panel>
    </Collapse>
  </Form>;
}
