const fn = require('./fn')
const defaultFilter = require('./default-filter')

module.exports = function puffObj(
  obj,
  opts = {}
) {
  let { filter = defaultFilter, bind, inherited } = opts
  let keys
  if (inherited) {
    keys = []
    for (let key in obj) { // eslint-disable-line guard-for-in
      keys.push(key)
    }
  }
  else {
    keys = Object.keys(obj)
  }

  let functions = {}
  let proxy = new Proxy(obj, {
    get(target, key) {
      let objFn = functions[key]
      return objFn ? objFn : obj[key]
    }
  })

  for (let key of keys) {
    let objFn = obj[key]
    if (typeof objFn === 'function' && filter(key)) {
      functions[key] = fn(bind ? objFn.bind(proxy) : objFn, opts)
    }
  }

  return proxy
}
