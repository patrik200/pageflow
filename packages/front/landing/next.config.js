const path = require("path");

module.exports = require("@app/nextjs")({
  addEnv: true,
  addIntl: true,
  rootFolder: path.join(process.cwd(), "..", "..", ".."),
  vanillaExtractExternalPackagesHack: ["polished", "@app/ui-kit"],
  faviconConfig: {},
});
