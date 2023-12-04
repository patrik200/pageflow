const { execSync } = require("node:child_process");

const { fixPath } = require("./fix-path");

function build({ additionalEntryPoints } = {}) {
  const rootPath = process.cwd();
  if (!rootPath) throw new Error("rootPath is not defined");

  fixPath(rootPath);

  const execOptions = { cwd: rootPath, stdio: "inherit", env: { PATH: process.env.PATH, NODE_ENV: "production" } };

  try {
    execSync("vite build", execOptions);
    additionalEntryPoints?.forEach((entry) => execSync(`vite build -c vite.${entry}.config.js`, execOptions));
    execSync("nest build", execOptions);
  } catch (e) {
    throw new Error("Build failed");
  }
}

module.exports = {
  build,
  getDependenciesFromPackageLock: require("./dependencies").getDependenciesFromPackageLock,
  buildVite: require("./build-vite").buildVite,
};
