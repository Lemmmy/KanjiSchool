// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, Popconfirm, Space, Switch } from "antd";
import { PlusOutlined } from "@ant-design/icons";

import { useDispatch } from "react-redux";
import { useAppSelector } from "@store";
import { setCustomFonts } from "@store/slices/settingsSlice.ts";

import { FontFormItem } from "./FontFormItem.tsx";
import { defaultFonts, lsSetObject, reloadFontCache } from "@utils";

import Debug from "debug";
const debug = Debug("kanjischool:settings-fonts");

interface FormValues {
  customFonts: string[];
}

export function RandomFontForm(): JSX.Element {
  const [form] = Form.useForm<FormValues>();
  const customFonts = useAppSelector(state => state.settings.customFonts);
  const [sampleText, setSampleText] = useState("あいうえお");
  const [showUnsupported, setShowUnsupported] = useState(false);

  const dispatch = useDispatch();

  const reloadFontCacheUpdateForm = useCallback((newCustomFonts: string[]) => {
    reloadFontCache(newCustomFonts);
    form.setFieldsValue({ customFonts: [...newCustomFonts] });
  }, [form]);

  const reloadFonts = useCallback(() => {
    reloadFontCacheUpdateForm(customFonts);
  }, [customFonts, reloadFontCacheUpdateForm]);

  useEffect(() => {
    reloadFontCacheUpdateForm(customFonts);
    form.setFieldsValue({ customFonts: [...customFonts] });
  }, [form, customFonts, reloadFontCacheUpdateForm]);

  const onFinish = useCallback(async () => {
    const { customFonts } = await form.validateFields();
    const cleanedFonts = [...(new Set(customFonts
      .map((font: string) => font.trim())
      .filter((font: string) => font.length > 0)))];

    debug("submitting new font list: %o", cleanedFonts);
    lsSetObject("customFonts", cleanedFonts);
    dispatch(setCustomFonts(cleanedFonts));

    reloadFontCacheUpdateForm(cleanedFonts);
  }, [form, dispatch, reloadFontCacheUpdateForm]);

  const resetToDefaults = useCallback(() => {
    debug("resetting to default fonts");
    lsSetObject("customFonts", defaultFonts);
    dispatch(setCustomFonts(defaultFonts));
  }, [dispatch]);

  return <>
    <div className="flex flex-col md:flex-row gap-xs items-center mb-sm">
      <div className="inline-flex items-center gap-xs w-[55%]">
        <label htmlFor="sample-text">Preview text:</label>
        <Input
          placeholder="Sample text"
          id="sample-text"
          value={sampleText}
          onChange={e => setSampleText(e.target.value)}
          className="flex-1"
        />
      </div>

      <div className="inline-flex items-center gap-xs">
        <Switch defaultChecked={true} onChange={setShowUnsupported} id="show-unsupported" />
        <label htmlFor="show-unsupported">Show unsupported fonts</label>
      </div>
    </div>

    <Form
      layout="vertical"
      form={form}
      onFinish={onFinish}
    >
      <Form.List name="customFonts">
        {(fields, { add, remove }, { errors }) => (
          <>
            {fields.map(field =>
              <FontFormItem
                field={field}
                key={field.key}
                fields={fields.length}
                remove={remove}
                font={form.getFieldValue("customFonts")?.[field.name]}
                sampleText={sampleText}
                showUnsupported={showUnsupported}
              />
            )}

            <Form.Item className="mb-0">
              <Button
                type="dashed"
                className="w-[55%] my-xs text-sm"
                onClick={() => add()}
                icon={<PlusOutlined />}
              >
                Add font
              </Button>
              <Form.ErrorList errors={errors} />
            </Form.Item>
          </>
        )}
      </Form.List>

      <p className="text-desc text-sm mt-xss">
        Note that on some systems you may need to restart the browser for newly installed fonts to take effect.
      </p>

      <Space>
        <Form.Item className="mb-0">
          <Button type="primary" htmlType="submit">Save</Button>
        </Form.Item>

        <Form.Item className="mb-0">
          <Button onClick={reloadFonts}>Reload fonts</Button>
        </Form.Item>

        <Form.Item className="mb-0">
          <Popconfirm
            title="Are you sure you want to reset to the default list of fonts?"
            onConfirm={resetToDefaults}
            okText="Reset"
            cancelText="Cancel"
          >
            <Button danger>Reset to defaults</Button>
          </Popconfirm>
        </Form.Item>
      </Space>
    </Form>
  </>;
}
