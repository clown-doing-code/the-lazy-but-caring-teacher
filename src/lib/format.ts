const dateFormatter = new Intl.DateTimeFormat("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
  // Frontmatter dates are date-only and parsed as UTC midnight, so format
  // them in UTC too. Otherwise they render a day early west of Greenwich.
  timeZone: "UTC",
})

export function formatDate(date: Date) {
  return dateFormatter.format(date)
}

const WORDS_PER_MINUTE = 200

export function estimateReadingTime(body: string | undefined) {
  if (!body) return 0

  const words = body.trim().split(/\s+/).length
  return Math.max(1, Math.round(words / WORDS_PER_MINUTE))
}
