# Figma source-of-truth — current audit

**File:** `Nmds4AYHtECKtmnTUDRU6m` ("v0-revamped")
**Audit baseline:** 2026-05-02 / 2026-05-03 (working from cached probes + PNG renders)
**Figma plan:** Starter — `get_figma_data` and `download_figma_images` both rate-limited (~4-day reset window). All entries below were captured before the window closed and may need re-validation against the live file when access is restored.

---

## 0. Status by section

| Page / asset | Probe (depth 3) | Render PNG | Asset SVGs | Confirmed copy |
|---|---|---|---|---|
| Home — Hero `2:8201` | ✓ | ✓ 1x + 2x | partial (logo, partner strip, avatars) | partial |
| Home — `Frame 86` About | indirect | ✓ 1x | — | partial |
| Home — `Frame 85` Systems We Build | indirect | ✓ 1x + 2x | 5 row-images cropped | minimal |
| Home — `Frame 82` Our Services | ✓ | ✓ 1x | — | confirmed |
| Home — `Frame 74` How It Works | indirect | ✓ 1x | — | confirmed |
| Home — `Frame 83` Business in a Box | indirect | ✓ 1x | — | confirmed |
| Home — `Frame 80` From The Blog | indirect | ✓ 1x | — | partial |
| Home — `Frame 76` Customer Stories | indirect | ✓ 1x | — | partial |
| Home — `Frame 78` FAQ | indirect | ✓ 1x | — | confirmed |
| Home — Ready to Build CTA `2:62179` | indirect | ✓ 1x | — | confirmed |
| Home — Footer `2:62193` | indirect | ✓ 1x | — | confirmed |
| Community `2:75491` | ✓ depth-3 | NO render yet | — | **partial** |
| Pricing `2:84127` | ✓ depth-3 | ✓ Hero + tiers | — | confirmed (tiers, hero) |
| Contact `2:92438` | ✓ depth-3 | NO render yet | — | **NO copy yet** |
| Blog `2:100609` | ✓ depth-3 | NO render yet | — | **NO copy yet** |
| Career `2:108936` | unprobed | ✓ 1x | — | partial |
| Brand logo `2:29539` | indirect | ✓ SVG | ✓ `logo.svg` (117×40) | n/a |
| Hero avatars (left/right) | n/a | ✓ cropped | n/a | n/a |
| Partner strip (Stripe / Paystack / M-PESA / GitHub / 5th) | unprobed | ✓ cropped strip | — | name-only |

**Strongest gaps (when rate limit lifts, prioritize):**
1. Community page render + deeper text probe — we built from a thin probe, may differ
2. Contact page render + form-field labels (currently using made-up copy)
3. Blog page render + post-card structure
4. Career page text probe (we have visual but no per-element copy)
5. Per-section deeper drills (depth 4–5) on home Frame 85 sub-sections, Frame 82 service-card icons, FAQ question text exact wording

---

## 1. Pages — confirmed structure & copy

### Home `2:125` (1440 × 14528)

Order top-to-bottom, all confirmed from cached probe + renders:

