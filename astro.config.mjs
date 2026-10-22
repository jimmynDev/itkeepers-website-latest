import { defineConfig } from 'astro/config';
import { contactBuildHeaders } from './scripts/contact-build-headers.mjs';

export default defineConfig({
  site: 'https://itkeepers.com',
  // Retain the pre-v7 HTML whitespace behavior and spacing between inline elements.
  compressHTML: true,
  devToolbar: { enabled: false },
  integrations: [contactBuildHeaders()],
  // Keep small component scripts external so script-src 'self' permits them.
  vite: { build: { assetsInlineLimit: 0 } }
});
