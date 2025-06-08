import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';

export default defineConfig({
  integrations: [
    starlight({
      title: 'WA Animal Welfare Transparency',

      sidebar: [
        { label: 'Overview', items: [
            { label: 'Home', link: '/' },
            { label: 'About', link: '/about' },
        ]},
        { label: 'Actions & Records', items: [
            { label: 'Action Log',           link: '/action-log' },
            { label: 'Downloads & Resources', link: '/resources' },
        ]},
      ],

      /** 只留这一行，路径从项目根目录开始写 */
      customCss: ['./src/styles/starlight.css'],
    }),
  ],
});