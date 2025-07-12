import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    lib: {
      entry: './src/madoi.ts',
      name: 'madoi',
      formats: ["es", "umd"],
      fileName: (format) => `madoi.${format}.js`,      
    },
  },
});
