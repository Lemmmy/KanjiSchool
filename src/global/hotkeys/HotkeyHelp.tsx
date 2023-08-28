// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, ReactNode, FC, Fragment } from "react";
import { Modal, Typography, Row, Col } from "antd";

import { RootState } from "@store";
import { useSelector, useDispatch } from "react-redux";
import { setHotkeyHelpVisible } from "@actions/SettingsActions";

import { GlobalHotKeys } from "react-hotkeys";

import { ctrl } from "@utils";

const { Text } = Typography;

const KEY_MAP = {
  "SHOW": "shift+?"
};

export function HotkeyHelpListener(): JSX.Element {
  const dispatch = useDispatch();
  const visible = useSelector((s: RootState) => s.settings.hotkeyHelpVisible);
  const setVisible = useCallback((v: boolean) => dispatch(setHotkeyHelpVisible(v)), [dispatch]);
  const toggleVisible = useCallback(() => setVisible(!visible), [visible, setVisible]);

  return <>
    {/* Hotkey handler to show modal */}
    <GlobalHotKeys
      keyMap={KEY_MAP}
      handlers={{ SHOW: toggleVisible }}
      allowChanges
    />

    {/* Modal */}
    <HotkeyModal visible={visible} setVisible={setVisible} />
  </>;
}

interface ModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

function HotkeyModal({ visible, setVisible }: ModalProps): JSX.Element {
  return <Modal
    open={visible}
    title="Keyboard shortcuts"
    footer={null}
    onCancel={() => setVisible(false)}
    width={720}
  >
    <Row gutter={16}>
      <Col span={12}>
        <HotkeyGroup title="General">
          <Hotkey name="Search" keys={["Ctrl+K"]} />
          <Hotkey name="Advanced search" keys={["Ctrl+Shift+K"]} />
          <Hotkey name="Handwriting search" keys={["Ctrl+Shift+H"]} />
          <Hotkey name="Show keyboard shortcuts" keys={["?"]} />
        </HotkeyGroup>

        <HotkeyGroup title="Sessions">
          <Hotkey name="Start lessons" keys={["L"]} />
          <Hotkey name="Start reviews" keys={["R"]} />
          <Hotkey name="Self-study" keys={["S"]} />
          <Hotkey name="Abandon session" keys={["A"]} />
        </HotkeyGroup>

        <HotkeyGroup title="Self-study queue">
          <Hotkey name="Add hovered to queue" keys={["Q"]} />
          <Hotkey name="Show/hide queue" keys={["Shift+Q"]} />
        </HotkeyGroup>
      </Col>

      <Col span={12}>
        <HotkeyGroup title="Lessons">
          <Hotkey name="Next lesson" keys={["→", "Space"]} />
          <Hotkey name="Previous lesson" keys={["←", "Backspace"]} />
          <Hotkey name="Play audio" keys={["P", "J"]} />
          <Hotkey name="Abandon lessons" keys={["Shift+Esc"]} />
        </HotkeyGroup>

        <HotkeyGroup title="Reviews">
          <Hotkey name="Submit" keys={["Enter"]} />
          <Hotkey name="Skip" keys={["Ctrl+Enter"]} />
          <Hotkey name="Re-focus textbox"
            desc={<Text type="secondary">Any key</Text>} />
          <Hotkey name="Wrap up session" keys={["Esc"]} />
          <Hotkey name="Abandon session" keys={["Shift+Esc"]} />
        </HotkeyGroup>

        <HotkeyGroup title="Incorrect answer">
          <Hotkey name="Continue" keys={["Space"]} />
          <Hotkey name="Undo" keys={["Ctrl+Z", "Backspace"]} />
          <Hotkey name="Play audio" keys={["P", "J"]} />
          <Hotkey name="Show more hints" keys={["H"]} />
        </HotkeyGroup>
      </Col>
    </Row>
  </Modal>;
}

interface GroupProps {
  title: string;
  children: ReactNode;
}

const HotkeyGroup: FC<GroupProps> = ({ title, children }) => {
  return <div className="group">
    {/* Title */}
    <h4 className="mt-lg mb-0 group-first:mt-0">
      {title}
    </h4>

    {/* Hotkeys */}
    {children}
  </div>;
};

interface HotkeyProps {
  keys?: string[];
  desc?: ReactNode;

  name: ReactNode;
}

function Hotkey({ keys, desc, name }: HotkeyProps): JSX.Element {
  return <Row>
    {/* Name */}
    <Col span={12} className="text-sm leading-[24px] align-middle">
      {name}
    </Col>

    {/* Key(s) */}
    <Col span={12} className="text-sm leading-[24px]">
      {desc || (keys || []).map((k, i, a) => <Fragment key={k}>
        <Text keyboard className="text-[95%] whitespace-nowrap">
          {k.replace("Ctrl", ctrl)}
        </Text>
        {i < a.length - 1 && <span className="mx-[0.2em]">or</span>}
      </Fragment>)}
    </Col>
  </Row>;
}
