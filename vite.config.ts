// Copyright (c) 2023-2025 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import "dotenv/config";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { VitePWA } from "vite-plugin-pwa";
import { viteExternalsPlugin } from "vite-plugin-externals";

import fs from "fs";
import path from "path";
import { execSync } from "child_process";

/** Convert path aliases in tsconfig.extend.json to Vite resolution aliases */
function parseTsAliases() {
  const tsconfig = JSON.parse(
    fs.readFileSync(path.resolve(__dirname, "tsconfig.extend.json"), "utf-8")
  );

  const aliases = tsconfig.compilerOptions.paths;
  const baseUrl = tsconfig.compilerOptions.baseUrl;
  const out = {};

  for (const alias in aliases) {
    const aliasPath = aliases[alias][0];
    const src = alias.replace("/*", "");
    out[src] = path.resolve(__dirname, baseUrl, aliasPath.replace("/*", ""));
  }

  return out;
}

// Inject the git version into the build
const gitVersion = execSync("git describe --always --tags").toString().trim();
process.env.VITE_GIT_VERSION = gitVersion;

const HTTPS_KEY = process.env.HTTPS_KEY;
const HTTPS_CERT = process.env.HTTPS_CERT;
if (!HTTPS_KEY || !HTTPS_CERT) {
  console.warn("HTTPS_KEY and HTTPS_CERT not set, but HTTPS is required for the PWA to work correctly");
}

// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    alias: {
      ...parseTsAliases(),
    },
  },
  server: {
    ...(HTTPS_KEY && HTTPS_CERT ? {
      https: {
        key: fs.readFileSync(HTTPS_KEY),
        cert: fs.readFileSync(HTTPS_CERT),
      }
    } : {}),
  },
  plugins: [
    react(),
    viteExternalsPlugin({
      "resize-observer-polyfill": "ResizeObserver", // Only needed for IE support, which we don't
    }),
    VitePWA({
      registerType: "prompt",
      filename: "service-worker.js",
      workbox: {
        runtimeCaching: [
          // Cache the Google Fonts stylesheets
          {
            urlPattern: /^https:\/\/fonts.(?:googleapis|gstatic).com\/(.*)/,
            handler: "CacheFirst",
            options: {
              cacheName: "google-fonts",
              expiration: {
                maxEntries: 150,
                maxAgeSeconds: 60 * 60 * 24 * 30 // 30 days
              },
              cacheableResponse: {
                statuses: [0, 200]
              }
            }
          }
        ]
      }
    })
  ],
});
