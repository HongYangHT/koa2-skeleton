module.exports = {
  extends: "airbnb-base",
  rules: {
    "no-console": 0,
    "comma-dangle": 0,
    "quotes": 0,
    "new-cap": 0,
    "eol-last": 0,
    "global-require": 0,
    "no-plusplus": 0,
    "no-mixed-operators": 0,
    "no-underscore-dangle": 0,
    "no-multi-assign": 0,
    "no-ex-assign": 0,
    "default-case": 0,
    "class-methods-use-this": 0,
    "no-unused-expressions": [2, {
      allowShortCircuit: true,
      allowTernary: true
    }],
    "no-param-reassign": 0,
    "import/no-extraneous-dependencies": ["error", {
      "devDependencies": ["**/tests/**/*.js"],
    }],
    "import/newline-after-import": 0
  }
};
