import type { Commit } from './types.js'
import { findRevertCommit } from './utils.js'

export class RevertedCommitsFilter<T extends Commit = Commit> {
  private readonly hold = new Set<T>()
  private holdRevertsCount = 0;

  /**
   * Process commit to filter reverted commits
   * @param commit
   * @yields Commit
   */
  * process(commit: T) {
    const { hold } = this
    const revertCommit = findRevertCommit(commit, hold)

    if (revertCommit) {
      hold.delete(revertCommit)
      this.holdRevertsCount--
      return
    }

    if (commit.revert) {
      hold.add(commit)
      this.holdRevertsCount++
      return
    }

    if (this.holdRevertsCount > 0) {
      hold.add(commit)
    } else {
      if (hold.size) {
        yield* hold
        hold.clear()
      }

      yield commit
    }
  }

  /**
   * Flush all held commits
   * @yields Held commits
   */
  * flush() {
    const { hold } = this

    if (hold.size) {
      yield* hold
      hold.clear()
    }
  }
}
