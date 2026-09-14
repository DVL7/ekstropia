import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { unified } from '@astrojs/markdown-remark';

export default defineConfig({
  site: 'https://ekstropia.pl',
  output: 'static',
  integrations: [sitemap()],
  markdown: {
    processor: unified(),
  },
});