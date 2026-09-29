import { AUTHORS, PRIMARY_AUTHOR, type Author } from "@/config"

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
        `Add it to AUTHORS in src/config.ts.`
    )
  }

  return AUTHORS[PRIMARY_AUTHOR]
}
