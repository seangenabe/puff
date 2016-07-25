const t = require('tap')
const fauto = require('..')
const tapromise = require('tapromise')

t.test('basic', t => {
  try {
    t = tapromise(t)
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
    return Promise.all([
      t.ok(o.foo, 'bar'),
      t.ok(o.methodA(7), 7),
      t.ok(o(), 'eggs')
    ])
  }
  catch (err) {
    t.threw(err)
  }
})
