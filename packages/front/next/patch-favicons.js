const path = require("path");
const babel = require("@babel/core");
const fs = require("fs");
const read = require("fs-readdir-recursive");

const favicons = path.join(process.cwd(), "../../../node_modules", "favicons");

const dist = path.join(favicons, "dist");
const packageJson = path.join(favicons, "package.json");
const pj = JSON.parse(fs.readFileSync(packageJson, "utf-8"));

function run() {
  read(dist).forEach((link) => {
    if (!link.endsWith("js")) return;
    const res = babel.transformFileSync(path.join(dist, link), {
      plugins: ["@babel/plugin-transform-modules-commonjs"],
    });
    res.code += "\n\nif (exports.default) {module.exports = exports.default; Object.assign(module.exports, exports)}";
    fs.writeFileSync(path.join(dist, link), res.code);
  });

  pj.type = "commonjs";
  pj.patched = true;

  fs.writeFileSync(packageJson, JSON.stringify(pj, null, 2));

  console.log("complete favicon patcher");
}

if (!pj.patched) run();
