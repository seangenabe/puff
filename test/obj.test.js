let t = require('ava')
const fobj = require('../obj')
const isPromise = require('./is-promise')

// Too many concurrent tests might be deadlocking.
t = t.serial

t('basic', async t => {
  const fixture = {
    methodA(a, cb) {
      process.nextTick(function() {
        cb(null, a)
      })
    },
    foo: 'bar'
  }
  let o = fobj(fixture)
  t.is(o.foo, 'bar')
  t.is(await o.methodA(7), 7)
})

t('bind', async t => {
  const fixture = {
    methodA(cb) {
      let context = this
      process.nextTick(function() {
        cb(null, context.foo)
      })
    },
    foo: 'bar'
  }
  let o = fobj(fixture)
  t.is(await o.methodA(), 'bar')
})

t('filter', async t => {
  const fixture = {
    m(cb) {
      process.nextTick(() => cb(null, 1))
    },
    n() {
      return Infinity
    }
  }
  let o = fobj(fixture, { filter: key => key === 'm' })
  let r1 = o.m()
  let r2 = o.n()
  t.truthy(isPromise(r1))
  t.is(r2, Infinity)
  t.is(await r1, 1)
})
