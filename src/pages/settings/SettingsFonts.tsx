// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useEffect, useState } from "react";
import { Button, Form, Input, Popconfirm, Space, Tooltip } from "antd";
import { CheckCircleFilled, FontSizeOutlined, MinusCircleOutlined, PlusOutlined, WarningFilled } from "@ant-design/icons";
import { ExtLink } from "@comp/ExtLink";
import { defaultFonts, lsSetObject, reloadFontCache, useBooleanSetting } from "@utils";
import classNames from "classnames";

import { RootState } from "@store";
import { useSelector, useDispatch } from "react-redux";
import { setCustomFonts } from "@actions/SettingsActions";

import { booleanSetting, MenuItem, settingsSubGroup } from "./SettingsSubGroup.tsx";

import { menuItemClass } from "./settingsStyles.ts";

import Debug from "debug";
const debug = Debug("kanjischool:settings-fonts");

export function getFontSettingsGroup(): MenuItem {
  return settingsSubGroup(
    "Font settings",
    <FontSizeOutlined />,
    [
      booleanSetting("randomFontEnabled", "Use a random font in reviews", <>
        Using random fonts in reviews can help you learn to recognize kanji in the many different styles they can be
        written in. Enabling random fonts may affect loading time and memory usage.
      </>),
      booleanSetting("randomFontHover", "Show the default font when hovering over a random font", <>
        Only effective if random fonts are enabled. When enabled, hover over or tap the question to see it in the
        default font (Noto Sans JP).
      </>),
      booleanSetting("randomFontSeparateReadingMeaning", "Show a different random font for reading/meaning questions", <>
        If enabled, reading and meaning questions will be shown in different random fonts. Otherwise, the same font will
        be used for both.
      </>),
      booleanSetting("randomFontShowName", "Show the random font name", <>
        When a random font is used, the name of the font will be shown in the top right corner of the question.
      </>),
      {
        key: "randomFontList",
        className: classNames(
          menuItemClass,
          "!cursor-auto hover:!bg-transparent"
        ),
        label: <RandomFontList />
      }
    ]
  );
}

function RandomFontList(): JSX.Element {
  const baseClass = "leading-normal py-md whitespace-normal";

  const enabled = useBooleanSetting("randomFontEnabled");
  if (!enabled) {
    return <div className={baseClass}>
      <RandomFontCredits enabled={false} />
    </div>;
  }

  return <div className={baseClass}>
    <RandomFontCredits enabled={true} />

    <p className="mt-sm">
      Fonts supported by your system are shown with a green checkmark <Check />. The default list of fonts is based
      on <ExtLink href="https://gist.github.com/obskyr/9f3c77cf6bf663792c6e">this list</ExtLink>, and more fonts can be
      found at <ExtLink href="https://freejapanesefont.com">freejapanesefont.com</ExtLink>.
    </p>

    <RandomFontForm />
  </div>;
}

function RandomFontCredits({ enabled }: { enabled: boolean }): JSX.Element {
  return <div>
    Random Fonts is based on the
    fantastic <ExtLink href="https://community.wanikani.com/t/jitai-%E5%AD%97%E4%BD%93-the-font-randomizer-that-fits/12617">Jitai</ExtLink> userscript.
    {!enabled && <> Enable to see the full list of fonts.</>}
  </div>;
}

const Check = () => <Tooltip title="This font is available!">
  <CheckCircleFilled className="text-green" />
</Tooltip>;

const Warn = () => <Tooltip title="Font not found">
  <WarningFilled className="text-yellow light:text-orange" />
</Tooltip>;

interface FormValues {
  customFonts: string[];
}

function RandomFontForm(): JSX.Element {
  const [form] = Form.useForm<FormValues>();
  const customFonts = useSelector((state: RootState) => state.settings.customFonts);
  const [sampleText, setSampleText] = useState("あいうえお");

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
    <div className="inline-flex items-center gap-xs w-[55%] mb-sm">
      <label htmlFor="sample-text">Preview text:</label>
      <Input
        placeholder="Sample text"
        id="sample-text"
        value={sampleText}
        onChange={e => setSampleText(e.target.value)}
        className="flex-1"
      />
    </div>

    <Form
      className="random-font-form"
      layout="vertical"
      form={form}
      onFinish={onFinish}
    >
      <Form.List
        name="customFonts"
      >
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

interface FontSampleProps {
  font: string;
  sampleText: string;
}

function FontSample({ font, sampleText }: FontSampleProps): JSX.Element {
  return <div className="text-[24px] leading-none" style={{ fontFamily: font }}>
    {sampleText}
  </div>;
}

interface FontFormItemProps {
  field: any;
  font: string | undefined;
  fields: number;
  remove: (field: number) => void;
  sampleText: string;
}

function FontFormItem({ field, font, fields, remove, sampleText, ...props }: FontFormItemProps): JSX.Element {
  const supported = useSelector((state: RootState) => font ? state.settings.supportedFonts[font] : false);

  return <Form.Item
    required={false}
    className={classNames(
      "mb-0 group",
      "[&_.ant-form-item-control-input-content]:flex [&_.ant-form-item-control-input-content]:items-center",
      "[&_.ant-form-item-control-input]:-mb-px",
      {
        "[&_.ant-form-item-control-input]:min-h-[40px]": supported,
        "[&_.ant-form-item-control-input]:min-h-[28px]": !supported
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
            "h-[28px] text-sm": !supported
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
