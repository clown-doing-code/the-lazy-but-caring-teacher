import { getCollection, type CollectionEntry } from "astro:content"

export type Post = CollectionEntry<"posts">

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
 * All posts, newest first. Drafts are included in dev so they can be
 * previewed, but production builds always exclude them.
 */
export async function getPosts() {
  const posts = await getCollection(
    "posts",
    ({ data }) => import.meta.env.DEV || !data.draft
  )

  warnOnLowResCovers(posts)

  return posts.sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf()
  )
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
