// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Form, Input } from "antd";
import { MinusCircleOutlined } from "@ant-design/icons";
import classNames from "classnames";

import { useSelector } from "react-redux";
import { RootState } from "@store";

import { Check } from "./Check.tsx";
import { Warn } from "./Warn.tsx";
import { FontSample } from "./FontSample.tsx";

interface FontFormItemProps {
  field: any;
  font: string | undefined;
  fields: number;
  remove: (field: number) => void;
  sampleText: string;
  showUnsupported?: boolean;
}

export function FontFormItem({
  field,
  font,
  fields,
  remove,
  sampleText,
  showUnsupported = true,
  ...props
}: FontFormItemProps): JSX.Element {
  const supported = useSelector((state: RootState) => font
    ? state.settings.supportedFonts[font]
    : false);

  return <Form.Item
    required={false}
    className={classNames(
      "mb-0 group",
      "[&_.ant-form-item-control-input-content]:flex [&_.ant-form-item-control-input-content]:items-center",
      "[&_.ant-form-item-control-input]:-mb-px",
      {
        "[&_.ant-form-item-control-input]:min-h-[40px]": supported,
        "[&_.ant-form-item-control-input]:min-h-[28px]": !supported,
        "hidden": !showUnsupported && !supported && fields > 1 && font
      }
    )}
    {...props}
  >
    <Form.Item
      {...field}
      validateTrigger={["onChange", "onBlur"]}
      rules={[{
        required: true,
        whitespace: true,
        message: "Enter font name or delete this row",
      }]}
      noStyle
    >
      <Input
        placeholder="Font name"
        className={classNames(
          "w-[55%] rounded-none group-first:rounded-t group-last:rounded-b z-10 hover:z-20 focus:z-30",
          {
            "h-[40px] text-base": supported,
            "h-[28px] text-sm text-desc": !supported
          }
        )}
      />
    </Form.Item>

    {fields > 1 && <div className="inline-flex items-center mx-xs gap-xs">
      {font && <span className="font-support-icon">
        {supported ? <Check /> : <Warn />}
      </span>}

      <MinusCircleOutlined
        className="hover:text-red"
        onClick={() => remove(field.name)}
      />
    </div>}

    {font && supported && <FontSample
      font={font}
      sampleText={sampleText}
    />}
  </Form.Item>;
}
