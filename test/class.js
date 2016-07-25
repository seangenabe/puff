const t = require('tap')
const fclass = require('../class')
const tapromise = require('tapromise')

const S = Symbol('S')
const T = Symbol('T')

t.test('basic', t => {
  const Base = class {
    get q() {
      return 'q'
    }
    r(cb) {
      setImmediate(function() {
        cb(null, 'r')
      })
    }
    get [T]() {
      return 't'
    }
  }
  const Fixture = class extends Base {
    m(cb) {
      setImmediate(function() {
        cb(null, 'm')
      })
    }
    get n() {
      return 'n'
    }
    get [S]() {
      return 's'
    }
  }
  const F = fclass(Fixture)
  t.equals(typeof F, 'function')
  t.ok(F.prototype instanceof Base)
  let instance = new F()
  t.equals(instance.q, 'q')
  t.equals(instance.n, 'n')
  t.equals(instance[S], 's')
  t.equals(instance[T], 't')
  t = tapromise(t)
  return Promise.all([
    t.equals(instance.m(), 'm'),
    t.equals(instance.r(), 'r')
  ])
})
