const BASE = import.meta.env.BASE_URL

/** BASE_URL without its trailing slash, e.g. "" or "/the-lazy-but-caring-teacher". */
const basePath = BASE.replace(/\/$/, "")

/**
 * Prefixes a root-absolute path with Astro's `base`.
 *
 * Deploying under a subfolder (e.g. a GitHub Pages project site) means `/about`
 * resolves to the domain root instead of the site. Every internal link and
 * public-asset path must go through here so that changing `base` in
 * astro.config.mjs stays a one-line switch.
 */
export function withBase(path: string): string {
  if (/^(?:[a-z]+:)?\/\//i.test(path) || path.startsWith("#")) return path
  return `${basePath}${path.startsWith("/") ? path : `/${path}`}`
}

/** The inverse of `withBase`: turns a site path back into a root-absolute one. */
export function stripBase(pathname: string): string {
  if (!basePath || !pathname.startsWith(basePath)) return pathname
  return pathname.slice(basePath.length) || "/"
}

/**
 * Whether a nav item is the current page. Compares base-stripped paths so that
 * `base` never leaks into the match — otherwise every path starts with the
 * base and the home link matches everywhere.
 */
export function isActiveNav(pathname: string, href: string): boolean {
  const current = stripBase(pathname)
  const target = stripBase(href)
  return target === "/" ? current === "/" : current.startsWith(target)
}