1. **Header `2:29538`** — sticky, padding `12px 40px`, fill `rgba(252,252,252,0.05)`, border-bottom `#E9E7EA`, `backdrop-filter: blur(15px)`. Children: `LOGO 2:29539` + `NAV LINK 2:29546`.
2. **Hero `2:8201`** — H1 (serif, italic emphasis "Ambitious"), sub, purple Book a Free Call CTA, two flanking columns (pink / lavender) ending in face avatars, dotted bg, partner logo strip at bottom.
3. **About `2:29552` (Frame 86)** — pill `ABOUT`, large mixed-weight statement: *"We work with founders. We cover every layer of **building a modern digital product**, so you don't need to patch together multiple vendors."* Inline pink + lavender star decorations.
4. **Systems We Build `2:29560` (Frame 85)** — pill `SYSTEMS WE BUILD`, serif H2 *"We Build Every Type Of Digital Product To Help Your Business Grow"*, sub *"We follow a repeatable, modular tested system for building products. Each phase has clear outputs so you always know where things stand."* Six alternating two-column rows; image sub-content not deeply probed (cached cropped PNGs in use).
5. **Our Services `2:61894` (Frame 82)** — dark `#171616` block, `radius-lg` 24px corners. Pill `OUR SERVICES`. Serif H2 *"Build Software That Actually Works."* Sub *"We combine product thinking, design, and engineering to build systems that work, not just features"*. Purple Book a Free Call CTA. 3 service cards: **Product Design**, **Software Development**, **AI & System Automation**, each with command-glyph icon + body. Decorative pink + lavender star/blob shapes in 4 corners.
6. **How It Works `2:61932` (Frame 74)** — two-column. Left: pill `HOW IT WORKS`, serif H2 *"From idea to launch, a process that actually works."*, sub *"We follow a repeatable, founder-tested system for building products. Each phase has clear outputs so you always know where things stand."*, purple Book a Free Call CTA. Right: 4 step cards in vertical timeline with dotted connectors:
   - **Discovery** — *"We understand your idea, define the problem, and identify the right system to build."*
   - **Product design** — *"We translate your visions into structured flows, wireframes and clear product systems."*
   - **Development** — *"We build the product, from frontend to backend, integrating anything needed to make it work."*
   - **Launch & Scale** — *"We help you launch, refine, and scale your product as it grows."*
7. **Business in a Box `2:61985` (Frame 83)** — two-column. Left: pill `BUSINESS IN A BOX`, serif H2 *"Everything You Need To Launch, In One System."*, sub *"We don't build in parts. We design and deliver complete product systems, ready to go live."*, purple Book a Free Call CTA. Right: cluster of 6 dark pill tags (`Web platform`, `Mobile applications`, `Launch & support`, `Admin dashboard`, `Payment integration`, `Scalable backend`) over multi-color star/blob shapes (pink, lavender, yellow, green, coral).
8. **From The Blog `2:62023` (Frame 80)** — pill `BLOG`, centered serif H2 *"From The Blog"*, sub *"Thoughts, lessons, and perspectives from building real products."*, 3 post-card grid, pill button `All Blog Posts`. Per-post copy not deeply probed.
9. **Customer Stories `2:62097` (Frame 76)** — pill `CUSTOMER STORIES`, centered serif H2 *"What Founders say"*, sub *"We work closely with founders to build products that actually deliver"*, horizontal carousel of testimonial cards. One full quote captured: *"What stood out about Imageleft was their ability to translate product ideas into real systems. They didn't just design screens, they built the entire infrastructure that powers our platform."* — **Bibi Gabriel**, *Founder, Fintech Startup*.
10. **FAQ `2:62147` (Frame 78)** — pill `FAQ`, centered serif H2 *"Questions founders often ask"*, sub *"Have questions? We've got answers.. Everything you need to know before you begin"*. 4 visible Q&A items (questions confirmed, answers our own copy):
    - "How long does it take to build a product?"
    - "Do you work with early-stage founders?"
    - "What does it cost to build a product?"
    - "Can you improve an existing product?"
    Outline pill button `See All Questions`.
11. **Ready to Build CTA `2:62179`** — pill `CONTACT`, big serif *"Ready to build something worth building?"*, body *"A 30-minute discovery call. No pitch decks, no hard sells. We'll listen to what you're building and tell you honestly whether we're the right fit."* Two CTAs: purple `Book a Free Call` + outline `Email Us Directly`. Tagline *"We respond within 24 hours. No automated sequences"*.
12. **Footer `2:62193`** — `Imageleft` logo. Three columns:
    - **Company:** Service · About · Careers · Blog
    - **Support:** Customer support · Privacy policy
    - **Contacts:** `+667 990 765555` · `info@imageleft.com` · `104 Reddington Street Rwanda`
    Bottom strip: `© 2026 Imageleft. All rights reserved.` + 4 social icons (Instagram, Facebook, LinkedIn, WhatsApp).

### Community `2:75491` (1440 × 2485)

