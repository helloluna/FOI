import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  integrations: [
    starlight({
      title: 'WA Animal Welfare Transparency',
      sidebar: [
        {
          label: 'Overview',
          items: [
            { label: 'Home', link: '/' },
            { label: 'About', link: '/about' },
          ],
        },
        {
          label: 'Actions & Records',
          items: [
            { label: 'Action Log', link: '/action-log' },
            { label: 'Downloads & Resources', link: '/resources' },
            { label: '25 Years of Legislative Theatre', link: '/legislative-timeline' },
            { label: 'Official Claims vs. Reality', link: '/contradictions' },
          ],
        },
      ],
      customCss: ['./src/styles/starlight.css'],
    }),
    sitemap({
      // ✅ 修复 Netlify 报错的核心：防止 undefined 访问
      filter: (page) => typeof page?.url === 'string',
    }),
  ],
});