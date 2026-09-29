// Lucide v1 dropped its brand icons, so social logos come from Simple Icons.
// Each SVG is imported raw so only the networks actually used are bundled, and
// so they render as inline markup rather than an extra <img> request.
import bluesky from "simple-icons/icons/bluesky.svg?raw"
import facebook from "simple-icons/icons/facebook.svg?raw"
import github from "simple-icons/icons/github.svg?raw"
import instagram from "simple-icons/icons/instagram.svg?raw"
import mastodon from "simple-icons/icons/mastodon.svg?raw"
import rss from "simple-icons/icons/rss.svg?raw"
import x from "simple-icons/icons/x.svg?raw"
import youtube from "simple-icons/icons/youtube.svg?raw"

const RAW_ICONS = {
  bluesky,
  facebook,
  github,
  instagram,
  mastodon,
  rss,
  x,
  youtube,
} as const

export type SocialIconSlug = keyof typeof RAW_ICONS

// Simple Icons ships a <title> and no fill attribute. Drop the title so the
// adjacent link label is not announced twice, and inherit the text colour so
// icons follow light/dark mode.
function prepare(svg: string) {
  return svg
    .replace(/<title>.*?<\/title>/, "")
    .replace("<svg ", '<svg aria-hidden="true" fill="currentColor" ')
}

export const SOCIAL_ICONS: Record<SocialIconSlug, string> = {
  bluesky: prepare(RAW_ICONS.bluesky),
  facebook: prepare(RAW_ICONS.facebook),
  github: prepare(RAW_ICONS.github),
  instagram: prepare(RAW_ICONS.instagram),
  mastodon: prepare(RAW_ICONS.mastodon),
  rss: prepare(RAW_ICONS.rss),
  x: prepare(RAW_ICONS.x),
  youtube: prepare(RAW_ICONS.youtube),
}

export function isSocialIconSlug(value: string): value is SocialIconSlug {
  return value in SOCIAL_ICONS
}

// Networks with no brand icon in Simple Icons, e.g. LinkedIn, which was
// removed upstream on legal grounds. These fall back to a generic glyph.
export const MISSING_BRAND_ICONS = ["linkedin"] as const
