import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/madoi.ts',
      name: 'madoi',
      formats: ["umd"],
      fileName: (format) => `madoi.js`,      
    },
  },
});
