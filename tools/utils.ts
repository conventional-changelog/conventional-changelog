export function delay(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms))
}

export async function toArray<T>(iterable: Iterable<T> | AsyncIterable<T>): Promise<T[]> {
  const array = []

  for await (const item of iterable) {
    array.push(item)
  }

  return array
}

export async function toString(iterable: Iterable<string | Buffer> | AsyncIterable<string | Buffer>) {
  let string = ''

  for await (const chunk of iterable) {
    string += chunk.toString()
  }

  return string
}
