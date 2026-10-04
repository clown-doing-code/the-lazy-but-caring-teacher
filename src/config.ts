import { withBase } from "@/lib/url"

// The author registry lives in src/lib/authors.ts rather than here. This module
// is imported by the MobileNav island, so it is in the client bundle, and
// AUTHORS now imports an image from src/assets — which would drag that file
// client-side. Keep this file to plain, serializable site data.
export const SITE = {
  // TODO: replace with the real title and tagline
  name: "The Lazy but Caring Teacher <3",
  title: "The Lazy but Caring Teacher <3",
  description: "Random stuffs",
  // Must match `site` in astro.config.mjs.
  url: "https://thelazybutcaringteacher.site",
  locale: "en_US",
} as const

export const ABOUT = {
  // TODO: write these in first person
  intro: ["I like computer stuffs and coding."],
  // TODO: replace with the subjects you actually cover
  topics: ["#English", "#Computer Science", "#Life"],
}

export type NavItem = {
  label: string
  href: string
}

export const NAV: NavItem[] = [
  { label: "Home", href: withBase("/") },
  { label: "Posts", href: withBase("/posts/") },
  { label: "About", href: withBase("/about/") },
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
  {
    label: "Facebook",
    href: "https://www.facebook.com/emilioaa2612/",
    icon: "facebook",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/emi_jaa/",
    icon: "instagram",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/emilio-alcantara-acosta/",
    icon: "linkedin",
  },
  {
    label: "GitHub",
    href: "https://github.com/clown-doing-code",
    icon: "github",
  },
  // { label: "Mastodon", href: "https://hachyderm.io/@you", icon: "mastodon" },
  // { label: "YouTube", href: "https://youtube.com/@you", icon: "youtube" },
  // { label: "X", href: "https://x.com/you", icon: "x" },
]
