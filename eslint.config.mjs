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
        cancel: "readonly",
        ChatLib: "readonly",
        FileLib: "readonly",
        Server: "readonly",
        World: "readonly",
        Player: "readonly",
        TabList: "readonly",
        Scoreboard: "readonly",
        Java: "readonly"
      },
    },
    rules: { "no-control-regex": "warn" },
  },
];
