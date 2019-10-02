module.exports = {
  env: {
    node: true,
    browser: false
  },
  extends: [
    "plugin:prettier/recommended",
  ],
  parser: "babel-eslint",
  parserOptions: {
    sourceType: "module",
    ecmaVersion: 2018,
    ecmaFeatures: {
      jsx: true,
    }
  }
};
