/**
 * Public content adapter interface.
 *
 * Pages and sections call ONLY through this module — never directly into
 * `astro:content` or any specific adapter. That gives us a single seam to
 * swap from local (filesystem MDX/JSON) to HTTP (app.imageleft.com) without
 * touching consumer code.
 *
 * Source selected at build time via `CONTENT_SOURCE` env var. `local` is the
 * default; `http` is a stub today (throws) and will be implemented in v2.
 */

import * as http from './adapters/http';
import * as local from './adapters/local';
import type { BlogPost, Job } from './schemas';

// Use HTTP adapter only when both CONTENT_SOURCE=http AND BACKOFFICE_URL are set.
// Falls back to local content when the back office URL is not configured (e.g. CI without the secret).
const source = import.meta.env.CONTENT_SOURCE ?? 'local';
const hasBackoffice = !!import.meta.env.BACKOFFICE_URL;

const adapter = source === 'http' && hasBackoffice ? http : local;

export const getBlogPosts = (): Promise<BlogPost[]> => adapter.getBlogPosts();
export const getBlogPost = (slug: string): Promise<BlogPost | null> => adapter.getBlogPost(slug);
export const getJobs = (): Promise<Job[]> => adapter.getJobs();
export const getJob = (slug: string): Promise<Job | null> => adapter.getJob(slug);
