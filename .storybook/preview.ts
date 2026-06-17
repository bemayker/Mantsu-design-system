import type { Preview } from '@storybook/react';
import '../src/styles/globals.css';

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'frost',
      values: [
        { name: 'frost', value: '#eef6f8' },
        { name: 'white', value: '#ffffff' },
        { name: 'midnight', value: '#00193f' },
      ],
    },
  },
};

export default preview;
