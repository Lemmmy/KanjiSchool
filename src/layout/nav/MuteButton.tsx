// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip, Slider, Popover } from "antd";

import { useAppSelector } from "@store";

import { setBooleanSetting, setIntegerSetting, useBooleanSetting, useIntegerSetting } from "@utils";
import { ConditionalLink } from "@comp/ConditionalLink.tsx";
import { PlayCircleOutlined, SoundOutlined } from "@ant-design/icons";

import { headerElementClass } from "./AppHeader.tsx";

export function MuteButton(): JSX.Element {
  const audioMuted = useBooleanSetting("audioMuted");
  const audioVolume = useIntegerSetting("audioVolume");

  function MenuIcon(): JSX.Element {
    if (audioVolume === 0) {
      return <MuteIcon />;
    } else if (audioMuted) {
      return <NoAutoPlayIcon />;
    } else {
      return <SoundOutlined />;
    }
  }

  function toggleAutoPlay() {
    setBooleanSetting("audioMuted", !audioMuted, false);
  }

  function setVolume(value: number) {
    setIntegerSetting("audioVolume", value, false);
  }

  const hasAnyAutoplaying = useAppSelector(s => s.settings.audioAutoplayLessons || s.settings.audioAutoplayReviews);

  function AutoPlayControl(): JSX.Element {
    if (hasAnyAutoplaying) {
      return <Tooltip title="Auto-play audio">
        <div className="flex flex-col items-center justify-center" onClick={toggleAutoPlay}>
          {audioMuted ? <NoAutoPlayIcon /> : <PlayCircleOutlined />}
        </div>
      </Tooltip>;
    } else {
      return <Tooltip title="Auto-playing audio is disabled.">
        <ConditionalLink to="/settings" matchTo>
          <div className={headerElementClass}>
            <NoAutoPlayIcon />
          </div>
        </ConditionalLink>
      </Tooltip>;
    }
  }

  const menu: JSX.Element =
    <div className = "h-full items-center justify-items-center" >
      <div className="flex flex-col items-center justify-center">
        <Slider vertical defaultValue={audioVolume} onChangeComplete={setVolume} className="h-24" />
        <p className="m-0">Volume</p>
      </div>
      <AutoPlayControl />
    </div>;

  return <Popover content={menu} >
    <div className={headerElementClass}> {/* ant-dropdown-link */}
      <MenuIcon />
    </div>
  </Popover>;
}

function MuteIcon(): JSX.Element {
  return <div className="relative flex items-center justify-center">
    <SoundOutlined className="text-red/50" />
    <div className="absolute w-[20px] h-[2px] bg-red -rotate-45 rounded-[3px]" />
  </div>;
}

function NoAutoPlayIcon(): JSX.Element {
  return <div className="relative flex items-center justify-center">
    <PlayCircleOutlined className="text-red/50" />
    <div className="absolute w-[20px] h-[2px] bg-red -rotate-45 rounded-[3px]" />
  </div>;
}
