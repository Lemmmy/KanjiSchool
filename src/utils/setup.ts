// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import "@global/js-api";

import Debug from "debug";

import { configureDefaultAntInterface } from "@global/AntInterface.tsx";

import dayjs from "dayjs";
import localizedFormat from "dayjs/plugin/localizedFormat";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import isToday from "dayjs/plugin/isToday";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(localizedFormat);
dayjs.extend(isSameOrAfter);
dayjs.extend(isToday);
dayjs.extend(isBetween);

Debug.enable("kanjischool:*");
localStorage.setItem("debug", "kanjischool:*");

configureDefaultAntInterface();
