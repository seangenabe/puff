const t = require('ava')
const ffn = require('../fn')
const isPromise = require('./is-promise')

t('positive with context', async t => {
  function fixture(x, cb) {
    process.nextTick(() => {
      cb(null, `${this}${x}`)
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
    process.nextTick(() => {
      cb(new TypeError(this))
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

  t.is(await f(1, 2, 3), 1, 'should return just the first value')
  t.deepEqual(await f2(1, 2, 3), [1, 2, 3],
    'should return all values in an array')
})
