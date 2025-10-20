module.exports = {
  extends: [require.resolve("./base.cjs")],
  env: {
    node: true
  },
  rules: {
    "import/no-extraneous-dependencies": [
      "error",
      {
        devDependencies: ["**/*.test.ts", "**/scripts/**"]
      }
    ]
  }
};

