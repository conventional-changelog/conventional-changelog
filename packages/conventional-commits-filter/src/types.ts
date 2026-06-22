// oxlint-disable-next-line typescript/no-explicit-any
export type AnyObject = Record<string, any>

export interface Commit {
  revert?: AnyObject | null
  raw?: AnyObject | null
}
