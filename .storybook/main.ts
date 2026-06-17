import type { StorybookConfig } from '@storybook/react-vite';

const config: StorybookConfig = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(ts|tsx)'],
  addons: ['@storybook/addon-essentials', '@storybook/addon-themes'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    // On GitHub Pages the site is served from a subpath
    // (https://<user>.github.io/<repo>/), so the asset base must match.
    // The deploy workflow sets PAGES_BASE; locally it defaults to '/'.
    config.base = process.env.PAGES_BASE || '/';
    return config;
  },
};

export default config;
