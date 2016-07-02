import test from 'tape'
import render from '../index'

const reset = () => {
  document.body.innerHTML = ''
}

/**
 * This is a dirty way to make html, don't do this
 */
const html = (str) => {
  const container = document.createElement('div')
  container.innerHTML = str
  return container.firstChild
}

test('simple render', (t) => {
  reset()
  render(document.body, html('<span id="a">foo</span>'))
  const a = document.querySelector('#a')
  t.ok(a)
  t.equal(a.textContent, 'foo')

  t.test('simple re-render', (t) => {
    render(document.body, html('<span id="b">bar</span>'))
    const a = document.querySelector('#a')
    const b = document.querySelector('#b')
    t.equal(a, null)
    t.ok(b)
    t.equal(b.textContent, 'bar')
    t.end()
  })

  t.end()
})

test('render over text', (t) => {
  reset()
  document.body.innerHTML = 'test'
  render(document.body, html('<span id="a">replaced</span>'))
  const a = document.querySelector('#a')
  t.equal(document.body.firstChild, a)
  t.equal(document.body.childElementCount, 1)
  t.equal(document.body.firstChild.textContent, 'replaced')
  t.end()
})

test('complex render', (t) => {
  reset()
  const list = html(`<ul id="a"></ul>`)
  render(document.body, list)
  render(list, html('<li>1</li>'), html('<li>2</li>'))
  const a = document.querySelector('#a')
  t.equal(a.childElementCount, 2)
  t.equal(a.childNodes[0].textContent, '1')
  t.equal(a.childNodes[1].textContent, '2')

  t.test('complex re-render - same length', (t) => {
    render(list, html('<li>3</li>'), html('<li>4</li>'))
    t.equal(a.childElementCount, 2)
    t.equal(a.childNodes[0].textContent, '3')
    t.equal(a.childNodes[1].textContent, '4')
    t.end()
  })

  t.test('complex re-render - longer target', (t) => {
    render(list, html('<li>5</li>'), html('<li>4</li>'), html('<li>6</li>'))
    t.equal(a.childElementCount, 3)
    t.equal(a.childNodes[0].textContent, '5')
    t.equal(a.childNodes[1].textContent, '4')
    t.equal(a.childNodes[2].textContent, '6')
    t.end()
  })

  t.test('complex re-render - longer source', (t) => {
    render(list, html('<li>7</li>'), html('<li>4</li>'))
    t.equal(a.childElementCount, 2)
    t.equal(a.childNodes[0].textContent, '7')
    t.equal(a.childNodes[1].textContent, '4')
    t.end()
  })

  t.end()
})

test('document fragment render', (t) => {
  reset()
  const frag = document.createDocumentFragment()
  frag.appendChild(html('<li>1</li>'))
  frag.appendChild(html('<li>2</li>'))
  const list = html(`<ul id="a"></ul>`)
  render(document.body, list)
  render(list, frag)
  const a = document.querySelector('#a')
  t.equal(a.childElementCount, 2)
  t.equal(a.childNodes[0].textContent, '1')
  t.equal(a.childNodes[1].textContent, '2')

  t.test('document fragment re-render - same length', (t) => {
    const frag = document.createDocumentFragment()
    frag.appendChild(html('<li>3</li>'))
    frag.appendChild(html('<li>4</li>'))
    render(list, frag)
    const a = document.querySelector('#a')
    t.equal(a.childElementCount, 2)
    t.equal(a.childNodes[0].textContent, '3')
    t.equal(a.childNodes[1].textContent, '4')
    t.end()
  })

  t.test('document fragment re-render - longer target', (t) => {
    const frag = document.createDocumentFragment()
    frag.appendChild(html('<li>5</li>'))
    frag.appendChild(html('<li>4</li>'))
    frag.appendChild(html('<li>6</li>'))
    render(list, frag)
    const a = document.querySelector('#a')
    t.equal(a.childElementCount, 3)
    t.equal(a.childNodes[0].textContent, '5')
    t.equal(a.childNodes[1].textContent, '4')
    t.equal(a.childNodes[2].textContent, '6')
    t.end()
  })

  t.test('document fragment re-render - longer source', (t) => {
    const frag = document.createDocumentFragment()
    frag.appendChild(html('<li>7</li>'))
    frag.appendChild(html('<li>4</li>'))
    render(list, frag)
    const a = document.querySelector('#a')
    t.equal(a.childElementCount, 2)
    t.equal(a.childNodes[0].textContent, '7')
    t.equal(a.childNodes[1].textContent, '4')
    t.end()
  })

  t.end()
})