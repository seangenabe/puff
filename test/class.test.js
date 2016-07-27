const t = require('ava')
const fclass = require('../class')

const S = Symbol('S')
const T = Symbol('T')

t('basic', async t => {
  const Base = class {
    get q() {
      return 'q'
    }
    r(cb) {
      process.nextTick(function() {
        cb(null, 'r')
      })
    }
    get [T]() {
      return 't'
    }
    static u(cb) {
      process.nextTick(function() {
        cb(null, 'u')
      })
    }
  }
  const Fixture = class extends Base {
    m(cb) {
      let context = this
      process.nextTick(function() {
        if (!(context instanceof Fixture)) {
          return cb(null, 'm2')
        }
        cb(null, 'm')
      })
    }
    get n() {
      return 'n'
    }
    get [S]() {
      return 's'
    }
    static v(cb) {
      if (this === Fixture) {
        return cb(null, 'v2')
      }
      process.nextTick(function() {
        cb(null, 'v')
      })
    }
  }
  const F = fclass(Fixture)
  t.is(typeof F, 'function')
  t.truthy(F.prototype instanceof Base)
  let instance = new F()
  t.is(instance.q, 'q')
  t.is(instance.n, 'n')
  t.is(instance[S], 's')
  t.is(instance[T], 't')

  const F2 = fclass(Fixture, { bind: true })
  const instance2 = new F2()

  await Promise.all((function*() {
    yield async () => t.is(await instance.m(), 'm')
    yield async () => t.is(await instance.r(), 'r')
    yield async () => t.is(await F.u(), 'u')
    yield async () => t.is(await F.v(), 'v')

    // bind: true has no effect
    yield async () => t.is(await instance2.m(), 'm')
    yield async () => t.is(await F2.v(), 'v')
  })())
})
