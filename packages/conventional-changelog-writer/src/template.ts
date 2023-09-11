import { join } from 'path'
import { fileURLToPath } from 'url'
import { readFile } from 'fs/promises'
import Handlebars from 'handlebars'
// @ts-expect-error This package is not typed yet
import filterCommits from 'conventional-commits-filter'
import type {
  TemplatesOptions,
  FinalTemplatesOptions,
  FinalContext,
  FinalOptions,
  CommitKnownProps,
  CommitNote
} from './types/index.js'
import { getTemplateContext } from './context.js'

const dirname = fileURLToPath(new URL('.', import.meta.url))

/**
 * Load templates from files.
 * @param options
 * @returns Templates strings object.
 */
export async function loadTemplates(options: TemplatesOptions = {}): Promise<FinalTemplatesOptions> {
  const [
    mainTemplate,
    headerPartial,
    commitPartial,
    footerPartial
  ] = await Promise.all([
    options.mainTemplate || readFile(join(dirname, '..', 'templates', 'template.hbs'), 'utf-8'),
    options.headerPartial || readFile(join(dirname, '..', 'templates', 'header.hbs'), 'utf-8'),
    options.commitPartial || readFile(join(dirname, '..', 'templates', 'commit.hbs'), 'utf-8'),
    options.footerPartial || readFile(join(dirname, '..', 'templates', 'footer.hbs'), 'utf-8')
  ])

  return {
    mainTemplate,
    headerPartial,
    commitPartial,
    footerPartial
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

  return async (commits: Commit[], keyCommit: Commit | null) => {
    const notes: CommitNote[] = []
    const commitsForTemplate = (
      ignoreReverted
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call
        ? filterCommits(commits) as Commit[]
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

    return template(templateContext)
  }
}
