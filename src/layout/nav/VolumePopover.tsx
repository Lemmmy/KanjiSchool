// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useCallback, useMemo } from "react";
import { Popover, PopoverProps, Slider, Tooltip } from "antd";
import { SliderTooltipProps } from "antd/es/slider";
import { PlayCircleOutlined, SoundOutlined } from "@ant-design/icons";
import classNames from "classnames";

import { useAppSelector } from "@store";
import { setIntegerSetting, toggleBooleanSetting, useBooleanSetting, useIntegerSetting } from "@utils";

import { debounce } from "lodash-es";
import { ConditionalLink } from "@comp/ConditionalLink.tsx";

import { headerElementClass } from "./AppHeader.tsx";

// Allow clicking too so the volume popover can be opened on mobile
const popoverTriggers: PopoverProps["trigger"] = ["hover", "click"];

const sliderTooltipProps: SliderTooltipProps = {
  placement: "left",
  formatter: value => value ? `${value.toFixed(0)}%` : "0%",
};

export function VolumePopover(): React.ReactElement {
  const audioMuted = useBooleanSetting("audioMuted");
  const audioVolume = useIntegerSetting("audioVolume");
  const setVolume = useCallback((value: number) => setIntegerSetting("audioVolume", value, false), []);

  function MenuIcon(): React.ReactElement {
    if (audioVolume === 0) {
      return <MuteIcon />;
    } else if (audioMuted) {
      return <NoAutoPlayIcon />;
    } else {
      return <SoundOutlined />;
    }
  }

  const content = <div className="flex flex-col gap-2 h-full items-center justify-items-center select-none">
    <div className="text-sm mb-1">Volume</div>

    {/* Volume slider */}
    <Slider
      className="h-[20vh] md:h-24"
      vertical
      tooltip={sliderTooltipProps}
      defaultValue={audioVolume}
      onChangeComplete={setVolume}
    />

    {/* Toggle auto-play button */}
    <AutoPlayControl />
  </div>;

  return <Popover content={content} trigger={popoverTriggers}>
    <div className={headerElementClass}>
      <MenuIcon />
    </div>
  </Popover>;
}

function AutoPlayControl(): React.ReactElement {
  const iconClass = "cursor-pointer mb-1 select-none";

  const audioMuted = useBooleanSetting("audioMuted");

  // Debounce the toggle to work around a bug where antd tooltips cause onClick to fire twice on mobile
  const toggleAutoPlay = useMemo(
    () => debounce(() => toggleBooleanSetting("audioMuted", false), 150, { leading: true, trailing: false }),
    []
  );

  const hasAnyAutoplaying = useAppSelector(s => s.settings.audioAutoplayLessons || s.settings.audioAutoplayReviews);

  if (hasAnyAutoplaying) {
    return <Tooltip title="Auto-play audio">
      <div
        className="flex flex-col items-center justify-center cursor-pointer select-none"
        onClick={toggleAutoPlay}
      >
        {audioMuted
          ? <NoAutoPlayIcon className={iconClass} />
          : <PlayCircleOutlined className={iconClass} />}
      </div>
    </Tooltip>;
  } else {
    return <Tooltip title="Auto-playing audio is disabled.">
      <ConditionalLink to="/settings" matchTo>
        <NoAutoPlayIcon className={iconClass} />
      </ConditionalLink>
    </Tooltip>;
  }
}

function MuteIcon(): React.ReactElement {
  return <div className="relative flex items-center justify-center">
    <SoundOutlined className="text-red/50" />
    <div className="absolute w-[20px] h-[2px] bg-red -rotate-45 rounded-[3px]" />
  </div>;
}

function NoAutoPlayIcon({ className }: { className?: string }): React.ReactElement {
  return <div className={classNames("relative flex items-center justify-center", className)}>
    <PlayCircleOutlined className="text-red/50" />
    <div className="absolute w-[20px] h-[2px] bg-red -rotate-45 rounded-[3px]" />
  </div>;
}
