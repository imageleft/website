# imageleft.com — Static Marketing Site

**Date:** 2026-05-02
**Status:** Draft (post-brainstorm, awaiting plan)
**Owner:** Israel
**Repo (target):** `/home/zozin/Opt/imageleft/imageleft-site/` (to be created — sibling to current `imageleft-website` Next.js project)

---

## 1. Goal

Build a fresh, fully-static marketing site at `imageleft.com` from new Figma designs (`Nmds4AYHtECKtmnTUDRU6m` — "v0-revamped"). Independent codebase. Zero coupling to the current Next.js project. Designed so dynamic content (blog, careers, customer stories) can later be swapped from local JSON to a headless API without touching call sites.

### What's in scope (this and next session)
- The static site only.
- Local JSON as the data source.
- Figma → Astro/Tailwind translation, page by page, after design extraction.

### Explicitly out of scope (for now)
- The back-office app (`office.imageleft.com`) — this is part of the broader plan but not addressed here.
- The headless API (`api.imageleft.com`) — same. The static site is designed for it but doesn't build it.
- Authentication, CMS UI, payments, email, and any feature on the back-office side.
- Newsletter signup, on-site search, dark mode, cookie banner.

---

## 2. Architecture context (the three surfaces)

For background only. This spec only designs the first.

| Surface | Domain | Role | Tech (planned) |
|---|---|---|---|
| **Marketing site (this)** | `imageleft.com` | Public, anonymous | Astro 5 static |
| Back-office | `office.imageleft.com` | Authenticated staff app | Reshaped current Next.js project |
| Headless API | `api.imageleft.com` | Read+write for content & app | Carved from current Next.js routes |

The static site is a pure read-only consumer. It writes nothing. The only user-initiated action is the contact form, which opens the user's mail client via `mailto:` (no submission).

---

## 3. Scope — pages (tentative)

Page list will be confirmed after Figma analysis. Working set:

1. **Home** — long-form, sections include: about · systems we build · our services · how it works · business in a box · blog (preview) · customer stories (preview) · FAQ · contact · footer
2. **Community**
3. **Pricing**
4. **Contact**
5. **Blog** — list (`/blog`) + detail (`/blog/[slug]`)
6. **Career** — list (`/careers`) + detail (`/careers/[slug]`)

Plus shared chrome: site header, site footer, 404, possibly a 500. Sitemap + `robots.txt` generated at build.

---

## 4. Stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Astro 5 | Content-first SSG, zero-JS default, islands for interactivity |
| Output | `output: 'static'` | Pure static — no SSR, no server runtime |
| Styling | Tailwind v4 (CSS-first `@theme`) | Maps cleanly from Figma tokens |
| Rich content | MDX | Blog posts, possibly long-form pages |
| Type safety | TypeScript | End-to-end |
| Interactivity | React islands | Only where needed (FAQ accordion, mobile nav) |
| Image handling | Astro `<Image>` | Build-time resize, AVIF/WebP w/ fallback |
| Analytics | Plausible | Lightweight, privacy-respecting; or Cloudflare Web Analytics if proxying |
| Forms | `mailto:` | No backend integration |
| Linting / format | ESLint + Prettier (default Astro config) | Standard |
| Type-check | `astro check` (uses `@astrojs/check` + tsc) | Required gate in CI |

---

## 5. Content layer

### Adapter pattern

A thin abstraction over the content source. One typed interface, two implementations. Pages always import from the interface, never from the adapter directly.

```
src/content/
  index.ts                 # public interface — getBlogPosts, getJobs, getStories...
  adapters/
    local.ts               # v1 — reads from src/content/data/{blog,careers,stories}/*.{md,mdx,json}
    http.ts                # v2 — fetches from api.imageleft.com/public/* (NOT BUILT in v1)
  schemas.ts               # Zod schemas — single source of truth for types
  data/
    blog/
      first-post.mdx
      ...
    careers/
      senior-engineer.json
      ...
    stories/
      acme-bank.json
      ...
```

The selector reads `CONTENT_SOURCE` env var (`local` | `http`). For v1, `http` is unimplemented and `local` is hard-coded.

