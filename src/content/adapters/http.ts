

/**
 * HTTP content adapter — placeholder for v2.
 *
 * Future implementation: fetch from `api.imageleft.com/public/*` and validate
 * responses against the schemas in `../schemas.ts`. Today this stub throws so a
 * misconfigured `CONTENT_SOURCE=http` fails loudly at the first call site.
 */
import type { BlogPost, Job } from '../schemas';

const PUBLIC_CMS_URL = import.meta.env.PUBLIC_CMS_URL;

// -------------------- JOBS --------------------

export async function getJobs(): Promise<Job[]> {
  const res = await fetch(`${PUBLIC_CMS_URL}/api/job`);
  if (!res.ok) {
    console.error('CMS fetch failed:', res.status);
    return [];
  }

  const data = await res.json();

  return (data.data ?? data.jobs ?? []).map((job: any) => ({
    slug: job.id,
    title: job.title,
    team: job.company ?? 'General',
    location: job.location ?? 'Remote',
    type: job.type,
    postedAt: new Date(job.createdAt),
    description: job.description,
  }));
}

export async function getJob(slug: string): Promise<Job | null> {
  const res = await fetch(`${PUBLIC_CMS_URL}/api/job/${slug}`);
  if (!res.ok) {
    console.error('CMS fetch failed:', res.status);
    return null;
  }

  return res.json();
}

// -------------------- BLOGS --------------------

export async function getBlogPosts(): Promise<BlogPost[]> {
  const res = await fetch(`${PUBLIC_CMS_URL}/api/public/blog-posts`);

  if (!res.ok) {
    console.error('CMS fetch failed:', res.status);
    return [];
  }

  const data = await res.json();

  return (data.posts ?? [])
    .filter((p: any) => p.isPublished && p.type === 'BLOG')
    .map((p: any) => ({
      slug: p.slug,
      title: p.title,
      excerpt: p.excerpt ?? '',
      content: p.content ,
      publishedAt: p.publishedAt ? new Date(p.publishedAt) : null,
      author: {
        name: p.author?.names ?? 'Unknown',
      },
      coverImage: p.coverImage ?? '/placeholder.png',
      tags: typeof p.tags === 'string' ? p.tags.split(',') : [],
    }));
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const res = await fetch(`${PUBLIC_CMS_URL}/api/public/blog-posts/${slug}`);

  if (!res.ok) {
    console.error('CMS fetch failed:', res.status);
    return null;
  }

  return res.json();
}