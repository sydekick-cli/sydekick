const { resolve } = require("path");

module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: ["eslint:recommended", "plugin:@typescript-eslint/recommended", "prettier"],
  parserOptions: {
    ecmaVersion: 2020,
    project: resolve(__dirname, "tsconfig.json"),
  },
  rules: {
    // Your rules here
    "prettier/prettier": "error",
    "@typescript-eslint/ban-ts-comment": "off", // todo: reenable
  },
};
