import { defineConfig } from 'astro/config'
import { unified } from '@astrojs/markdown-remark'
import starlight from '@astrojs/starlight'
import llmsTxt from 'starlight-llms-txt'
import { viewTransitions } from 'astro-vtbot/starlight-view-transitions'
import { rehypeNormalizeContent } from './rehype.js'

const isProduction = process.env.NODE_ENV === 'production'

export default defineConfig({
  site: 'https://conventional-changelog.js.org',
  markdown: {
    processor: unified({
      rehypePlugins: [rehypeNormalizeContent]
    })
  },
  integrations: [
    starlight({
      title: 'Conventional Changelog',
      description: 'Generate a changelog from git metadata.',
      favicon: '/favicon.svg',
      head: [
        {
          tag: 'meta',
          attrs: {
            name: 'format-detection',
            content: 'telephone=no'
          }
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image',
            content: 'https://conventional-changelog.js.org/og-image.jpg'
          }
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:width',
            content: '1200'
          }
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:height',
            content: '630'
          }
        },
        {
          tag: 'meta',
          attrs: {
            property: 'og:image:type',
            content: 'image/jpeg'
          }
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:card',
            content: 'summary_large_image'
          }
        },
        {
          tag: 'meta',
          attrs: {
            name: 'twitter:image',
            content: 'https://conventional-changelog.js.org/og-image.jpg'
          }
        },
        isProduction && {
          tag: 'script',
          attrs: {
            'src': 'https://cloud.umami.is/script.js',
            'data-website-id': '22ee47a3-93bb-4233-a9c6-c2be27cacb0a',
            'defer': true
          }
        },
        {
          tag: 'meta',
          attrs: {
            name: 'google-site-verification',
            content: 'JbpBLn9A_qAr4OqSunPoFWeahyME9dMplBMUsaOK_I4'
          }
        }
      ].filter(Boolean),
      social: [
        {
          label: 'GitHub',
          icon: 'github',
          href: 'https://github.com/conventional-changelog/conventional-changelog'
        }
      ],
      editLink: {
        baseUrl: 'https://github.com/conventional-changelog/conventional-changelog/edit/master/website/'
      },
      plugins: [llmsTxt(), viewTransitions()],
      sidebar: [
        {
          label: 'Getting Started',
          items: [{
            autogenerate: {
              directory: 'getting-started'
            }
          }]
        },
        {
          label: 'Conventional Changelog',
          items: [{
            autogenerate: {
              directory: 'conventional-changelog'
            }
          }]
        },
        {
          label: 'Standard Changelog',
          items: [{
            autogenerate: {
              directory: 'standard-changelog'
            }
          }]
        },
        {
          label: 'Version Bump',
          items: [{
            autogenerate: {
              directory: 'version-bump'
            }
          }]
        },
        {
          label: 'Presets',
          items: [
            {
              label: 'Conventional Commits',
              items: [{
                autogenerate: {
                  directory: 'presets/conventional-commits'
                }
              }]
            },
            {
              label: 'Angular',
              items: [{
                autogenerate: {
                  directory: 'presets/angular'
                }
              }]
            }
          ]
        },
        {
          label: 'Internal Packages',
          collapsed: true,
          items: [
            {
              label: 'Commits Parser',
              items: [{
                autogenerate: {
                  directory: 'commits-parser'
                }
              }]
            },
            {
              label: 'Commits Filter',
              items: [{
                autogenerate: {
                  directory: 'commits-filter'
                }
              }]
            },
            {
              label: 'Changelog Writer',
              items: [{
                autogenerate: {
                  directory: 'changelog-writer'
                }
              }]
            },
            {
              label: 'Preset loader',
              items: [{
                autogenerate: {
                  directory: 'preset-loader'
                }
              }]
            },
            {
              label: 'Git client',
              items: [{
                autogenerate: {
                  directory: 'git-client'
                }
              }]
            },
            {
              label: 'Template',
              items: [{
                autogenerate: {
                  directory: 'template'
                }
              }]
            }
          ]
        }
      ],
      customCss: ['./src/styles/global.css'],
      expressiveCode: {
        themes: ['github-dark-high-contrast', 'github-light-default'],
        frames: {
          extractFileNameFromCode: false
        }
      }
    })
  ]
})
