export const samples = [
  [
    'bitbucket:foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'bitbucket:foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'bitbucket:user@foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'bitbucket:user@foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'bitbucket:user:password@foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'bitbucket:user:password@foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'bitbucket::password@foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'bitbucket::password@foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'bitbucket:foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'bitbucket:foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'bitbucket:user@foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'bitbucket:user@foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'bitbucket:user:password@foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'bitbucket:user:password@foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'bitbucket::password@foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'bitbucket::password@foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git@bitbucket.org:foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git@bitbucket.org:foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user@bitbucket.org:foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user@bitbucket.org:foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user:password@bitbucket.org:foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user:password@bitbucket.org:foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    ':password@bitbucket.org:foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    ':password@bitbucket.org:foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git@bitbucket.org:foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git@bitbucket.org:foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user@bitbucket.org:foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user@bitbucket.org:foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user:password@bitbucket.org:foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user:password@bitbucket.org:foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    ':password@bitbucket.org:foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    ':password@bitbucket.org:foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://bitbucket.org:foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://bitbucket.org:foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user@bitbucket.org:foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user@bitbucket.org:foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user:password@bitbucket.org:foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user:password@bitbucket.org:foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://:password@bitbucket.org:foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://:password@bitbucket.org:foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://bitbucket.org:foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://bitbucket.org:foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user@bitbucket.org:foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user@bitbucket.org:foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user:password@bitbucket.org:foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user:password@bitbucket.org:foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://:password@bitbucket.org:foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://:password@bitbucket.org:foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://bitbucket.org:foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://bitbucket.org:foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user@bitbucket.org:foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user@bitbucket.org:foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user:password@bitbucket.org:foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user:password@bitbucket.org:foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://:password@bitbucket.org:foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://:password@bitbucket.org:foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://bitbucket.org:foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://bitbucket.org:foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user@bitbucket.org:foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user@bitbucket.org:foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user:password@bitbucket.org:foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user:password@bitbucket.org:foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://:password@bitbucket.org:foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://:password@bitbucket.org:foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://bitbucket.org/foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://bitbucket.org/foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user@bitbucket.org/foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user@bitbucket.org/foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user:password@bitbucket.org/foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user:password@bitbucket.org/foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://:password@bitbucket.org/foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://:password@bitbucket.org/foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://bitbucket.org/foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://bitbucket.org/foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user@bitbucket.org/foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user@bitbucket.org/foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user:password@bitbucket.org/foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user:password@bitbucket.org/foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://:password@bitbucket.org/foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://:password@bitbucket.org/foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://bitbucket.org/foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://bitbucket.org/foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user@bitbucket.org/foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user@bitbucket.org/foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user:password@bitbucket.org/foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user:password@bitbucket.org/foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://:password@bitbucket.org/foo/bar',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://:password@bitbucket.org/foo/bar#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://bitbucket.org/foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://bitbucket.org/foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user@bitbucket.org/foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user@bitbucket.org/foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user:password@bitbucket.org/foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user:password@bitbucket.org/foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://:password@bitbucket.org/foo/bar.git',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://:password@bitbucket.org/foo/bar.git#branch',
    {
      type: 'bitbucket',
      url: 'https://bitbucket.org/foo/bar/src/branch',
      host: 'https://bitbucket.org',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'foo/bar#sf1312sas',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/sf1312sas',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'foo/bar.git#sf1312sas',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/sf1312sas',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github:foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github:foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github:user@foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github:user@foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github:user:password@foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github:user:password@foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github::password@foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github::password@foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github:foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github:foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github:user@foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github:user@foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github:user:password@foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github:user:password@foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github::password@foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'github::password@foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://github.com/foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://github.com/foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://user@github.com/foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://user@github.com/foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://user:password@github.com/foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://user:password@github.com/foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://:password@github.com/foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://:password@github.com/foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://github.com/foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://github.com/foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://git@github.com/foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://git@github.com/foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://user:password@github.com/foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://user:password@github.com/foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://:password@github.com/foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git://:password@github.com/foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user@github.com:foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user@github.com:foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user:password@github.com:foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user:password@github.com:foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    ':password@github.com:foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    ':password@github.com:foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user@github.com:foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user@github.com:foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user:password@github.com:foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user:password@github.com:foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    ':password@github.com:foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    ':password@github.com:foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://github.com:foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://github.com:foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user@github.com:foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user@github.com:foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user:password@github.com:foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user:password@github.com:foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://:password@github.com:foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://:password@github.com:foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://github.com:foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://github.com:foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user@github.com:foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user@github.com:foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user:password@github.com:foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user:password@github.com:foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://:password@github.com:foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://:password@github.com:foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://github.com:foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://github.com:foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user@github.com:foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user@github.com:foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user:password@github.com:foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user:password@github.com:foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://:password@github.com:foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://:password@github.com:foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://github.com:foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://github.com:foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user@github.com:foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user@github.com:foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user:password@github.com:foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user:password@github.com:foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://:password@github.com:foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://:password@github.com:foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://github.com/foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://github.com/foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user@github.com/foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user@github.com/foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user:password@github.com/foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user:password@github.com/foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://:password@github.com/foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://:password@github.com/foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://github.com/foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://github.com/foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user@github.com/foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user@github.com/foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user:password@github.com/foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user:password@github.com/foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://:password@github.com/foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://:password@github.com/foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://github.com/foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://github.com/foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user@github.com/foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user@github.com/foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user:password@github.com/foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user:password@github.com/foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://:password@github.com/foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://:password@github.com/foo/bar#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://github.com/foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://github.com/foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user@github.com/foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user@github.com/foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user:password@github.com/foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user:password@github.com/foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://:password@github.com/foo/bar.git',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://:password@github.com/foo/bar.git#asd123sad',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/asd123sad',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://www.github.com/foo/bar',
    {
      type: 'github',
      url: 'https://github.com/foo/bar',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'foo/bar#branch with space',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/branch%20with%20space',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'foo/bar#branch:with:colons',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/branch%3Awith%3Acolons',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://github.com/foo/bar/tree/branch',
    {
      type: 'github',
      url: 'https://github.com/foo/bar/tree/branch',
      host: 'https://github.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab:foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab:foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab:user@foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab:user@foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab:user:password@foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab:user:password@foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab::password@foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab::password@foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab:foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab:foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab:user@foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab:user@foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab:user:password@foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab:user:password@foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab::password@foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab::password@foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'gitlab:foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'gitlab:foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'gitlab:user@foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'gitlab:user@foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'gitlab:user:password@foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'gitlab:user:password@foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'gitlab::password@foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'gitlab::password@foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'gitlab:foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'gitlab:foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'gitlab:user@foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'gitlab:user@foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'gitlab:user:password@foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'gitlab:user:password@foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'gitlab::password@foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'gitlab::password@foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'user@gitlab.com:foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user@gitlab.com:foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user:password@gitlab.com:foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user:password@gitlab.com:foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    ':password@gitlab.com:foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    ':password@gitlab.com:foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user@gitlab.com:foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user@gitlab.com:foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user:password@gitlab.com:foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user:password@gitlab.com:foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    ':password@gitlab.com:foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    ':password@gitlab.com:foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'user@gitlab.com:foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'user@gitlab.com:foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'user:password@gitlab.com:foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'user:password@gitlab.com:foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    ':password@gitlab.com:foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    ':password@gitlab.com:foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'user@gitlab.com:foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'user@gitlab.com:foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'user:password@gitlab.com:foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'user:password@gitlab.com:foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    ':password@gitlab.com:foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    ':password@gitlab.com:foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://gitlab.com:foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://gitlab.com:foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user@gitlab.com:foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user@gitlab.com:foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user:password@gitlab.com:foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user:password@gitlab.com:foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://:password@gitlab.com:foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://:password@gitlab.com:foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://gitlab.com:foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://gitlab.com:foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user@gitlab.com:foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user@gitlab.com:foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user:password@gitlab.com:foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://user:password@gitlab.com:foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://:password@gitlab.com:foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://:password@gitlab.com:foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://gitlab.com:foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://gitlab.com:foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://user@gitlab.com:foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://user@gitlab.com:foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://user:password@gitlab.com:foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://user:password@gitlab.com:foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://:password@gitlab.com:foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://:password@gitlab.com:foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://gitlab.com:foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://gitlab.com:foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://user@gitlab.com:foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://user@gitlab.com:foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://user:password@gitlab.com:foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://user:password@gitlab.com:foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://:password@gitlab.com:foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+ssh://:password@gitlab.com:foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://gitlab.com:foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://gitlab.com:foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user@gitlab.com:foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user@gitlab.com:foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user:password@gitlab.com:foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user:password@gitlab.com:foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://:password@gitlab.com:foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://:password@gitlab.com:foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://gitlab.com:foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://gitlab.com:foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user@gitlab.com:foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user@gitlab.com:foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user:password@gitlab.com:foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://user:password@gitlab.com:foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://:password@gitlab.com:foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://:password@gitlab.com:foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'ssh://gitlab.com:foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://gitlab.com:foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://user@gitlab.com:foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://user@gitlab.com:foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://user:password@gitlab.com:foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://user:password@gitlab.com:foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://:password@gitlab.com:foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://:password@gitlab.com:foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://gitlab.com:foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://gitlab.com:foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://user@gitlab.com:foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://user@gitlab.com:foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://user:password@gitlab.com:foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://user:password@gitlab.com:foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://:password@gitlab.com:foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'ssh://:password@gitlab.com:foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://gitlab.com/foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://gitlab.com/foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user@gitlab.com/foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user@gitlab.com/foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user:password@gitlab.com/foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user:password@gitlab.com/foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://:password@gitlab.com/foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://:password@gitlab.com/foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://gitlab.com/foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://gitlab.com/foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user@gitlab.com/foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user@gitlab.com/foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user:password@gitlab.com/foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://user:password@gitlab.com/foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://:password@gitlab.com/foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://:password@gitlab.com/foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git+https://gitlab.com/foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://gitlab.com/foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://user@gitlab.com/foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://user@gitlab.com/foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://user:password@gitlab.com/foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://user:password@gitlab.com/foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://:password@gitlab.com/foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://:password@gitlab.com/foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://gitlab.com/foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://gitlab.com/foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://user@gitlab.com/foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://user@gitlab.com/foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://user:password@gitlab.com/foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://user:password@gitlab.com/foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://:password@gitlab.com/foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'git+https://:password@gitlab.com/foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://gitlab.com/foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://gitlab.com/foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user@gitlab.com/foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user@gitlab.com/foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user:password@gitlab.com/foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user:password@gitlab.com/foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://:password@gitlab.com/foo/bar',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://:password@gitlab.com/foo/bar#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://gitlab.com/foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://gitlab.com/foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user@gitlab.com/foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user@gitlab.com/foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user:password@gitlab.com/foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://user:password@gitlab.com/foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://:password@gitlab.com/foo/bar.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://:password@gitlab.com/foo/bar.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'https://gitlab.com/foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://gitlab.com/foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://user@gitlab.com/foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://user@gitlab.com/foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://user:password@gitlab.com/foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://user:password@gitlab.com/foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://:password@gitlab.com/foo/bar/baz',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://:password@gitlab.com/foo/bar/baz#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://gitlab.com/foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://gitlab.com/foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://user@gitlab.com/foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://user@gitlab.com/foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://user:password@gitlab.com/foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://user:password@gitlab.com/foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://:password@gitlab.com/foo/bar/baz.git',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'https://:password@gitlab.com/foo/bar/baz.git#branch',
    {
      type: 'gitlab',
      url: 'https://gitlab.com/foo/bar/baz/tree/branch',
      host: 'https://gitlab.com',
      owner: 'foo/bar',
      project: 'baz'
    }
  ],
  [
    'sourcehut:~foo/bar',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'sourcehut:~foo/bar#branch',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar/tree/branch',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'sourcehut:~foo/bar.git',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'sourcehut:~foo/bar.git#branch',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar/tree/branch',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'git@git.sr.ht:~foo/bar',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'git@git.sr.ht:~foo/bar#branch',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar/tree/branch',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'git@git.sr.ht:~foo/bar.git',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'git@git.sr.ht:~foo/bar.git#branch',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar/tree/branch',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://git@git.sr.ht:~foo/bar',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://git@git.sr.ht:~foo/bar#branch',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar/tree/branch',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://git@git.sr.ht:~foo/bar.git',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'git+ssh://git@git.sr.ht:~foo/bar.git#branch',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar/tree/branch',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'https://git.sr.ht/~foo/bar',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'https://git.sr.ht/~foo/bar#branch',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar/tree/branch',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'https://git.sr.ht/~foo/bar.git',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'https://git.sr.ht/~foo/bar.git#branch',
    {
      type: 'sourcehut',
      url: 'https://git.sr.ht/~foo/bar/tree/branch',
      host: 'https://git.sr.ht',
      owner: '~foo',
      project: 'bar'
    }
  ],
  [
    'git://localhost:12345/foo/bar',
    {
      type: '',
      url: 'http://localhost:12345/foo/bar',
      host: 'http://localhost:12345',
      owner: 'foo',
      project: 'bar'
    }
  ],
  [
    'git@code.mycompany.com:abc/def.git',
    {
      type: '',
      url: 'https://code.mycompany.com/abc/def',
      host: 'https://code.mycompany.com',
      owner: 'abc',
      project: 'def'
    }
  ],
  [
    'https://unknown-host/.git',
    {
      type: '',
      url: 'https://unknown-host',
      host: 'https://unknown-host'
    }
  ],
  [
    'https://github.internal.example.com/conventional-changelog/internal',
    {
      type: 'github',
      url: 'https://github.internal.example.com/conventional-changelog/internal',
      host: 'https://github.internal.example.com',
      owner: 'conventional-changelog',
      project: 'internal'
    }
  ]
] as const
