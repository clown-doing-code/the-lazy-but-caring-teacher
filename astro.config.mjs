// @ts-check

import tailwindcss from "@tailwindcss/vite"
import { defineConfig } from "astro/config"
import react from "@astrojs/react"

// https://astro.build/config
export default defineConfig({
  site: "https://example.com", // TODO: point at the real domain
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
  integrations: [react()],
})
