# The Lazy but Caring Teacher <3

Source for [thelazybutcaringteacher.site](https://thelazybutcaringteacher.site) — a
blog of essays and projects by Emilio Alcántara, mostly computer science and
English.

Built with [Astro](https://astro.build), React islands, Tailwind CSS v4 and
shadcn/ui. It builds to fully static HTML and is served by GitHub Pages, so
there is no server to run in production.

## Running it locally

Requires Node 22.12+ and pnpm.

```bash
pnpm install
pnpm dev        # http://localhost:4321
```

Other scripts:

| Command          | What it does                                           |
| ---------------- | ------------------------------------------------------ |
| `pnpm build`     | Builds the static site to `dist/`                      |
| `pnpm preview`   | Serves the built `dist/` locally                       |
| `pnpm typecheck` | Runs `astro check` (the CI gate)                       |
| `pnpm lint`      | Runs ESLint                                            |
| `pnpm format`    | Formats `.ts`, `.tsx` and `.astro` files with Prettier |

There is no test suite. Before calling a change done, run the same two steps CI
does:

```bash
pnpm typecheck && pnpm build
```

## Writing a post

Posts are markdown files in `src/content/posts/`. **The filename is the URL** —
`smoking.md` is published at `/posts/smoking/`, so pick the name before you
publish.

```markdown
---
title: "Smoking Should Be Banned in All Public Place"
description: "One sentence, used for the page description and social previews."
pubDate: 2026-10-01
tags: ["English Project", "Writing"]
author: nanyeli
cover: ../../assets/smoking.webp
coverAlt: "A person smoking"
---

The post body goes here.
```

- `author` is a key from `AUTHORS` in `src/config.ts` — add a student there
  first, otherwise the post falls back to you without any warning in production.
- `cover` must point into `src/assets/`, not `public/`, so Astro can generate
  the responsive images and the social preview image. Give it at least 1440px of
  width or the build prints a `[covers]` warning and it renders blurry.
- Set `draft: true` to work on a post without publishing it. Drafts show up in
  `pnpm dev` and are left out of production builds.

## Layout

```
src/
  assets/        Cover images referenced from post frontmatter
  components/    Astro components, plus React islands and shadcn/ui in ui/
  content/       The posts themselves
  layouts/       Page shell: head tags, header, footer
  lib/           Posts, dates, authors, base-path helpers
  pages/         Routes; posts/page/[page].astro holds archive pages 2+
  styles/        Tailwind v4 theme and the light/dark tokens
```

## Deploying

Pushing to `main` publishes the site. GitHub Actions runs the typecheck and
build, then uploads `dist/` to GitHub Pages. There is no staging environment, so
a push is live immediately.

The domain is configured in three places that have to agree: `site` in
`astro.config.mjs`, `SITE.url` in `src/config.ts`, and `public/CNAME`.

## Adding a component

shadcn/ui components are generated into `src/components/ui/`. They are built on
Base UI, so pass other elements with the `render` prop rather than Radix's
`asChild`.

```bash
npx shadcn@latest add button
```

## Contributing

[AGENTS.md](AGENTS.md) documents the conventions this codebase follows — base
path handling, cover image rules, pagination layout and more.
