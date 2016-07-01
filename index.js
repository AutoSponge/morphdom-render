import morphdom from 'morphdom'

export default (container, ...elms) => {
  const children = [...container.childNodes]
  const length = Math.max(children.length, elms.length)
  for (let i = 0; i < length; i += 1) {
    let elm = elms[i]
    let child = children[i]
    if (child) {
      if (elm) {
        if (child.nodeType !== elm.nodeType) {
          container.replaceChild(elm, child)
        } else {
          if (!child.isEqualNode(elm)) {
            morphdom(child, elm)
          }
        }
      } else {
        container.removeChild(child)
      }
    } else {
      container.appendChild(elm)
    }
  }
}
