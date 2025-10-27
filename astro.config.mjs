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
          ],
        },
        {
          label: 'Context & History',
          items: [
            { label: 'Official Claims vs. Reality', link: '/contradictions' },
            { label: '25 Years of Legislative Theatre', link: '/legislative-timeline' },
          ],
        },
        {
          label: 'Analyses & Evidence',
          items: [
            { label: 'The Illusion of Democratic Oversight', link: '/democratic-illusion' },
            { label: 'WA OIC: Systemic Resource Starvation (2002–2025)', link: '/oic-starvation' },
          ],
        },
      ],
      customCss: ['./src/styles/starlight.css'],
    }),
    sitemap({
      // ✅ ensure safe URL access during Netlify builds
      filter: (page) => typeof page?.url === 'string',
    }),
  ],
});