const t = require('ava')
const ffn = require('../fn')
const isPromise = require('./is-promise')

t('positive with context', async t => {
  function fixture(x, cb) {
    let context = this
    process.nextTick(function() {
      cb(null, `${context}${x}`)
    })
  }
  fixture.extra = 1
  let f = ffn(fixture)
  let result = f.call('a', 'b')
  t.true(isPromise(result))
  t.is(f.extra, 1) // magic!

  t.is(await result, 'ab')
})

t('negative with context', t => {
  function fixture(cb) {
    let context = this
    process.nextTick(function() {
      cb(new TypeError(context))
    })
  }
  let f = ffn(fixture)

  let result = f.call('a')
  t.truthy(isPromise(result))
  t.throws(result, err => err instanceof TypeError && err.message === 'a')
})

t('multiple returns', async t => {
  const fixture = function(...args) {
    let cb = args.pop()
    process.nextTick(() => {
      cb(null, ...args)
    })
  }
  const f = ffn(fixture)
  const f2 = ffn(fixture, { multiArgs: true })

  await Promise.all((function*() {
    yield async () => t.is(f(1, 2, 3), 1)
    yield async () => t.same(f2(1, 2, 3), [1, 2, 3])
  })())
})
