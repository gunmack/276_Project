import globals from 'globals';
import pluginJs from '@eslint/js';
import pluginReact from 'eslint-plugin-react';
import pluginPrettier from 'eslint-config-prettier';
import pluginNext from '@next/eslint-plugin-next';

/** @type {import('eslint').Linter.Config[]} */
export default [
  { files: ['**/*.{js,mjs,cjs,jsx}'] },
  { languageOptions: { globals: globals.browser } },
  pluginJs.configs,
  pluginPrettier.configs,
  pluginNext.configs,
  pluginReact.configs.flat,
  'plugin:prettier/recommended',
  'prettier'
];
