const dynamic = require('./dynamic')

module.exports = function puffClass(constructorFn, opts = {}) {
  // Proxy the class.
  let proxiedConstructor = new Proxy(constructorFn, {
    construct(target, args) {
      let constructedInstance = Reflect.construct(target, args)
      // Proxy the instance with the prototype keys of the class.
      let proxiedInstance = dynamic(constructedInstance, opts)
      return proxiedInstance
    }
  })

  // Proxy the static methods of the class.
  proxiedConstructor = dynamic(proxiedConstructor, opts)

  return proxiedConstructor
}
