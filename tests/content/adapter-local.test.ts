import { describe, expect, it, vi } from 'vitest';

/*
 * `astro:content` is a virtual module provided at build time by Astro.
 * We mock it with deterministic fixtures across all three collections (blog,
 * careers, stories) so the adapter's mapping/sorting logic can be unit-tested
 * without an Astro runtime.
 */
vi.mock('astro:content', () => {
  const baseAuthor = { name: 'Israel' };

  const blog = [
    {
      id: 'older',
      data: {
        title: 'Older post',
        excerpt: '...',
        publishedAt: new Date('2026-01-15'),
        author: baseAuthor,
        coverImage: '/og/older.png',
        tags: [],
      },
    },
    {
      id: 'welcome',
      data: {
        title: 'Welcome to the new imageleft',
        excerpt: '...',
        publishedAt: new Date('2026-05-02'),
        author: baseAuthor,
        coverImage: '/og/welcome.png',
        tags: ['news'],
      },
    },
  ];

  const careers = [
    {
      id: 'old-role',
      data: {
        title: 'Old role',
        team: 'Platform',
        location: 'Remote',
        type: 'full-time',
        postedAt: new Date('2026-01-01'),
        description: '...',
      },
    },
    {
      id: 'senior-engineer',
      data: {
        title: 'Senior Engineer',
        team: 'Platform',
        location: 'Remote',
        type: 'full-time',
        postedAt: new Date('2026-05-02'),
        description: 'Help us build great products.',
      },
    },
  ];

  return {
    getCollection: vi.fn(async (collection: string) => {
      if (collection === 'blog') return blog;
      if (collection === 'careers') return careers;
      return [];
    }),
    getEntry: vi.fn(async (collection: string, slug: string) => {
      const lookup: Record<string, Array<{ id: string }>> = {
        blog,
        careers,
      };
      const set = lookup[collection];
      if (!set) return null;
      return set.find((e) => e.id === slug) ?? null;
    }),
  };
});

import { getBlogPost, getBlogPosts, getJob, getJobs } from '../../src/content';

describe('local content adapter — blog', () => {
  it('returns posts sorted by publishedAt desc', async () => {
    const posts = await getBlogPosts();
    expect(posts.length).toBe(2);
    expect(posts[0].slug).toBe('welcome');
    expect(posts[1].slug).toBe('older');
  });

  it('attaches the entry id as `slug`', async () => {
    const posts = await getBlogPosts();
    expect(posts.every((p) => typeof p.slug === 'string' && p.slug.length > 0)).toBe(true);
  });

  it('returns null for an unknown slug', async () => {
    expect(await getBlogPost('does-not-exist')).toBeNull();
  });

  it('returns the matching post by slug', async () => {
    const post = await getBlogPost('welcome');
    expect(post).not.toBeNull();
    expect(post!.title).toBe('Welcome to the new imageleft');
  });
});

describe('local content adapter — careers', () => {
  it('returns jobs sorted by postedAt desc', async () => {
    const jobs = await getJobs();
    expect(jobs.length).toBe(2);
    expect(jobs[0].slug).toBe('senior-engineer');
    expect(jobs[1].slug).toBe('old-role');
  });

  it('returns null for an unknown slug', async () => {
    expect(await getJob('not-real')).toBeNull();
  });

  it('returns the matching job by slug', async () => {
    const job = await getJob('senior-engineer');
    expect(job).not.toBeNull();
    expect(job!.title).toBe('Senior Engineer');
  });
});
