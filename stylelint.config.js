module.exports = {
  customSyntax: "postcss-styled-syntax",
  plugins: ["design-system-stylelint"],
  rules: {
    "design-system/no-hardcoded-color": [
      true,
      { themePath: "./src/styles/theme.ts" },
    ],
    "design-system/no-hardcoded-font": true,
  },
};
