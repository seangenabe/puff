const t = require('tap')
const tapromise = require('tapromise')
const ffn = require('../fn')

t.test('positive with context', t => {
  function fixture(x, cb) {
    let context = this
    setImmediate(function() {
      cb(null, `${context}${x}`)
    })
  }
  fixture.extra = 1
  let f = ffn(fixture)
  let result = f.call('a', 'b')
  t.ok(result instanceof Promise)
  t.equals(f.extra, 1) // magic!

  t = tapromise(t)
  return t.equals(result, 'ab')
})

t.test('negative with context', t => {
  function fixture(cb) {
    let context = this
    setImmediate(function() {
      cb(new TypeError(context))
    })
  }
  let f = ffn(fixture)
  let result = f.call('a')

  return result.then(
    () => { t.fail() },
    err => {
      t.ok(err instanceof TypeError)
      t.ok(err.message === 'a')
    }
  )
})

t.test('multiple returns', t => {
  const fixture = function(...args) {
    let cb = args.pop()
    setImmediate(() => {
      cb(null, ...args)
    })
  }
  const f = ffn(fixture)
  const f2 = ffn(fixture, { multiArgs: true })
  t = tapromise(t)
  return Promise.all([
    t.equals(f(1, 2, 3), 1),
    t.same(f2(1, 2, 3), [1, 2, 3])
  ])
})
