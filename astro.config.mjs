// @ts-check

import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import rehypeExternalLinks from "rehype-external-links"

// https://astro.build/config
export default defineConfig({
  // Custom domain, set in public/CNAME.
  site: "https://thelazybutcaringteacher.site",
  // A custom domain is served from the root, so no subfolder prefix is needed.
  // Internal links go through withBase() in src/lib/url.ts, so this stays a
  // one-line change if you ever move the site back to a subfolder.
  base: "/",
  // GitHub Pages serves /about/ but returns 404 for /about, so links must
  // carry the trailing slash.
  trailingSlash: "always",
  markdown: {
    rehypePlugins: [
      [
        rehypeExternalLinks,
        {
          target: "_blank",
          rel: ["noopener", "noreferrer"],
          test: (href) => {
            try {
              const url = new URL(href, "https://thelazybutcaringteacher.site")
              return url.origin !== "https://thelazybutcaringteacher.site"
            } catch {
              return false
            }
          },
        },
      ],
    ],
    shikiConfig: {
      // Emit --shiki-light / --shiki-dark custom properties instead of inline
      // colours, so code blocks follow the site theme.
      themes: { light: "github-light", dark: "github-dark" },
      defaultColor: false,
    },
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), sitemap()],
})
