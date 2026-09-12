const mantsu = require('@bemayker/mantsu-design-system/tailwind-preset');

/** @type {import('tailwindcss').Config} */
module.exports = {
  // The preset is the only source of colours and type scale here. No local
  // token declarations: that absence is what the smoke test proves.
  presets: [mantsu],
  content: [
    './index.html',
    './src/**/*.{ts,tsx}',
    // Required: the package ships JavaScript, not compiled Tailwind layers,
    // so the classes its components reference must be scanned from dist.
    './node_modules/@bemayker/mantsu-design-system/dist/**/*.js',
  ],
};
