const { exec } = require('child_process')
const { valid: semverValid } = require('semver')

const regex = /tag:\s*(.+?)[,)]/gi
const cmd = 'git log --decorate --no-color --date-order'
const unstableTagTest = /.+-\w+\.\d+$/

function lernaTag (tag, pkg) {
  if (pkg && !tag.startsWith(`${pkg}@`)) {
    return false
  }

  return /^.+@[0-9]+\.[0-9]+\.[0-9]+(-.+)?$/.test(tag)
}

function gitSemverTags (opts = {}) {
  return new Promise((resolve, reject) => {
    const options = {
      maxBuffer: Infinity,
      cwd: process.cwd(),
      ...opts
    }

    if (options.package && !options.lernaTags) {
      throw new Error('opts.package should only be used when running in lerna mode')
    }

    exec(cmd, options, (err, data) => {
      if (err) {
        reject(err)
        return
      }

      const tags = []
      let match
      let tag
      let unprefixedTag

      data.split('\n').forEach((decorations) => {
        while ((match = regex.exec(decorations))) {
          tag = match[1]

          if (options.skipUnstable && unstableTagTest.test(tag)) {
            // skip unstable tag
            continue
          }

          if (options.lernaTags) {
            if (lernaTag(tag, options.package)) {
              tags.push(tag)
            }
          } else if (options.tagPrefix) {
            if (tag.startsWith(options.tagPrefix)) {
              unprefixedTag = tag.replace(options.tagPrefix, '')

              if (semverValid(unprefixedTag)) {
                tags.push(tag)
              }
            }
          } else if (semverValid(tag)) {
            tags.push(tag)
          }
        }
      })

      resolve(tags)
    })
  })
}

module.exports = gitSemverTags
