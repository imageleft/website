import { getCollection, getEntry } from 'astro:content';
import type { BlogPost, Job } from '../schemas';

/**
 * Local content adapter — backed by Astro Content Collections (filesystem).
 * Active when `CONTENT_SOURCE=local` (default).
 *
 * Slugs come from the entry `id` (derived from the file path or the JSON `id` field
 * by the loaders), so we attach `slug` onto the parsed `data` payload to satisfy
 * the consumer-facing schema types.
 */

export async function getBlogPosts(): Promise<BlogPost[]> {
  const entries = await getCollection('blog');
  const posts = entries.map((e) => ({ ...e.data, slug: e.id }));
  return posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const entry = await getEntry('blog', slug);
  if (!entry) return null;
  return { ...entry.data, slug: entry.id };
}

export async function getJobs(): Promise<Job[]> {
  const entries = await getCollection('careers');
  const jobs = entries.map((e) => ({ ...e.data, slug: e.id }));
  return jobs.sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
}

export async function getJob(slug: string): Promise<Job | null> {
  const entry = await getEntry('careers', slug);
  if (!entry) return null;
  return { ...entry.data, slug: entry.id };
}
