// $ npm i -D @ginpei/eslintrc
// $ npm i -D @typescript-eslint/eslint-plugin eslint eslint-config-prettier eslint-plugin-import eslint-plugin-prettier prettier

module.exports = {
  extends: ["react-app", "./node_modules/@ginpei/eslintrc/.eslintrc.js"],
  rules: {
    "no-shadow": "off",
    "@typescript-eslint/no-shadow": "error",
  },
};
