const { buildVite, getDependenciesFromPackageLock } = require("@app/builder");

export default buildVite({
  externals: getDependenciesFromPackageLock(require("../../../package-lock.json")),
  defineGlobalAsWindow: true,
});
