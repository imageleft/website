// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

const SITE = 'https://new.imageleft.com';
const BASE = process.env.BACKOFFICE_URL ?? '';

/**
 * Fetch dynamic slugs from the Back Office at build time so they appear in the sitemap.
 * Falls back gracefully (empty array) if the Back Office is unreachable during a local build.
 */
async function getDynamicPages() {
  if (!BASE) return [];
  try {
    const [postsRes, jobsRes] = await Promise.all([
      fetch(`${BASE}/api/v1/public/blog-posts?limit=100`),
      fetch(`${BASE}/api/v1/public/jobs?limit=100`),
    ]);
    const { posts = [] } = postsRes.ok ? await postsRes.json() : {};
    const { jobs = [] } = jobsRes.ok ? await jobsRes.json() : {};
    return [
      ...posts.map((/** @type {{slug:string}} */ p) => `${SITE}/blog/${p.slug}/`),
      ...jobs.map((/** @type {{slug?:string,id:string}} */ j) => `${SITE}/careers/${j.slug ?? j.id}/`),
    ];
  } catch {
    return [];
  }
}

const dynamicPages = await getDynamicPages();

export default defineConfig({
  site: SITE,
  output: 'server',
  integrations: [
    mdx(),
    react(),
    sitemap({
      // Static pages are auto-discovered; dynamic routes (blog/careers slugs) must be
      // listed explicitly in SSR mode since the sitemap integration can't crawl them.
      customPages: dynamicPages,
      // Exclude the styleguide from the public sitemap.
      filter: (page) => !page.includes('/styleguide'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
