import { getCollection, type CollectionEntry } from "astro:content"

import { withBase } from "@/lib/url"

export type Post = CollectionEntry<"posts">

/** Languages a post can be written in. English needs no path segment. */
export const LANGS = ["en", "es"] as const

export type Lang = (typeof LANGS)[number]

export const DEFAULT_LANG: Lang = "en"

/**
 * Long names, for prose rather than the two-letter toggle labels. Also the
 * source for the "only available in {language}" copy, so a post in either
 * language reads correctly without a second string.
 */
export const LANG_NAMES: Record<Lang, string> = {
  en: "English",
  es: "Spanish",
}

/**
 * The language a post is written in, read off its path instead of its
 * frontmatter: `posts/es/smoking.md` gets the id `es/smoking`, so the directory
 * already says it. Deriving it here means the two can never disagree.
 */
export function langOf(post: Post): Lang {
  const [head] = post.id.split("/")
  return LANGS.includes(head as Lang) ? (head as Lang) : DEFAULT_LANG
}

/**
 * The stem that every language of one post shares, so `smoking` and
 * `es/smoking` resolve to the same group. This is what pairs a post with its
 * translation; nothing in the frontmatter has to repeat it.
 */
export function translationKey(post: Post): string {
  const segments = post.id.split("/")
  return segments.length > 1 ? segments.slice(1).join("/") : post.id
}

/** The site path for a post. Both languages of a post keep their own URL. */
export function postHref(post: Post): string {
  return withBase(`/posts/${post.id}/`)
}

/**
 * Every language this post exists in, keyed by language. Entries are null when
 * a translation is missing, which is the normal case: most posts are written
 * once. Driven off LANGS so adding a language needs no change here.
 */
export function getTranslations(
  post: Post,
  all: Post[]
): Record<Lang, Post | null> {
  const key = translationKey(post)
  const found = new Map<Lang, Post>(
    all
      .filter((candidate) => translationKey(candidate) === key)
      .map((candidate) => [langOf(candidate), candidate])
  )

  const translations = {} as Record<Lang, Post | null>
  for (const lang of LANGS) translations[lang] = found.get(lang) ?? null
  return translations
}

/**
 * Covers render in a 45rem (720px) slot. A source narrower than this is
 * stretched by the browser even on a 1x display, and a 2x display renders it
 * at roughly 2.35x its real size, which reads as blur. Astro caps the
 * generated srcset at the source width instead of upscaling, so a small cover
 * yields a single-entry srcset with nothing better to pick.
 */
const MIN_COVER_WIDTH = 1440

const warnedCovers = new Set<string>()

/**
 * Warns about covers too small to stay sharp. Warns rather than fails: an
 * undersized cover is a content problem to fix, not a reason to block a
 * deploy. Deduplicated because getPosts() runs once per page.
 */
function warnOnLowResCovers(posts: Post[]) {
  for (const post of posts) {
    const { cover } = post.data
    if (!cover || cover.width >= MIN_COVER_WIDTH) continue
    if (warnedCovers.has(post.id)) continue

    warnedCovers.add(post.id)
    console.warn(
      `[covers] "${post.id}" has a ${cover.width}px cover, below the ` +
        `${MIN_COVER_WIDTH}px needed to stay sharp in the 45rem cover slot. ` +
        `Re-export the source at ${MIN_COVER_WIDTH}px or wider, or it will look blurry.`
    )
  }
}

/**
 * Every post in every language, newest first. Route generation needs all of
 * them, translations included, which is why this is separate from getPosts().
 * Drafts are included in dev so they can be previewed, but production builds
 * always exclude them.
 */
export async function getAllPosts() {
  const posts = await getCollection(
    "posts",
    ({ data }) => import.meta.env.DEV || !data.draft
  )

  warnOnLowResCovers(posts)

  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  )
}

/**
 * Posts for the listings — the archive, the home page and the feed — newest
 * first.
 *
 * Only the default language. A translation is reachable from its English
 * counterpart through the language toggle, so listing it as well would show the
 * same essay twice and inflate the counts. The trade-off is that a post
 * existing *only* in Spanish never surfaces in a listing: publish a translation
 * alongside its English original, never on its own.
 */
export async function getPosts() {
  return (await getAllPosts()).filter((post) => langOf(post) === DEFAULT_LANG)
}

/**
 * Posts shown per page in the archive. Bump this and every archive page is
 * rebuilt at the new size; nothing else has to change.
 */
export const POSTS_PER_PAGE = 5

export type PaginatedPosts = {
  /** The slice of posts for this page, in the order they were passed in. */
  posts: Post[]
  /** 1-based. */
  pageNumber: number
  /** Always at least 1, so page 1 exists even with no posts at all. */
  pageCount: number
  /** Total posts across all pages. */
  total: number
  previous: number | null
  next: number | null
}

/**
 * Slices `posts` down to one page. Callers pass the full list from
 * getPosts(), already sorted newest first.
 *
 * `pageNumber` is clamped rather than rejected: page 1 must render even with
 * an empty collection, and a stale link to a now-out-of-range page should land
 * on the last page that still exists instead of throwing.
 */
export function paginatePosts(
  posts: Post[],
  pageNumber = 1,
  pageSize = POSTS_PER_PAGE
): PaginatedPosts {
  const pageCount = Math.max(1, Math.ceil(posts.length / pageSize))
  const current = Math.min(Math.max(Math.trunc(pageNumber) || 1, 1), pageCount)
  const start = (current - 1) * pageSize

  return {
    posts: posts.slice(start, start + pageSize),
    pageNumber: current,
    pageCount,
    total: posts.length,
    previous: current > 1 ? current - 1 : null,
    next: current < pageCount ? current + 1 : null,
  }
}

/**
 * Page numbers to render in the pagination control, with `"…"` standing in for
 * the runs of skipped pages. Always includes the first and last page plus the
 * current page's neighbours, so the row stays a fixed width however many pages
 * the archive grows to.
 */
export function pageWindow(
  pageNumber: number,
  pageCount: number,
  radius = 1
): Array<number | "…"> {
  if (pageCount <= 1) return []

  const pages = new Set<number>([1, pageCount])
  for (let page = pageNumber - radius; page <= pageNumber + radius; page++) {
    if (page >= 1 && page <= pageCount) pages.add(page)
  }

  const window: Array<number | "…"> = []
  let previous = 0

  for (const page of [...pages].sort((a, b) => a - b)) {
    if (previous && page - previous > 1) window.push("…")
    window.push(page)
    previous = page
  }

  return window
}

/** Groups posts by publication year, newest year first. */
export function groupByYear(posts: Post[]) {
  const groups = new Map<number, Post[]>()

  for (const post of posts) {
    const year = post.data.pubDate.getUTCFullYear()
    const group = groups.get(year)

    if (group) {
      group.push(post)
    } else {
      groups.set(year, [post])
    }
  }

  return [...groups.entries()]
}
