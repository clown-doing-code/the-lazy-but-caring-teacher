import { getCollection, type CollectionEntry } from "astro:content"

export type Post = CollectionEntry<"posts">

/**
 * All posts, newest first. Drafts are included in dev so they can be
 * previewed, but production builds always exclude them.
 */
export async function getPosts() {
  const posts = await getCollection(
    "posts",
    ({ data }) => import.meta.env.DEV || !data.draft
  )

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
