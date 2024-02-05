import { randomUUID } from 'crypto'
import path from 'path'
import fs from 'fs'

export function createTmpDirectory(rootDir: string) {
  const id = randomUUID()
  const dirname = path.join(rootDir, id)

  fs.mkdirSync(dirname, {
    recursive: true
  })

  return dirname
}
