const t = require('ava')
const fdynamic = require('../dynamic')
const isPromise = require('./is-promise')

t.test('basic', async t => {
  const fixture = {
    methodA(a, cb) {
      setImmediate(function() {
        cb(null, a)
      })
    },
    foo: 'bar'
  }
  let o = fdynamic(fixture)
  t.is(o.foo, 'bar')
  t.is(await o.methodA(7), 7)
})

t.test('bind', async t => {
  const fixture = {
    methodA(cb) {
      let context = this
      setImmediate(function() {
        cb(null, context.foo)
      })
    },
    foo: 'bar'
  }
  let o = fdynamic(fixture)
  t.is(await o.methodA(), 'bar')
})

t.test('filter', async t => {
  const fixture = {
    m(cb) {
      setImmediate(() => cb(null, 1))
    },
    n() {
      return Infinity
    }
  }
  let o = fdynamic(fixture, { filter: key => key === 'm' })
  let r1 = o.m()
  let r2 = o.n()
  t.truthy(isPromise(r1))
  t.is(r2, Infinity)
  t.is(await r1, 1)
})