From depth-3 probe — thin landing page:
- **Hero `2:75541`** (1440 × 1015) — dotted-line Vector grid background pattern (24+ dashed Vector elements), centered email-pill input (`Frame 1410104512`, 610px wide, `radius-md` 12px, fill `#F1F1F1`). Decorative blur ellipses (`blur(322px)`, `blur(281px)`, `blur(151px)`). Sticky header.
- **Ready to Build CTA `2:84113`** (Same shared CTA as Home).
- **Footer** (same shared footer).

**Community-specific copy is NOT in cached probe.** Our implementation invented headline + sub. Re-probe needed for accurate copy.

### Pricing `2:84127` (1440 × 4435)

From depth-3 probe + rendered PNG — confirmed:
- **Hero `2:84177`** (1440 × 2215) — H1 *"What It Cost to Build a Product"*, sub *"Every project is different, but here's a clear view of what it typically costs to design, build, and launch with imageleft."*, purple `Schedule a Call` CTA, "Simple, transparent pricing" sub-section, **3 tier cards** with these confirmed labels (rendered PNG):
  - **STARTER** — Product Design — `$500-$1000` — *"We turn your idea into a real product system"* — features (5 items with check icons): UX research / Wireframes / User flows / High Fidelity designs / Clickable prototypes — `Get Started` button (outline)
  - **POPULAR** — Full Product Development — `From $10,000` — *"End-to-end product build"* — features with circle bullets: Mobile app or web platform / Mobile app and web platform / Backend infrastructure / API integrations / Deployment support — `Get Started` button (dark variant on dark card)
  - **ENTERPRISE** — AI & System Automation — `Custom pricing` — *"We design and integrate intelligent systems"* — features: Automate workflows / Connect tools and APIs / Custom AI integrations / Improve system efficiency / Continuous iterations — `Get Started` (outline)
- **What goes into every project** `Frame 2:92412` (1440 × 748) — section sub of 5 person-icon items: Product thinking / System architecture / Design + development / Testing & iteration / Launch support.
- **Ready to Build CTA** + **Footer**.

### Contact `2:92438` (1440 × 1750)

From depth-3 probe — minimal:
- **Hero `2:92488`** (1440 × 910) — sticky header + `Frame 1410104751` containing `Frame 1410104514` (column gap 44, likely heading + sub) + `Frame 1410104750` (column gap 24, likely form fields).
- **No `Ready to Build` CTA** (intentional — page is itself a contact).
- **Footer**.

**Contact form field labels NOT in cached probe.** Our implementation has Name / Email / Subject / Message. Re-probe needed to confirm against Figma copy.

### Blog `2:100609` (1440 × 2878)

From depth-3 probe:
- **Hero `2:100659`** (1440 × 1431) — sticky header + `Frame 1410104541` (column gap 44) containing `Frame 78` (column align center gap 12, likely title block) + `Frame 1410104693` (column gap 64, likely the post-card grid).
- **Ready to Build CTA `2:108922`**.
- **Footer**.

**Blog page copy + post-card layout NOT deeply probed.** Re-probe needed.

### Career `2:108936` (1440 × 3739) — desktop only

Frame contents from rendered PNG (not data-probed):
- Sticky header with full nav: About · Services · Community · Careers · Pricing.
- Hero: H1 *"Build products that actually matter"* (centered), sub *"We're a small, focused team working with founders to design and build real products. If you care about clarity, systems, and doing things properly, you'll fit right in."*, purple `View Open Roles` CTA.
- "Open Roles" status pill with leading **pink dot** (`#F6BDEC`).
- Light gray "What we value" panel: pill `HOW WE WORK`, sans-serif H2 *"What we value"* (note: sans, not serif), purple `View Open Roles` CTA. Right column: 5 numbered steps (dark squares with white numerals 1–5):
  1. Systems over features
  2. Ownership
  3. Clarity
  4. Speed with intentions
  5. Honest collaboration
- Footer: same as Home.

**No iPad/Phone variants in Figma** for Career — desktop only.

---

## 2. Brand tokens — confirmed (sampled from PNG)

