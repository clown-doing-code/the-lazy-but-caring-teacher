import { defineCollection } from "astro:content"
import { glob } from "astro/loaders"
import { z } from "astro/zod"
import { PRIMARY_AUTHOR } from "@/config"

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "./src/content/posts" }),
  // `image` is injected per entry by the content layer; it is not a named
  // export of `astro:content`, so the schema is built from the context.
  schema: ({ image }) =>
    z
      .object({
        title: z.string(),
        description: z.string(),
        pubDate: z.coerce.date(),
        updatedDate: z.coerce.date().optional(),
        tags: z.array(z.string()).default([]),
        draft: z.boolean().default(false),
        /** Key into AUTHORS in src/config.ts. */
        author: z.string().default(PRIMARY_AUTHOR),
        /** Shown above the title. Omit for posts without one. */
        cover: image().optional(),
        coverAlt: z.string().optional(),
      })
      // A cover with no alt text is announced as decorative, and a post cover
      // is never decorative, so the two travel together. Kept as a refine
      // rather than a union so the no-cover case stays a plain optional.
      .refine((data) => !data.cover || Boolean(data.coverAlt), {
        message: "coverAlt is required when a post sets cover",
        path: ["coverAlt"],
      }),
})

export const collections = { posts }
