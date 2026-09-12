import { defineConfig } from 'tsup';

// Four entry points, matching the `exports` map in package.json. React is
// external so a consuming app never ends up with two copies of it; that is
// also why react/react-dom are peerDependencies here.
export default defineConfig({
  entry: {
    index: 'src/index.ts',
    tokens: 'src/tokens/tokens.ts',
    'tailwind-preset': 'src/tailwind-preset.ts',
    icons: 'src/components/icons/index.ts',
  },
  format: ['esm', 'cjs'],
  dts: { compilerOptions: { composite: false } },
  sourcemap: true,
  clean: true,
  treeshake: true,
  external: ['react', 'react-dom'],
  tsconfig: 'tsconfig.build.json',
});
