import rss from "@astrojs/rss"

import { SITE } from "@/config"
import { getAuthor } from "@/lib/authors"
import { getPosts } from "@/lib/posts"
import { withBase } from "@/lib/url"

export async function GET(context: { site?: URL }) {
  const posts = await getPosts()
  const origin = (context.site ?? new URL(SITE.url)).origin
  const base = withBase("/")
  // Every URL is absolute and already carries `base`, so `site` is passed as
  // the origin: @astrojs/rss resolves bare `link` values against it, and using
  // the base path there would double it.
  const site = `${origin}${base}`

  return rss({
    title: SITE.name,
    description: SITE.description,
    site,
    trailingSlash: true,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: withBase(`/posts/${post.id}/`),
      categories: post.data.tags,
      author: getAuthor(post.data.author).name,
    })),
  })
}
