import globals from 'globals';
import js from '@eslint/js';
import react from 'eslint-plugin-react';
import hooks from 'eslint-plugin-react-hooks';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import jest from 'eslint-plugin-jest';
import storybook from 'eslint-plugin-storybook';

export default [
  /* ───────── 공통(JS·TS) ───────── */
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parserOptions: { ecmaVersion: 2024, sourceType: 'module' },
      globals: {
        ...globals.browser, // window·document 등
        ...globals.node, // process·__dirname 등
        RequestInit: 'readonly', // 아직 node 세트에 없음
      },
    },
    plugins: { react, 'react-hooks': hooks },
    rules: {
      ...react.configs.recommended.rules,
      ...hooks.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
    },
  },

  /* ───────── Jest 테스트 ───────── */
  {
    files: ['**/__tests__/**/*', '**/*.test.*'],
    languageOptions: { globals: globals.jest },
    plugins: { jest },
    rules: { ...jest.configs.recommended.rules },
  },

  /* ───────── Storybook ─────────── */
  {
    files: ['.storybook/**/*.{js,ts}'],
    languageOptions: { globals: globals.node },
  },

  /* ───────── JS 기본 preset ─────── */
  js.configs.recommended,

  /* ───────── TypeScript(마지막!) ─ */
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: { parser: tsParser },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      ...tsPlugin.configs.recommended.rules,
      'no-undef': 'off', // JS preset보다 뒤에 위치해야 효과 있음
      '@typescript-eslint/no-explicit-any': 'warn',
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    },
  },

  /* ───────── Storybook preset ─── */
  ...storybook.configs['flat/recommended'],
];
