import type { ImageMetadata } from "astro"

import profilePhoto from "@/assets/profile-photo.jpeg"
import { withBase } from "@/lib/url"

export type Author = {
  name: string
  role?: string
  /** Photo in src/assets, optimized on demand. Falls back to initials. */
  avatar?: ImageMetadata
  /** Where the byline links. Omit to render the name as plain text. */
  url?: string
  email?: string
}

// The author whose page /about describes, and the byline default for any post
// that does not set `author` in its frontmatter.
export const PRIMARY_AUTHOR = "emilio"

export const AUTHORS: Record<string, Author> = {
  emilio: {
    name: "Emilio Alcántara",
    role: "Lazy Teacher",
    avatar: profilePhoto,
    url: withBase("/about/"),
    email: "",
  },
  // TODO: add co-authors here, then set `author: "<key>"` in a post's
  // frontmatter. e.g.
  // guest: { name: "Fulano", role: "Guest writer" },
  carlos: { name: "Carlos Cueva" },
  anny: { name: "Anny Hidalgo Vélez" },
  loribel: { name: "Loribel Taveras" },
  emely: { name: "Emely Valdez García" },
  felix: { name: "Felix Dickson" },
  elizabeth: { name: "Elizabeth Maria Gomez" },
  marilisy: { name: "Marilisy Tejada" },
  wilfred: { name: "Wilfred Holguin Adames" },
  yulied: { name: "Yulied Vasquez" },
  nanyeli: { name: "Nanyeli Concepcion" },
  juan: { name: "Juan de Dios Fernández Camilo" },
  grissette: { name: "Grissette Sosa" },
  jeremy: { name: "Jeremy Ventura" },
  andriw: { name: "Andriw Antonio Padilla" },
}

/**
 * Resolves a frontmatter `author` key to a registry entry, falling back to the
 * primary author so a typo never breaks the build.
 */
export function getAuthor(id: string | undefined): Author {
  const key = id ?? PRIMARY_AUTHOR
  const author = AUTHORS[key]

  if (author) return author

  if (import.meta.env.DEV) {
    console.warn(
      `[authors] Unknown author "${key}", falling back to "${PRIMARY_AUTHOR}". ` +
        `Add it to AUTHORS in src/lib/authors.ts.`
    )
  }

  return AUTHORS[PRIMARY_AUTHOR]
}
