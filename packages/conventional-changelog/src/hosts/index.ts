import type { HostOptions } from '../types.js'
import { bitbucket } from './bitbucket.js'
import { github } from './github.js'
import { gitlab } from './gitlab.js'

export const hostsOptions: Record<string, HostOptions> = {
  github,
  gitlab,
  bitbucket
}
