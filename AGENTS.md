# AGENTS.md

## Stack

Astro 7 static site, React 19 islands, Tailwind v4, shadcn/ui (`base-lyra` style
on **Base UI**, not Radix), TypeScript strict. pnpm 12.4.1, Node >= 22.12.

Every push to `main` publishes: `.github/workflows/deploy.yml` runs
`pnpm typecheck` + `pnpm build` and deploys `dist/` to GitHub Pages. There is no
staging environment, so a push goes live.

## Commands

- `pnpm dev` / `pnpm build` / `pnpm preview`
- `pnpm lint` — eslint, currently clean
- `pnpm typecheck` — `astro check`; this is the CI gate, run it before calling work done
- `pnpm format` — prettier on `**/*.{ts,tsx,astro}` **only**; `.md` posts, CSS and JSON are not covered
- Verify with `pnpm typecheck && pnpm build` (CI's exact order). There is no test suite or test runner.

## Adding a post

- Posts are markdown in `src/content/posts/`. The filename without extension **is** the slug and the URL — `smoking.md` → `/posts/smoking/`. Nothing in frontmatter sets the path.
- Schema is enforced at build time in `src/content.config.ts`: `title`, `description`, `pubDate`, `tags`, `author`, `cover`, `coverAlt`. See `src/content/posts/smoking.md` for a complete example.
- `pubDate` is date-only and parsed as UTC midnight; `src/lib/format.ts` formats in UTC so dates don't render a day early. Don't add timezones.
- `author` is a key into `AUTHORS` in `src/config.ts` — add new student authors there. An unknown key silently falls back to the primary author in production (dev only warns), so a typo will not fail the build.
- `cover` must be a relative path into `src/assets/` (e.g. `../../assets/foo.webp`), never `public/`. That path is what feeds Astro's image pipeline, the responsive `srcset`, and the OG image.
- Covers narrower than **1440px** produce a `[covers]` build warning and look blurry in the 45rem card slot. It's warn-only — read the build output instead of assuming it passed.
- `draft: true` renders in dev with a Draft badge and is excluded from production builds.

## Architecture

- The domain lives in **three places that must agree**: `site` in `astro.config.mjs`, `SITE.url` in `src/config.ts`, and `public/CNAME`.
- **Every internal link and public-asset path must go through `withBase()`** (`src/lib/url.ts`). Never hardcode `href="/..."`; it breaks as soon as `base` isn't `/`. Keep trailing slashes — GitHub Pages 404s on `/about` but serves `/about/`.
- Use `isActiveNav()` for current-page checks. It strips `base` first; a naive `startsWith` makes Home match on every page.
- Archive page 1 is `src/pages/posts/index.astro`; pages 2+ come from `src/pages/posts/page/[page].astro`. The static `page/` segment exists so a post slug can never collide with a page number. Page size is `POSTS_PER_PAGE` in `src/lib/posts.ts`.
- `post-archive.astro` takes the **full** post list plus a `pageNumber` and slices internally. Don't pass a pre-sliced list.
- `src/components/ui/` is shadcn-generated; hand-edits are fine and `eslint.config.js` already relaxes `react-refresh/only-export-components` there. These are Base UI components: use `render={<X />}`, **not** Radix's `asChild`.
- `cn` is imported from the `cn` npm package directly in existing files; `src/lib/utils.ts` only re-exports it. Match whatever the surrounding file does.
- Social brand icons are wired up one-by-one in `src/lib/social-icons.ts` (8 slugs; LinkedIn intentionally falls back to a globe). A new network needs an entry there.

## Conventions

- Prettier: no semicolons, double quotes, 2 spaces, 80 columns.
- Comments explain **why**, not what — base-path handling, UTC dates, cover resolution all carry real rationale. Match that density rather than deleting them.
- Commits are short lowercase imperative one-liners ("add students post", "fix image resolution").