| Token | Hex | Source |
|---|---|---|
| `--color-surface` | `#FCFCFC` | All page-frame fills |
| `--color-surface-soft` | `#F8F8F7` | CTA pill bg, pricing tier card bg |
| `--color-ink` | `#000000` | Footer copyright |
| `--color-ink-strong` | `#171616` | Dark CTA blocks, featured pricing tier card |
| `--color-muted` | `#565656` | Secondary text, footer tagline |
| `--color-border` | `#E9E7EA` | Header/footer dividers, card borders |
| `--color-border-strong` | `#DADADA` | CTA pill stroke |
| `--color-accent` | `#8862DC` | All purple CTAs (sampled twice from rendered hero + frame 74) |
| `--color-accent-strong` | `#6D4AC0` | Inferred hover (~12% darker — not directly sampled) |
| `--color-decoration-pink` | `#F6BDEC` | Hero left stripe, About / Frame 82 / BusinessInABox blobs, Career status dot |
| `--color-decoration-lavender` | `#B7C9FB` | Hero right stripe (sampled) |

**Type:**
- `--font-display`: Playfair Display (italic + roman, weights 400/500/600/700)
- `--font-sans`: Inter (weights 400/500/600/700)

**Radii:**
- `--radius-sm`: 4px (chrome)
- `--radius-md`: 12px (input pills, post cards)
- `--radius-lg`: 24px (Our Services dark block, possibly tier cards)
- `--radius-full`: 9999px (Ready to Build pill, status badges)

**Effects observed (hero only):**
- `backdrop-filter: blur(15px)` on sticky header
- `filter: blur(322px)` ambient color glow (Community hero)
- `filter: blur(281.232177734375px)` side ellipses
- `filter: blur(151.22999572753906px)` center ellipse

**Type sizes observed in chrome (probed):**
- 11px Regular Inter — "We respond within 24 hours" tagline
- 12px Regular Inter, line-height 22px — Footer copyright

**Heading sizes (estimated visually from PNG, not probed):**
- Hero H1: ≈ 72–80px (`text-7xl` 4.5rem chosen)
- Section H2 (centered hero-style): ≈ 48–60px
- Pricing hero H1: ≈ 48px (smaller than home hero)
- Section H2 (left-aligned, two-col): ≈ 40–48px

---

## 3. Component catalog — current implementation

### Primitives `src/components/primitives/`
- `Container.astro` — sizes sm/md/lg/xl, polymorphic `as` (div/section/main/article/nav/header/footer/aside), `mx-auto px-6 md:px-10 lg:px-20`
- `Heading.astro` — levels 1–6, sizes xl/2xl/3xl/4xl/5xl/6xl/7xl, font-display, tracking-tight, NO default text color (inherits from parent)
- `Text.astro` — sizes sm/base/lg/xl, optional muted, polymorphic `as` (p/span/div)
- `Eyebrow.astro` — uppercase tracking-widest text-accent xs (typographic eyebrow, distinct from `PillBadge`)
- `Button.astro` — variants accent/primary/secondary/ghost/outline/pill, sizes sm/md/lg, optional href (renders anchor), `gap-2` for leading icons
- `Link.astro` — text-accent + persistent underline + focus ring, opens external in new tab
- `PillBadge.astro` — variants outline/dark/soft/dark-outline, optional leading colored dot (status badge pattern)
- `IconSquare.astro` — dark/light variants, configurable Tailwind size class
- `StarBlob.astro` — 4-pointed rounded star SVG, configurable color + size
- `Icon.astro` — single source for inline SVG icons. UI: arrow-return, arrow-right, compass, hand, database, rocket, command, plus, minus, quote. Brand: stripe, paystack, mpesa, github, instagram, facebook, linkedin, whatsapp, google-meet (canonical simple-icons path).

### Layouts
- `BaseLayout.astro` — head meta (title/desc/canonical/OG/Twitter), Inter + Playfair Display Google Fonts links, skip-link, header/main/footer slots.

