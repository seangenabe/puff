const fn = require('./fn')
const defaultFilter = require('./default-filter')

module.exports = function puffObj(
  obj,
  opts = {}
) {
  let { filter = defaultFilter, bind } = opts
  let keys = Object.keys(obj)

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
      let fnValue
      if (bind === 'original') {
        fnValue = objFn.bind(obj)
      }
      else if (bind) {
        fnValue = objFn.bind(proxy)
      }
      else {
        fnValue = objFn
      }
      functions[key] = fn(fnValue, opts)
    }
  }

  return proxy
}
