import type { StorybookConfig } from '@storybook/react-webpack5';
import path from 'path';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: ['@storybook/addon-webpack5-compiler-swc', '@storybook/addon-docs'],
  staticDirs: ['../public'],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  staticDirs: ['../public'],

  webpackFinal: async (baseConfig) => {
    if (baseConfig.resolve) {
      baseConfig.resolve.alias = {
        ...(baseConfig.resolve.alias ?? {}),

        '@': path.resolve(__dirname, '../src'),
      };
    }
    return baseConfig;
  },
};

export default config;
