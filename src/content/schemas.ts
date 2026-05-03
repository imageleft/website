import { z } from 'zod';

/**
 * Schemas for the content adapter. Pages always import the inferred types from here,
 * never define their own shapes. The same Zod object is also used by Astro's Content
 * Collections (with `.omit({ slug: true })`) so on-disk content is validated at build.
 */

export const BlogPost = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  publishedAt: z.coerce.date(),
  author: z.object({
    name: z.string(),
    avatar: z.url().optional(),
  }),
  coverImage: z.string(),
  tags: z.array(z.string()).default([]),
});
export type BlogPost = z.infer<typeof BlogPost>;

export const Job = z.object({
  slug: z.string(),
  title: z.string(),
  team: z.string(),
  location: z.string(),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  postedAt: z.coerce.date(),
  description: z.string(),
});
export type Job = z.infer<typeof Job>;

export const CustomerStory = z.object({
  slug: z.string(),
  customer: z.string(),
  logo: z.string(),
  industry: z.string(),
  summary: z.string(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  body: z.string(),
});
export type CustomerStory = z.infer<typeof CustomerStory>;
