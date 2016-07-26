const t = require('ava')
const fauto = require('..')

t('basic', async t => {
  const fixture = function(cb) {
    setImmediate(function() {
      cb(null, 'eggs')
    })
  }
  fixture.foo = 'bar'
  fixture.methodA = function(a, cb) {
    setImmediate(function() {
      cb(null, a)
    })
  }

  let o = fauto(fixture)
  await Promise.all([
    t.is(o.foo, 'bar'),
    t.is(await o.methodA(7), 7),
    t.is(await o(), 'eggs')
  ])
})
