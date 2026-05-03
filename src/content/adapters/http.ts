import type { BlogPost, CustomerStory, Job } from '../schemas';

/**
 * HTTP content adapter — placeholder for v2.
 *
 * Future implementation: fetch from `api.imageleft.com/public/*` and validate
 * responses against the schemas in `../schemas.ts`. Today this stub throws so a
 * misconfigured `CONTENT_SOURCE=http` fails loudly at the first call site.
 */

const NOT_IMPLEMENTED = 'HTTP content adapter is not implemented yet (v2).';

export async function getBlogPosts(): Promise<BlogPost[]> {
  throw new Error(NOT_IMPLEMENTED);
}
export async function getBlogPost(_slug: string): Promise<BlogPost | null> {
  throw new Error(NOT_IMPLEMENTED);
}
export async function getJobs(): Promise<Job[]> {
  throw new Error(NOT_IMPLEMENTED);
}
export async function getJob(_slug: string): Promise<Job | null> {
  throw new Error(NOT_IMPLEMENTED);
}
export async function getStories(): Promise<CustomerStory[]> {
  throw new Error(NOT_IMPLEMENTED);
}
export async function getStory(_slug: string): Promise<CustomerStory | null> {
  throw new Error(NOT_IMPLEMENTED);
}
