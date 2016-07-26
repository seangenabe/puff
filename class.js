const dynamic = require('./dynamic')

module.exports = function puffClass(constructorFn, opts = {}) {
  // Remove opts.bind
  let newOpts = Object.assign({}, opts)
  // Removing bind has no effect, so let's just remove it.
  // Even if we delete the following line, the tests will still pass.
  delete newOpts.bind
  // The point is that this is done to avoid redundant creation of bound
  // functions.

  // Proxy the class.
  let proxiedConstructor = new Proxy(constructorFn, {
    construct(target, args) {
      let constructedInstance = Reflect.construct(target, args)
      // Proxy the instance with the prototype keys of the class.
      let proxiedInstance = dynamic(constructedInstance, newOpts)
      return proxiedInstance
    }
  })

  // Proxy the static methods of the class.
  proxiedConstructor = dynamic(proxiedConstructor, newOpts)

  return proxiedConstructor
}
