var through = require('through2')
var pace = require('pace')

module.exports = paceStream = function(options, total) {
  var stream

  if (typeof options === 'number') {
    total = options
    options = {}
  }

  if (!total) { total = 1000000000000 }

  var realTotal = 0
  var progress = pace(total)
  var stream = through(options, transform)

  function transform(obj, enc, next) {
    progress.op()
    this.push(obj)
    next()
  }

  stream.setTotal = function(total) {
    progress.total = total
    realTotal = total
  }

  stream.incrementTotal = through(options, incTransform)
  function incTransform(obj, enc, next) {
    realTotal += 1
    progress.total = realTotal
    this.push(obj)
    next()
  }

  return stream
}


paceStream.obj = function(options, total) {
  if (typeof options === 'object') {
    options.objectMode = true
  }
  else {
    total = options
    options = { objectMode: true }
  }
  return paceStream(options, total)
}
