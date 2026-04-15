import js from "@eslint/js";
import pluginQuery from "@tanstack/eslint-plugin-query";
import { defineConfig } from "eslint/config";
import globals from "globals";
import tseslint from "typescript-eslint";

export default defineConfig([
  {
    ignores: ["dist/**", "node_modules/**", "*.min.js", "public/**"],
  },
  ...pluginQuery.configs["flat/recommended"],
  {
    files: ["**/*.{js,mjs,cjs,ts,mts,cts,tsx,jsx}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: { globals: globals.browser },
  },
  tseslint.configs.recommended,
  {
    rules: {
      "@typescript-eslint/no-unused-vars": [
        "error",
        {
          varsIgnorePattern: "^_",
          argsIgnorePattern: "^_",
          caughtErrorsIgnorePattern: "^_",
        },
      ],
      "@typescript-eslint/ban-ts-comment": [
        "error",
        {
          "ts-nocheck": false,
          "ts-ignore": true,
          "ts-expect-error": "allow-with-description",
        },
      ],
    },
  },
]);
