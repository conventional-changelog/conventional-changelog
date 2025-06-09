const SCISSOR = '# ------------------------ >8 ------------------------'

/**
 * Remove leading and trailing newlines.
 * @param input
 * @returns String without leading and trailing newlines.
 */
export function trimNewLines(input: string) {
  // To escape ReDos we should escape String#replace with regex.

  const matches = input.match(/[^\r\n]/)

  if (typeof matches?.index !== 'number') {
    return ''
  }

  const firstIndex = matches.index
  let lastIndex = input.length - 1

  while (input[lastIndex] === '\r' || input[lastIndex] === '\n') {
    lastIndex--
  }

  return input.substring(firstIndex, lastIndex + 1)
}

/**
 * Append a newline to a string.
 * @param src
 * @param line
 * @returns String with appended newline.
 */
export function appendLine(src: string | null, line: string | undefined) {
  return src ? `${src}\n${line || ''}` : line || ''
}

/**
 * Creates a function that filters out comments lines.
 * @param char
 * @returns Comment filter function.
 */
export function getCommentFilter(char: string | undefined) {
  return char
    ? (line: string) => !line.startsWith(char)
    : () => true
}

/**
 * Select lines before the scissor.
 * @param lines
 * @returns Lines before the scissor.
 */
export function truncateToScissor(lines: string[]) {
  const scissorIndex = lines.indexOf(SCISSOR)

  if (scissorIndex === -1) {
    return lines
  }

  return lines.slice(0, scissorIndex)
}

/**
 * Filter out GPG sign lines.
 * @param line
 * @returns True if the line is not a GPG sign line.
 */
export function gpgFilter(line: string) {
  return !line.match(/^\s*gpg:/)
}

/**
 * Assign matched correspondence to the target object.
 * @param target - The target object to assign values to.
 * @param matches - The RegExp match array containing the matched groups.
 * @param correspondence - An array of keys that correspond to the matched groups.
 * @returns The target object with assigned values.
 */
export function assignMatchedCorrespondence(
  target: Record<string, string | null>,
  matches: RegExpMatchArray,
  correspondence: string[]
) {
  const { groups } = matches

  for (let i = 0, len = correspondence.length, key; i < len; i++) {
    key = correspondence[i]
    target[key] = (groups ? groups[key] : matches[i + 1]) || null
  }

  return target
}
