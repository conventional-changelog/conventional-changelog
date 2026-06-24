import type {
  CommitKnownProps,
  FinalTemplateContext,
  TransformedCommit
} from '@conventional-changelog/template'
import type { FinalOptions } from './types/index.js'
import { getTemplateContext } from './context.js'

/**
 * Create template renderer.
 * @param context
 * @param options
 * @returns Template render function.
 */
export function createTemplateRenderer<Commit extends CommitKnownProps = CommitKnownProps>(
  context: FinalTemplateContext<Commit>,
  options: FinalOptions<Commit>
) {
  const { template } = options

  return async (
    commits: TransformedCommit<Commit>[],
    keyCommit: Commit | null,
    subsequent?: boolean
  ) => {
    const templateContext = await getTemplateContext(keyCommit, commits, context, options)
    const rendered = (await template(templateContext)).trim()

    return rendered.length > 0
      ? `${subsequent ? '\n' : ''}${rendered}\n`
      : ''
  }
}
