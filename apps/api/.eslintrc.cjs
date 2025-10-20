const path = require("path");

module.exports = {
  root: false,
  extends: [path.resolve(__dirname, "../../packages/config/eslint/node.cjs")],
  parserOptions: {
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json"
  }
};