### Schemas (illustrative — finalized post-Figma)

Defined with Zod, used by Astro Content Collections + the adapter.

```ts
// schemas.ts (sketch)
export const BlogPost = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  publishedAt: z.coerce.date(),
  author: z.object({ name: z.string(), avatar: z.string().url().optional() }),
  coverImage: z.string(),
  tags: z.array(z.string()).default([]),
  body: z.string(), // raw MDX, rendered by Astro
});

export const Job = z.object({
  slug: z.string(),
  title: z.string(),
  team: z.string(),
  location: z.string(),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  postedAt: z.coerce.date(),
  description: z.string(), // markdown
});

export const CustomerStory = z.object({
  slug: z.string(),
  customer: z.string(),
  logo: z.string(),
  industry: z.string(),
  summary: z.string(),
  metrics: z.array(z.object({ label: z.string(), value: z.string() })).default([]),
  body: z.string(),
});
```

Each schema is exhaustive enough to render list cards, detail pages, and home-page previews from the same record.

---

## 6. Public API contract (sketch — for v2 swap)

Recorded here so the back-office/API team can build to a known shape later. Not implemented now.

```
GET  /public/blog             → BlogPost[]            (sorted by publishedAt desc)
GET  /public/blog/{slug}      → BlogPost | 404
GET  /public/careers          → Job[]                 (postedAt desc)
GET  /public/careers/{slug}   → Job | 404
GET  /public/stories          → CustomerStory[]
GET  /public/stories/{slug}   → CustomerStory | 404
```

Constraints:
- Read-only, anonymous (no auth header)
- CORS allows `https://imageleft.com` and `https://new.imageleft.com`
- Response shapes must match the Zod schemas
- Cache-Control: `public, max-age=300, s-maxage=900` (or similar)

---

## 7. Figma workflow

**Tool:** Framelink Figma MCP (free), already configured. Token in shell env, MCP registered globally.

**Two MCP tools:**
- `get_figma_data(fileKey, nodeId?, depth?)` — frame trees, layout, tokens, components
- `download_figma_images(fileKey, localPath, nodes[])` — PNG/SVG export

**Per-section flow:**
1. Pull the Figma frame via `get_figma_data` (with `depth` to keep payload small)
2. Identify tokens used (colors, typography, spacing)
3. Confirm tokens against the design-system frame (when present); record any unknowns
4. Translate frame → Astro component (layout, semantics, accessibility)
5. Pull asset exports via `download_figma_images` into `public/` or `src/assets/`
6. Render locally; visually compare to Figma frame
7. Iterate until parity, then move on

**Token extraction:**
- Mixed strategy. The Figma file may or may not have a complete design-system frame.
- Pass 1: extract whatever exists (`Foundations`, `Design System`, etc.)
- Pass 2: infer missing scales (spacing, radii, shadows) from observed values across screens; group similar values, propose a scale, get user confirmation
- Output: a Tailwind v4 `@theme` block in `src/styles/theme.css` — the single source of styling truth

---

## 8. Project structure

```
imageleft-site/
├── astro.config.mjs
├── tailwind.config.* | (Tailwind v4 = CSS-first, may not need)
├── tsconfig.json
├── package.json
├── public/
│   ├── favicon.svg
│   ├── og/                     # static OG images per page
│   └── robots.txt              # generated, but committed for clarity
├── src/
│   ├── content/                # adapter + schemas + local data
│   │   ├── index.ts
│   │   ├── schemas.ts
│   │   ├── adapters/
│   │   │   ├── local.ts
│   │   │   └── http.ts         # stub for now
│   │   └── data/
│   │       ├── blog/
│   │       ├── careers/
│   │       └── stories/
│   ├── layouts/
│   │   ├── BaseLayout.astro    # html, head, header, footer, OG/SEO meta
│   │   └── PageLayout.astro    # marketing page chrome
│   ├── components/
│   │   ├── primitives/         # Button, Link, Heading, Container... — token-driven
│   │   ├── sections/           # one file per home-page section + reusable cross-page sections
│   │   └── islands/            # React-only: FAQAccordion, MobileNav, ContactForm
│   ├── pages/
│   │   ├── index.astro
│   │   ├── community.astro
│   │   ├── pricing.astro
│   │   ├── contact.astro
│   │   ├── blog/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── careers/
│   │   │   ├── index.astro
│   │   │   └── [slug].astro
│   │   ├── 404.astro
│   │   └── 500.astro
│   ├── styles/
│   │   ├── theme.css           # Tailwind v4 @theme — Figma tokens live here
│   │   └── global.css          # resets, base styles
│   └── assets/                 # imported images (Astro processes these)
├── docs/
│   └── design.md               # this spec, copied in
├── .env.example                # CONTENT_SOURCE=local
└── .github/
    └── workflows/
        └── deploy.yml
```

