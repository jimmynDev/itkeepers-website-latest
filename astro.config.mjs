import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://itkeepers.com',
  // Keep small component scripts external so script-src 'self' permits them.
  vite: { build: { assetsInlineLimit: 0 } }
});
