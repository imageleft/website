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
  // Raw markdown body — present on detail fetches, absent on list fetches.
  body: z.string().optional(),
});
export type BlogPost = z.infer<typeof BlogPost>;

export const Job = z.object({
  id: z.string(),   // Back Office DB id — used for submitting job applications
  slug: z.string(), // URL-safe identifier for routing
  title: z.string(),
  team: z.string(),
  location: z.string(),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  postedAt: z.coerce.date(),
  description: z.string(),
});
export type Job = z.infer<typeof Job>;
