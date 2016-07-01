global.document = require('jsdom').jsdom('<body></body>')
global.window = document.defaultView
global.navigator = window.navigator
require('babel-polyfill')
require('babel-register')({
  presets: [
    'es2015',
    'stage-2'
  ]
})
var path = require('path')
var glob = require('glob')

process.argv.slice(2).forEach(function (arg) {
  glob(arg, function (err, files) {
    if (err) throw err
    files.forEach(function (file) {
      require(path.resolve(process.cwd(), file))
    })
  })
})