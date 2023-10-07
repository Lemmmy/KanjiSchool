// Copyright (c) 2021-2023 Drew Edwards
// This file is part of KanjiSchool under AGPL-3.0.
// Full details: https://github.com/Lemmmy/KanjiSchool/blob/master/LICENSE

import { useEffect, useMemo } from "react";
import memoize from "memoizee";

import { useDispatch } from "react-redux";
import { useAppSelector } from "@store";
import { store } from "@store";
import { setSupportedFonts } from "@store/slices/settingsSlice.ts";

import { useBooleanSetting } from "./settings";
import { sample } from "./shuffle.ts";

import { lru } from "tiny-lru";

import Debug from "debug";
const debug = Debug("kanjischool:fonts");

const defaultFont = "Noto Sans JP";

// This selection of fonts is based on the fantastic Jitai userscript. Fonts can
// be found on freejapanesefont.com.
// https://gist.github.com/obskyr/9f3c77cf6bf663792c6e
export const defaultFonts = [
  // Default KanjiSchool font
  defaultFont,

  // Default Windows fonts
  "Meiryo, メイリオ",
  "MS PGothic, ＭＳ Ｐゴシック, MS Gothic, ＭＳ ゴック",
  "MS PMincho, ＭＳ Ｐ明朝, MS Mincho, ＭＳ 明朝",
  "Yu Gothic, YuGothic",
  "Yu Mincho, YuMincho",

  // Default OS X fonts
  "Hiragino Kaku Gothic Pro, ヒラギノ角ゴ Pro W3",
  "Hiragino Maru Gothic Pro, ヒラギノ丸ゴ Pro W3",
  "Hiragino Mincho Pro, ヒラギノ明朝 Pro W3",

  // Common Linux fonts
  "Takao Gothic, TakaoGothic",
  "Takao Mincho, TakaoMincho",
  "Sazanami Gothic",
  "Sazanami Mincho",
  "Kochi Gothic",
  "Kochi Mincho",
  "Dejima Mincho",
  "Ume Gothic",
  "Ume Mincho",

  // Other Japanese fonts people use.
  // You might want to try some of these!
  "EPSON 行書体Ｍ",
  "EPSON 正楷書体Ｍ",
  "EPSON 教科書体Ｍ",
  "EPSON 太明朝体Ｂ",
  "EPSON 太行書体Ｂ",
  "EPSON 丸ゴシック体Ｍ",
  "cinecaption",
  "nagayama_kai",
  "A-OTF Shin Maru Go Pro",
  "Hosofuwafont",
  "ChihayaGothic",
  "'chifont+', chifont",
  "darts font",
  "santyoume-font",
  "FC-Flower",
  "ArmedBanana",
  "HakusyuKaisyoExtraBold_kk",
  "aoyagireisyosimo2, AoyagiKouzanFont2OTF",
  "aquafont",
];

// Characters with widths that often vary between fonts.
const FONT_TEST_STRING = "wim-—l~ツ亻".repeat(100);
const DEFAULT_TEST_FONT = "72px monospace";

let testCanvas: HTMLCanvasElement;

const testFontWidth = memoize((font: string): number => {
  if (!testCanvas) testCanvas = document.createElement("canvas");

  const ctx = testCanvas.getContext("2d");
  if (!ctx) return 0;

  try {
    ctx.font = font;
  } catch (e) {
    return 0;
  }

  return ctx.measureText(FONT_TEST_STRING).width;
});

export function fontExists(font: string): boolean {
  if (font === defaultFont) return true;

  const controlWidth = testFontWidth(DEFAULT_TEST_FONT);
  const testWidth = testFontWidth(`72px ${font}, monospace`);
  return controlWidth !== testWidth;
}

function isCanvasBlank(canvas: HTMLCanvasElement): boolean {
  const ctx = canvas.getContext("2d");
  if (!ctx) return true;
  const buf = new Uint32Array(ctx.getImageData(0, 0, canvas.width, canvas.height).data.buffer);
  return !buf.some(c => c !== 0);
}

export const canRepresentGlyphs = memoize((font: string, text: string): boolean => {
  const canvas = document.createElement("canvas");
  canvas.width = 50;
  canvas.height = 50;

  const ctx = canvas.getContext("2d");
  if (!ctx) return false;
  ctx.textBaseline = "top";

  ctx.font = `24px ${font}`;

  for (const char of text) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillText(char, 0, 0);

    if (isCanvasBlank(canvas)) return false;
  }

  return true;
});

export function reloadFontCache(newCustomFonts: string[]): Record<string, boolean> {
  debug("reloading font cache");

  const newSupportedFonts: Record<string, boolean> = {};
  for (const font of newCustomFonts) {
    newSupportedFonts[font] = fontExists(font);
  }

  testFontWidth.clear();
  canRepresentGlyphs.clear();

  debug("new supported fonts: %o", newSupportedFonts);
  store.dispatch(setSupportedFonts(newSupportedFonts));

  return newSupportedFonts;
}

const randomFontsPicked = lru<string>(100);

export function useRandomFont(
  glyphs: string | null | undefined,
  sessionUuid: string | undefined,
  type: "reading" | "meaning"
): string | undefined {
  const enabled = useBooleanSetting("randomFontEnabled");
  const separateReadingMeaning = useBooleanSetting("randomFontSeparateReadingMeaning");
  const customFonts = useAppSelector(state => state.settings.customFonts);
  const supportedFonts = useAppSelector(state => state.settings.supportedFonts);
  const dispatch = useDispatch();

  useEffect(() => {
    if (!enabled || !sessionUuid) return;

    // Reload the supported fonts at the start of a session if random fonts are
    // enabled. Check if the supported font keys are the same as the custom font
    // names.
    const needsUpdate = customFonts.some(f => !(f in supportedFonts));
    if (needsUpdate) {
      debug("reloading font cache for session %s", sessionUuid);
      reloadFontCache(customFonts);
    }
  }, [sessionUuid, enabled, customFonts, supportedFonts, dispatch]);

  // Use sessionUuid to get a new font when the session changes.
  return useMemo(() => {
    if (!enabled || !glyphs || !sessionUuid) return undefined;

    const typeKey = separateReadingMeaning ? type : "combined";
    const key = `${sessionUuid}:${glyphs}:${typeKey}`;
    debug("using key %s", key);

    const cached = randomFontsPicked.get(key);
    if (cached) {
      debug("picking cached font %s for session %s", cached, sessionUuid);
      return cached;
    } else {
      debug("picking random font for session %s", sessionUuid);

      const fonts: string[] = [];
      for (const font in supportedFonts) {
        if (supportedFonts[font] && canRepresentGlyphs(font, glyphs)) {
          fonts.push(font);
        }
      }

      const font = sample(fonts);
      if (font) {
        debug("picked random font %s for session %s", font, sessionUuid);
        randomFontsPicked.set(key, font);
        return font;
      } else {
        debug("could not pick random font!", supportedFonts);
        return undefined;
      }
    }
  }, [glyphs, sessionUuid, enabled, separateReadingMeaning, type, supportedFonts]);
}
