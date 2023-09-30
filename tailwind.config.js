/** @type {import('tailwindcss').Config} */
import { presetPalettes } from "@ant-design/colors";
import plugin from "tailwindcss/plugin";
import clipPath from "tailwind-clip-path";
import logical from "tailwindcss-logical";
import { kebabCase } from "lodash-es";

const generateConfig = () => ({
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  corePlugins: {
    // Disable tailwind's CSS reset
    preflight: false,
  },
  theme: {
    darkMode: "class",

    screens: {
      xs : "480px",
      sm : "576px",
      md : "768px",
      lg : "992px",
      xl : "1200px",
      xxl: "1600px",
    },

    extend: {
      spacing: {
        // antd compatible spacing
        xss          : "4px",
        xs           : "8px",
        sm           : "12px",
        md           : "16px",
        lg           : "24px",

        // component/layout sizes
        "page-header"          : "56px",
        "header"               : "64px",
        "toc"                  : "180px",
        "toc-right"            : "-204px", // -toc - lg
        "study-modal"          : "182px", // 150px + md * 2
        "text"                 : "0.3em",
        "preset-editor-height" : "400px",
        "preset-editor-sidebar": "260px",
      },

      fontFamily: {
        ja: [`"Noto Sans JP"`, "sans-serif"],
      },

      fontSize: {
        xss : "11px",
        xs  : "12px",
        sm  : "13px",
        base: "16px",
        lg  : "18px",
        xl  : "20px",
        xxl : "27px",
      },

      lineHeight: {
        normal: 1.5715,
      },

      borderRadius: {
        xss    : "2px",
        xs     : "3px",
        sm     : "4px",
        DEFAULT: "6px", // antd default
      },

      aspectRatio: {
        "2/1": "2 / 1",
      },

      opacity: {
        "2" : ".02",
        "4" : ".04",
        "8" : ".08",
        "15": ".15",
        "35": ".35",
        "65": ".65"
      },

      cursor: {
        pen: `url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAsAAAALCAYAAACprHcmAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAA5SURBVChTYyAE/gMBlIkfwBQS1ICuAKcGmAQ6jQHQJYa0QhAASYIAjA0WxAEYkRUwAgGUiQUwMAAAr3dXrhd5j3gAAAAASUVORK5CYII=") 0 10, auto`
      },

      clipPath: {
        "arrow-b": "path('M 0 8 A 4 4 0 0 0 2.82842712474619 6.82842712474619 L 6.585786437626905 3.0710678118654755 A 2 2 0 0 1 9.414213562373096 3.0710678118654755 L 13.17157287525381 6.82842712474619 A 4 4 0 0 0 16 8 Z')"
      },

      keyframes: {
        "shake": {
          "10%, 90%":      { "transform": "translateX(-3px)" },
          "20%, 80%":      { "transform": "translateX(6px)" },
          "30%, 50%, 70%": { "transform": "translateX(-8px)" },
          "40%, 60%":      { "transform": "translateX(8px)" }
        },
        "fade-in": {
          "0%":   { "opacity": "0" },
          "100%": { "opacity": "1" }
        }
      },

      animation: {
        "shake": "shake 750ms ease-in-out both",
        "fade-in": "fade-in 300ms ease-in-out both",
      },

      transitionProperty: {
        "session-page": "opacity, transform",
      },

      transitionDuration: {
        "session-page": "250ms",
      },

      transitionTimingFunction: {
        "session-page": "ease",
      },

      backgroundImage: {
        "locked-stripes-dark":  "repeating-linear-gradient(-45deg, var(--wktc-srs-locked) 0, var(--wktc-srs-locked) 4px, transparent 4px, transparent 8px)",
        "locked-stripes-light": "repeating-linear-gradient(-45deg, var(--wktc-srs-lesson) 0, var(--wktc-srs-lesson) 4px, transparent 4px, transparent 8px)",
      },

      // END OF EXTEND
    },

    textShadow: {
      none: "none",
      sm: "0 1px 2px var(--tw-shadow-color)",
      DEFAULT: "0 2px 4px var(--tw-shadow-color)",
      lg: "0 8px 16px var(--tw-shadow-color)",
    },

    colors: {
      // antd token shortcuts
      "white"     : "rgb(255 255 255 / <alpha-value>)",
      "black"     : "rgb(0 0 0 / <alpha-value>)",
      "primary"   : "rgb(var(--antd-primary) / <alpha-value>)",
      "success"   : "rgb(var(--antd-success) / <alpha-value>)",
      "link"      : "rgb(var(--antd-link) / <alpha-value>)",
      "basec"     : "var(--antd-text)",
      "base-c"    : "rgb(var(--antd-text-c) / <alpha-value>)",
      "o-70"      : "var(--antd-text-o-70)",
      "desc"      : "var(--antd-text-desc)",
      "desc-c"    : "rgb(var(--antd-text-desc-c) / <alpha-value>)",
      "disabled"  : "var(--antd-text-disabled)",
      "disabled-c": "rgb(var(--antd-text-disabled-c) / <alpha-value>)",
      "solidc"    : "rgb(var(--antd-text-solid) / <alpha-value>)",
      "split"     : "var(--antd-split)",
      "container" : "rgb(var(--antd-container) / <alpha-value>)",
      "spotlight" : "rgb(var(--antd-spotlight) / <alpha-value>)",
      "header"    : "rgb(var(--antd-header) / <alpha-value>)",

      // wktc colors
      ...generateWktcColors(),

      // antd colors
      ...generateAntColors(),

      // others
      "question-meaning-dark"    : "#1f1f1f",
      "question-meaning-dark-hc" : "#bfbfbf",
      "question-meaning-light"   : "#d9d9d9",
      "question-meaning-light-hc": "#ffffff",
      "question-reading-light"   : "#808080",
      "question-reading-light-hc": "#434343",
      "reviews-cumulative-dark"  : "#095cb5",
      "reviews-cumulative-light" : "#69b1ff",

      // misc missing values
      "transparent": "transparent",
      "none"       : "none",
      "inherit"    : "inherit",
      "current"    : "currentColor"
    },
  },
  plugins: [
    clipPath,
    logical,

    // text-shadow
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        { "text-shadow": v => ({ textShadow: v }) },
        { values: theme("textShadow") }
      );
    }),

    // light mode and palette variants
    plugin(({ addVariant }) => {
      addVariant("light", ":is(.light &)");
      addVariant("palette-ks", ":is(.palette-kanjiSchool &)");
      addVariant("palette-fdd", ":is(.palette-fdDark &)");
      addVariant("palette-fdl", ":is(.palette-fdLight &)");
    })
  ],
});

