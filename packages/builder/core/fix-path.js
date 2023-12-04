const path = require("node:path");

module.exports.fixPath = function (rootPath) {
  process.env.PATH += ":" + path.join(rootPath, "node_modules", ".bin");
};
