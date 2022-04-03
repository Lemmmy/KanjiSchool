// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import "@global/js-api";

import { notification } from "antd";

import Debug from "debug";

import dayjs from "dayjs";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isToday from "dayjs/plugin/isToday";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isSameOrAfter);
dayjs.extend(isToday);
dayjs.extend(isBetween);

Debug.enable("kanjischool:*");
localStorage.setItem("debug", "kanjischool:*");

notification.config({
  placement: "topRight",
  top: 88, // Top nav height (64px) + default margin (24px)
  duration: 3
});
