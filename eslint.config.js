const antfu = require('@antfu/eslint-config').default

module.exports = antfu({
  rules: {
    'no-console': 0,
    'ts/consistent-type-imports': 0,
  },
})
