import { file, glob } from 'astro/loaders';
import { defineCollection } from 'astro:content';
import { BlogPost, Job } from './content/schemas';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/data/blog' }),
  // Slug is derived from the file's path by the glob loader, not the frontmatter.
  schema: BlogPost.omit({ slug: true }),
});

const careers = defineCollection({
  // file loader reads a single JSON array; each entry's `id` field becomes the slug.
  loader: file('./src/content/data/careers/index.json'),
  // Omit both slug and id — the loader derives id from the entry's JSON `id` field;
  // we re-attach both in the local adapter.
  schema: Job.omit({ slug: true, id: true }),
});

export const collections = { blog, careers };