---

## 9. Hosting, build & deploy

**Host:** existing VPS (same as `office.imageleft.com` and `api.imageleft.com` will live).
**Front:** Cloudflare in proxy mode (orange-cloud DNS) — free CDN, SSL, DDoS.
**Origin web server:** nginx (or Caddy if simpler — open). Serves `dist/` as static files.

### nginx vhost (sketch)

```nginx
server {
  listen 443 ssl http2;
  server_name imageleft.com new.imageleft.com;

  root /var/www/imageleft-site;
  index index.html;

  # Pretty URLs from Astro static
  try_files $uri $uri/ $uri.html =404;

  # Aggressive caching for hashed assets
  location /_astro/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  # Conservative caching for HTML
  location ~ \.html$ {
    expires 5m;
    add_header Cache-Control "public, must-revalidate";
  }
}
```

### CI/CD (GitHub Actions, sketch)

```yaml
name: deploy
on:
  push:
    branches: [main, develop]
jobs:
  build-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20, cache: npm }
      - run: npm ci
      - run: npx astro check
      - run: npm run build
      - name: rsync to VPS
        uses: burnett01/rsync-deployments@7.0.1   # pin to current latest at scaffold time
        with:
          switches: -avzr --delete
          path: dist/
          remote_path: ${{ github.ref == 'refs/heads/main' && '/var/www/imageleft-site' || '/var/www/imageleft-site-staging' }}
          remote_host: ${{ secrets.VPS_HOST }}
          remote_user: ${{ secrets.VPS_USER }}
          remote_key: ${{ secrets.VPS_SSH_KEY }}
```

### Rollout

- Branch `develop` deploys to `new.imageleft.com` (staging vhost).
- Branch `main` deploys to `imageleft.com` (production vhost).
- Apex DNS (`imageleft.com`) stays pointing at the **current** Next.js app until launch day; on cutover, flip the A/CNAME record.
- Old apex artifacts left intact for one week post-cutover for rollback.

---

## 10. Testing & quality gates

| Gate | Tool | When |
|---|---|---|
| Type-check | `astro check` | Pre-commit + CI |
| Lint | ESLint (Astro config) | CI |
| Format | Prettier | Pre-commit |
| Lighthouse | `lhci` (Lighthouse CI) | CI on PR; budget: perf ≥ 95, a11y ≥ 95, SEO = 100 |
| Broken links | `linkinator` or Astro's link checker | CI on PR |
| Visual review | Cloudflare/staging URL preview | Manual, per PR |

Tests are *gates, not unit tests*. There's no business logic to unit-test on a static marketing site; the value is preventing regressions in build, perf, and a11y.

---

## 11. SEO, performance, accessibility

**Per-page metadata** declared in frontmatter, rendered by `BaseLayout`:
- `<title>`, `<meta name="description">`
- Canonical URL
- Open Graph: `og:title`, `og:description`, `og:image`, `og:type`, `og:url`
- Twitter Card

**OG images:** static per-page PNGs in `public/og/` for v1. Dynamic OG image generation deferred.

**Sitemap:** `@astrojs/sitemap` integration → emits `sitemap-index.xml` at build.

**robots.txt:** allow all, point at sitemap.

