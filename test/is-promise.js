// https://github.com/avajs/ava/issues/947
module.exports = function isPromise(p) {
  return p && p.constructor.name === 'Promise' && typeof p.then === 'function'
}
