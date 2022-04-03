// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import "@utils/setup/errors";
import "@utils/setup/setup";
import { criticalError } from "@utils/setup/errors";

import ReactDOM from "react-dom";

import { notification } from "antd";

import "./index.css";
import App from "@app";

import Debug from "debug";
const debug = Debug("kanjischool:index");

async function main() {
  debug("=========================== APP STARTING ===========================");
  initialRender();
}

function initialRender() {
  debug("performing initial render");
  ReactDOM.render(
    <App />,
    document.getElementById("root")
  );
}

main().catch(err => {
  // Remove the preloader
  document.getElementById("wk-preloader")?.remove();

  debug("critical error in index.tsx");
  criticalError(err);

  notification.error({
    message: "Critical error",
    description: "A critical startup error has occurred. Please report this on GitHub. See console for details."
  });
});
