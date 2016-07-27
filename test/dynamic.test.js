'use strict' // important

let t = require('ava')
const fdynamic = require('../dynamic')
const isPromise = require('./is-promise')

t('basic', async t => {
  const fixture = {
    methodA(a, cb) {
      process.nextTick(function() {
        cb(null, a)
      })
    },
    foo: 'bar'
  }
  let o = fdynamic(fixture)
  t.is(o.foo, 'bar')
  t.is(await o.methodA(7), 7)
})

t('negative bind', async t => {
  const fixture = {
    methodA(cb) {
      process.nextTick(() => { cb(null, this) })
    }
  }

  let o = fdynamic(fixture, { bind: false })

  let unboundFunction = o.methodA
  t.is(await unboundFunction(), undefined)
  t.is(await o.methodA(), o)
})

t('negative bind outside of strict mode', async t => {
  await (new Function('args', `
    let { t, fdynamic } = args
    const fixture = {
      methodA(cb) {
        process.nextTick(() => { cb(null, this) })
      }
    }

    let o = fdynamic(fixture, { bind: false })

    let unboundFunction = o.methodA
    return unboundFunction().then(value => {
      t.is(value, global)
    })
  `))({ t, fdynamic })
})

t('positive bind', async t => {
  const fixture = {
    methodA(cb) {
      process.nextTick(() => {
        cb(null, this)
      })
    }
  }

  let o = fdynamic(fixture, { bind: true })

  let unboundFunction = o.methodA
  t.is(await o.methodA(), o)
  let r2 = await unboundFunction()
  t.is(await unboundFunction(), o)
})

t('positive bind outside of strict mode', async t => {
  await (new Function('args', `
    let { t, fdynamic } = args
    const fixture = {
      methodA(cb) {
        process.nextTick(() => { cb(null, this) })
      }
    }

    let o = fdynamic(fixture, { bind: true })

    let unboundFunction = o.methodA
    return Promise.all([
      o.methodA().then(value => {
        t.is(value, o)
      }),
      unboundFunction().then(value => {
        t.is(value, o)
      })
    ])
  `))({ t, fdynamic })
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
  let o = fdynamic(fixture, { filter: key => key === 'm' })
  let r1 = o.m()
  let r2 = o.n()
  t.truthy(isPromise(r1))
  t.is(r2, Infinity)
  t.is(await r1, 1)
})
