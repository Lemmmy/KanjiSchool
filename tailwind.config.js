/** @type {import('tailwindcss').Config} */
import { presetPalettes } from "@ant-design/colors";
import plugin from "tailwindcss/plugin";
import clipPath from "tailwind-clip-path";

function generateAntColors() {
  const out = {};

  for (const colorName in presetPalettes) {
    const palette = presetPalettes[colorName];
    const colorOut = {};

    for (const shade in palette) {
      const name = shade === "primary" ? "DEFAULT" : shade.toString();
      colorOut[name] = `rgb(var(--antd-${colorName}-${shade}) / <alpha-value>)`;
    }

    out[colorName] = colorOut;
  }

  return out;
}

export default {
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
        "page-header": "56px",
        "header"     : "64px",
        "toc"        : "180px",
        "toc-right"  : "-204px", // -toc - lg
        "study-modal": "182px", // 150px + md * 2
        "text"       : "0.3em",
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

      // wktc base colors
      "radical"             : "var(--wktc-radical)",
      "kanji"               : "var(--wktc-kanji)",
      "vocabulary"          : "var(--wktc-vocabulary)",
      "reading"             : "var(--wktc-reading)",
      "vocabulary-hiragana" : "var(--wktc-vocabulary-hiragana)",
      "vocabulary-katakana" : "var(--wktc-vocabulary-katakana)",
      "srs-lesson"          : "var(--wktc-srs-lesson)",
      "srs-apprentice"      : "var(--wktc-srs-apprentice)",
      "srs-apprentice-1"    : "var(--wktc-srs-apprentice-1)",
      "srs-apprentice-2"    : "var(--wktc-srs-apprentice-2)",
      "srs-apprentice-3"    : "var(--wktc-srs-apprentice-3)",
      "srs-apprentice-4"    : "var(--wktc-srs-apprentice-4)",
      "srs-passed"          : "var(--wktc-srs-passed)",
      "srs-guru"            : "var(--wktc-srs-guru)",
      "srs-master"          : "var(--wktc-srs-master)",
      "srs-enlightened"     : "var(--wktc-srs-enlightened)",
      "srs-burned"          : "var(--wktc-srs-burned)",
      "srs-locked"          : "var(--wktc-srs-locked)",
      "srs-not-on-wk"       : "var(--wktc-srs-not-on-wk)",

      // wktc lighter colors
      "radical-lighter"             : "var(--wktc-radical-lighter)",
      "kanji-lighter"               : "var(--wktc-kanji-lighter)",
      "vocabulary-lighter"          : "var(--wktc-vocabulary-lighter)",
      "reading-lighter"             : "var(--wktc-reading-lighter)",
      "vocabulary-hiragana-lighter" : "var(--wktc-vocabulary-hiragana-lighter)",
      "vocabulary-katakana-lighter" : "var(--wktc-vocabulary-katakana-lighter)",
      "srs-lesson-lighter"          : "var(--wktc-srs-lesson-lighter)",
      "srs-apprentice-lighter"      : "var(--wktc-srs-apprentice-lighter)",
      "srs-apprentice-1-lighter"    : "var(--wktc-srs-apprentice-1-lighter)",
      "srs-apprentice-2-lighter"    : "var(--wktc-srs-apprentice-2-lighter)",
      "srs-apprentice-3-lighter"    : "var(--wktc-srs-apprentice-3-lighter)",
      "srs-apprentice-4-lighter"    : "var(--wktc-srs-apprentice-4-lighter)",
      "srs-passed-lighter"          : "var(--wktc-srs-passed-lighter)",
      "srs-guru-lighter"            : "var(--wktc-srs-guru-lighter)",
      "srs-master-lighter"          : "var(--wktc-srs-master-lighter)",
      "srs-enlightened-lighter"     : "var(--wktc-srs-enlightened-lighter)",
      "srs-burned-lighter"          : "var(--wktc-srs-burned-lighter)",
      "srs-locked-lighter"          : "var(--wktc-srs-locked-lighter)",
      "srs-not-on-wk-lighter"       : "var(--wktc-srs-not-on-wk-lighter)",

      // wktc darker colors
      "radical-darker"             : "var(--wktc-radical-darker)",
      "kanji-darker"               : "var(--wktc-kanji-darker)",
      "vocabulary-darker"          : "var(--wktc-vocabulary-darker)",
      "vocabulary-dark-darker"     : "var(--wktc-vocabulary-dark-darker)",
      "vocabulary-hiragana-darker" : "var(--wktc-vocabulary-hiragana-darker)",
      "vocabulary-katakana-darker" : "var(--wktc-vocabulary-katakana-darker)",
      "srs-lesson-darker"          : "var(--wktc-srs-lesson-darker)",
      "srs-apprentice-darker"      : "var(--wktc-srs-apprentice-darker)",
      "srs-apprentice-1-darker"    : "var(--wktc-srs-apprentice-1-darker)",
      "srs-apprentice-2-darker"    : "var(--wktc-srs-apprentice-2-darker)",
      "srs-apprentice-3-darker"    : "var(--wktc-srs-apprentice-3-darker)",
      "srs-apprentice-4-darker"    : "var(--wktc-srs-apprentice-4-darker)",
      "srs-passed-darker"          : "var(--wktc-srs-passed-darker)",
      "srs-guru-darker"            : "var(--wktc-srs-guru-darker)",
      "srs-master-darker"          : "var(--wktc-srs-master-darker)",
      "srs-enlightened-darker"     : "var(--wktc-srs-enlightened-darker)",
      "srs-burned-darker"          : "var(--wktc-srs-burned-darker)",
      "srs-locked-darker"          : "var(--wktc-srs-locked-darker)",
      "srs-not-on-wk-darker"       : "var(--wktc-srs-not-on-wk-darker)",

      // wktc dark colors
      "radical-dark"             : "var(--wktc-radical-dark)",
      "kanji-dark"               : "var(--wktc-kanji-dark)",
      "vocabulary-dark"          : "var(--wktc-vocabulary-dark)",
      "reading-dark"             : "var(--wktc-reading-dark)",
      "radical-dark-dark"        : "var(--wktc-radical-dark-dark)",
      "kanji-dark-dark"          : "var(--wktc-kanji-dark-dark)",
      "vocabulary-dark-dark"     : "var(--wktc-vocabulary-dark-dark)",
      "vocabulary-hiragana-dark" : "var(--wktc-vocabulary-hiragana-dark)",
      "vocabulary-katakana-dark" : "var(--wktc-vocabulary-katakana-dark)",
      "srs-lesson-dark"          : "var(--wktc-srs-lesson-dark)",
      "srs-apprentice-dark"      : "var(--wktc-srs-apprentice-dark)",
      "srs-apprentice-1-dark"    : "var(--wktc-srs-apprentice-1-dark)",
      "srs-apprentice-2-dark"    : "var(--wktc-srs-apprentice-2-dark)",
      "srs-apprentice-3-dark"    : "var(--wktc-srs-apprentice-3-dark)",
      "srs-apprentice-4-dark"    : "var(--wktc-srs-apprentice-4-dark)",
      "srs-passed-dark"          : "var(--wktc-srs-passed-dark)",
      "srs-guru-dark"            : "var(--wktc-srs-guru-dark)",
      "srs-master-dark"          : "var(--wktc-srs-master-dark)",
      "srs-enlightened-dark"     : "var(--wktc-srs-enlightened-dark)",
      "srs-burned-dark"          : "var(--wktc-srs-burned-dark)",
      "srs-locked-dark"          : "var(--wktc-srs-locked-dark)",
      "srs-not-on-wk-dark"       : "var(--wktc-srs-not-on-wk-dark)",

      // antd colors
      ...generateAntColors(),

      // others
      "question-meaning-dark"    : "#1f1f1f",
      "question-meaning-dark-hc" : "#bfbfbf",
      "question-meaning-light"   : "#eeeeee", // TODO
      "question-meaning-light-hc": "#eeeeee", // TODO
      "reviews-cumulative"       : "#095cb5",

      // misc missing values
      "transparent": "transparent",
      "none"       : "none",
      "inherit"    : "inherit",
      "current"    : "currentColor"
    },
  },
  plugins: [
    clipPath,

    // text-shadow
    plugin(({ matchUtilities, theme }) => {
      matchUtilities(
        { "text-shadow": v => ({ textShadow: v }) },
        { values: theme("textShadow") }
      );
    }),
  ],
};