function generateAntColors() {
  const out = {};

  for (const colorName in presetPalettes) {
    const palette = presetPalettes[colorName];
    const colorOut = {};

    for (const shade in palette) {
      if (shade === "grey") continue;
      const name = shade === "primary" ? "DEFAULT" : shade.toString();
      colorOut[name] = `rgb(var(--antd-${colorName}-${shade}) / <alpha-value>)`;
    }

    out[colorName] = colorOut;
  }

  return out;
}

function generateWktcColors() {
  // Copy from ./src/global/theme/palette.ts
  const paletteInterface = `
  radical   : string;
  kanji     : string;
  vocabulary: string;
  reading   : string;

  radicalDark   : string;
  kanjiDark     : string;
  vocabularyDark: string;

  radicalText     : string;
  kanjiText       : string;
  vocabularyText  : string;
  sharedStagesText: string;

  vocabularyHiragana: string;
  vocabularyKatakana: string;

  srsLesson     : string;
  srsApprentice : string;
  srsApprentice1: string;
  srsApprentice2: string;
  srsApprentice3: string;
  srsApprentice4: string;
  srsPassed     : string;
  srsGuru       : string;
  srsMaster     : string;
  srsEnlightened: string;
  srsBurned     : string;
  srsLocked     : string;
  srsNotOnWk    : string;
  `;

  const noVariants = {
    "radicalText"     : true,
    "kanjiText"       : true,
    "vocabularyText"  : true,
    "sharedStagesText": true,
  };

  const names = paletteInterface.match(/(?<=\n\s+)(\w+)(?=\s*:)/g);
  const convertKeyName = keyName => kebabCase(keyName.replace(/(\d+)/, "-$1"));

  const out = {};

  for (const name of names) {
    const keyName = convertKeyName(name);
    out[keyName] = `var(--wktc-${keyName})`;

    if (!noVariants[keyName]) {
      out[`${keyName}-lighter`] = `var(--wktc-${keyName}-lighter)`;
      out[`${keyName}-light`]   = `var(--wktc-${keyName}-light)`;
      out[`${keyName}-dark`]    = `var(--wktc-${keyName}-dark)`;
    }
  }

  return out;
}

export default generateConfig();
