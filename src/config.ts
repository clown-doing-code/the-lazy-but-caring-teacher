import { withBase } from "@/lib/url"

export const SITE = {
  // TODO: replace with the real title and tagline
  name: "The Lazy but Caring Teacher <3",
  title: "The Lazy but Caring Teacher <3",
  description: "TODO: one sentence describing what this blog is about.",
  // Must match `site` in astro.config.mjs. Keep it at the origin only — the
  // subfolder lives in `base`, and every link already carries it.
  url: "https://clown-doing-code.github.io",
  locale: "en_US",
} as const

export type Author = {
  name: string
  role?: string
  /** Path to a file in /public, e.g. "/me.jpg". Falls back to initials. */
  avatar?: string
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
    role: "Teacher",
    avatar: withBase("/profile_picture.jpeg"),
    url: withBase("/about"),
    email: "emiliojacosta@icloud.com",
  },
  // TODO: add co-authors here, then set `author: "<key>"` in a post's
  // frontmatter. e.g.
  guest: { name: "Fulano", role: "Guest writer" },
  carlos: { name: "Carlos Cueva" },
  anny: { name: "Anny Hidalgo Vélez" },
}

export const ABOUT = {
  // TODO: write these in first person
  intro: ["I like computer stuffs and coding."],
  // TODO: replace with the subjects you actually cover
  topics: ["English", "Computer Science", "Life"],
}

export type NavItem = {
  label: string
  href: string
}

export const NAV: NavItem[] = [
  { label: "Home", href: withBase("/") },
  { label: "Posts", href: withBase("/posts") },
  { label: "About", href: withBase("/about") },
]

export type Social = {
  label: string
  href: string
  icon: string
}

// Brand icons available: bluesky, facebook, github, instagram, mastodon, rss,
// x, youtube. Any other slug renders a generic globe, which is what LinkedIn
// gets — Simple Icons dropped its logo upstream on legal grounds.
export const SOCIALS: Social[] = [
  // TODO: add your profiles, e.g.
  // { label: "Bluesky", href: "https://bsky.app/profile/you", icon: "bluesky" },
  { label: "Facebook", href: "https://facebook.com/you", icon: "facebook" },
  { label: "Instagram", href: "https://instagram.com/you", icon: "instagram" },
  { label: "LinkedIn", href: "https://linkedin.com/in/you", icon: "linkedin" },
  { label: "GitHub", href: "https://github.com/you", icon: "github" },
  // { label: "Mastodon", href: "https://hachyderm.io/@you", icon: "mastodon" },
  // { label: "YouTube", href: "https://youtube.com/@you", icon: "youtube" },
  // { label: "X", href: "https://x.com/you", icon: "x" },
]
