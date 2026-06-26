/**
 * Converts a renderable value to a string.
 * @param value - Value to render.
 * @returns String value, or an empty string for empty values.
 */
function toString(value: string | number | null | undefined | false) {
  return typeof value === 'number' || value ? String(value) : ''
}

/**
 * Renders an array into newline-separated non-empty strings.
 * @param array - Items to render.
 * @param callback - Item renderer.
 * @param separator - Separator inserted between rendered items.
 * @returns Rendered string.
 */
export function each<T>(
  array: T[] | null | undefined | false,
  callback: (item: T) => string | number | null | undefined | false,
  separator = newline()
) {
  return array
    ? array.reduce((acc, item) => {
      const rendered = toString(callback(item)).trim()

      return `${acc}${acc && rendered ? separator : ''}${rendered}`
    }, '')
    : ''
}

/**
 * Renders a Markdown heading.
 * @param level - Markdown heading level.
 * @param text - Heading text.
 * @returns Markdown heading.
 */
export function heading(level: number, text: string) {
  return `${'#'.repeat(level)} ${text}`
}

/**
 * Renders a Markdown link.
 * @param text - Link text.
 * @param url - Link URL.
 * @returns Markdown link.
 */
export function link(text: string, url: string) {
  return `[${text}](${url})`
}

/**
 * Renders an array into a Markdown unordered list.
 * @param array - Items to render.
 * @param callback - Item renderer.
 * @returns Markdown unordered list.
 */
export function list<T>(
  array: T[] | null | undefined | false,
  callback: (item: T) => string | null | undefined | false
) {
  return each(
    array,
    (item) => {
      const rendered = toString(callback(item)).trim()
      const itemText = rendered
        .split(/\r?\n/)
        .map((line, index) => (
          index > 0 && line
            ? `  ${line}`
            : line
        ))
        .join('\n')

      return rendered ? `* ${itemText}` : ''
    }
  )
}

/**
 * Renders bold Markdown text.
 * @param text - Text to render.
 * @returns Bold Markdown text.
 */
export function bold(text: string) {
  return `**${text}**`
}

/**
 * Renders italic Markdown text.
 * @param text - Text to render.
 * @returns Italic Markdown text.
 */
export function italic(text: string) {
  return `_${text}_`
}

/**
 * Renders text inside an HTML small element.
 * @param text - Text to render.
 * @returns HTML small element.
 */
export function small(text: string) {
  return `<small>${text}</small>`
}

/**
 * Creates one or more newline characters.
 * @param times - Number of newline characters to render.
 * @returns Newline characters.
 */
export function newline(times = 1) {
  return '\n'.repeat(times)
}

/**
 * Renders values without separators.
 * @param values - Values to render.
 * @returns Concatenated non-empty values.
 */
export function strings(
  ...values: (string | number | null | undefined | false)[]
) {
  return each(values, value => value, '')
}

/**
 * Renders values as Markdown blocks separated by blank lines.
 * @param values - Values to render.
 * @returns Rendered non-empty block segments.
 */
export function segments(
  ...values: (string | number | null | undefined | false)[]
) {
  return each(values, value => value, newline(2))
}

/**
 * Renders values as space-separated words.
 * @param values - Values to render.
 * @returns Rendered non-empty words.
 */
export function words(
  ...values: (string | number | null | undefined | false)[]
) {
  return each(values, value => value, ' ')
}

/**
 * Joins URL path segments and trims extra slashes around each segment.
 * @param parts - URL path segments.
 * @returns Joined URL.
 */
export function url(...parts: (string | number | null | undefined)[]) {
  return parts.reduce((acc: string, part) => {
    if (typeof part !== 'number' && !part) {
      return acc
    }

    const segment = String(part).replace(/^\/+|\/+$/g, '')

    return acc
      ? `${acc}/${segment}`
      : segment
  }, '')
}
