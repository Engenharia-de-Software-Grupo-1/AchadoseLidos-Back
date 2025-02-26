import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import importPlugin from "eslint-plugin-import";

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ["**/*.{js,mjs,cjs,ts}"] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    plugins: {
      import: importPlugin,
    },
    rules: {
      "no-multiple-empty-lines": ["error", { "max": 1, "maxEOF": 1, "maxBOF": 0 }],
      "semi": ["error", "always"],
      "indent": ["error", 2],
      "object-curly-spacing": ["error", "always"],
      "comma-dangle": ["error", "always-multiline"],
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
      "space-before-function-paren": ["error", "never"],
      "arrow-spacing": ["error", { "before": true, "after": true }],

      "import/order": [
        "error",
        {
          "groups": [
            ["builtin", "external"],
            ["internal"],
            ["parent", "sibling", "index"]
          ],
          "newlines-between": "always"
        }
      ],

      "no-console": "error",
    },
  },
];
