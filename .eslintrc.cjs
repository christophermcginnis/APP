const path = require("path");

module.exports = {
  root: true,
  extends: [path.resolve(__dirname, "packages/config/eslint/base.cjs")],
  ignorePatterns: ["dist", ".next", "node_modules"]
};
