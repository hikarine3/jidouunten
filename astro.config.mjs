import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://jidouunten.jp',
  output: 'static',
  integrations: [sitemap()],
  build: { format: 'directory' },
});
