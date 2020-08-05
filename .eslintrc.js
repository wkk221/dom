module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/essential',
    '@vue/standard'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'space-before-function-paren': 0,
    'keyword-spacing': 0,
    'space-in-parens': 0,
    'no-multiple-empty-lines':0,
    // 'camelcase':0,
    'no-unused-vars':0,
    'no-trailing-spaces':0,
    'camelcase': ["error", {"allow": ["aa_bb"]}],
    'quotes': 0,
    'quote-props': 0
  }
}
