// Copyright (c) 2021-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import "@utils/setup";

import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import { router } from "@global/AppRouter";

import { notification } from "antd";

import "./index.css";

import "@global/js-api";

import Debug from "debug";
import React from "react";
const debug = Debug("kanjischool:index");

async function main() {
  debug("=========================== APP STARTING ===========================");
  initialRender();
}

function initialRender() {
  debug("performing initial render");
  ReactDOM
    .createRoot(document.getElementById("root")!)
    .render(<RouterProvider router={router} />);
}

main().catch(err => {
  // Remove the preloader
  document.getElementById("wk-preloader")?.remove();

  debug("critical error in index.tsx");
  console.error(err);

  notification.error({
    message: "Critical error",
    description: "A critical startup error has occurred. Please report this on GitHub. See console for details."
  });
});
