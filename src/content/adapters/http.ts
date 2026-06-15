import type { BlogPost, Job } from '../schemas';

const BASE = import.meta.env.BACKOFFICE_URL;

if (!BASE && import.meta.env.CONTENT_SOURCE === 'http') {
  throw new Error('BACKOFFICE_URL must be set when CONTENT_SOURCE=http');
}

async function api<T>(path: string): Promise<T> {
  const res = await fetch(`${BASE}/api/v1/public${path}`, {
    headers: { Accept: 'application/json' },
    // Astro static builds: revalidate every 60s (mirrors the API's Cache-Control)
    next: { revalidate: 60 },
  } as RequestInit);
  if (!res.ok) throw new Error(`Back Office API ${path} → ${res.status}`);
  return res.json() as Promise<T>;
}

// ── field mappers ─────────────────────────────────────────────────────────────

function mapPost(raw: Record<string, unknown>): BlogPost {
  return {
    slug: raw.slug as string,
    title: raw.title as string,
    excerpt: (raw.excerpt as string | null) ?? '',
    publishedAt: new Date(raw.publishedAt as string),
    author: {
      name: typeof raw.author === 'string' ? raw.author : ((raw.author as Record<string, string> | null)?.name ?? 'imageleft'),
      avatar: undefined,
    },
    coverImage: (raw.coverImageUrl as string | null) ?? '',
    tags: (raw.tags as string[]) ?? [],
  };
}

const JOB_TYPE_MAP: Record<string, Job['type']> = {
  FULL_TIME: 'full-time',
  PART_TIME: 'part-time',
  CONTRACT: 'contract',
  INTERNSHIP: 'internship',
};

function mapJob(raw: Record<string, unknown>): Job {
  return {
    slug: (raw.slug as string | null) ?? (raw.id as string),
    title: raw.title as string,
    team: (raw.team as string | null) ?? 'imageleft',
    location: (raw.location as string | null) ?? 'Remote',
    type: JOB_TYPE_MAP[raw.type as string] ?? 'full-time',
    postedAt: new Date((raw.datePosted ?? raw.createdAt) as string),
    description: raw.description as string,
  };
}

// ── adapter exports ───────────────────────────────────────────────────────────

export async function getBlogPosts(): Promise<BlogPost[]> {
  const data = await api<{ posts: Record<string, unknown>[] }>('/blog-posts');
  return data.posts.map(mapPost);
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  try {
    const data = await api<{ post: Record<string, unknown> }>(`/blog-posts/${slug}`);
    return mapPost(data.post);
  } catch {
    return null;
  }
}

export async function getJobs(): Promise<Job[]> {
  const data = await api<{ jobs: Record<string, unknown>[] }>('/jobs');
  return data.jobs.map(mapJob);
}

export async function getJob(slug: string): Promise<Job | null> {
  // The jobs API is a list endpoint — find the job by slug from the list.
  const jobs = await getJobs();
  return jobs.find((j) => j.slug === slug) ?? null;
}
