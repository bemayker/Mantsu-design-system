// Copies the packaged stylesheet into dist/ after tsup has run.
// It is a plain copy on purpose: see src/styles/package.css for why this
// package ships no compiled Tailwind layers.
import { copyFile, mkdir } from 'node:fs/promises';

await mkdir('dist', { recursive: true });
await copyFile('src/styles/package.css', 'dist/styles.css');
console.log('build:css -> dist/styles.css');
