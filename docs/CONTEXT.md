# Domain Glossary — imageleft.com (marketing site)

A pure domain glossary. One entry per term; what it *is*, not how it's implemented.

> The site is a **pure static consumer** at `imageleft.com`. It reads content and displays it;
> it never authenticates, never writes to a database, and never runs server-side code.
> Dynamic content (blog, careers, testimonials) is sourced from either local files (dev/fallback)
> or the **Back Office public API** (production), selected by the `CONTENT_SOURCE` env var.

---

## Content adapter
The single seam between the site's pages and any content source. Pages call `content/index.ts`
exclusively — never `astro:content` or `fetch()` directly. The adapter is selected at build time
via `CONTENT_SOURCE` env var (`local` = filesystem MDX/JSON; `http` = Back Office public API).

**Distinct from:** the Back Office, which *owns* the content and exposes it via the Public API.

## Local adapter
The default content adapter. Reads blog posts from MDX files in `src/content/data/blog/` and
jobs from `src/content/data/careers/index.json`. Used in development and as a fallback.

## HTTP adapter
The production content adapter (`CONTENT_SOURCE=http`). Fetches from the Back Office public API
(`BACKOFFICE_URL`) and maps responses to the site's canonical schemas. **Currently a stub (throws).**

## Back Office
The separate Next.js app (`office.imageleft.com`) that owns content (blog, jobs, testimonials,
leads, applications) and exposes a versioned public read/write API at `/api/v1/public/*`.

## Public API
The Back Office's unauthenticated API — the HTTP adapter's data source. Contract documented in
the Back Office's `docs/PUBLIC-API-V1.md`.

## Content schema
Zod schemas in `src/content/schemas.ts` that define the shapes all pages consume. Both the local
adapter (via Astro Content Collections) and the HTTP adapter must produce values that conform to
these schemas. They are the single source of truth for content shape.

## Lead
A contact form submission. POSTed to `POST /api/v1/public/leads` on the Back Office.
The site's contact form currently opens `mailto:` — migrating to POST is a planned integration step.

## Field mapping
The HTTP adapter's responsibility for resolving mismatches between the Back Office API shape and
the site's content schemas. **Adapter-side mapping** is the chosen pattern — the Public API shape
is stable and shared; the adapter is the only place that knows about both sides. Specific mappings:
`coverImageUrl` → `coverImage`, `datePosted` → `postedAt`, `type` enum case (`FULL_TIME` → `full-time`),
`author` string → `{ name, avatar? }` object, `team` fallback to `"imageleft"` when null.

## Application
A job application submitted via the careers detail page. Will POST to `POST /api/v1/public/applications`
(multipart/form-data). Not yet wired.
