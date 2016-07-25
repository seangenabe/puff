const r = /Sync$/

module.exports = function defaultFilter(key) {
  return !(typeof key === 'string' && r.test(key))
}
