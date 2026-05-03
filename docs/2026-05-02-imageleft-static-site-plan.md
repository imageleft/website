# imageleft.com Static Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Scaffold a fresh static Astro marketing site for `imageleft.com` from Figma designs, locally-stubbed content, deployed to the existing VPS via GitHub Actions, staged at `new.imageleft.com`.

**Architecture:** Astro 5 (`output: 'static'`) + Tailwind v4 + MDX + TypeScript. Content via Astro Content Collections + Zod schemas behind a thin **content-adapter** interface (v1 = local JSON/MDX; v2 = HTTP API, deferred). Figma frames translated section-by-section using the Framelink Figma MCP. Self-hosted on existing VPS behind nginx + Cloudflare proxy.

**Tech Stack:** Astro 5, Tailwind v4, MDX, TypeScript, Zod, React (islands only), Astro `<Image>`, `@astrojs/sitemap`, ESLint, Prettier, Lighthouse CI, linkinator, GitHub Actions, nginx, Let's Encrypt.

**Spec reference:** `docs/2026-05-02-imageleft-static-site-design.md` (sibling file)

---

## Pre-flight constraints

Read this once before starting any task.

1. **Repo target:** `/home/zozin/Opt/imageleft/imageleft-site/` — sibling to current `imageleft-website`. Spec lives at `imageleft-site/docs/2026-05-02-imageleft-static-site-design.md`.
2. **Figma file:** `Nmds4AYHtECKtmnTUDRU6m` (`v0-revamped`), starting at node `0-1`.
3. **Figma MCP:** `figma-developer-mcp` is registered in user-scope MCP config; token is in `$FIGMA_API_KEY`. Tools: `get_figma_data`, `download_figma_images`. **The MCP must be reachable from the executing session** — restart Claude Code if its tool index doesn't surface them at startup.
4. **Pages list is tentative.** Final list confirmed in Task M1.1 after probing the Figma file.
5. **Content source is local JSON/MDX in v1.** The HTTP adapter exists as a stub only; do not implement HTTP fetching now.
6. **Forms = `mailto:` only.** No form submission backends.
7. **TDD where it earns its weight.** Real unit tests for the content adapter and schemas. For Astro components driven by Figma, "tests" = build success, type-check, Lighthouse, linkinator, and visual diff against the Figma frame. Do not invent component-snapshot tests just to look thorough.
8. **Commit cadence:** end of every task at minimum; intra-task commits encouraged for non-trivial steps. Branch off `develop`; merge to `develop` deploys to staging; merge to `main` deploys to production.
9. **Never start a dev server in CI / hooks.** Locally, `npm run dev` is fine.

---

## File structure (overview)

```
imageleft-site/
├── .github/workflows/
│   ├── ci.yml                  # type-check + lint + build + Lighthouse CI + linkinator (PRs)
│   └── deploy.yml              # build + rsync to VPS (push to develop/main)
├── .gitignore
├── .editorconfig
├── .eslintrc.cjs               # or eslint.config.js (flat) — pick the one Astro starter ships
├── .prettierrc.json
├── astro.config.mjs
├── tsconfig.json
├── package.json
├── README.md
├── docs/                       # this plan + spec live here
├── public/
│   ├── favicon.svg
│   ├── og/                     # static OG images per page (PNG)
│   └── robots.txt
├── src/
│   ├── content/
│   │   ├── index.ts            # public adapter interface
│   │   ├── schemas.ts          # Zod schemas
│   │   ├── adapters/
│   │   │   ├── local.ts        # v1 — reads from local data + collections
│   │   │   └── http.ts         # v2 — stub (throws "not implemented")
│   │   └── data/
│   │       ├── blog/           # .mdx files
│   │       ├── careers/        # .json files
│   │       └── stories/        # .json files
│   ├── content.config.ts       # Astro Content Collections wiring (Astro 5)
│   ├── layouts/
│   │   ├── BaseLayout.astro
│   │   └── PageLayout.astro
│   ├── components/
│   │   ├── primitives/         # Container, Heading, Text, Button, Link, Eyebrow...
│   │   ├── sections/           # one per home-page section + shared (CTABanner, etc.)
│   │   └── islands/            # FAQAccordion.tsx, MobileNav.tsx, ContactForm.tsx
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
│   │   ├── styleguide.astro    # dev-only, gated by import.meta.env.DEV
│   │   ├── 404.astro
│   │   └── 500.astro
│   ├── styles/
│   │   ├── theme.css           # Tailwind v4 @theme — Figma tokens
│   │   └── global.css          # resets, base
│   ├── lib/
│   │   ├── seo.ts              # OG/meta helpers
│   │   └── images.ts           # any image utilities
│   └── assets/                 # imported images
├── tests/
│   └── content/
│       ├── schemas.test.ts
│       └── adapter-local.test.ts
└── lhci.config.cjs             # Lighthouse CI thresholds
```

---

# Milestone M0 — Bootstrap

Goal: empty Astro app with TypeScript, Tailwind v4, MDX, lint/format, and a CI workflow stub. Local dev runs and `astro check` passes.

## Task M0.1: Create directory and init git

**Files:**
- Create: `/home/zozin/Opt/imageleft/imageleft-site/`

- [ ] **Step 1: Create the directory and initialize git**

```bash
mkdir -p /home/zozin/Opt/imageleft/imageleft-site
cd /home/zozin/Opt/imageleft/imageleft-site
git init -b develop
```

- [ ] **Step 2: Add `.gitignore`**

Create `/home/zozin/Opt/imageleft/imageleft-site/.gitignore`:

```gitignore
# build output
dist/
.astro/

# dependencies
node_modules/

# logs
npm-debug.log*
yarn-debug.log*

# env
.env
.env.local
.env.*.local
!.env.example

# editor
.vscode/
.idea/
*.swp
.DS_Store

# CI artifacts
.lighthouseci/
```

- [ ] **Step 3: Initial commit**

The spec was moved here in the previous session. It and the plan should be the first commit.

```bash
git add .gitignore docs/
git commit -m "chore: initial repo with design spec and implementation plan"
```

## Task M0.2: Astro scaffold

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `src/pages/index.astro`, `src/env.d.ts`

- [ ] **Step 1: Run the Astro create command (non-interactive, minimal template)**

