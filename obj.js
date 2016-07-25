const fn = require('./fn')
const defaultFilter = require('./default-filter')

module.exports = function puffObj(
  obj,
  opts = {}
) {
  let { filter = defaultFilter, bind, inherited, keys } = opts
  if (keys == null) {
    if (inherited) {
      keys = []
      for (let key in obj) { // eslint-disable-line guard-for-in
        keys.push(key)
      }
    }
    else {
      keys = Object.keys(obj)
    }
  }

  let functions = {}
  for (let key of keys) {
    let objFn = obj[key]
    if (typeof objFn === 'function' && filter(key)) {
      functions[key] = fn(bind ? objFn.bind(obj) : objFn, opts)
    }
  }

  return new Proxy(obj, {
    get(target, key) {
      let objFn = functions[key]
      return objFn ? objFn : target[key]
    }
  })
}
