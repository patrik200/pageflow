const { join } = require("path");
const { readdirSync, statSync } = require("fs");

function getAllTsConfigPaths() {
  const workRoot = join(process.cwd(), "packages");

  const packages = readdirSync(workRoot).map((fp) => join(workRoot, fp));

  const project = [];
  while (packages.length) {
    const path = packages.shift();
    if (!statSync(path).isDirectory()) continue;

    const dirs = readdirSync(path);
    if (dirs.includes("tsconfig.json")) {
      project.push(join(path, "tsconfig.json"));
      continue;
    }
    for (let f of dirs) packages.push(path + "/" + f);
  }

  return project;
}

module.exports = { getAllTsConfigPaths };
