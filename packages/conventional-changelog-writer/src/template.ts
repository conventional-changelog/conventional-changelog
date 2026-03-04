import Handlebars from 'handlebars'
import { filterRevertedCommitsSync } from 'conventional-commits-filter'
import type {
  TemplatesOptions,
  FinalTemplatesOptions,
  FinalContext,
  FinalOptions,
  CommitKnownProps,
  TransformedCommit,
  CommitNote
} from './types/index.js'
import { getTemplateContext } from './context.js'
import {
  mainTemplate,
  headerPartial,
  commitPartial,
  footerPartial
} from './templates.js'

/**
 * Load templates from options or fall back to built-in defaults.
 * @param options
 * @returns Templates strings object.
 */
export function loadTemplates(options: TemplatesOptions = {}): FinalTemplatesOptions {
  return {
    mainTemplate: options.mainTemplate || mainTemplate,
    headerPartial: options.headerPartial || headerPartial,
    commitPartial: options.commitPartial || commitPartial,
    footerPartial: options.footerPartial || footerPartial
  }
}

/**
 * Compile Handlebars templates.
 * @param templates
 * @returns Handlebars template instance.
 */
export function compileTemplates(templates: FinalTemplatesOptions) {
  const {
    mainTemplate,
    headerPartial,
    commitPartial,
    footerPartial,
    partials
  } = templates

  Handlebars.registerPartial('header', headerPartial)
  Handlebars.registerPartial('commit', commitPartial)
  Handlebars.registerPartial('footer', footerPartial)

  if (partials) {
    Object.entries(partials).forEach(([name, partial]) => {
      if (typeof partial === 'string') {
        Handlebars.registerPartial(name, partial)
      }
    })
  }

  return Handlebars.compile(mainTemplate, {
    noEscape: true
  })
}

/**
 * Create template renderer.
 * @param context
 * @param options
 * @returns Template render function.
 */
export function createTemplateRenderer<Commit extends CommitKnownProps = CommitKnownProps>(
  context: FinalContext<Commit>,
  options: FinalOptions<Commit>
) {
  const { ignoreReverted } = options
  const template = compileTemplates(options)

  return async (
    commits: TransformedCommit<Commit>[],
    keyCommit: Commit | null,
    subsequent?: boolean
  ) => {
    const notes: CommitNote[] = []
    const commitsForTemplate = (
      ignoreReverted
        ? Array.from(filterRevertedCommitsSync(commits))
        : commits
    ).map(commit => ({
      ...commit,
      notes: commit.notes.map((note) => {
        const commitNote = {
          ...note,
          commit
        }

        notes.push(commitNote)

        return commitNote
      })
    }))
    const templateContext = await getTemplateContext(keyCommit, commits, commitsForTemplate, notes, context, options)
    const rendered = template(templateContext).trim()

    return rendered.length > 0
      ? `${subsequent ? '\n' : ''}${rendered}\n`
      : ''
  }
}