Run from `imageleft-site/` (which is now the cwd of the agent's bash):

```bash
npm create astro@latest -- --template minimal --no-install --no-git --typescript strict --yes .
```

This drops the minimal Astro template into the current directory. The command flags:
- `--template minimal` — bare scaffold, no example content
- `--no-install` — we install in a deliberate next step
- `--no-git` — repo already initialized
- `--typescript strict` — strict mode from day one
- `--yes` — accept defaults

- [ ] **Step 2: Install dependencies**

```bash
npm install
```

Expected: clean install, no peer-dep errors. Astro 5.x and TypeScript 5.x in `package.json`.

- [ ] **Step 3: Verify dev server starts**

```bash
npm run dev
```

Expected: dev server prints "Local: http://localhost:4321/" and serves the placeholder page. Stop the server (`Ctrl-C`).

> User runs the dev server during normal work. The agent only starts it for this verification step (not on a watch).

- [ ] **Step 4: Verify type-check passes**

```bash
npx astro check
```

Expected: "0 errors, 0 warnings."

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(m0): scaffold astro minimal with strict typescript"
```

## Task M0.3: Add Tailwind v4

**Files:**
- Modify: `astro.config.mjs`, `package.json`
- Create: `src/styles/global.css`, `src/styles/theme.css`

- [ ] **Step 1: Verify the current canonical Tailwind v4 + Astro setup with context7**

Tailwind v4 moved from the `@astrojs/tailwind` integration to the official Vite plugin pattern. Confirm before installing:

Use the `mcp__plugin_context7_context7__query-docs` tool with library `/withastro/docs` and query: *"Add Tailwind CSS v4 to an Astro project — current canonical setup with Vite plugin"*. Read the snippet and use the **exact** package names and config it shows.

- [ ] **Step 2: Install Tailwind**

(Likely command — confirm against context7 result first.)

```bash
npm install tailwindcss @tailwindcss/vite
```

- [ ] **Step 3: Wire Tailwind via Vite plugin in `astro.config.mjs`**

Replace the contents of `astro.config.mjs` with:

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig({
  output: 'static',
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 4: Create `src/styles/theme.css` with neutral defaults**

Real Figma tokens land in M1. For now:

```css
@import "tailwindcss";

@theme {
  /* Color — neutral starter palette; replaced from Figma in M1 */
  --color-bg: #ffffff;
  --color-fg: #0f172a;
  --color-muted: #64748b;
  --color-accent: #2563eb;
  --color-border: #e2e8f0;

  /* Type scale — starter; replaced from Figma in M1 */
  --font-sans: ui-sans-serif, system-ui, sans-serif;
  --font-display: ui-sans-serif, system-ui, sans-serif;

  --text-xs: 0.75rem;
  --text-sm: 0.875rem;
  --text-base: 1rem;
  --text-lg: 1.125rem;
  --text-xl: 1.25rem;
  --text-2xl: 1.5rem;
  --text-3xl: 1.875rem;
  --text-4xl: 2.25rem;
  --text-5xl: 3rem;

  /* Radii — starter */
  --radius-sm: 0.25rem;
  --radius-md: 0.5rem;
  --radius-lg: 1rem;

  /* Spacing scale uses Tailwind defaults */
}
```

- [ ] **Step 5: Create `src/styles/global.css`**

```css
@import "./theme.css";

html {
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

body {
  background: var(--color-bg);
  color: var(--color-fg);
  font-family: var(--font-sans);
  margin: 0;
}

/* Skip-to-content link (a11y) — initially visually hidden */
.skip-link {
  position: absolute;
  left: -9999px;
  z-index: 100;
}
.skip-link:focus {
  left: 1rem;
  top: 1rem;
  background: var(--color-fg);
  color: var(--color-bg);
  padding: 0.5rem 1rem;
  border-radius: var(--radius-md);
}
```

- [ ] **Step 6: Wire global.css into a temporary index page to verify Tailwind compiles**

Replace `src/pages/index.astro` with:

```astro
---
import '../styles/global.css';
---

<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>imageleft</title>
  </head>
  <body>
    <main class="mx-auto max-w-3xl p-8">
      <h1 class="text-4xl font-bold">imageleft</h1>
      <p class="mt-2 text-slate-600">
        Tailwind v4 is wired. Real designs land in M2.
      </p>
    </main>
  </body>
</html>
```

- [ ] **Step 7: Verify build succeeds**

```bash
npm run build
```

Expected: build completes; `dist/index.html` contains the heading; CSS file produced under `dist/_astro/`.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(m0): wire tailwind v4 via vite plugin with neutral theme"
```

## Task M0.4: Add MDX integration

**Files:**
- Modify: `astro.config.mjs`, `package.json`

- [ ] **Step 1: Install the MDX integration**

```bash
npm install @astrojs/mdx
```

- [ ] **Step 2: Add to `astro.config.mjs`**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';

export default defineConfig({
  output: 'static',
  integrations: [mdx()],
  vite: {
    plugins: [tailwindcss()],
  },
});
```

- [ ] **Step 3: Verify type-check still passes**

```bash
npx astro check
```

Expected: 0 errors.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(m0): add @astrojs/mdx integration"
```

## Task M0.5: Add ESLint + Prettier

**Files:**
- Create: `eslint.config.js`, `.prettierrc.json`, `.prettierignore`, `.editorconfig`
- Modify: `package.json`

- [ ] **Step 1: Verify the current canonical Astro ESLint flat-config setup with context7**

ESLint flat config + Astro is fast-moving. Use `mcp__plugin_context7_context7__query-docs` against `/withastro/docs` with query: *"ESLint flat config setup for Astro projects with TypeScript and Prettier"*. Use the canonical packages it recommends.

- [ ] **Step 2: Install lint/format dev deps**

(Likely command — confirm against context7 result.)

```bash
npm install -D \
  eslint \
  eslint-plugin-astro \
  @typescript-eslint/parser \
  @typescript-eslint/eslint-plugin \
  prettier \
  prettier-plugin-astro \
  prettier-plugin-organize-imports \
  prettier-plugin-tailwindcss
```

- [ ] **Step 3: Create `eslint.config.js`**

```js
import eslintPluginAstro from 'eslint-plugin-astro';
import tsParser from '@typescript-eslint/parser';
import tsPlugin from '@typescript-eslint/eslint-plugin';

export default [
  ...eslintPluginAstro.configs.recommended,
  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: { parser: tsParser },
    plugins: { '@typescript-eslint': tsPlugin },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['dist/**', '.astro/**', 'node_modules/**'],
  },
];
```

- [ ] **Step 4: Create `.prettierrc.json`**

```json
{
  "semi": true,
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "plugins": [
    "prettier-plugin-astro",
    "prettier-plugin-organize-imports",
    "prettier-plugin-tailwindcss"
  ],
  "overrides": [
    {
      "files": "*.astro",
      "options": { "parser": "astro" }
    }
  ]
}
```

- [ ] **Step 5: Create `.prettierignore`**

```
dist
.astro
node_modules
package-lock.json
```

- [ ] **Step 6: Create `.editorconfig`**

```ini
root = true

[*]
indent_style = space
indent_size = 2
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true
```

- [ ] **Step 7: Add scripts to `package.json`**

In the `scripts` block, add:

```json
{
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "check": "astro check",
    "lint": "eslint .",
    "format": "prettier --check .",
    "format:fix": "prettier --write ."
  }
}
```

- [ ] **Step 8: Run lint and format checks; fix any issues**

```bash
npm run lint
npm run format
```

Expected: 0 errors. If format complains, run `npm run format:fix`.

- [ ] **Step 9: Commit**

```bash
git add -A
git commit -m "chore(m0): add eslint flat config, prettier, editorconfig"
```

## Task M0.6: CI workflow stub

**Files:**
- Create: `.github/workflows/ci.yml`

- [ ] **Step 1: Create the CI workflow**

```yaml
name: CI

on:
  pull_request:
    branches: [develop, main]
  push:
    branches: [develop, main]

jobs:
  verify:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm

      - run: npm ci

      - name: Type-check
        run: npm run check

      - name: Lint
        run: npm run lint

      - name: Format check
        run: npm run format

      - name: Build
        run: npm run build
```

- [ ] **Step 2: Commit**

```bash
git add .github/workflows/ci.yml
git commit -m "ci(m0): add type-check, lint, format, build workflow"
```

## Task M0.7: README

**Files:**
- Create: `README.md`

- [ ] **Step 1: Write a short README**

```markdown
# imageleft.com — static marketing site

Public marketing site for imageleft.com. Astro 5 static, Tailwind v4, MDX. Content via local JSON/MDX (HTTP API integration deferred).

## Develop

```bash
npm install
npm run dev      # http://localhost:4321
```

## Verify before commit

```bash
npm run check    # astro check (typescript + astro)
npm run lint     # eslint
npm run format   # prettier --check
npm run build    # production build
```

## Deploy

- Branch `develop` → staging at `new.imageleft.com` via GitHub Actions
- Branch `main` → production at `imageleft.com`

See `docs/2026-05-02-imageleft-static-site-design.md` for the full design.
See `docs/2026-05-02-imageleft-static-site-plan.md` for the implementation plan.
```

- [ ] **Step 2: Commit**

```bash
git add README.md
git commit -m "docs(m0): add README"
```

---

# Milestone M1 — Figma extraction & token system

Goal: design tokens captured in `theme.css`, foundational primitive components built and verified at `/styleguide`.

## Task M1.1: Confirm Figma file structure and pages

**Prerequisites:** Figma MCP tools loadable in this session (`get_figma_data`, `download_figma_images`). If they aren't surfaced, restart Claude Code first.

- [ ] **Step 1: Probe top-level pages**

Call:

```
get_figma_data(fileKey="Nmds4AYHtECKtmnTUDRU6m", depth=1)
```

Record the list of top-level pages in the file. Common patterns: `Cover`, `Foundations` / `Design System`, page-named frames (`Home`, `Pricing`, etc.), `Components`.

- [ ] **Step 2: Reconcile with the spec's tentative page list**

Compare against spec §3:
- Home, Community, Pricing, Contact, Blog, Career

For each page in Figma, mark as: **planned** (in spec), **new** (not in spec — discuss with user), or **out-of-scope** (e.g. exploratory frames).

For each spec page, mark as: **present** (in Figma), **missing** (in spec but not in Figma — discuss).

- [ ] **Step 3: Confirm with user**

Present findings to the user. Get explicit approval of the **final page list** before continuing. Update spec §3 to remove the "tentative" qualifier and replace with the locked list. Commit:

```bash
git add docs/2026-05-02-imageleft-static-site-design.md
git commit -m "docs(m1): lock final pages list after figma probe"
```

## Task M1.2: Extract design system foundations

- [ ] **Step 1: Locate the foundations**

If the file has a `Foundations` / `Design System` page, fetch it:

```
get_figma_data(fileKey="Nmds4AYHtECKtmnTUDRU6m", nodeId="<foundations-page-id>", depth=4)
```

If it doesn't exist, sample from screens: pull each top-level page at depth 3 and aggregate observed styles.

- [ ] **Step 2: Catalog tokens**

Record in a working notes file `docs/figma-tokens.md` (gitignored — temporary):

- **Colors:** every distinct fill across foundations + screens. Group by intent (primary, neutral, semantic).
- **Typography:** font families, weights, sizes, line-heights, letter-spacings used in headings and body.
- **Spacing:** observed paddings/gaps. Cluster and propose a scale (e.g., 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64).
- **Radii:** observed border-radius values.
- **Shadows:** observed effects.
- **Breakpoints:** observed responsive variants if Figma has multi-device frames.

- [ ] **Step 3: Have the user review the cataloged tokens**

Show the catalog. Resolve ambiguities (e.g., "two near-identical greys — keep both or collapse?"). Get sign-off before writing tokens to code.

## Task M1.3: Write tokens into `theme.css`

**Files:**
- Modify: `src/styles/theme.css`

- [ ] **Step 1: Replace the neutral defaults with real tokens**

Structure:

```css
@import "tailwindcss";

@theme {
  /* Brand */
  --color-brand-50:  /* hex */;
  --color-brand-100: /* hex */;
  /* ...full palette as locked in M1.2 */

  /* Neutrals */
  --color-neutral-0:   /* hex */;
  --color-neutral-50:  /* hex */;
  /* ... */

  /* Semantic */
  --color-success: /* hex */;
  --color-warning: /* hex */;
  --color-danger:  /* hex */;

  /* Surfaces */
  --color-bg:      /* hex */;
  --color-fg:      /* hex */;
  --color-muted:   /* hex */;
  --color-border:  /* hex */;

  /* Type */
  --font-sans:    /* family stack */;
  --font-display: /* family stack */;

  /* Type scale (xs → 6xl), set values from Figma */
  --text-xs:   /* px → rem */;
  /* ... */

  /* Radii */
  --radius-sm: /* */;
  --radius-md: /* */;
  --radius-lg: /* */;
  --radius-full: 9999px;

  /* Shadows */
  --shadow-sm: /* */;
  --shadow-md: /* */;
  --shadow-lg: /* */;
}
```

> Each `/* ... */` is filled with values from the M1.2 catalog. **The plan author cannot supply these values up-front** — they come from the Figma extraction. Replace every comment placeholder before committing this task.

- [ ] **Step 2: If custom fonts are used, add a font-loading strategy**

If Figma uses Google Fonts: add a `<link rel="preconnect" ...>` + `<link rel="stylesheet" ...>` to `BaseLayout` (built in M2.2). Note in this task that the font CDN call will land in M2.2.

If Figma uses a self-hosted font: place files under `public/fonts/`, add `@font-face` blocks in `theme.css`, set `font-display: swap`.

- [ ] **Step 3: Verify build still succeeds**

```bash
npm run build
```

Expected: 0 errors. CSS file in `dist/_astro/` reflects new tokens.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(m1): apply figma design tokens to theme.css"
```

## Task M1.4: Build foundational primitives

**Files:**
- Create: `src/components/primitives/Container.astro`, `Heading.astro`, `Text.astro`, `Eyebrow.astro`, `Button.astro`, `Link.astro`

- [ ] **Step 1: Create `Container.astro`**

```astro
---
interface Props {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  as?: 'div' | 'section' | 'main' | 'article';
  class?: string;
}
const { size = 'lg', as: Tag = 'div', class: className = '' } = Astro.props;
const max = {
  sm: 'max-w-3xl',
  md: 'max-w-5xl',
  lg: 'max-w-6xl',
  xl: 'max-w-7xl',
}[size];
---
<Tag class={`mx-auto px-4 sm:px-6 lg:px-8 ${max} ${className}`}>
  <slot />
</Tag>
```

- [ ] **Step 2: Create `Heading.astro`**

```astro
---
interface Props {
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  size?: 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl';
  class?: string;
}
const { level = 2, size = '3xl', class: className = '' } = Astro.props;
const Tag = `h${level}` as `h${1 | 2 | 3 | 4 | 5 | 6}`;
const sizeClass = {
  xl: 'text-xl',
  '2xl': 'text-2xl',
  '3xl': 'text-3xl',
  '4xl': 'text-4xl',
  '5xl': 'text-5xl',
  '6xl': 'text-6xl',
}[size];
---
<Tag class={`font-display tracking-tight ${sizeClass} ${className}`}>
  <slot />
</Tag>
```

- [ ] **Step 3: Create `Text.astro`**

```astro
---
interface Props {
  size?: 'sm' | 'base' | 'lg' | 'xl';
  muted?: boolean;
  class?: string;
}
const { size = 'base', muted = false, class: className = '' } = Astro.props;
const sizeClass = {
  sm: 'text-sm',
  base: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
}[size];
---
<p class={`${sizeClass} ${muted ? 'text-[var(--color-muted)]' : ''} ${className}`}>
  <slot />
</p>
```

- [ ] **Step 4: Create `Eyebrow.astro`**

A small uppercase tagline that often sits above section headings in marketing layouts.

```astro
---
interface Props { class?: string; }
const { class: className = '' } = Astro.props;
---
<span class={`inline-block text-xs font-semibold uppercase tracking-widest text-[var(--color-accent,#2563eb)] ${className}`}>
  <slot />
</span>
```

- [ ] **Step 5: Create `Button.astro`**

```astro
---
interface Props {
  href?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  class?: string;
  type?: 'button' | 'submit' | 'reset';
}
const { href, variant = 'primary', size = 'md', class: className = '', type } = Astro.props;
const base = 'inline-flex items-center justify-center rounded-[var(--radius-md)] font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2';
const variants = {
  primary:   'bg-[var(--color-accent)] text-white hover:opacity-90',
  secondary: 'bg-[var(--color-neutral-50)] text-[var(--color-fg)] hover:bg-[var(--color-neutral-100)]',
  ghost:     'text-[var(--color-fg)] hover:bg-[var(--color-neutral-50)]',
};
const sizes = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
};
const cls = `${base} ${variants[variant]} ${sizes[size]} ${className}`;
---
{
  href ? (
    <a href={href} class={cls}><slot /></a>
  ) : (
    <button type={type ?? 'button'} class={cls}><slot /></button>
  )
}
```

- [ ] **Step 6: Create `Link.astro`**

```astro
---
interface Props {
  href: string;
  external?: boolean;
  class?: string;
}
const { href, external = false, class: className = '' } = Astro.props;
const isExternal = external || /^https?:\/\//.test(href);
---
<a
  href={href}
  class={`underline-offset-2 hover:underline ${className}`}
  {...(isExternal ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
>
  <slot />
</a>
```

- [ ] **Step 7: Verify type-check passes**

```bash
npm run check
```

Expected: 0 errors.

- [ ] **Step 8: Commit**

```bash
git add src/components/primitives
git commit -m "feat(m1): add token-driven primitive components"
```

## Task M1.5: Styleguide route (dev-only)

**Files:**
- Create: `src/pages/styleguide.astro`

- [ ] **Step 1: Build a single page that exhibits every primitive**

```astro
---
import '../styles/global.css';
import Container from '../components/primitives/Container.astro';
import Heading from '../components/primitives/Heading.astro';
import Text from '../components/primitives/Text.astro';
import Eyebrow from '../components/primitives/Eyebrow.astro';
import Button from '../components/primitives/Button.astro';
import Link from '../components/primitives/Link.astro';

if (!import.meta.env.DEV) {
  return Astro.redirect('/404');
}
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Styleguide — DEV ONLY</title>
  </head>
  <body>
    <Container size="md" as="main" class="space-y-12 py-12">
      <section>
        <Eyebrow>Headings</Eyebrow>
        <Heading level={1} size="6xl">Heading 6xl</Heading>
        <Heading level={2} size="5xl">Heading 5xl</Heading>
        <Heading level={2} size="4xl">Heading 4xl</Heading>
        <Heading level={3} size="3xl">Heading 3xl</Heading>
        <Heading level={3} size="2xl">Heading 2xl</Heading>
      </section>

      <section>
        <Eyebrow>Body</Eyebrow>
        <Text size="xl">XL body — used for hero sub-headings.</Text>
        <Text size="lg">Large body — used for section intros.</Text>
        <Text>Default body.</Text>
        <Text size="sm" muted>Small muted body — used for meta text.</Text>
      </section>

      <section class="space-x-2">
        <Eyebrow>Buttons</Eyebrow>
        <div class="mt-2 flex flex-wrap gap-3">
          <Button variant="primary" size="lg">Primary L</Button>
          <Button variant="primary">Primary M</Button>
          <Button variant="primary" size="sm">Primary S</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
        </div>
      </section>

      <section>
        <Eyebrow>Link</Eyebrow>
        <Text>
          Inline <Link href="/">internal link</Link> and
          <Link href="https://example.com">external link</Link>.
        </Text>
      </section>
    </Container>
  </body>
</html>
```

- [ ] **Step 2: Verify it renders correctly**

Run `npm run dev`, open `http://localhost:4321/styleguide`. Compare against the Figma foundations frame. Adjust primitives in M1.4 until visual match.

> This is the iterative part of M1. Tokens may need refinement; primitives may need extra variants. Loop M1.4 ↔ M1.5 until the styleguide reads as a faithful Figma foundations rendering.

- [ ] **Step 3: Verify build still excludes `/styleguide` in production**

```bash
npm run build
ls dist/styleguide* 2>/dev/null && echo "PROBLEM: styleguide leaked to prod build" || echo "OK: styleguide not in prod build"
```

Expected: "OK". Because `import.meta.env.DEV` is `false` during `astro build`, the redirect runs and Astro doesn't emit the page.

- [ ] **Step 4: Commit**

```bash
git add src/pages/styleguide.astro
git commit -m "feat(m1): add dev-only /styleguide route exhibiting primitives"
```

---

# Milestone M2 — Home page

Goal: home page rendered section-by-section to visual parity with Figma. Blog/career/story preview sections use placeholder seed data.

## Task M2.1: Probe the home Figma frame

- [ ] **Step 1: Fetch the Home page node**

```
get_figma_data(fileKey="Nmds4AYHtECKtmnTUDRU6m", nodeId="<home-page-id>", depth=4)
```

- [ ] **Step 2: Enumerate sections**

For each top-level frame inside `Home`, record:
- Section name (e.g., `Hero`, `SystemsWeBuild`, `OurServices`, …)
- Frame node ID
- Brief layout note (one row, two-column, grid, carousel, etc.)
- Asset list (images/icons that need export)

Cross-check with the spec §3 home sections list. Reconcile any difference with user.

## Task M2.2: BaseLayout

**Files:**
- Create: `src/layouts/BaseLayout.astro`, `src/lib/seo.ts`

- [ ] **Step 1: Create `src/lib/seo.ts`**

```ts
export interface SEOProps {
  title: string;
  description: string;
  ogImage?: string;
  canonical?: string;
  noindex?: boolean;
}

const SITE = 'https://imageleft.com';

export function buildSEO(props: SEOProps, pathname: string) {
  const canonical = props.canonical ?? `${SITE}${pathname}`;
  const ogImage = props.ogImage ?? `${SITE}/og/default.png`;
  return {
    title: props.title,
    description: props.description,
    canonical,
    ogImage,
    noindex: props.noindex ?? false,
  };
}
```

- [ ] **Step 2: Create `BaseLayout.astro`**

```astro
---
import '../styles/global.css';
import { buildSEO, type SEOProps } from '../lib/seo';

interface Props extends SEOProps {}
const seo = buildSEO(Astro.props, Astro.url.pathname);
---
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>{seo.title}</title>
    <meta name="description" content={seo.description} />
    <link rel="canonical" href={seo.canonical} />

    {seo.noindex && <meta name="robots" content="noindex,follow" />}

    <!-- OG -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content={seo.title} />
    <meta property="og:description" content={seo.description} />
    <meta property="og:url" content={seo.canonical} />
    <meta property="og:image" content={seo.ogImage} />

    <!-- Twitter -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={seo.title} />
    <meta name="twitter:description" content={seo.description} />
    <meta name="twitter:image" content={seo.ogImage} />

    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Plausible (or Cloudflare Web Analytics) — replace placeholder domain in production -->
    <script
      defer
      data-domain="imageleft.com"
      src="https://plausible.io/js/script.js"
    ></script>
  </head>
  <body>
    <a href="#main" class="skip-link">Skip to content</a>
    <slot name="header" />
    <main id="main">
      <slot />
    </main>
    <slot name="footer" />
  </body>
</html>
```

- [ ] **Step 3: Commit**

```bash
git add src/layouts/BaseLayout.astro src/lib/seo.ts
git commit -m "feat(m2): add BaseLayout with SEO meta and skip-link"
```

## Task M2.3: Site header and footer (chrome)

**Files:**
- Create: `src/components/sections/SiteHeader.astro`, `SiteFooter.astro`, `src/components/islands/MobileNav.tsx`

These are designed from the Figma `Header` and `Footer` frames. The plan can't reproduce code exactly without the design — work this pattern:

- [ ] **Step 1: Probe header frame**

```
get_figma_data(fileKey="Nmds4AYHtECKtmnTUDRU6m", nodeId="<header-frame-id>", depth=3)
download_figma_images(...) # for the logo and any icons
```

- [ ] **Step 2: Build `SiteHeader.astro`**

Static markup of the desktop nav, plus a slot for the mobile toggle. Use primitives. For interactivity (mobile menu open/close), import a React island:

```astro
---
import Container from '../primitives/Container.astro';
import Link from '../primitives/Link.astro';
import MobileNav from '../islands/MobileNav.tsx';

const nav = [
  { href: '/', label: 'Home' },
  { href: '/community', label: 'Community' },
  { href: '/pricing', label: 'Pricing' },
  { href: '/blog', label: 'Blog' },
  { href: '/careers', label: 'Careers' },
  { href: '/contact', label: 'Contact' },
];
---
<header class="border-b border-[var(--color-border)]">
  <Container size="xl" as="nav" class="flex items-center justify-between py-4">
    <a href="/" class="font-display text-xl font-bold">imageleft</a>

    <ul class="hidden gap-6 md:flex">
      {nav.map((item) => (
        <li><Link href={item.href}>{item.label}</Link></li>
      ))}
    </ul>

    <div class="md:hidden">
      <MobileNav client:load nav={nav} />
    </div>
  </Container>
</header>
```

- [ ] **Step 3: Build `MobileNav.tsx` (React island)**

```tsx
import { useState } from 'react';

interface NavItem { href: string; label: string; }

export default function MobileNav({ nav }: { nav: NavItem[] }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Close menu' : 'Open menu'}
        onClick={() => setOpen(!open)}
        className="rounded p-2"
      >
        <span aria-hidden="true">{open ? '✕' : '☰'}</span>
      </button>

      {open && (
        <div
          id="mobile-nav"
          role="dialog"
          aria-modal="true"
          className="fixed inset-x-0 top-16 z-40 border-b bg-white p-6 shadow-md"
        >
          <ul className="space-y-4">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} className="block text-lg" onClick={() => setOpen(false)}>
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </>
  );
}
```

- [ ] **Step 4: Add `@astrojs/react` to enable React islands**

Verify with context7 first (Astro 5 React integration syntax may differ):

```bash
npm install @astrojs/react react react-dom
npm install -D @types/react @types/react-dom
```

Update `astro.config.mjs`:

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';

export default defineConfig({
  output: 'static',
  integrations: [mdx(), react()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 5: Build `SiteFooter.astro` from Figma footer frame**

Pattern matches header. Footer typically has: logo + tagline, link columns, social icons, copyright line.

```astro
---
import Container from '../primitives/Container.astro';
import Link from '../primitives/Link.astro';

const cols = [
  { title: 'Company', links: [/* from Figma */] },
  { title: 'Resources', links: [/* from Figma */] },
  { title: 'Legal', links: [/* from Figma */] },
];

const year = new Date().getFullYear();
---
<footer class="border-t border-[var(--color-border)] bg-[var(--color-neutral-50)] py-12">
  <Container size="xl">
    <div class="grid grid-cols-2 gap-8 md:grid-cols-4">
      <div>
        <a href="/" class="font-display text-xl font-bold">imageleft</a>
        <p class="mt-2 text-sm text-[var(--color-muted)]">{/* tagline from Figma */}</p>
      </div>
      {cols.map((col) => (
        <div>
          <h3 class="font-semibold">{col.title}</h3>
          <ul class="mt-3 space-y-2">
            {col.links.map((l) => <li><Link href={l.href}>{l.label}</Link></li>)}
          </ul>
        </div>
      ))}
    </div>
    <p class="mt-12 text-sm text-[var(--color-muted)]">© {year} imageleft.</p>
  </Container>
</footer>
```

- [ ] **Step 6: Verify build succeeds**

```bash
npm run check && npm run build
```

- [ ] **Step 7: Commit**

```bash
git add -A
git commit -m "feat(m2): site header, footer, and mobile-nav island"
```

## Task M2.4: Build home sections (repeatable per-section pattern)

This task is a **loop**, not a single linear task — one iteration per home-page section. Run it for: Hero, SystemsWeBuild, OurServices, HowItWorks, BusinessInABox, BlogPreview, CustomerStoriesPreview, FAQ, ContactCTA. Section names will be confirmed against Figma in M2.1 — adjust as needed.

For each section:

- [ ] **Step 1: Probe the section frame**

```
get_figma_data(fileKey="Nmds4AYHtECKtmnTUDRU6m", nodeId="<section-id>", depth=3)
```

- [ ] **Step 2: Download assets if any**

```
download_figma_images(
  fileKey="Nmds4AYHtECKtmnTUDRU6m",
  localPath="<repo>/src/assets/sections/<section-name>",
  nodes=[{ nodeId: "...", fileName: "..." }, ...]
)
```

For SVG icons, use `.svg` extension. For raster, use `.png` and let Astro `<Image>` handle re-encoding to AVIF/WebP at build.

- [ ] **Step 3: Build the section component**

Path: `src/components/sections/<SectionName>.astro`. Use only primitives; **never bypass tokens with raw hex/px values**. For images:

```astro
---
import { Image } from 'astro:assets';
import heroImg from '../../assets/sections/hero/hero.png';
---
<Image src={heroImg} alt="..." widths={[480, 768, 1280]} sizes="(max-width: 768px) 100vw, 1280px" />
```

- [ ] **Step 4: Mount in `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import SiteHeader from '../components/sections/SiteHeader.astro';
import SiteFooter from '../components/sections/SiteFooter.astro';
import Hero from '../components/sections/Hero.astro';
/* ...other section imports as built */
---
<BaseLayout
  title="imageleft — [tagline from Figma]"
  description="[meta description from Figma or briefing]"
>
  <Fragment slot="header"><SiteHeader /></Fragment>

  <Hero />
  {/* ...other sections as built */}

  <Fragment slot="footer"><SiteFooter /></Fragment>
</BaseLayout>
```

- [ ] **Step 5: Visual review**

Run `npm run dev`, view `http://localhost:4321/`. Compare to Figma at multiple breakpoints (375 / 768 / 1280). Iterate until parity.

- [ ] **Step 6: Verify build**

```bash
npm run check && npm run build
```

- [ ] **Step 7: Commit (per section)**

```bash
git add src/components/sections/<SectionName>.astro src/assets/sections/<section-name>/
git commit -m "feat(m2): home <section-name> section"
```

> Sections that show **previews of dynamic content** (BlogPreview, CustomerStoriesPreview) should pull from a small in-file placeholder array for now — `const seed = [...]`. They're re-wired to real collections in M4 / M5.

## Task M2.5: FAQ accordion island

**Files:**
- Create: `src/components/islands/FAQAccordion.tsx`

- [ ] **Step 1: Build the accordion as a React island**

```tsx
import { useState } from 'react';

export interface FAQ {
  question: string;
  answer: string;
}

export default function FAQAccordion({ items }: { items: FAQ[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  return (
    <ul className="divide-y divide-[var(--color-border)]">
      {items.map((item, i) => {
        const isOpen = i === openIndex;
        return (
          <li key={i}>
            <button
              type="button"
              aria-expanded={isOpen}
              aria-controls={`faq-${i}`}
              onClick={() => setOpenIndex(isOpen ? null : i)}
              className="flex w-full items-center justify-between py-4 text-left text-lg font-medium"
            >
              <span>{item.question}</span>
              <span aria-hidden="true">{isOpen ? '−' : '+'}</span>
            </button>
            {isOpen && (
              <div id={`faq-${i}`} className="pb-4 text-[var(--color-muted)]">
                {item.answer}
              </div>
            )}
          </li>
        );
      })}
    </ul>
  );
}
```

- [ ] **Step 2: Use in the FAQ section**

In `src/components/sections/FAQ.astro`:

```astro
---
import Container from '../primitives/Container.astro';
import Heading from '../primitives/Heading.astro';
import FAQAccordion from '../islands/FAQAccordion.tsx';

const faqs = [
  { question: '...', answer: '...' },
  /* from Figma copy */
];
---
<section class="py-16">
  <Container size="md">
    <Heading level={2} size="4xl">Frequently asked questions</Heading>
    <div class="mt-8">
      <FAQAccordion client:visible items={faqs} />
    </div>
  </Container>
</section>
```

`client:visible` defers hydration until the section scrolls into view — keeps the JS payload off the initial bundle.

- [ ] **Step 3: Commit**

```bash
git add src/components/islands/FAQAccordion.tsx src/components/sections/FAQ.astro
git commit -m "feat(m2): FAQ accordion island"
```

---

# Milestone M3 — Static pages

Goal: Community, Pricing, Contact, 404, 500 — all built with the same primitives + sections vocabulary established in M2.

## Task M3.1: Community page

- [ ] **Step 1: Probe Figma `Community` page**

```
get_figma_data(fileKey="Nmds4AYHtECKtmnTUDRU6m", nodeId="<community-page-id>", depth=3)
```

- [ ] **Step 2: Identify reusable sections**

Sections that already exist (from M2) get reused. Sections that are unique to Community get new components in `src/components/sections/`.

- [ ] **Step 3: Build `src/pages/community.astro`**

Same shape as `index.astro`: `BaseLayout` + sections. Reuse `SiteHeader`/`SiteFooter` slots.

- [ ] **Step 4: Visual review against Figma**

- [ ] **Step 5: Verify and commit**

```bash
npm run check && npm run build
git add -A
git commit -m "feat(m3): community page"
```

## Task M3.2: Pricing page

Same flow as M3.1 against the Figma `Pricing` page.

- [ ] Probe Figma → identify sections → build component → mount → review → commit

```bash
git commit -m "feat(m3): pricing page"
```

## Task M3.3: Contact page (with mailto: form)

**Files:**
- Create: `src/pages/contact.astro`, `src/components/sections/ContactForm.astro`

- [ ] **Step 1: Probe Figma `Contact` page**

- [ ] **Step 2: Build the contact form**

A pure-HTML form whose `action` is a `mailto:` URL. No JS submission. Fields: name, email, subject, message.

```astro
---
import Container from '../primitives/Container.astro';
import Heading from '../primitives/Heading.astro';
import Button from '../primitives/Button.astro';

const TO = 'hello@imageleft.com'; // confirm with user before merge
---
<section class="py-16">
  <Container size="sm">
    <Heading level={1} size="4xl">Contact us</Heading>
    <form
      action={`mailto:${TO}`}
      method="post"
      enctype="text/plain"
      class="mt-8 space-y-4"
    >
      <label class="block">
        <span class="block text-sm font-medium">Name</span>
        <input
          name="name"
          type="text"
          required
          class="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2"
        />
      </label>
      <label class="block">
        <span class="block text-sm font-medium">Email</span>
        <input
          name="email"
          type="email"
          required
          class="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2"
        />
      </label>
      <label class="block">
        <span class="block text-sm font-medium">Subject</span>
        <input
          name="subject"
          type="text"
          required
          class="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2"
        />
      </label>
      <label class="block">
        <span class="block text-sm font-medium">Message</span>
        <textarea
          name="message"
          rows="6"
          required
          class="mt-1 w-full rounded-[var(--radius-md)] border border-[var(--color-border)] px-3 py-2"
        ></textarea>
      </label>
      <Button type="submit" variant="primary" size="lg" class="w-full">Send</Button>
    </form>
    <p class="mt-4 text-sm text-[var(--color-muted)]">
      Submitting opens your mail client with the form contents pre-filled.
    </p>
  </Container>
</section>
```

> **Note:** `mailto:` with `enctype="text/plain"` is the most portable form for opening a mail client with the data. Some browsers (notably Firefox on Linux) ignore `method` and `enctype` and only use the `to:`. Acceptable trade-off — the alternative is shipping a backend, which is out of scope.

- [ ] **Step 3: Verify and commit**

```bash
git commit -m "feat(m3): contact page with mailto: form"
```

## Task M3.4: 404 and 500 pages

**Files:**
- Create: `src/pages/404.astro`, `src/pages/500.astro`

- [ ] **Step 1: Probe Figma if it has 404/500 designs; otherwise use simple defaults**

- [ ] **Step 2: Build `404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Container from '../components/primitives/Container.astro';
import Heading from '../components/primitives/Heading.astro';
import Text from '../components/primitives/Text.astro';
import Button from '../components/primitives/Button.astro';
import SiteHeader from '../components/sections/SiteHeader.astro';
import SiteFooter from '../components/sections/SiteFooter.astro';
---
<BaseLayout
  title="Page not found — imageleft"
  description="The page you’re looking for doesn’t exist."
  noindex
>
  <Fragment slot="header"><SiteHeader /></Fragment>
  <Container size="md" class="py-24 text-center">
    <Heading level={1} size="6xl">404</Heading>
    <Text size="xl" class="mt-2">We couldn’t find that page.</Text>
    <div class="mt-8">
      <Button href="/" variant="primary">Back to home</Button>
    </div>
  </Container>
  <Fragment slot="footer"><SiteFooter /></Fragment>
</BaseLayout>
```

- [ ] **Step 3: Build `500.astro` similarly**

For static hosting, 500 is rare (no server). Some hosts (nginx) can be configured to serve `500.html` for upstream errors. Keeping a designed 500 is cheap insurance.

- [ ] **Step 4: Verify and commit**

```bash
git commit -m "feat(m3): 404 and 500 pages"
```

---

# Milestone M4 — Blog

Goal: blog list and detail pages backed by an Astro Content Collection. Home blog preview re-wired.

## Task M4.1: Define schemas (TDD)

**Files:**
- Create: `src/content/schemas.ts`, `tests/content/schemas.test.ts`

- [ ] **Step 1: Install a test runner**

Vitest is the natural fit for Astro:

```bash
npm install -D vitest
```

Add to `package.json` scripts:

```json
{
  "scripts": {
    "test": "vitest run",
    "test:watch": "vitest"
  }
}
```

- [ ] **Step 2: Write the failing test**

`tests/content/schemas.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { BlogPost } from '../../src/content/schemas';

describe('BlogPost schema', () => {
  it('parses a valid post', () => {
    const result = BlogPost.safeParse({
      slug: 'hello',
      title: 'Hello',
      excerpt: 'A first post.',
      publishedAt: '2026-05-02',
      author: { name: 'Israel' },
      coverImage: '/og/hello.png',
    });
    expect(result.success).toBe(true);
  });

  it('rejects a post missing required fields', () => {
    const result = BlogPost.safeParse({ slug: 'x' });
    expect(result.success).toBe(false);
  });

  it('coerces publishedAt to a Date', () => {
    const result = BlogPost.parse({
      slug: 'hello',
      title: 'Hello',
      excerpt: 'A first post.',
      publishedAt: '2026-05-02',
      author: { name: 'Israel' },
      coverImage: '/og/hello.png',
    });
    expect(result.publishedAt).toBeInstanceOf(Date);
  });

  it('defaults tags to empty array', () => {
    const result = BlogPost.parse({
      slug: 'hello',
      title: 'Hello',
      excerpt: 'A first post.',
      publishedAt: '2026-05-02',
      author: { name: 'Israel' },
      coverImage: '/og/hello.png',
    });
    expect(result.tags).toEqual([]);
  });
});
```

- [ ] **Step 3: Run the test — should fail (no module yet)**

```bash
npm test
```

Expected: FAIL with "Cannot find module '../../src/content/schemas'".

- [ ] **Step 4: Implement the schema**

`src/content/schemas.ts`:

```ts
import { z } from 'zod';

export const BlogPost = z.object({
  slug: z.string(),
  title: z.string(),
  excerpt: z.string(),
  publishedAt: z.coerce.date(),
  author: z.object({
    name: z.string(),
    avatar: z.string().url().optional(),
  }),
  coverImage: z.string(),
  tags: z.array(z.string()).default([]),
});
export type BlogPost = z.infer<typeof BlogPost>;

export const Job = z.object({
  slug: z.string(),
  title: z.string(),
  team: z.string(),
  location: z.string(),
  type: z.enum(['full-time', 'part-time', 'contract', 'internship']),
  postedAt: z.coerce.date(),
  description: z.string(),
});
export type Job = z.infer<typeof Job>;

export const CustomerStory = z.object({
  slug: z.string(),
  customer: z.string(),
  logo: z.string(),
  industry: z.string(),
  summary: z.string(),
  metrics: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .default([]),
  body: z.string(),
});
export type CustomerStory = z.infer<typeof CustomerStory>;
```

- [ ] **Step 5: Add Zod**

```bash
npm install zod
```

- [ ] **Step 6: Run the test again — should pass**

```bash
npm test
```

Expected: 4 passed.

- [ ] **Step 7: Add corresponding tests for Job and CustomerStory in the same file**

(Mirror the BlogPost tests for the other two schemas.)

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "feat(m4): zod schemas for blog, job, story (with tests)"
```

## Task M4.2: Wire Astro Content Collection for blog

**Files:**
- Create: `src/content.config.ts`, `src/content/data/blog/.gitkeep`

- [ ] **Step 1: Create `src/content.config.ts`**

```ts
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { BlogPost } from './content/schemas';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/data/blog' }),
  schema: BlogPost.omit({ slug: true }), // slug derived from filename
});

export const collections = { blog };
```

> Verify the loader API against context7 (`/withastro/docs`, query: "Content Collections loader API in Astro 5"). The above matches the Astro 5 Content Layer pattern.

- [ ] **Step 2: Add a seed post**

`src/content/data/blog/welcome.mdx`:

```mdx
---
title: Welcome to the new imageleft
excerpt: Why we rebuilt the marketing site from the ground up.
publishedAt: 2026-05-02
author:
  name: Israel
coverImage: /og/welcome.png
tags: [news, launch]
---

The new imageleft.com is live. This post explains the why and the how.
```

- [ ] **Step 3: Verify type-check**

```bash
npm run check
```

Expected: 0 errors. Astro generates types for the collection at this step.

- [ ] **Step 4: Commit**

```bash
git add -A
git commit -m "feat(m4): wire blog collection with seed post"
```

## Task M4.3: Build adapter interface (TDD for local adapter)

**Files:**
- Create: `src/content/index.ts`, `src/content/adapters/local.ts`, `src/content/adapters/http.ts`, `tests/content/adapter-local.test.ts`

- [ ] **Step 1: Write the failing test**

`tests/content/adapter-local.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { getBlogPosts, getBlogPost } from '../../src/content';

describe('local content adapter — blog', () => {
  it('returns posts sorted by publishedAt desc', async () => {
    const posts = await getBlogPosts();
    expect(posts.length).toBeGreaterThan(0);
    for (let i = 1; i < posts.length; i++) {
      expect(posts[i - 1].publishedAt.getTime()).toBeGreaterThanOrEqual(
        posts[i].publishedAt.getTime(),
      );
    }
  });

  it('returns null for unknown slug', async () => {
    const post = await getBlogPost('does-not-exist');
    expect(post).toBeNull();
  });

  it('returns the seed post by slug', async () => {
    const post = await getBlogPost('welcome');
    expect(post).not.toBeNull();
    expect(post!.title).toBe('Welcome to the new imageleft');
  });
});
```

- [ ] **Step 2: Run — should fail (no module)**

```bash
npm test
```

- [ ] **Step 3: Implement the adapter interface**

`src/content/index.ts`:

```ts
import * as local from './adapters/local';
import * as http from './adapters/http';
import type { BlogPost, Job, CustomerStory } from './schemas';

const source = import.meta.env.CONTENT_SOURCE ?? 'local';

export const adapter = source === 'http' ? http : local;

export const getBlogPosts = (): Promise<BlogPost[]> => adapter.getBlogPosts();
export const getBlogPost = (slug: string): Promise<BlogPost | null> =>
  adapter.getBlogPost(slug);
export const getJobs = (): Promise<Job[]> => adapter.getJobs();
export const getJob = (slug: string): Promise<Job | null> => adapter.getJob(slug);
export const getStories = (): Promise<CustomerStory[]> => adapter.getStories();
export const getStory = (slug: string): Promise<CustomerStory | null> =>
  adapter.getStory(slug);
```

`src/content/adapters/local.ts`:

```ts
import { getCollection, getEntry } from 'astro:content';
import type { BlogPost, Job, CustomerStory } from '../schemas';

export async function getBlogPosts(): Promise<BlogPost[]> {
  const entries = await getCollection('blog');
  const posts = entries.map((e) => ({ ...e.data, slug: e.id }));
  return posts.sort((a, b) => b.publishedAt.getTime() - a.publishedAt.getTime());
}

export async function getBlogPost(slug: string): Promise<BlogPost | null> {
  const entry = await getEntry('blog', slug).catch(() => null);
  if (!entry) return null;
  return { ...entry.data, slug: entry.id };
}

// Stubs — careers + stories collections wired in M5
export async function getJobs(): Promise<Job[]> { return []; }
export async function getJob(_slug: string): Promise<Job | null> { return null; }
export async function getStories(): Promise<CustomerStory[]> { return []; }
export async function getStory(_slug: string): Promise<CustomerStory | null> { return null; }
```

`src/content/adapters/http.ts`:

```ts
import type { BlogPost, Job, CustomerStory } from '../schemas';

const NOT_IMPLEMENTED = 'HTTP content adapter is not implemented yet (v2).';

export async function getBlogPosts(): Promise<BlogPost[]> { throw new Error(NOT_IMPLEMENTED); }
export async function getBlogPost(_slug: string): Promise<BlogPost | null> { throw new Error(NOT_IMPLEMENTED); }
export async function getJobs(): Promise<Job[]> { throw new Error(NOT_IMPLEMENTED); }
export async function getJob(_slug: string): Promise<Job | null> { throw new Error(NOT_IMPLEMENTED); }
export async function getStories(): Promise<CustomerStory[]> { throw new Error(NOT_IMPLEMENTED); }
export async function getStory(_slug: string): Promise<CustomerStory | null> { throw new Error(NOT_IMPLEMENTED); }
```

- [ ] **Step 4: Run tests — should pass**

```bash
npm test
```

Expected: all green.

- [ ] **Step 5: Commit**

```bash
git add -A
git commit -m "feat(m4): content adapter interface with local impl + http stub"
```

## Task M4.4: Blog list page

**Files:**
- Create: `src/pages/blog/index.astro`, `src/components/sections/BlogList.astro`

- [ ] **Step 1: Probe Figma blog list frame**

```
get_figma_data(fileKey="Nmds4AYHtECKtmnTUDRU6m", nodeId="<blog-list-id>", depth=3)
```

- [ ] **Step 2: Build `src/pages/blog/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Container from '../../components/primitives/Container.astro';
import Heading from '../../components/primitives/Heading.astro';
import SiteHeader from '../../components/sections/SiteHeader.astro';
import SiteFooter from '../../components/sections/SiteFooter.astro';
import BlogList from '../../components/sections/BlogList.astro';
import { getBlogPosts } from '../../content';

const posts = await getBlogPosts();
---
<BaseLayout
  title="Blog — imageleft"
  description="Updates, ideas, and lessons from the imageleft team."
>
  <Fragment slot="header"><SiteHeader /></Fragment>
  <section class="py-16">
    <Container size="lg">
      <Heading level={1} size="5xl">Blog</Heading>
      <BlogList posts={posts} />
    </Container>
  </section>
  <Fragment slot="footer"><SiteFooter /></Fragment>
</BaseLayout>
```

- [ ] **Step 3: Build `BlogList.astro`** — designed from Figma list cards. Use primitives. Avoid raw px/hex.

- [ ] **Step 4: Verify build and commit**

```bash
npm run check && npm run build
git commit -am "feat(m4): blog list page"
```

## Task M4.5: Blog detail page

**Files:**
- Create: `src/pages/blog/[slug].astro`

- [ ] **Step 1: Implement using `getStaticPaths`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Container from '../../components/primitives/Container.astro';
import SiteHeader from '../../components/sections/SiteHeader.astro';
import SiteFooter from '../../components/sections/SiteFooter.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const entries = await getCollection('blog');
  return entries.map((entry) => ({ params: { slug: entry.id }, props: { entry } }));
}

const { entry } = Astro.props;
const { Content } = await render(entry);
---
<BaseLayout
  title={`${entry.data.title} — imageleft`}
  description={entry.data.excerpt}
  ogImage={entry.data.coverImage}
>
  <Fragment slot="header"><SiteHeader /></Fragment>
  <article class="py-16">
    <Container size="sm">
      <h1 class="font-display text-4xl font-bold tracking-tight">{entry.data.title}</h1>
      <p class="mt-2 text-sm text-[var(--color-muted)]">
        {new Date(entry.data.publishedAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
        · {entry.data.author.name}
      </p>
      <div class="prose mt-8 max-w-none">
        <Content />
      </div>
    </Container>
  </article>
  <Fragment slot="footer"><SiteFooter /></Fragment>
</BaseLayout>
```

> Verify the Astro 5 render API with context7: `/withastro/docs`, query *"render content collection entry in Astro 5"*. Adjust if the API shape differs.

- [ ] **Step 2: Add prose styles**

Tailwind v4 doesn't ship `prose` by default. Either install `@tailwindcss/typography` or write a small `.prose` style block in `theme.css`. Pick the lighter option that meets the design.

- [ ] **Step 3: Verify and commit**

```bash
npm run check && npm run build
git commit -am "feat(m4): blog detail page with MDX rendering"
```

## Task M4.6: Re-wire home blog preview

**Files:**
- Modify: `src/components/sections/BlogPreview.astro` (built in M2.4 with placeholder seed)

- [ ] **Step 1: Replace seed array with adapter call**

```astro
---
import { getBlogPosts } from '../../content';
const posts = (await getBlogPosts()).slice(0, 3);
---
{/* template unchanged — already iterates over `posts` */}
```

- [ ] **Step 2: Visual sanity check on home**

Run `npm run dev`, open `/`. Confirm preview reads from collection.

- [ ] **Step 3: Commit**

```bash
git commit -am "feat(m4): home blog preview reads from collection"
```

---

# Milestone M5 — Careers & Customer Stories

Same pattern as M4, applied to the `Job` and `CustomerStory` schemas.

## Task M5.1: Careers collection + adapter

**Files:**
- Create: `src/content/data/careers/*.json` (seed entries), update `src/content.config.ts`, update `src/content/adapters/local.ts`

- [ ] **Step 1: Add the careers collection in `content.config.ts`**

```ts
import { defineCollection } from 'astro:content';
import { file } from 'astro/loaders';
import { BlogPost, Job, CustomerStory } from './content/schemas';
// ...existing blog config

const careers = defineCollection({
  loader: file('./src/content/data/careers/index.json'), // file loader for json array
  schema: Job.omit({ slug: true }),
});

export const collections = { blog, careers /* + stories below */ };
```

> Astro 5's `file` loader reads a single JSON file containing an array (each item gets an `id` from the `id` field). Verify with context7 (`/withastro/docs`, query "file loader for content collection JSON array Astro 5"). If the canonical pattern is `glob` over per-file JSON, use that instead.

- [ ] **Step 2: Seed entries**

`src/content/data/careers/index.json`:

```json
[
  {
    "id": "senior-engineer",
    "title": "Senior Engineer",
    "team": "Platform",
    "location": "Remote · Africa preferred",
    "type": "full-time",
    "postedAt": "2026-05-02",
    "description": "We're looking for a senior engineer to..."
  }
]
```

- [ ] **Step 3: Implement `getJobs` / `getJob` in the local adapter**

```ts
export async function getJobs(): Promise<Job[]> {
  const entries = await getCollection('careers');
  return entries
    .map((e) => ({ ...e.data, slug: e.id }))
    .sort((a, b) => b.postedAt.getTime() - a.postedAt.getTime());
}

export async function getJob(slug: string): Promise<Job | null> {
  const entry = await getEntry('careers', slug).catch(() => null);
  return entry ? { ...entry.data, slug: entry.id } : null;
}
```

- [ ] **Step 4: Add tests for jobs (mirror blog tests)**

- [ ] **Step 5: Commit**

```bash
git commit -am "feat(m5): careers collection + adapter"
```

## Task M5.2: Careers list and detail pages

**Files:**
- Create: `src/pages/careers/index.astro`, `src/pages/careers/[slug].astro`

- [ ] Probe Figma career list/detail frames → build pages → re-wire home career preview if it exists → verify → commit.

```bash
git commit -m "feat(m5): careers list and detail pages"
```

## Task M5.3: Customer Stories collection + pages

Same pattern as M5.1 + M5.2 for `CustomerStory`.

- [ ] **Step 1: Add the stories collection** (`stories` in `content.config.ts`)
- [ ] **Step 2: Seed JSON entries**
- [ ] **Step 3: Implement `getStories` / `getStory` in adapter**
- [ ] **Step 4: Add tests**
- [ ] **Step 5: Probe Figma frames; build pages**
- [ ] **Step 6: Re-wire home customer-stories preview**
- [ ] **Step 7: Commit**

```bash
git commit -m "feat(m5): customer stories collection and pages"
```

---

# Milestone M6 — Hardening & deploy

Goal: SEO complete, quality gates in CI, deploy pipeline live, staging URL working.

## Task M6.1: Sitemap + robots.txt

**Files:**
- Modify: `astro.config.mjs`, `package.json`
- Create: `public/robots.txt`

- [ ] **Step 1: Install `@astrojs/sitemap`**

```bash
npm install @astrojs/sitemap
```

- [ ] **Step 2: Wire the integration**

```js
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://imageleft.com',
  output: 'static',
  integrations: [mdx(), react(), sitemap()],
  vite: { plugins: [tailwindcss()] },
});
```

- [ ] **Step 3: Create `public/robots.txt`**

```
User-agent: *
Allow: /

Sitemap: https://imageleft.com/sitemap-index.xml
```

- [ ] **Step 4: Build and verify sitemap output**

```bash
npm run build
ls dist/sitemap-*.xml
```

Expected: at least `dist/sitemap-index.xml` and `dist/sitemap-0.xml`.

- [ ] **Step 5: Commit**

```bash
git commit -am "feat(m6): sitemap + robots.txt"
```

## Task M6.2: Per-page OG images

**Files:**
- Create: `public/og/default.png`, `public/og/blog.png`, `public/og/pricing.png`, etc.

- [ ] **Step 1: For each top-level page, export an OG card from Figma**

If Figma includes pre-designed OG cards, use `download_figma_images` to pull them as 1200×630 PNG into `public/og/`.

If Figma doesn't include them, design simple cards in the foundations style — title + tagline on brand background — and export. Optional: use a single default card for v1 and revisit per-page later.

- [ ] **Step 2: Reference per-page OG in each page's `BaseLayout` props**

Each page's frontmatter already passes `ogImage` to `BaseLayout` (from M2.2). Update the value to the page-specific PNG.

- [ ] **Step 3: Commit**

```bash
git commit -am "feat(m6): per-page OG images"
```

## Task M6.3: Lighthouse CI

**Files:**
- Create: `lhci.config.cjs`
- Modify: `.github/workflows/ci.yml`

- [ ] **Step 1: Install lhci**

```bash
npm install -D @lhci/cli
```

- [ ] **Step 2: Create `lhci.config.cjs`**

```js
module.exports = {
  ci: {
    collect: {
      staticDistDir: './dist',
      url: [
        'http://localhost/index.html',
        'http://localhost/community.html',
        'http://localhost/pricing.html',
        'http://localhost/contact.html',
        'http://localhost/blog/index.html',
      ],
    },
    assert: {
      assertions: {
        'categories:performance':   ['error', { minScore: 0.95 }],
        'categories:accessibility': ['error', { minScore: 0.95 }],
        'categories:best-practices':['error', { minScore: 0.95 }],
        'categories:seo':           ['error', { minScore: 1.00 }],
      },
    },
    upload: { target: 'temporary-public-storage' },
  },
};
```

- [ ] **Step 3: Add to CI workflow**

Append to `.github/workflows/ci.yml` after the `Build` step:

```yaml
      - name: Lighthouse CI
        run: npx lhci autorun
        continue-on-error: false
```

- [ ] **Step 4: Run locally to verify thresholds are achievable**

```bash
npm run build
npx lhci autorun
```

If any page falls below threshold, fix the cause (large image, render-blocking script, missing meta) before merging.

- [ ] **Step 5: Commit**

```bash
git commit -am "ci(m6): lighthouse CI with strict thresholds"
```

## Task M6.4: Link checker

**Files:**
- Modify: `.github/workflows/ci.yml`, `package.json`

- [ ] **Step 1: Install linkinator**

```bash
npm install -D linkinator
```

- [ ] **Step 2: Add a script**

```json
{
  "scripts": {
    "check:links": "linkinator dist --recurse --skip 'localhost'"
  }
}
```

- [ ] **Step 3: Add to CI**

```yaml
      - name: Link check
        run: npm run check:links
```

- [ ] **Step 4: Verify locally and commit**

```bash
npm run build && npm run check:links
git commit -am "ci(m6): linkinator broken-link check"
```

## Task M6.5: nginx vhost on the VPS

> **Risky-action checkpoint:** this changes shared infrastructure. Before running, confirm with the user which VPS to target, the nginx config path convention on that VPS, and the desired SSL strategy (Let's Encrypt direct vs Cloudflare Origin Cert). Do NOT push changes to the VPS without explicit user approval per command.

**Files (on VPS):**
- Create: `/etc/nginx/sites-available/imageleft-site`, `/etc/nginx/sites-available/imageleft-site-staging`
- Symlink: `/etc/nginx/sites-enabled/imageleft-site*`
- Create: `/var/www/imageleft-site/`, `/var/www/imageleft-site-staging/`

- [ ] **Step 1: Confirm nginx is the chosen origin server (not Caddy) with user**

If Caddy is in use, swap the config in step 3 for a Caddyfile equivalent.

- [ ] **Step 2: Provision the deploy directories on the VPS**

```bash
ssh user@vps "sudo mkdir -p /var/www/imageleft-site /var/www/imageleft-site-staging && sudo chown -R deploy:deploy /var/www/imageleft-site*"
```

(Substitute the real username + path conventions used on this VPS.)

- [ ] **Step 3: Place the vhost config**

`/etc/nginx/sites-available/imageleft-site`:

```nginx
server {
  listen 80;
  server_name imageleft.com www.imageleft.com;
  return 301 https://$host$request_uri;
}

server {
  listen 443 ssl http2;
  server_name imageleft.com www.imageleft.com;

  ssl_certificate     /etc/letsencrypt/live/imageleft.com/fullchain.pem;
  ssl_certificate_key /etc/letsencrypt/live/imageleft.com/privkey.pem;

  root /var/www/imageleft-site;
  index index.html;

  add_header X-Content-Type-Options "nosniff" always;
  add_header X-Frame-Options "SAMEORIGIN" always;
  add_header Referrer-Policy "strict-origin-when-cross-origin" always;
  # CSP — start permissive, tighten later
  add_header Content-Security-Policy "default-src 'self'; script-src 'self' 'unsafe-inline' https://plausible.io; style-src 'self' 'unsafe-inline'; img-src 'self' data: https:; font-src 'self' data: https:; connect-src 'self' https://plausible.io;" always;

  try_files $uri $uri/ $uri.html =404;

  location /_astro/ {
    expires 1y;
    add_header Cache-Control "public, immutable";
  }

  location ~* \.(html)$ {
    expires 5m;
    add_header Cache-Control "public, must-revalidate";
  }

  location ~* \.(png|jpg|jpeg|gif|webp|avif|svg|ico|woff2)$ {
    expires 30d;
    add_header Cache-Control "public";
  }

  gzip on;
  gzip_types text/css text/javascript application/javascript application/json text/xml image/svg+xml;
  gzip_min_length 1024;
}
```

`/etc/nginx/sites-available/imageleft-site-staging` is identical except:
- `server_name new.imageleft.com;`
- `root /var/www/imageleft-site-staging;`
- Cert paths under `/etc/letsencrypt/live/new.imageleft.com/`

Add the staging vhost a `noindex` X-Robots-Tag header so Google doesn't index the staging URL:

```nginx
add_header X-Robots-Tag "noindex, nofollow" always;
```

- [ ] **Step 4: Issue SSL certs**

```bash
sudo certbot --nginx -d imageleft.com -d www.imageleft.com -d new.imageleft.com
```

- [ ] **Step 5: Enable and reload**

```bash
sudo ln -s /etc/nginx/sites-available/imageleft-site /etc/nginx/sites-enabled/
sudo ln -s /etc/nginx/sites-available/imageleft-site-staging /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

Expected: `nginx -t` reports OK; `systemctl reload` returns no error.

- [ ] **Step 6: Smoke test with placeholder content**

```bash
echo '<h1>imageleft staging — empty origin</h1>' | sudo tee /var/www/imageleft-site-staging/index.html
curl -I https://new.imageleft.com/
```

Expected: 200, with the security headers present.

- [ ] **Step 7: DNS — point `new.imageleft.com` at the VPS**

In your DNS provider, add an `A` record for `new.imageleft.com` → VPS IP. If using Cloudflare, set proxy mode (orange cloud) for the staging subdomain too.

> Apex `imageleft.com` is **not** flipped yet — that happens in M7.

## Task M6.6: GitHub Actions deploy workflow

**Files:**
- Create: `.github/workflows/deploy.yml`
- Add secrets to GitHub: `VPS_HOST`, `VPS_USER`, `VPS_SSH_KEY` (private key content)

> **Risky-action checkpoint:** secrets handling. Confirm with user that the SSH key being added has limited scope (deploy user only, no sudo, restricted to the deploy paths). Generate a fresh keypair for this if unsure.

- [ ] **Step 1: Generate a deploy keypair (if needed)**

```bash
ssh-keygen -t ed25519 -f ~/.ssh/imageleft-deploy -C "imageleft-deploy" -N ""
```

Append the public key to `/home/deploy/.ssh/authorized_keys` on the VPS. Provide the private key as `VPS_SSH_KEY` in the GitHub repo's Secrets.

- [ ] **Step 2: Create the workflow**

```yaml
name: Deploy

on:
  push:
    branches: [develop, main]

concurrency:
  group: deploy-${{ github.ref }}
  cancel-in-progress: false

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run check
      - run: npm run lint
      - run: npm run build

      - name: Deploy via rsync
        uses: burnett01/rsync-deployments@7.0.1
        with:
          switches: -avzr --delete --no-times --omit-dir-times
          path: dist/
          remote_path: ${{ github.ref == 'refs/heads/main' && '/var/www/imageleft-site/' || '/var/www/imageleft-site-staging/' }}
          remote_host: ${{ secrets.VPS_HOST }}
          remote_user: ${{ secrets.VPS_USER }}
          remote_key: ${{ secrets.VPS_SSH_KEY }}
```

- [ ] **Step 3: Push to `develop` and confirm staging deploys**

```bash
git push origin develop
```

Watch the Actions tab; verify success. Hit `https://new.imageleft.com/` — should show the latest build.

- [ ] **Step 4: Commit**

```bash
git commit -am "ci(m6): deploy workflow — develop→staging, main→prod"
```

## Task M6.7: Smoke + Lighthouse audit on staging

- [ ] **Step 1: Manual smoke test**

Navigate every top-level page on `https://new.imageleft.com/`. Verify:
- All links resolve
- Images load
- Mobile nav opens/closes
- FAQ accordion expands/collapses
- Contact form opens the mail client
- Blog detail pages render
- 404 page renders for unknown URLs

- [ ] **Step 2: Run Lighthouse against staging**

```bash
npx lighthouse https://new.imageleft.com/ --view --output html --output-path ./lh-staging.html
```

Confirm Performance ≥ 95, Accessibility ≥ 95, SEO = 100, Best Practices ≥ 95. Address any regressions.

- [ ] **Step 3: User signoff on staging**

Get explicit approval from user before scheduling cutover.

---

# Milestone M7 — Cutover

> **Risky action throughout.** All steps require user confirmation per step.

## Task M7.1: Pre-flight checklist

- [ ] All M6 quality gates green on `develop`
- [ ] Staging URL signed off by user
- [ ] Backup of current production exists (apex DNS records, current Next.js app responding correctly)
- [ ] Communication plan for any downtime window (likely none — DNS flip is non-destructive)
- [ ] Rollback plan rehearsed mentally: revert DNS to old A record; old Next.js site at apex still responds

## Task M7.2: DNS flip

- [ ] **Step 1: Merge `develop` → `main`**

```bash
git checkout main
git merge --ff-only develop
git push origin main
```

This triggers a production deploy to `/var/www/imageleft-site/` on the VPS. Verify the build succeeds.

- [ ] **Step 2: Update apex DNS**

In your DNS provider:
- `imageleft.com` A record → VPS IP (or CNAME to staging if you've validated)
- Keep `www.imageleft.com` → same target
- Lower TTL to 300s a few hours before the flip if you can plan ahead

If using Cloudflare proxy: set both records to proxied.

- [ ] **Step 3: Verify HTTPS resolves**

```bash
dig imageleft.com +short
curl -I https://imageleft.com/
```

Expected: VPS IP, 200 with the security headers.

## Task M7.3: Monitor

- [ ] **Step 1: Watch logs for 30 minutes post-flip**

```bash
ssh deploy@vps "sudo tail -f /var/log/nginx/access.log /var/log/nginx/error.log"
```

Watch for unexpected 404s (broken inbound links), 5xx, or unusual request patterns.

- [ ] **Step 2: Check Plausible / analytics dashboard**

Confirm traffic is landing on the new site.

- [ ] **Step 3: Run Lighthouse against production**

```bash
npx lighthouse https://imageleft.com/
```

Match the staging numbers within ±2 points.

## Task M7.4: Decommission old apex (deferred)

After 7 days of stable operation:
- [ ] Update old Next.js project's deploy to remove the apex `server_name` if it had one
- [ ] Document the cutover date and old-vs-new artifact paths in `docs/`

```bash
git commit -am "docs(m7): record cutover date and decommission steps"
```

---

# Self-review

This section is for the plan author (me). Confirms the plan covers the spec.

## Spec coverage check

| Spec section | Covered by |
|---|---|
| §1 Goal / scope | Pre-flight + M0–M7 collectively |
| §2 Architecture context | Pre-flight (out of scope reaffirmed) |
| §3 Pages — tentative | M1.1 (final lock), M2 (home), M3 (community/pricing/contact/404/500), M4 (blog), M5 (careers + stories) |
| §4 Stack | M0.2 (Astro+TS), M0.3 (Tailwind), M0.4 (MDX), M2.3 (React islands), M6.1 (sitemap) |
| §5 Content layer + adapter | M4.1 (schemas), M4.2 (blog collection), M4.3 (adapter), M5.1/M5.3 (jobs/stories) |
| §6 API contract sketch | Recorded in spec only — not implemented (out of scope per user) |
| §7 Figma workflow | Pre-flight + per-section pattern in M2.4 |
| §8 Project structure | "File structure" block at top of plan |
| §9 Hosting/deploy | M6.5 (nginx), M6.6 (GH Actions), M6.7 (smoke), M7 (cutover) |
| §10 Quality gates | M0.6 (CI stub), M6.3 (Lighthouse CI), M6.4 (link check) |
| §11 SEO / perf / a11y | M2.2 (BaseLayout SEO), M6.1 (sitemap/robots), M6.2 (OG), Lighthouse a11y threshold |
| §12 Milestones | One milestone block per spec milestone |
| §13 Open questions | Caddy vs nginx → M6.5 step 1; analytics → M2.2 (Plausible default); CSP → M6.5 step 3 |

No spec gaps.

## Placeholder scan

This plan deliberately contains some "fill from Figma" placeholders in M1.3 (token values), M2.4 (per-section component code), and other Figma-driven sections. **These are not plan failures** — they are dependencies on a real-time MCP probe that the executing agent performs. Each marked spot is a **specific, named field** (e.g., `--color-brand-50: /* hex */`), not a vague "TBD."

No anti-pattern placeholders ("implement appropriate error handling", "add validation", "TBD", "TODO") are present.

## Type consistency check

- Adapter interface uses the same method names across `index.ts`, `local.ts`, `http.ts`: `getBlogPosts`, `getBlogPost`, `getJobs`, `getJob`, `getStories`, `getStory`. Consistent.
- Schema types `BlogPost`, `Job`, `CustomerStory` referenced consistently in tests, adapter, and pages.
- `getStaticPaths` returns shape matches Astro 5 expectations; `entry.id` used as slug throughout.

No type-name drift detected.
