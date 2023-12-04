const { getAllTsConfigPaths } = require("./eslint-ts-config-paths.js");

const project = getAllTsConfigPaths();

/** @type {import('eslint').Linter.Config} */
const config = {
  extends: ["@worksolutions/common", "plugin:import/recommended", "plugin:import/typescript"],
  plugins: ["import", "unused-imports"],
  settings: {
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"],
    },
    "import/resolver": {
      typescript: { project },
      node: { project },
    },
  },
  rules: {
    "react-hooks/exhaustive-deps": [
      "error",
      {
        additionalHooks: "(useAsyncFn|useEffectSkipFirst|useMemoizeCallback|useObservableAsDeferredMemo)",
      },
    ],
    "comma-spacing": "error",
    "no-multi-spaces": "error",
    "no-multiple-empty-lines": ["error", { max: 1 }],
    "no-unused-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "unused-imports/no-unused-imports": "error",
    "unused-imports/no-unused-vars": ["error"],
    "import/default": "off",
    "import/no-named-as-default-member": "off",
    "import/newline-after-import": ["error", { count: 1, exactCount: true, considerComments: true }],
  },
  overrides: [
    {
      files: ["packages/back/**/*.ts*"],
      rules: {
        "import/order": [
          "error",
          {
            "newlines-between": "always",
            distinctGroup: true,
            groups: [["builtin", "external"], "internal", ["parent", "sibling"], "index", "unknown"],
            pathGroupsExcludedImportTypes: ["builtin"],
            pathGroups: [
              // react
              // пакеты node_modules
              {
                pattern: "react",
                group: "builtin",
              },
              {
                pattern: "@app/**",
                group: "external",
              },
              {
                pattern: "@worksolutions/**",
                group: "external",
              },
              // libs
              {
                pattern: "libs",
                group: "internal",
                position: "before",
              },
              // entities
              {
                pattern: "entities/**",
                group: "internal",
                position: "before",
              },
              // misc
              {
                pattern: "fixtures/**",
                group: "internal",
                position: "before",
              },
              {
                pattern: "constants/**",
                group: "internal",
                position: "before",
              },
              // modules
              {
                pattern: "modules/**",
                group: "internal",
                position: "before",
              },
              // types
              {
                pattern: "types",
                group: "internal",
              },
              {
                pattern: "types/**",
                group: "internal",
              },
              // relative controllers
              {
                pattern: "./controllers/**",
                group: "sibling",
              },
              {
                pattern: "./controllers",
                group: "sibling",
              },
              {
                pattern: "./controller",
                group: "sibling",
              },

              // relative services
              {
                pattern: "./services/**",
                group: "sibling",
                position: "after",
              },
              // relative strategies
              {
                pattern: "./strategies/**",
                group: "sibling",
                position: "after",
              },

              // relative dto
              {
                pattern: "../dto/**",
                group: "parent",
                position: "after",
              },
              {
                pattern: "./dto/**",
                group: "sibling",
                position: "after",
              },
              {
                pattern: "**/*.ts",
                group: "sibling",
                position: "before",
              },
            ],
          },
        ],
      },
    },
    {
      files: ["packages/front/**/*.ts*"],
      rules: {
        "import/order": [
          "error",
          {
            "newlines-between": "always",
            distinctGroup: true,
            groups: [["builtin", "external"], "internal", ["parent", "sibling"], "index", "unknown"],
            pathGroupsExcludedImportTypes: ["builtin"],
            pathGroups: [
              // react
              // пакеты node_modules
              {
                pattern: "react",
                group: "builtin",
              },
              {
                pattern: "react-dom/**",
                group: "builtin",
              },
              {
                pattern: "@app/**",
                group: "external",
              },
              {
                pattern: "@worksolutions/**",
                group: "external",
              },
              {
                pattern: "components/**",
                group: "internal",
                position: "before",
              },
              {
                pattern: "views/**",
                group: "internal",
                position: "before",
              },
              // ui kit
              {
                pattern: "main",
                group: "internal",
                position: "before",
              },
              {
                pattern: "primitives/**",
                group: "internal",
                position: "before",
              },
              // libs
              {
                pattern: "libs",
                group: "internal",
                position: "before",
              },
              // core stuff
              {
                pattern: "core/*",
                group: "internal",
                position: "before",
              },

              // entities
              {
                pattern: "entities/**",
                group: "internal",
                position: "before",
              },
              {
                pattern: "**/entities/**",
                group: "internal",
                position: "before",
              },
              // storages
              {
                pattern: "**/storages/**",
                group: "internal",
                position: "before",
              },
              // types
              {
                pattern: "types",
                group: "internal",
              },
              {
                pattern: "types/**",
                group: "internal",
              },
              {
                pattern: "../types{,/**}",
                group: "parent",
                position: "before",
              },
              {
                pattern: "./types{,/**}",
                group: "sibling",
                position: "before",
              },
              // hooks
              {
                pattern: "../hooks/**",
                group: "parent",
                position: "after",
              },
              {
                pattern: "**/hooks/**",
                group: "sibling",
                position: "after",
              },
              {
                pattern: "./hooks/**",
                group: "sibling",
                position: "after",
              },
              {
                pattern: "./hooks",
                group: "sibling",
                position: "after",
              },
              // relative styles
              {
                pattern: "{.,..}/**/*.css",
                group: "unknown",
                position: "after",
              },
            ],
          },
        ],
      },
    },
  ],
};

module.exports = config;
