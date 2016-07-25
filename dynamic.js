const fn = require('./fn')
const defaultFilter = require('./default-filter')

const blacklistedFunctions = new Set((function*() {
  for (let key of Object.getOwnPropertyNames(Object.prototype)) {
    let desc = Object.getOwnPropertyDescriptor(Object.prototype, key)
    if (desc.value && desc.value === 'function') {
      yield desc.value
    }
  }
})())
const blacklistedKeys = new Set([
  'constructor',
  '__defineGetter__',
  '__lookupGetter__',
  '__defineSetter__',
  '__lookupSetter__',
  '__proto__',
  'prototype'
])

module.exports = function puffDynamic(
  obj,
  opts = {}
) {
  let { filter = defaultFilter, bind } = opts

  return new Proxy(obj, {
    get(target, key) {
      let value = target[key]
      if (blacklistedKeys.has(key) || blacklistedFunctions.has(value)) {
        return value
      }
      if (filter(key)) {
        if (typeof value === 'function') {
          if (bind) {
            value = bind(value)
          }
          value = fn(value, opts)
        }
      }
      return value
    }
  })
}
