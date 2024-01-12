import { Transform } from 'stream'

export function through(
  transform = (
    chunk: string | Buffer,
    _enc: string,
    cb: (err: Error | null, chunk: string | Buffer) => void
  ) => cb(null, chunk),
  flush?: () => void
) {
  return new Transform({
    transform,
    flush
  })
}

export function throughObj(
  transform = (
    chunk: string | Buffer,
    _enc: string,
    cb: (err: Error | null, chunk: string | Buffer) => void
  ) => cb(null, chunk),
  flush?: () => void
) {
  return new Transform({
    objectMode: true,
    highWaterMark: 16,
    transform,
    flush
  })
}
