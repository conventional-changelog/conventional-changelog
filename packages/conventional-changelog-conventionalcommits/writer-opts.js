'use strict'

const compareFunc = require(`compare-func`)
const Q = require(`q`)
const readFile = Q.denodeify(require(`fs`).readFile)
const resolve = require(`path`).resolve

module.exports = function (config) {
  config = defaultConfig(config)
  const commitUrlFormat = expandTemplate(config.commitUrlFormat, {
    host: '{{~@root.host}}',
    owner: '{{~@root.owner}}',
    repository: '{{~@root.repository}}'
  })
  const compareUrlFormat = expandTemplate(config.compareUrlFormat, {
    host: '{{~@root.host}}',
    owner: '{{~@root.owner}}',
    repository: '{{~@root.repository}}'
  })
  const issueUrlFormat = expandTemplate(config.issueUrlFormat, {
    host: '{{~@root.host}}',
    owner: '{{~@root.owner}}',
    repository: '{{~@root.repository}}',
    id: '{{this.issue}}'
  })

  return Q.all([
    readFile(resolve(__dirname, `./templates/template.hbs`), `utf-8`),
    readFile(resolve(__dirname, `./templates/header.hbs`), `utf-8`),
    readFile(resolve(__dirname, `./templates/commit.hbs`), `utf-8`),
    readFile(resolve(__dirname, `./templates/footer.hbs`), `utf-8`)
  ])
    .spread((template, header, commit, footer) => {
      const writerOpts = getWriterOpts(config)

      writerOpts.mainTemplate = template
      writerOpts.headerPartial = header
        .replace(/{{compareUrlFormat}}/g, compareUrlFormat)
      writerOpts.commitPartial = commit
        .replace(/{{commitUrlFormat}}/g, commitUrlFormat)
        .replace(/{{issueUrlFormat}}/g, issueUrlFormat)
      writerOpts.footerPartial = footer

      return writerOpts
    })
}

function getWriterOpts (config) {
  config = defaultConfig(config)
  const typesLookup = {}
  config.types.forEach(type => {
    typesLookup[type.type] = type
  })

  return {
    transform: (commit, context) => {
      let discard = true
      const issues = []
      const typeKey = (commit.type || '').toLowerCase()

      commit.notes.forEach(note => {
        note.title = `BREAKING CHANGES`
        discard = false
      })

      // breaking changes attached to any type are still displayed.
      if (discard && (typesLookup[typeKey] === undefined ||
          typesLookup[typeKey].hide)) return

      if (typesLookup[typeKey]) commit.type = typesLookup[typeKey].name

      if (commit.scope === `*`) {
        commit.scope = ``
      }

      if (typeof commit.hash === `string`) {
        commit.hash = commit.hash.substring(0, 7)
      }

      if (typeof commit.subject === `string`) {
        if (context.repository) {
          // Issue URLs.
          commit.subject = commit.subject.replace(/#([0-9]+)/g, (_, issue) => {
            issues.push(issue)
            const url = expandTemplate(config.issueUrlFormat, {
              host: context.host,
              owner: context.owner,
              repository: context.repository,
              id: issue
            })
            return `[#${issue}](${url})`
          })
        }
        if (context.host) {
          // User URLs.
          commit.subject = commit.subject.replace(/\B@([a-z0-9](?:-?[a-z0-9/]){0,38})/g, (_, user) => {
            // TODO: investigate why this code exists.
            if (user.includes('/')) {
              return `@${user}`
            }

            const usernameUrl = expandTemplate(config.userUrlFormat, {
              host: context.host,
              owner: context.owner,
              repository: context.repository,
              user: user
            })

            return `[@${user}](${usernameUrl})`
          })
        }
      }

      // remove references that already appear in the subject
      commit.references = commit.references.filter(reference => {
        if (issues.indexOf(reference.issue) === -1) {
          return true
        }

        return false
      })

      return commit
    },
    groupBy: `type`,
    commitGroupsSort: `title`,
    commitsSort: [`scope`, `subject`],
    noteGroupsSort: `title`,
    notesSort: compareFunc
  }
}

// merge user set configuration with default configuration.
function defaultConfig (config) {
  config = config || {}
  config.types = config.types || [
    { type: 'feat', name: 'Features' },
    { type: 'fix', name: 'Bug Fixes' },
    { type: 'perf', name: 'Performance Improvements' },
    { type: 'revert', name: 'Reverts' },
    { type: 'docs', name: 'Documentation', hide: true },
    { type: 'style', name: 'Styles', hide: true },
    { type: 'chore', name: 'Miscellaneous Chores', hide: true },
    { type: 'refactor', name: 'Code Refactoring', hide: true },
    { type: 'test', name: 'Tests', hide: true },
    { type: 'build', name: 'Build System', hide: true },
    { type: 'ci', name: 'Continuous Integration', hide: true }
  ]
  config.issueUrlFormat = config.issueUrlFormat ||
    '{{host}}/{{owner}}/{{repository}}/issues/{{id}}'
  config.commitUrlFormat = config.commitUrlFormat ||
    '{{host}}/{{owner}}/{{repository}}/commit/{{hash}}'
  config.compareUrlFormat = config.compareUrlFormat ||
    '{{host}}/{{owner}}/{{repository}}/compare/{{previousTag}}...{{currentTag}}'
  config.userUrlFormat = config.userUrlFormat ||
    '{{host}}/{{user}}'

  return config
}

// expand on the simple mustache-style templates supported in
// configuration (we may eventually want to use handlebars for this).
function expandTemplate (template, context) {
  let expanded = template
  Object.keys(context).forEach(key => {
    expanded = expanded.replace(new RegExp(`{{${key}}}`, 'g'), context[key])
  })
  return expanded
}
