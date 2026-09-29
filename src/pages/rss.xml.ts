import rss from "@astrojs/rss"

import { getAuthor } from "@/lib/authors"
import { getPosts } from "@/lib/posts"
import { SITE } from "@/config"

export async function GET(context: { site?: URL }) {
  const posts = await getPosts()

  return rss({
    title: SITE.name,
    description: SITE.description,
    site: context.site ?? SITE.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      link: `/posts/${post.id}`,
      categories: post.data.tags,
      author: getAuthor(post.data.author).name,
    })),
  })
}
