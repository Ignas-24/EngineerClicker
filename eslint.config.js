import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import vitest from '@vitest/eslint-plugin'
import customRules from './CustomRules/index.js'

export default [
  { ignores: ['dist','coverage'] },
  {
    files: ['**/*.{js,jsx}'],
    ignores: ['**/__tests__/**'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'custom': customRules,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'custom/numeric-separators': 'warn',
    },
  },
  {
    files: ["src/game/**/*.js"],
    ignores: ['**/__tests__/**'],
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      'custom': customRules,
    },
    rules: {
      'custom/require-notify-after-game-mutation': 'warn',
    }
  },
  {
    files: ["**/__tests__/**"],
    languageOptions: {
      globals: {
        ...globals.vitest,
      },
    },
    plugins: {
      vitest,
    },
    rules: {
      ...vitest.configs.recommended.rules, // vitest.configs.all.rules can be used for more rules
    },
  },
]
