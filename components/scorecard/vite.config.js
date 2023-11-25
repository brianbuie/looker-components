import { resolve } from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  define: {
    // Workaround to replace process.env check in bundled js
    // Whch causes an error in the browser.
    'process.env.NODE_ENV': process.env.NODE_ENV === 'production' ? '"production"' : undefined,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.jsx'),
      formats: ['es'],
      name: 'scorecard',
      fileName: 'index',
    },
  },
  plugins: [
    react({
      babel: {
        plugins: [
          [
            'babel-plugin-styled-components',
            {
              displayName: true,
            },
          ],
        ],
      },
    }),
  ],
});