### Sections `src/components/sections/`
- **Chrome:** `SiteHeader`, `SiteFooter`, `MobileNav` (React island)
- **Home:** `Hero` + `HeroStripe`, `About`, `SystemsWeBuild`, `OurServices`, `HowItWorks`, `BusinessInABox`, `BlogPreview`, `CustomerStories`, `FAQ` + `FAQAccordion` (React island), `ReadyToBuildCTA`
- **Community:** `CommunityHero`
- **Pricing:** `PricingHero`, `PricingTiers`, `PricingProcess`
- **Contact:** `ContactForm`

### Public assets `public/sections/`
- `brand/logo.svg` (Figma export, 117×40 viewBox)
- `brand/google-meet.svg` (simple-icons canonical, single-color)
- `hero/avatar-left.png` (100×100 cropped face)
- `hero/avatar-right.png` (100×100 cropped face)
- `hero/partners.png` (1300×130 crop of Stripe/Paystack/M-PESA/GitHub/5th-icon strip)
- `systems/{mobile,dashboard,integrations,notifications,marketplace}.png` (5 row visuals, 800–1100×700–800)

---

## 4. UI consistency review (sanity check, 2026-05-03)

**Strong:**
- Tokens applied uniformly. No raw hex outside `theme.css` (verified via grep).
- Chrome shared everywhere via slot pattern — `Header` and `Footer` defined once, reused on all 7 pages.
- `PillBadge` consistent across sections.
- Type pairing (Playfair Display + Inter) applied consistently.

**Issues to address:**
1. **Pricing tier labels were left-aligned** — fixed in this round (`flex justify-center` + `text-center` on pill + heading block).
2. **`What goes into every project` shows 5 items in a 3-col grid** — last row has 2 items left-justified, looks unbalanced. Should center the last row, or use a different layout.
3. **Em-dashes were sprinkled in user-visible copy** — fixed in this round (titles use `|`, body copy rewritten with periods/commas).
4. **Made-up copy on Contact and Community pages** — placeholder until fresh probe possible.
5. **Page 2x renders not yet captured for Community / Contact / Blog** — three pages still rely on partial structural probes.
6. **Hero avatar geometry** — current implementation is structurally correct (`w-full aspect-square` inside `w-20` parent, `rounded-full`, `left-1/2 -translate-x-1/2`), but per-PNG content centering depends on crop accuracy. Latest crops at `+704+529 92×92` for left, `+2084+529 92×92` for right are within ~3px of true center.
7. **`google-meet` icon is the simple-icons single-color path** — recognizable but not the official 4-color brand mark. Acceptable for a small CTA glyph; could be swapped for the multi-color version if desired.
8. **`Eyebrow` and `PillBadge` overlap in concept** — both are "small label" elements but one is typographic-only (uppercase blue text) while the other is a chip. Worth deciding: keep both with clear use-cases, or consolidate.
9. **Customer Stories carousel converted to 3-col grid** for accessibility, while Figma uses horizontal scroll. Decision noted; revisit with user if Figma fidelity outranks UX.
10. **`Frame 85` row visuals are cropped from rendered PNG** — not vector exports. They look fine at the current sizes but won't scale beyond 800px wide. Replace with vector-rendered SVGs / proper image assets when accessible.

---

## 5. When the rate limit lifts — priority probe list

In order:
1. Render full page PNGs at 2x for: Community, Contact, Blog.
2. Probe Pricing's `Frame 1410104326` (the secondary section between hero and CTA).
3. Probe Frame 85 sub-children (the 6 product showcase rows) for exact text + asset IDs.
4. Probe Frame 82's service-card icon nodes — extract real SVGs to replace `command` glyph approximation.
5. Probe Frame 78 (FAQ) for the actual question + answer text.
6. Probe the partner-strip frame for individual partner SVGs (so we can render at any size, instead of a single PNG strip).
7. Probe Career page at depth 4 — exact value-list copy, Open Roles dot color exact hex.

For each: `get_figma_data(fileKey, nodeId, depth=4)` + `download_figma_images` for every image-fill or vector node referenced.