**A11y baseline:** semantic HTML (`<main>`, `<nav>`, `<article>`, `<section>` headings), skip-to-content link, focus styles never removed without replacement, color contrast ≥ 4.5:1 (verified per token), all images have meaningful `alt`.

**Performance budget:**
- Total transferred JS on home: ≤ 30 KB compressed
- Total transferred CSS: ≤ 25 KB compressed
- LCP element: hero image, prioritized with `loading="eager"` + `fetchpriority="high"`
- All other images: `loading="lazy"`

---

## 12. Implementation sequence (milestones)

This is the rough phasing the implementation plan will refine. Each milestone ends in something the user can review.

### M0 — Bootstrap (½ day)
- `git init` in `imageleft-site/`
- Astro scaffold, Tailwind v4, MDX, TypeScript, Prettier, ESLint
- Empty `BaseLayout`, placeholder routes for all pages, baseline `theme.css` with neutral defaults (real Figma tokens land in M1)
- CI workflow stub (lint + type-check + build, no deploy yet)
- Local dev runs at `localhost:4321`; `astro check` passes

### M1 — Figma extraction & token system (½ day)
- Probe `Nmds4AYHtECKtmnTUDRU6m` via MCP
- Confirm or compose pages list with user
- Extract design tokens, write `theme.css` (`@theme` block)
- Build out token-driven primitives (`Container`, `Heading`, `Text`, `Button`, `Link`, etc.)
- Visual sanity check: a styleguide route (`/styleguide`, dev-only) renders all primitives

### M2 — Home page (1–2 days)
- Section by section, top to bottom
- Each section ships as a component in `src/components/sections/`
- Blog / career / story preview sections use placeholder seed data; they'll re-wire to real collections in M4 and M5
- Iterate to visual parity per section

### M3 — Static pages (½–1 day)
- Community, Pricing, Contact (mailto:), 404, 500
- Reuse sections where applicable

### M4 — Blog (1 day)
- Local MDX collection
- List page, detail page, frontmatter schema
- Code highlighting, image handling, related-posts (if in Figma)
- Replace home-page placeholder seed data with real collection reads (blog preview)

### M5 — Careers & Customer Stories (1 day)
- Local JSON collections
- List + detail for each
- Replace home-page placeholder seed data with real collection reads (career + story previews)

### M6 — Hardening & deploy (½–1 day)
- Lighthouse CI gating
- nginx vhost + GH Actions deploy to `new.imageleft.com`
- Smoke test, rollback drill
- Hand off staging URL for review

### M7 — Cutover (½ day)
- After signoff, point apex DNS at the static origin
- Monitor for 24–48h, confirm metrics

**Total rough estimate:** 6–8 working days for an experienced solo, depending on Figma fidelity ambitions.

---

## 13. Open questions / parking lot

- **Pages list final.** Confirm against Figma after extraction.
- **Caddy vs nginx.** nginx is the assumed default; if the VPS already runs Caddy for the current project, switch.
- **Cloudflare Web Analytics vs Plausible.** Cloudflare's free if we proxy; Plausible is more flexible. Decide before launch.
- **Per-page OG images dynamic generation.** Out of scope for v1; revisit if marketing wants per-post OG cards.
- **i18n.** EN-only confirmed for v1; if marketing needs FR/RW later, Astro's i18n can be retrofitted.
- **CSP / security headers.** Recommend adding strict CSP, Permissions-Policy, Referrer-Policy on the nginx vhost. Spec'd as a small follow-up after launch.
- **Tailwind config file vs pure CSS.** Tailwind v4 supports both; we'll use the official Vite plugin path and keep config in CSS unless friction arises.

---

## 14. References

- Figma file: https://www.figma.com/design/Nmds4AYHtECKtmnTUDRU6m/v0-revamped?node-id=0-1
- Astro docs: https://docs.astro.build/
- Tailwind v4 docs: https://tailwindcss.com/docs/v4-beta
- Framelink Figma MCP: https://github.com/GLips/Figma-Context-MCP
- Brainstorm session screens: `.superpowers/brainstorm/22138-1777695340/content/`
