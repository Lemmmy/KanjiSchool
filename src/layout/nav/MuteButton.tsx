// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip, Slider, Popover } from "antd";

import { useAppSelector } from "@store";

import { setBooleanSetting, setIntegerSetting, useBooleanSetting, useIntegerSetting } from "@utils";
import { ConditionalLink } from "@comp/ConditionalLink.tsx";
import { SoundOutlined } from "@ant-design/icons";

import { headerElementClass } from "./AppHeader.tsx";

export function MuteButton(): JSX.Element {
  const audioMuted = useBooleanSetting("audioMuted");
  const audioVolume = useIntegerSetting("audioVolume");
  
  function toggleMute() {
    setBooleanSetting("audioMuted", !audioMuted, false);
  }
  
  function setVolume(value: number) {
    if (value === 0 && !audioMuted) {
      setBooleanSetting("audioMuted", true, false);
    } else if (audioMuted && value > 0) {
      setBooleanSetting("audioMuted", false, false);
    }
    setIntegerSetting("audioVolume", value, false)
  }

  const hasAnyAutoplaying = useAppSelector(s => s.settings.audioAutoplayLessons || s.settings.audioAutoplayReviews);

  const menu: JSX.Element = 
    <div className = "h-full items-center justify-items-center" >
      <div className="flex flex-col items-center justify-center"><Slider vertical defaultValue={audioVolume} onChangeComplete={setVolume} className="h-24" /><p className="m-0">Volume</p></div>
      <div className="flex flex-col items-center justify-center" onClick={toggleMute}> {audioMuted ? <MuteIcon /> : <SoundOutlined />} </div>
    </div>;

  if (hasAnyAutoplaying) {
      return <Popover
        content={menu}
      >
        <div className={headerElementClass}> {/* ant-dropdown-link */}
          {audioMuted ? <MuteIcon /> : <SoundOutlined />}
        </div>
      </Popover>;
  } else {
    return <Tooltip title="Audio is disabled.">
      <ConditionalLink to="/settings" matchTo>
        <div className={headerElementClass}>
          <MuteIcon />
        </div>
      </ConditionalLink>
    </Tooltip>;
  }
}

function MuteIcon(): JSX.Element {
  return <div className="relative flex items-center justify-center">
    <SoundOutlined className="text-red/50" />
    <div className="absolute w-[20px] h-[2px] bg-red -rotate-45 rounded-[3px]" />
  </div>;
}
