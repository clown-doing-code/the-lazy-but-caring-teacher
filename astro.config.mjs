// @ts-check

import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  // Origin only — the subfolder lives in `base` below.
  site: "https://clown-doing-code.github.io",
  // GitHub Pages project sites are served from a subfolder, so every internal
  // link and asset needs this prefix. When you attach a custom domain, set this
  // to "/" and update `site`; no source changes needed (see src/lib/url.ts).
  base: "/the-lazy-but-caring-teacher",
  // GitHub Pages serves /about/ but returns 404 for /about, so links must
  // carry the trailing slash.
  trailingSlash: "always",
  markdown: {
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
