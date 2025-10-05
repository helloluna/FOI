import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import sitemap from '@astrojs/sitemap';
import fg from 'fast-glob';
import fs from 'node:fs';

// 你站点的根域名（必须填，sitemap 用它拼绝对 URL）
const SITE = 'https://unseenbeings.org';

// 构建时刻（ISO），用于普通页面的 lastmod
const BUILD_TIME = new Date().toISOString();

// 自动收集 /public/resources 下的所有 PDF，生成绝对 URL
const pdfGlobs = ['public/resources/**/*.pdf'];
const pdfFiles = await fg(pdfGlobs, { dot: false });
const pdfEntries = pdfFiles.map((absPath) => {
  const stats = fs.statSync(absPath);
  const pathname = '/' + absPath.replace(/^public\//, '');
  return {
    url: `${SITE}${pathname}`,
    pathname,
    mtime: stats.mtime.toISOString(),
  };
});
// 让 sitemap.serialize 能查到每个 PDF 的 mtime
const pdfMtimeMap = new Map(pdfEntries.map((e) => [e.pathname, e.mtime]));

export default defineConfig({
  site: SITE,

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

    // 🔁 自动 sitemap（包含页面 + PDF）
    sitemap({
      // 把 PDF 作为“自定义页面”注入（Astro 会自动发现 MD 页）
      customPages: pdfEntries.map((e) => e.url),

      // 过滤 404 等无意义路由
      filter: (page) => !page.pathname.includes('404'),

      // 统一设置每条 URL 的元数据
      serialize(item) {
        const isPage = !item.pathname.includes('.') || item.pathname.endsWith('/');
        const isPDF = item.pathname.endsWith('.pdf');

        // lastmod：页面=构建时间；PDF=真实 mtime
        const lastmod = isPDF
          ? pdfMtimeMap.get(item.pathname) ?? BUILD_TIME
          : (isPage ? BUILD_TIME : undefined);

        if (isPage || isPDF) {
          return {
            ...item,
            lastmod,
            changefreq: isPage ? 'monthly' : 'yearly',
            priority: isPage ? 0.8 : 0.6,
          };
        }
        return null;
      },
    }),
  ],
});