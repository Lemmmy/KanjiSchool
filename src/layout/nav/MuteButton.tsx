// Copyright (c) 2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { Tooltip } from "antd";

import { useAppSelector } from "@store";

import { headerElementClass } from "@layout/nav/AppHeader.tsx";
import { setBooleanSetting, useBooleanSetting } from "@utils";
import { ConditionalLink } from "@comp/ConditionalLink.tsx";
import { SoundOutlined } from "@ant-design/icons";

export function MuteButton(): JSX.Element {
  const audioMuted = useBooleanSetting("audioMuted");
  const hasAnyAutoplaying = useAppSelector(s => s.settings.audioAutoplayLessons || s.settings.audioAutoplayReviews);

  function toggleMute() {
    setBooleanSetting("audioMuted", !audioMuted, false);
  }

  if (hasAnyAutoplaying) {
    return <Tooltip title={audioMuted ? "Unmute auto-playing audio" : "Mute auto-playing audio"}>
      <div className={headerElementClass} onClick={toggleMute}>
        {audioMuted ? <MuteIcon /> : <SoundOutlined />}
      </div>
    </Tooltip>;
  } else {
    return <Tooltip title="Auto-playing audio is disabled.">
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
