module.exports = {
  roots: ["<rootDir>/src"],
  testMatch: ["**/__tests__/**/*.+(ts|tsx|js)", "**/?(*.)+(spec|test).+(ts|tsx|js)"],
  clearMocks: true,
  coverageDirectory: "coverage",
  transform: {
    "\\.[tj]sx?$": ["babel-jest", { configFile: "../../.babelrc.test.js" }],
  },
  moduleDirectories: ["node_modules", "src"],
};
