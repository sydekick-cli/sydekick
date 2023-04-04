module.exports = {
  parser: "@typescript-eslint/parser",
  plugins: ["@typescript-eslint", "prettier"],
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier"
  ],
  parserOptions: {
    ecmaVersion: 2020,
    project: "./tsconfig.json",
  },
  rules: {
    // Your rules here
    "prettier/prettier": "error",
    "@typescript-eslint/ban-ts-comment": "off", // todo: reenable
  },
};
