const obj = require('./obj')
const fn = require('./fn')

module.exports = function puff(x, opts) {
  if (typeof x === 'function') {
    x = fn(x, opts)
  }
  return obj(x, opts)
}
