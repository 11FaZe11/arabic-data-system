/**
 * Highlights search terms in text with HTML markup
 */
export function highlightText(text: string, searchQuery: string): string {
  if (!searchQuery.trim()) return text

  const query = searchQuery.trim()
  const regex = new RegExp(`(${escapeRegex(query)})`, "gi")

  return text.replace(regex, '<mark class="bg-secondary/30 text-secondary font-semibold px-1 rounded">$1</mark>')
}

/**
 * Extracts context snippets around search matches
 */
export function extractContext(text: string, searchQuery: string, contextLength = 100): string[] {
  if (!searchQuery.trim()) return []

  const query = searchQuery.trim().toLowerCase()
  const textLower = text.toLowerCase()
  const contexts: string[] = []
  let startPos = 0

  while (startPos < text.length) {
    const matchIndex = textLower.indexOf(query, startPos)
    if (matchIndex === -1) break

    const contextStart = Math.max(0, matchIndex - contextLength)
    const contextEnd = Math.min(text.length, matchIndex + query.length + contextLength)

    let snippet = text.slice(contextStart, contextEnd)

    // Add ellipsis if not at start/end
    if (contextStart > 0) snippet = "..." + snippet
    if (contextEnd < text.length) snippet = snippet + "..."

    contexts.push(snippet)

    // Move to next potential match
    startPos = matchIndex + query.length

    // Limit to 3 contexts per file
    if (contexts.length >= 3) break
  }

  return contexts
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
}

/**
 * Calculate match score for relevance ranking
 */
export function calculateMatchScore(text: string, searchQuery: string): number {
  if (!searchQuery.trim()) return 0

  const query = searchQuery.trim().toLowerCase()
  const textLower = text.toLowerCase()

  // Count occurrences
  const matches = (textLower.match(new RegExp(escapeRegex(query), "g")) || []).length

  // Boost score if match is at the beginning
  const startsWithMatch = textLower.startsWith(query) ? 2 : 1

  return matches * startsWithMatch
}
