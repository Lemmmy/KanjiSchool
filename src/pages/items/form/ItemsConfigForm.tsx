// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useState, useEffect, useCallback, useMemo } from "react";
import { Form, Collapse, Row, Col, InputNumber, Divider, Button } from "antd";

import { FormValues, ItemsBaseType, DEFAULT_PARAMS } from "../types";
import { PerformLookupFn } from "../ItemsPage";

import { GroupByPicker } from "./GroupByPicker";
import { SortByPicker } from "./SortByPicker";
import { ColorByPicker } from "./ColorByPicker";
import { TypePicker } from "./TypePicker";
import { SrsPicker } from "./SrsPicker";

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
    valuesUpdated();
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
    className="items-config-form"
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
      <Collapse.Panel key="1" header="Config" forceRender>
        {/* Frequency group size */}
        {type === "freq" && <Row gutter={24} style={{ marginBottom: 16 }}>
          <Col span={24}>
            <Divider orientation="left">Frequency grouping</Divider>
            <Form.Item name="frequencyGroupSize" label="Group size">
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
          <Col span={24}><Divider orientation="left">Show/hide</Divider></Col>
        </Row>
        {type === "wk" && <TypePicker />}
        <SrsPicker showNotOnWk={type !== "wk"} />

        {/* Button row */}
        <Row gutter={24}>
          <Col span={24} style={{ textAlign: "right" }}>
            {/* Submit */}
            <Button type="primary" htmlType="submit">
              Save
            </Button>

            {/* Reset to default */}
            <Button style={{ margin: "0 8px" }} onClick={onReset}>
              Reset
            </Button>
          </Col>
        </Row>

      </Collapse.Panel>
    </Collapse>
  </Form>;
}
