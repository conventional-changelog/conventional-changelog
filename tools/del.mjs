import { rmSync } from 'fs'

const paths = process.argv.slice(2)

for (const p of paths) {
  rmSync(p, {
    recursive: true,
    force: true
  })
}
