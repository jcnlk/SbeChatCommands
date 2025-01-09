import globals from "globals";
import pluginJs from "@eslint/js";

/** @type {import('eslint').Linter.Config[]} */
export default [
  pluginJs.configs.recommended,
  {
    languageOptions: {
      globals: {
        ...globals.browser,
        register: "readonly",
        ChatLib: "readonly",
        World: "readonly",
        TabList: "readonly",
        Scoreboard: "readonly",
      },
    },
    rules: { "no-control-regex": "warn" },
  },
];
