const path = require("path");

module.exports = {
  root: false,
  extends: [path.resolve(__dirname, "../../packages/config/eslint/react.cjs")],
  parserOptions: {
    tsconfigRootDir: __dirname
  }
};
