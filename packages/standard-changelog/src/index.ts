import type { ConventionalGitClient } from '@conventional-changelog/git-client'
import { ConventionalChangelog } from 'conventional-changelog'
import angular from 'conventional-changelog-angular'

export * from 'conventional-changelog'

export class StandardChangelog extends ConventionalChangelog {
  constructor(cwdOrGitClient: string | ConventionalGitClient) {
    super(cwdOrGitClient)

    this.config(angular())
  }
}
