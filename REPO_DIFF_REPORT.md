# REPO_DIFF_REPORT

Read-only audit comparing the current local working tree against the
pre-revamp baseline on GitHub.

## Section 1 — Overview

| | |
|---|---|
| Baseline | `8b3156285eb98e74184e1f1cc994cd0fde4ad488` (https://github.com/TIEESUN/Tiessun-blog `main`) |
| Current HEAD | `a1224f1ddf9a0762e4f502fbdc9cff20f4706912` (local `master`) |
| Working tree | Clean against HEAD. One untracked directory (`Hokage_Vanguard/`) — not part of this audit. |
| Audit date | 2026-05-21 |

Aggregate counts from `git diff baseline/main --name-status`:

| Status | Count |
|---|---|
| Added (A) | 6 |
| Deleted (D) | 18 |
| Modified (M) | 23 |

Aggregate line counts (text files only): **+3095 insertions / −1326 deletions / 47 files touched** including binaries.

> **Important context for the 18 deletions:** every "deleted" entry is a static-asset PNG that still exists on disk under the *same name but with an uppercase `.PNG` extension*. Windows is case-insensitive so they appear present; git's tree comparison is case-sensitive so it sees `kimkuksky.png` (baseline) and `kimkuksky.PNG` (current) as different paths. This is a real concern for the Netlify Linux deploy — see Section 8.

---

## Section 2 — Files added

### `src/data/` — new directory

- **`src/data/researchers.json`** — Centralized researcher records (name, photo, title, bio, linkedinUrl, githubUrl, twitterUrl) keyed by id (`muhammad-sawood`, `sarah-jawaid`). Single source of truth for both the home page "Meet the Team" modal and the in-blog researcher cards. ~20 lines.

### `src/styles/` — new directory

- **`src/styles/home.css`** — Home-page-specific layout. Hero panel right-anchored, glass panel `min(720px, 88vw)` wide, two-card modal row, About Me button. Imported once by `src/templates/index-page.js`. ~203 lines.
- **`src/styles/pokemon-card.css`** — All `.hv-card-*` rules for the holographic pokemon card layer stack (base, foil, holo shine, glare, edge shimmer, content). Imported globally via `gatsby-browser.js` so the modal can render anywhere on the site. ~293 lines.

### `static/`

- **`static/bg-video.mp4`** — Fullscreen background video played fixed-position on every page. ~17 MB binary.
- **`static/assets/sawood.png`** — Researcher photo for Muhammad Sawood, used on the home Pokemon card and the in-blog researcher card. ~169 KB.
- **`static/assets/sarah.jpg`** — Researcher photo for Sarah Jawaid, same usage. ~108 KB.

---

## Section 3 — Files deleted

All 18 deletions are in `static/assets/` and correspond 1:1 to the body-image assets referenced by the Rinnegan / APT43 markdown post (and a `diamond.png` referenced at the end of that post).

- `static/assets/kimkuksky.png`
- `static/assets/overview.png`
- `static/assets/kimku.png`
- `static/assets/1-apt43.png` through `static/assets/14-apt43.png` (14 files)
- `static/assets/diamond.png`

**Why they look deleted:** the actual files exist on disk but with uppercase `.PNG` extensions. The current commit (a1224f1) tracks them at the new case (`*.PNG`); the baseline tracked them at the original lowercase (`*.png`). Git's tree comparison treats this as a delete-of-lowercase paired with an add-of-uppercase. On Windows the rename is invisible to `git status` (because `core.ignorecase=true`), so the "add" side of the rename never surfaced as `A` lines in `git diff --name-status`. Net effect: same image bytes, different case, no apparent rename detection.

**Risk:** the Rinnegan markdown references these images as `![](/assets/kimkuksky.png)` (lowercase). On Netlify's case-sensitive Linux filesystem, those references will 404 against `kimkuksky.PNG` on disk. Flagged in Section 8.

---

## Section 4 — Files modified

### Configuration files

#### `gatsby-config.js` (+11 / −7)

Plumbing for the Gatsby build. Plugin list, source-filesystem entries, transformer-remark options.

- **Structural** — Removed the `netlifyCmsPaths` const and its entry from the `gatsby-transformer-remark` plugins array.
- **Structural** — Updated `gatsby-remark-images` options: `maxWidth` 1024 → 1200, `tracedSVG` true → **false** (the SVG placeholder was the cause of permanent image blur), added `quality: 90`, `withWebp: true`, `withAvif: false`, `backgroundColor: "transparent"`, `disableBgImageOnAlpha: true`, `disableBgImage: false`.

#### `gatsby-node.js` (+66 / −13)

Schema customization, page creation, redirects.

- **Structural** — `createSchemaCustomization` rewritten to use `schema.buildObjectType` so a custom resolver can be attached to `frontmatter.featuredImage`. The resolver takes the `/assets/foo.png` string from markdown, strips the leading `/` and `assets/`, then looks up the matching `File` node scoped to `sourceInstanceName: "assets"`. `extensions: { infer: true }` preserves Gatsby's automatic inference for every other frontmatter field.
- **Structural** — New `SLUG_REDIRECTS` const + `createRedirect` loop at the top of `createPages` so renamed posts keep working at their old URLs (gatsby-plugin-netlify writes these into `_redirects`).
- **Behavioral** — `createPages` now also destructures `createRedirect` from `actions`.
- **Behavioral** — `MarkdownRemarkFrontmatter` is no longer declared via SDL `implements Node`; it's defined via `buildObjectType` with the same interface.

#### `package.json` (−1)

- **Dependency change** — `gatsby-plugin-netlify-cms-paths@^1.3.0` removed. No additions, no version bumps. See Section 5.

#### `package-lock.json` (−157)

- **Dependency change** — Auto-regenerated by `npm install` after removing the plugin above. Mechanical sync, no semantic changes.

### Templates

#### `src/templates/blog-post.js` (+180 / −106)

Renders an individual blog post.

- **Structural** — Removed the `@jsx jsx` pragma and the `theme-ui` import; the file is now plain React.
- **Structural** — Imports `researchersData` from `src/data/researchers.json`; builds a `RESEARCHERS_BY_NAME` lookup at module scope.
- **Structural** — New `ResearcherCard` component (photo + name + LinkedIn icon + title; no bio per v13 redesign), new `LegacyResearcherPill` fallback, new `Researchers` wrapper that resolves each frontmatter entry to a full record or falls back to legacy.
- **Structural** — Dropped the old `Pagination` component; prev/next links rendered inline as `.hv-post-nav-btn` glass tiles.
- **Structural** — JSX restructured: outer `.hv-post-page` (no glass, just centering) → `.hv-post-header` (title, date, researchers) → `.hv-post-wrap` (glass card containing featured image + body HTML).
- **Behavioral** — `Image` and `ImageUrl` are derived separately; `Seo` receives the string URL (`ImageUrl`), `GatsbyImage` receives the object (`Image`). Fixes a long-standing PropType mismatch.
- **Dependency / import changes** — Added `import researchersData from "../data/researchers.json"`. Removed `import { jsx } from "theme-ui"`.

#### `src/templates/index-page.js` (+391 / −158, essentially a rewrite)

Home page template (routed via `gatsby-node` from `src/content/pages/index.md`).

- **Structural** — Extensive changes — see git diff for line-level detail. Headline summary:
  - New `HoloCard` component (~150 lines): pointer-tracked 3D tilt via rAF + lerp loop, sets CSS vars (`--rotate-x`, `--pointer-x`, etc.) on the inner card. Reads `{name, title, bio, photo, linkedinUrl, githubUrl, twitterUrl}` from a `data` prop and renders three conditional social buttons.
  - New `CardModal` component: full-screen overlay, blurred backdrop, Esc-to-close, click-outside-to-close, body scroll lock.
  - New `GlassPanel`-style hero with "About This Platform" copy and the "Meet the Team" trigger button.
  - Modal contains a `.hv-modal-card-row` flex container with two `<HoloCard>` instances (Sawood + Sarah) reading from `researchersData`.
  - Three named `LinkedInSvg` / `GitHubSvg` / `XSvg` components for the social icons.
- **Dependency / import changes** — Added imports for `useEffect`, `useRef`, `useState`, `useCallback` from React; added `researchersData`; added `"../styles/home.css"`.

#### `src/templates/blog-list.js` (+92 / −55)

Blog index page.

- **Structural** — Replaced the old grid-of-PostCard layout with an inline `BlogCard` component rendering 3-column responsive card grid (`.blog-card-grid` → 3 cols desktop, 2 ≤1100px, 1 ≤640px).
- **Structural** — Added `formatAuthors` helper that prefers `frontmatter.researchers[].name` (joined with `·`), falls back to `frontmatter.author / authors`, then to `"Hokage Vanguard"`.
- **Structural** — GraphQL query gained `researchers { name }` selection; `featuredImage` `gatsbyImageData` resized to 600×340 with CONSTRAINED layout to match the new 16:9 card image wrap.
- **Behavioral** — Each card is now a `<Link>` wrapping image + body, hover-elevates with crimson glow.
- **Dependency / import changes** — Added `GatsbyImage` import.

#### `src/templates/publication-page.js` (+109 / −70)

Publications listing.

- **Structural** — Removed all inline Theme UI `sx={}` styling; rewritten as plain JSX using `.publication-card` / `.publication-list` / `.publication-title` / `.publication-date` / `.publication-abstract` classes.
- **Content** — `<h1>Publications</h1>` heading added explicitly inside `.content-page`.
- **Dependency / import changes** — Removed the `@jsx jsx` pragma and theme-ui import.

### Components

#### `src/components/layout.js` (+45 / −54)

Root layout wrapper.

- **Structural** — Added `@jsxFrag React.Fragment` pragma + explicit React import so the new `<>` wrapper compiles under the Theme UI `@jsx jsx` pragma.
- **Structural** — Added fixed-position `<video className="site-bg-video">` and `<div className="site-bg-overlay">` siblings to the page content tree; all children now wrap in `<div className="site-content">` which sits at `z-index: 10` over the video.
- **Behavioral** — `useEffect` wires `timeupdate` and `ended` event listeners that jump `currentTime = 0.1` shortly before the end of the video, producing a seamless loop without the visible black-frame pause that `<video loop>` produces in some browsers.
- **Structural** — Removed `Search` and the old children-based `Header` slot-pattern. `Header` is now a self-contained component called without children.

#### `src/components/header.js` (+39 / −32, full rewrite)

Header / top nav bar.

- **Structural** — Rewritten as a self-contained navbar with logo + 3 nav links (Home / Blog / Publication) + hamburger menu. Pulls site title via `useStaticQuery`. Hamburger toggle state managed locally via `useState`.
- **Content** — About link removed from nav.
- **Dependency / import changes** — Now imports `useState` + `useStaticQuery` + `graphql` from gatsby. Drops Theme UI `sx` usage entirely.

#### `src/components/footer.js` (+10 / −16)

Site footer.

- **Structural** — Removed Theme UI `sx={}` styling.
- **Content** — Motto restored to canonical form *"Guarding against the Unknown, Just Like a Hokage"* (italic); copyright line *"© {year} Hokage Vanguard — All rights reserved."* added below.

#### `src/components/navigation.js` (+16 / −16)

Old navigation component — still present but no longer rendered by the new `Header`.

- **Content** — About entry removed from `MenuItems` array (now Home / Blog / Publication).
- **Behavioral** — Removed the `Theme` (theme toggle) import + usage. Removed inline `sx` styling on the nav element.

#### `src/components/post-card.js` (+11 / −44)

Reusable post card. Currently used nowhere (blog-list inlines its own BlogCard).

- **Structural** — Simplified to a single `<Link>` wrapper with `.post-card` class. All Theme UI `sx={}` styling removed.
- **Dependency / import changes** — Removed `@jsx jsx` pragma + theme-ui import.

#### `src/components/search.js` (+7 / −7)

Search dropdown.

- **Styling** — Replaced two `bg: "#fff"` + `color: "#000"` declarations and an `ul.bg: "#fff"` with the dark glass equivalents (`rgba(15,15,15,0.92)`, `var(--text-primary)`, `var(--text-secondary)`, plus a `backdropFilter: blur(14px)` on the result list). Hover state for `ul > li > a` recoloured from `#9b9b9b` to `var(--text-primary)` with a subtle `rgba(255,255,255,0.04)` background.

### Styles

#### `src/assets/scss/style.scss` (+2054 lines, extensive changes — see git diff for line-level detail)

The site's single global stylesheet. The 2,054-line delta is essentially a full rewrite of the visual system.

Grouped categories:

- **CSS variables / fonts** — Poppins + Source Serif 4 imported from Google Fonts. `:root` block introduces `--font-display`, `--font-serif`, `--radius`, the full text-opacity scale (`--text-primary` through `--text-faint`), and the crimson palette (`--crimson`, `--crimson-mid`, `--crimson-bright`, `--crimson-glow`).
- **Reset** — Base 17px body font-size, dark fallback `#050505` background, `box-sizing: border-box` on all elements, themed crimson scrollbar via Firefox `scrollbar-*` and WebKit `::-webkit-scrollbar*` rules.
- **Liquid-glass utilities** — `.liquid-glass` and `.liquid-glass-strong` with translucent backgrounds (`rgba(0,0,0,0.25)` / `rgba(0,0,0,0.35)`), `backdrop-filter: blur() saturate()`, and a `::before` masked-gradient border for the catch-light effect.
- **Site chrome** — `.site-bg-video`, `.site-bg-overlay`, `.site-content` for the fixed video stack. `.nav-bar`, `.nav-logo`, `.nav-links`, `.nav-hamburger` for the new header. `.site-footer` for the new italic + copyright footer.
- **Blog list grid** — `.blog-list-page`, `.blog-list-heading`, `.blog-card-grid`, `.blog-card`, `.blog-card-img-wrap`, `.blog-card-body`, `.blog-card-title`, `.blog-card-excerpt`, `.blog-card-meta`, `.blog-card-author`, `.blog-card-date`. Hover lift + crimson glow; responsive at 1100px and 640px.
- **Blog post chrome** — `.hv-post-page` (outer container), `.hv-post-header` (title block with `text-shadow` for legibility over video), `.hv-post-wrap` (glass body), `.hv-post-nav` + `.hv-post-nav-btn` for prev/next tiles.
- **In-blog researcher card** — `.hv-researchers-row`, `.hv-researcher-card`, `.hv-researcher-photo` (170×170 rounded square), `.hv-researcher-name-row`, `.hv-researcher-linkedin`, `.hv-researcher-title`, plus `.hv-researcher-legacy` fallback for unmapped names.
- **Publication / content pages** — `.publication-list`, `.publication-card`, `.publication-title`, `.publication-date`, `.publication-abstract`, `.content-page`.
- **Article body typography** — Inside `.hv-post-wrap`: universal text-colour override `rgba(255,255,255,0.84) !important`, headings white + Poppins, links crimson, code blocks dark with crimson tint, blockquote with crimson left-border. Specific resets for `.gatsby-resp-image-wrapper *` so the body-image sizing spans don't inherit the 1.12rem font-size.
- **Image-wrapper resets** — Targeted `.hv-post-wrap .gatsby-image-wrapper *` rules that strip `backdrop-filter`/`filter` so the glass blur doesn't bleed into images.
- **Article glass leftovers** — Dead `.article-glass-wrap` / `.post-glass-wrap` blocks from intermediate passes; harmless but unused.

#### `src/assets/scss/_defaults.scss` (+10 / −21)

Browser reset partial.

- **Styling** — Stripped down to just `code { font-family: var(--font-family-mono) }` and `main p { line-height: 1.6 }`. The original universal box-sizing reset, body font-family, link colour rules, etc. are all now consolidated into `style.scss`.

#### `src/assets/scss/lib/_prism-default.scss` (+22 / −27)

Prism syntax-highlighting theme.

- **Styling** — Rewritten from the light "dabblet" theme to a dark crimson-tinted theme. Background `rgba(0,0,0,0.55)`, base text `rgba(245,245,245,0.92)`, comments italic muted-white, keywords blue (`#8ab8ff`), strings green (`#b6e3a1`), functions orange (`#ffb38a`), regex/important amber. Selection highlight is crimson (`rgba(180,20,20,0.45)`).

### Data files

#### `src/gatsby-plugin-theme-ui/index.js` (+24 / −23)

Theme UI theme object.

- **Structural** — `config.useRootStyles: false` + `config.useColorSchemeMediaQuery: false` added so Theme UI doesn't inject a competing `<body>` background that would cover the fixed video.
- **Behavioral** — Every colour palette entry rewritten with `siteColor: "transparent"`, `background: "transparent"`, `primary: "transparent"`, `accent: "transparent"`. The button + socialIcons variants kept but with dark palette values. Result: Theme UI no longer paints over the video.

### Pages / browser shim

#### `gatsby-browser.js` (+2)

- **Dependency / import changes** — Added `import "./src/styles/pokemon-card.css"` at the top so the holographic-card CSS is available site-wide (needed because the modal can render from anywhere, not just the home page).

### Content (markdown)

The audit found 4 markdown files with edits — all minor, all on the frontmatter or first lines. No body text was changed.

#### `src/content/posts/2024-12-21-rinnegan-…-apt43-….md` (+1 / −1)

- **Content** — Slug `/Rinnegan Awakening Unlocking Kimsuk's-APT43 Hidden Shadow Network` → `/rinnegan-awakening-unlocking-kimsuks-apt43-hidden-shadow-network`. The old slug contained spaces and a smart quote which were invalid in Windows paths; a 301 redirect was added in `gatsby-node.js`.

#### `src/content/posts/2025-04-14-🐎-lasso-trail-….md` (+1 / −2)

- **Content** — Slug `/Hunting Chinese Cyber\n  Espionage-Inspired-ORB-Proxy-…` (multi-line YAML folded scalar) → `/hunting-chinese-cyber-espionage-inspired-orb-proxy-techniques-leveraging-zuorat-style-tradecraft-in-phishing-and-malware-operations`. 301 redirect added.

#### `src/content/posts/2025-06-03-eyes-on-the-radar-…-south-asia.md` (+1 / −1)

- **Content** — Slug `"/The Exploit-Theater: Nation-State-Cyber-Clashes-in-South Asia"` → `/the-exploit-theater-nation-state-cyber-clashes-in-south-asia`. The colon and spaces broke Windows path generation. 301 redirect added.

#### `src/content/posts/2026-03-09-rogue-signal-…-iran.md` (−2)

- **Content** — Removed two lines: an empty `![]()` markdown image link on line 20 (no alt, no src — gatsby-remark-images crashed on this and dropped subsequent body content) and a trailing blank line.

---

## Section 5 — Dependencies

### Packages added

None.

### Packages removed

| Package | Previous version | Reason removed |
|---|---|---|
| `gatsby-plugin-netlify-cms-paths` | `^1.3.0` | Incompatible with Gatsby 4.x; was implicitly resolving `featuredImage` paths and silently rewriting body-image URLs. Replaced by the explicit `featuredImage` File resolver in `gatsby-node.js`; body images now work via Gatsby's native static-file serving from `/assets/`. |

### Versions changed

None.

### Other `package.json` fields

No changes to `scripts`, `engines`, `devDependencies`, `repository`, or any other root-level fields.

---

## Section 6 — Build / deploy config

### `gatsby-config.js`

**Baseline:** `gatsby-transformer-remark` had `gatsby-plugin-netlify-cms-paths` as its first sub-plugin; `gatsby-remark-images` was configured with `maxWidth: 1024` and the now-deprecated `tracedSVG: true`.

**Current:** netlify-cms-paths sub-plugin removed; remark-images expanded with `maxWidth: 1200`, `quality: 90`, `tracedSVG: false`, `backgroundColor: "transparent"`, `withWebp: true`, `withAvif: false`, `disableBgImageOnAlpha: true`, `disableBgImage: false`.

**What this means:** body images in markdown posts now render as plain `<img src="/assets/foo.png">` tags served directly from Gatsby's static-file pipeline, rather than going through the (broken) netlify-cms-paths transformer. Featured images still go through Sharp via the new resolver below. The image processing produces high-quality WebP variants and no SVG placeholders.

### `gatsby-node.js`

**Baseline:** Schema customization defined `MarkdownRemarkFrontmatterResearchers` and `MarkdownRemarkFrontmatter implements Node` as SDL strings — no resolvers. `createPages` only created pages, no redirects.

**Current:**
- `createSchemaCustomization` rewritten to use `schema.buildObjectType` for `MarkdownRemarkFrontmatter`, attaching a custom `featuredImage` resolver that maps `/assets/foo.png` → matching `File` node via `relativePath` lookup scoped to `sourceInstanceName: "assets"`. `extensions: { infer: true }` preserves auto-inference for every other field.
- New `SLUG_REDIRECTS` array (3 entries) registered via `createRedirect` at the start of `createPages`. These are written into the deployed `_redirects` file by `gatsby-plugin-netlify` so the renamed post URLs in Section 4 keep working for inbound links to the old paths.

### `netlify.toml`

**Unchanged.** Still `command = "npm run build"`, `publish = "public"`, `NODE_VERSION = "14.15.0"`, `@netlify/plugin-gatsby` plugin enabled.

### `static/admin/config.yml`

**Unchanged.** Collections, fields, media paths all identical to baseline. CMS-authored posts continue to produce the same frontmatter shape the templates expect.

---

## Section 7 — Visual / UX changes summary

The revamp transforms a stock white/light Stackrole starter into a dark, glass-morphic, cinematic site. A returning visitor would see almost nothing in common with the previous design: a fullscreen video plays behind every page, every text block sits on a translucent dark glass card with a crimson-tinted gradient border, and the home page is dominated by a single right-anchored panel that opens a two-card holographic "Meet the Team" modal. Routes are unchanged.

- **Background video** plays fixed-position behind every page; dark overlay ensures text legibility.
- **Glass-morphism** is the dominant idiom — all panels use `backdrop-filter: blur() saturate()` over a low-opacity dark fill.
- **Typography** shifts from default browser fonts to Poppins (display) + Source Serif 4 (italic accents) at 17px base.
- **Crimson + dark** replaces the original pink/purple Stackrole palette.
- **Home page** now shows only a glass description panel on the right with a "Meet the Team" CTA; the legacy "Latest in Blog" grid below the hero is gone.
- **Meet the Team modal** opens to two holographic pokemon-style cards (Sawood + Sarah) with mouse-tracked 3D tilt, holo shimmer, and conditional social icon buttons.
- **Blog list** is now a 3-column responsive card grid (was a 3-up Gatsby-image-thumbnail grid before).
- **Individual blog post** has a centred title/date/researcher header sitting directly over the video, with body content in a single 88%-width glass card below. Researchers render as polished mini-cards with photo + name + LinkedIn link + title.
- **Prev/next post navigation** is now two glass tiles centred under the article.
- **Scrollbar** is themed crimson on a dark track.
- **Navigation** is reduced to Home / Blog / Publication (About removed from the navbar but the page still exists at `/about`).
- **Footer** is italic motto + copyright line.

---

## Section 8 — Notable observations

**Case-mismatched static asset extensions.** The 18 "deleted" PNGs are not deletions — they're case renames (`.png` → `.PNG`) that survive on Windows but will 404 on Netlify's Linux deploy because the markdown still references the lowercase variants. This affects every body image of the Rinnegan / APT43 post and one image of an unrelated location (`diamond.png`). **Recommendation:** mass-rename the 18 files back to lowercase `.png` and re-stage. This is the single most likely cause of any "missing image" reports from production after the next deploy.

**Untracked `Hokage_Vanguard/` directory.** Present at the project root, ignored by git but not by `npm`/Gatsby. Unclear origin — not produced by any change in the diff. Worth investigating; if it's a nested working copy or backup, consider deleting or moving it outside the project root.

**Dead CSS leftovers from intermediate passes.** `style.scss` retains `.article-glass-wrap` and `.post-glass-wrap` rule blocks that no template uses anymore (the blog-post template moved to `.hv-post-wrap` in a later pass). The rules are inert because no element carries the class. They add to bundle size but do no harm. Same goes for the original `.blog-post-title` / `.blog-post-date` / `.blog-post-body` / `.blog-post-header` / `.blog-post-featured` rules from an earlier wrapper structure.

**`src/components/post-card.js` is now orphaned.** Modified during the revamp to use the new class names, but `blog-list.js` no longer imports it (inlines its own `BlogCard`). Nothing else imports it either. Safe to delete, but currently dead code.

**`src/components/navigation.js` is orphaned.** Modified to remove the About link, but the new `Header` component no longer renders it. Safe to delete.

**The `Theme` import (theme-ui colour mode toggle) was removed from `Navigation` but the theme-ui plugin is still loaded** via `gatsby-plugin-theme-ui` in `gatsby-config.js`. Theme UI is dead-weight from the revamp's perspective — every component that used `sx={}` or `jsx` from theme-ui has been rewritten without it (except `blog-post.js`'s previous Researchers component, which has now also been rewritten without `sx`). Could be removed in a future cleanup, but currently it's still in `dependencies` and `gatsby-config.js`.

**No commented-out blocks or TODO/FIXME markers** introduced anywhere in the diff. Code is reasonably tidy.

**`gatsby-plugin-netlify` is listed twice in `gatsby-config.js`** (lines 109 + 111-122). This is unchanged from baseline — not introduced by the revamp — but it's an existing anomaly worth flagging since you may not have noticed.

**Inconsistency between `src/templates/blog-post.js` import style and `src/templates/index-page.js` import style.** The former dropped the `@jsx jsx` pragma entirely; the latter never used it. Both files are plain React. The former matches the team's apparent direction. Probably fine; just noting that some legacy templates (`contact-page.js`, `about-page.js`) still use the original Theme UI patterns and weren't touched by the revamp.

**Slug case sensitivity flagged but not enforced.** The 3 renamed slugs from problematic-character originals were lowercased and dashed, but the CMS `slug` widget hint still says *"Use only alphanumeric characters, - and _."* without enforcing lowercase. A future post authored via the CMS with a title-cased slug (e.g. `/My-New-Post`) would work on Linux but couldn't be reached as `/my-new-post`. Worth a small CMS pattern-validation field, but out of scope for this audit.

---

## Section 9 — End

Baseline remote will be removed after this report is saved. See the user-facing message for the cleanup confirmation.
