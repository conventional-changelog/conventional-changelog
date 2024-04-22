import { resolve, extname } from 'path'
import { pathToFileURL } from 'url'
import { readFile } from 'fs/promises'

function relativeResolve(filePath: string) {
  return pathToFileURL(resolve(process.cwd(), filePath))
}

export async function loadDataFile(filePath: string): Promise<object> {
  const resolvedFilePath = relativeResolve(filePath)
  const ext = extname(resolvedFilePath.toString())

  if (ext === '.json') {
    return JSON.parse(await readFile(resolvedFilePath, 'utf8')) as object
  }

  // @ts-expect-error Dynamic import actually works with file URLs
  // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
  return (await import(resolvedFilePath)).default as object
}
