module.exports = function puffFn(fn, { multiArgs } = {}) {
  return new Proxy(fn, {
    apply(target, context, args) {
      return new Promise((resolve, reject) => {
        args.push((err, ...results) => {
          if (err) {
            reject(err)
            return
          }
          else if (multiArgs) {
            resolve(results)
          }
          else {
            resolve(results[0])
          }
        })
        target.apply(context, args)
      })
    }
  })
}
