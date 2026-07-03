function visitElements(node, callback) {
  const children = node.children

  if (!Array.isArray(children)) {
    return
  }

  for (let index = 0; index < children.length; index++) {
    const child = children[index]

    if (child.type === 'element') {
      callback(child, index, node)
    }

    visitElements(child, callback)
  }
}

function normalizeInternalHref(href) {
  if (
    typeof href !== 'string'
    || !href
    || href.startsWith('#')
    || href.startsWith('//')
    || /^[a-z][a-z\d+.-]*:/i.test(href)
  ) {
    return undefined
  }

  const match = href.match(/^([^?#]*)([?#].*)?$/)
  const pathname = match?.[1] || ''

  if (
    !pathname
    || pathname === '/'
    || pathname.endsWith('/')
    || /(?:^|\/)[^/]+\.[^/]+$/.test(pathname)
  ) {
    return undefined
  }

  return `${pathname}/${match?.[2] || ''}`
}

export function rehypeNormalizeContent() {
  return (tree) => {
    visitElements(tree, (node, index, parent) => {
      if (node.tagName === 'a') {
        const href = normalizeInternalHref(node.properties?.href)

        if (href) {
          node.properties.href = href
        }
      }

      if (
        node.tagName !== 'table'
        || parent?.properties?.className?.includes('cc-table-wrapper')
      ) {
        return
      }

      parent.children[index] = {
        type: 'element',
        tagName: 'div',
        properties: {
          className: ['cc-table-wrapper']
        },
        children: [node]
      }
    })
  }
}
