module.exports = {
  plugins: [
    "@vanilla-extract/babel-plugin",
    ["@babel/plugin-proposal-decorators", { legacy: true }],
    "babel-plugin-transform-typescript-metadata",
  ],
  presets: ["next/babel"],
};
