import { describe, expect, it } from 'vitest';
import { BlogPost, Job } from '../../src/content/schemas';

describe('BlogPost schema', () => {
  const validPost = {
    slug: 'hello',
    title: 'Hello',
    excerpt: 'A first post.',
    publishedAt: '2026-05-02',
    author: { name: 'Israel' },
    coverImage: '/og/hello.png',
  };

  it('parses a valid post', () => {
    expect(BlogPost.safeParse(validPost).success).toBe(true);
  });

  it('rejects a post missing required fields', () => {
    expect(BlogPost.safeParse({ slug: 'x' }).success).toBe(false);
  });

  it('coerces publishedAt to a Date', () => {
    const parsed = BlogPost.parse(validPost);
    expect(parsed.publishedAt).toBeInstanceOf(Date);
  });

  it('defaults tags to empty array', () => {
    const parsed = BlogPost.parse(validPost);
    expect(parsed.tags).toEqual([]);
  });

  it('accepts an optional avatar URL on author', () => {
    const parsed = BlogPost.parse({
      ...validPost,
      author: { name: 'Israel', avatar: 'https://example.com/avatar.png' },
    });
    expect(parsed.author.avatar).toBe('https://example.com/avatar.png');
  });

  it('rejects an invalid avatar URL', () => {
    const result = BlogPost.safeParse({
      ...validPost,
      author: { name: 'Israel', avatar: 'not-a-url' },
    });
    expect(result.success).toBe(false);
  });
});

describe('Job schema', () => {
  const validJob = {
    slug: 'senior-engineer',
    title: 'Senior Engineer',
    team: 'Product',
    location: 'Remote',
    type: 'full-time' as const,
    postedAt: '2026-05-01',
    description: 'Help us build great products.',
  };

  it('parses a valid job', () => {
    expect(Job.safeParse(validJob).success).toBe(true);
  });

  it('rejects an unknown employment type', () => {
    expect(Job.safeParse({ ...validJob, type: 'volunteer' }).success).toBe(false);
  });

  it('coerces postedAt to a Date', () => {
    const parsed = Job.parse(validJob);
    expect(parsed.postedAt).toBeInstanceOf(Date);
  });

  it('rejects a job missing required fields', () => {
    expect(Job.safeParse({ slug: 'x' }).success).toBe(false);
  });
});

