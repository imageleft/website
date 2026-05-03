/**
 * Public content adapter interface.
 *
 * Pages and sections call ONLY through this module — never directly into
 * `astro:content` or any specific adapter. That gives us a single seam to
 * swap from local (filesystem MDX/JSON) to HTTP (api.imageleft.com) without
 * touching consumer code.
 *
 * Source selected at build time via `CONTENT_SOURCE` env var. `local` is the
 * default; `http` is a stub today (throws) and will be implemented in v2.
 */

import * as http from './adapters/http';
import * as local from './adapters/local';
import type { BlogPost, CustomerStory, Job } from './schemas';

const source = import.meta.env.CONTENT_SOURCE ?? 'local';

const adapter = source === 'http' ? http : local;

export const getBlogPosts = (): Promise<BlogPost[]> => adapter.getBlogPosts();
export const getBlogPost = (slug: string): Promise<BlogPost | null> => adapter.getBlogPost(slug);
export const getJobs = (): Promise<Job[]> => adapter.getJobs();
export const getJob = (slug: string): Promise<Job | null> => adapter.getJob(slug);
export const getStories = (): Promise<CustomerStory[]> => adapter.getStories();
export const getStory = (slug: string): Promise<CustomerStory | null> => adapter.getStory(slug);
