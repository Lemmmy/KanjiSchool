// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { ReactNode } from "react";
import { CheckboxOptionType, Form, Radio, Tooltip } from "antd";
import { SortAscendingOutlined, SortDescendingOutlined } from "@ant-design/icons";

import { FormValues, Order } from "../../types";

import { PickByValue } from "utility-types";

interface Props {
  linkedRadio?: keyof FormValues;
  orderField?: keyof PickByValue<FormValues, Order>;
  allowNone?: boolean;

  name: keyof FormValues;
  label?: string;
  tooltip?: ReactNode | (() => ReactNode);

  options: CheckboxOptionType[];
}

export function EpicRadioGroup({
  name,
  linkedRadio,
  orderField,
  ...props
}: Props): JSX.Element {
  return <Form.Item<FormValues>
    noStyle
    shouldUpdate={(o, n) => o[name] !== n[name]
        || (linkedRadio && o[linkedRadio] !== n[linkedRadio])
        || (orderField && o[orderField] !== n[orderField])
        || false}
  >
    {({ getFieldValue, setFieldsValue }) => {
      // Used to know which item to display the ascending/descending icon on.
      const selectedValue = getFieldValue(name);

      // Handle the linked form item behavior (primary/secondary group picker).
      // The linkedSelectedValue comes from the upper EpicRadioGroup component.
      const linkedSelectedValue = linkedRadio
        ? getFieldValue(linkedRadio) : undefined;

      // Whether to sort ascending or descending.
      const order = orderField ? getFieldValue(orderField) : undefined;

      return <EpicRadioGroupInner
        name={name}
        selectedValue={selectedValue}
        linkedSelectedValue={linkedSelectedValue}
        order={order}
        orderField={orderField}
        setFieldsValue={setFieldsValue}
        {...props}
      />;
    }}
  </Form.Item>;
}

function EpicRadioGroupInner({
  selectedValue, linkedSelectedValue, order, orderField, allowNone,
  setFieldsValue,
  name, label, tooltip,
  options: originalOptions,
  ...props
}: Props & {
  /// This radio group's selected value
  selectedValue: string;
  /// The linked radio group's selected value
  linkedSelectedValue: string;
  /// This radio group's sort order (ascending/descending)
  order: Order;
  /// Used to change sort order on radio button click
  setFieldsValue: (values: Partial<FormValues>) => void;
}): JSX.Element {
  // Tooltip describing group/sort behavior on click
  return <Tooltip
    title={tooltip}
    placement="bottomLeft"
    overlayClassName="epic-radio-group-tooltip"
    mouseEnterDelay={0.5}
    mouseLeaveDelay={0}
  >
    <Form.Item
      className="epic-radio-group"
      name={name}
      label={label}
      {...props}
    >
      <Radio.Group
        buttonStyle="solid"
        optionType="button"
      >
        {/* Render the radio group buttons */}
        {originalOptions.map(o => <Radio.Button
          key={o.value as string}
          value={o.value}

          // If there's a linked form item (e.g. a primary/secondary group
          // picker), disable its value so it can't be selected twice. If the
          // linkedSelectedValue is "none", set all fields (except "none"
          // itself) to disabled. If allowNone is true, the opposite happens -
          // all fields will be enabled.
          disabled={o.value !== "none" && (
            o.value === linkedSelectedValue
            || (linkedSelectedValue === "none" && !allowNone)
          )}

          // If the button is clicked and it is already selected, reverse the
          // sort order.
          onClick={orderField && o.value === selectedValue ? () => {
            setFieldsValue({ [orderField]: order === "asc" ? "desc" : "asc" });
          } : undefined}
        >
          {/* Render the radio group button labels */}
          {/* Sort icon if this is a selected value */}
          {o.value === selectedValue && o.value !== "none"
            ? <>
              {/* Original label */}
              {o.label}

              {/* Sort icon (ascending/descending) */}
              {order === "desc"
                ? <SortDescendingOutlined />
                : <SortAscendingOutlined />}
            </>
            // Original label
            : o.label}
        </Radio.Button>)}
      </Radio.Group>
    </Form.Item>
  </Tooltip>;
}
