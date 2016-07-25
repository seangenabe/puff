const t = require('tap')
const fdynamic = require('../obj')
const tapromise = require('tapromise')

t.test('basic', t => {
  const fixture = {
    methodA(a, cb) {
      setImmediate(function() {
        cb(null, a)
      })
    },
    foo: 'bar'
  }
  t = tapromise(t)
  let o = fdynamic(fixture)
  return Promise.all([
    t.ok(o.foo, 'bar'),
    t.ok(o.methodA(7), 7)
  ])
})

t.test('bind', t => {
  const fixture = {
    methodA(cb) {
      let context = this
      setImmediate(function() {
        cb(null, context.foo)
      })
    },
    foo: 'bar'
  }
  t = tapromise(t)
  let o = fdynamic(fixture)
  return t.ok(o.methodA(), 'bar')
})

t.test('filter', t => {
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
  t.ok(r1 instanceof Promise)
  t.equals(r2, Infinity)
  t = tapromise(t)
  return t.equals(r1, 1)
})
