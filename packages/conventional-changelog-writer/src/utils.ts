import type {
  Comparator,
  StringsRecord
} from './types/index.js'

const utcDateFormatter = Intl.DateTimeFormat('sv-SE', {
  timeZone: 'UTC'
})

/**
 * Formats date to yyyy-mm-dd format.
 * @param date - Date string, number or Date object.
 * @param timeZone - Time zone to use.
 * @returns Date string in yyyy-mm-dd format.
 */
export function formatDate(date?: string | number | Date, timeZone = 'UTC') {
  const dateFormatter = !timeZone || timeZone === 'UTC'
    ? utcDateFormatter
    : Intl.DateTimeFormat('sv-SE', {
      timeZone
    })

  // sv-SEis used for yyyy-mm-dd format
  return dateFormatter.format(date ? new Date(date) : new Date())
}

/**
 * Safe JSON.stringify with circular reference support.
 * @param obj
 * @returns Stringified object with circular references.
 */
export function stringify(obj: unknown) {
  const stack: unknown[] = []
  const keys: string[] = []
  let thisPos: number

  function cycleReplacer(value: unknown) {
    if (stack[0] === value) {
      return '[Circular ~]'
    }

    return `[Circular ~.${keys.slice(0, stack.indexOf(value)).join('.')}]`
  }

  function serializer(this: unknown, key: string, value: unknown) {
    let resultValue = value

    if (stack.length > 0) {
      thisPos = stack.indexOf(this)

      if (thisPos !== -1) {
        stack.splice(thisPos + 1)
        keys.splice(thisPos, Infinity, key)
      } else {
        stack.push(this)
        keys.push(key)
      }

      if (stack.includes(resultValue)) {
        resultValue = cycleReplacer(resultValue)
      }
    } else {
      stack.push(resultValue)
    }

    return resultValue
  }

  return JSON.stringify(obj, serializer, '  ')
}

/**
 * Creates a compare function for sorting from object keys.
 * @param strings - String or array of strings of object keys to compare.
 * @returns Compare function.
 */
export function createComparator<
  K extends string,
  T extends StringsRecord<K>
>(strings: K | K[] | Comparator<T> | undefined) {
  if (typeof strings === 'string') {
    return (a: T, b: T) => (a[strings] || '').localeCompare(b[strings] || '')
  }

  if (Array.isArray(strings)) {
    return (a: T, b: T) => {
      let strA = ''
      let strB = ''

      for (const key of strings) {
        strA += a[key] || ''
        strB += b[key] || ''
      }

      return strA.localeCompare(strB)
    }
  }

  return strings
}
