// Copyright (c) 2021-2022 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

const path = require("path");
const CracoAlias = require("craco-alias");
const CracoLessPlugin = require("@lemmmy/craco-less");
const AntdDayjsWebpackPlugin = require("antd-dayjs-webpack-plugin");
const WebpackBar = require("webpackbar");
const GitRevisionPlugin = require("git-revision-webpack-plugin");
const { DefinePlugin } = require("webpack");
const SentryCliPlugin = require("@sentry/webpack-plugin");

const gitRevisionPlugin = new GitRevisionPlugin({
  // Include the "-dirty" suffix if the local tree has been modified, and
  // include non-annotated tags.
  versionCommand: "describe --always --tags --dirty"
});

module.exports = {
  style: {
    css: {
      loaderOptions: {
        url: false
      }
    }
  },

  babel: {
    plugins: [
      "lodash",
      ["@simbathesailor/babel-plugin-use-what-changed", {
        "active": process.env.NODE_ENV === "development"
      }]
    ]
  },

  plugins: [
    {
      plugin: CracoAlias,
      options: {
        source: "tsconfig",
        baseUrl: "./src",
        tsConfigPath: "./tsconfig.extend.json"
      }
    },
    {
      plugin: CracoLessPlugin,
      options: {
        lessLoaderOptions: {
          lessOptions: {
            javascriptEnabled: true
          }
        }
      }
    }
  ],

  eslint: {
    enable: false
  },

  webpack: {
    plugins: [
      new WebpackBar({ profile: true }),
      new AntdDayjsWebpackPlugin(),
      new DefinePlugin({
        "__GIT_VERSION__": DefinePlugin.runtimeValue(() => JSON.stringify(gitRevisionPlugin.version()), []),
        "__GIT_COMMIT_HASH__": DefinePlugin.runtimeValue(() => JSON.stringify(gitRevisionPlugin.commithash()), []),
        "__BUILD_TIME__": DefinePlugin.runtimeValue(Date.now)
      }),
      ...(process.env.NODE_ENV === "production" && process.env.SENTRY_ENABLED === "true"
      ? [new SentryCliPlugin({
        include: "./build/",
        ignore: ["node_modules", "craco.config.js", "tools", "public"],
          release: "kanjischool@" + gitRevisionPlugin.version()
        })]
        : [])
    ]
  },

  optimization: {
    sideEffects: true
  },

  configure: {
    devtool: process.env.NODE_ENV === "development"
      ? "eval" : "hidden-source-map"
  }
}
