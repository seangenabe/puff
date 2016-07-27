# puff

Promisify with proxies

[![npm](https://img.shields.io/npm/v/puff.svg?style=flat-square)](https://www.npmjs.com/package/puff)
[![node](https://img.shields.io/node/v/puff.svg?style=flat-square)](https://nodejs.org/en/download/)

## Intro

It's one of those modules that promisify (aka denodeify) things. Promisify means making a node-style function `(...args, callback: (err, ...returnValues))` return a `Promise` instead `(...args): Promise<returnValues>`.

Using Javascript proxies has the advantage of _not_ modifying the object you pass into it. At least, the operations that you can do with it. All the other operations we're not concerned about will still stay the same as if operating on the original object.

## Usage

**WARNING: Requires runtime Proxy support!** (in case the description didn't give it away)

### fn(fnArg, opts)

`require('puff/fn')`

Promisifies a node-style function.

* `fnArg` <Function> The node-style function.
* `opts` <Object>
  * `multiArgs` <Boolean> Whether to catch multiple arguments in the node-style callback. The arguments will be passed as an array when the returned `Promise` resolves. Otherwise, a single argument is assumed and that is passed as the resolution value of the returned `Promise`.

Returns `Proxy<Function>: Promise`.

### obj(objArg, opts)

`require('puff/obj')`

Promisifies the enumerable properties of an object.

* `objArg` <Object> The object.
* `opts` <Object> → fn
  * `filter` <Function> A function to filter the keys with. Default = `defaultFilter`
  * `bind` <Boolean> Pass ("bind") the object to the function as its context.

Caches all the promisified functions, no hit on property access.

Returns `Proxy<Object>`.

### dynamic(objArg, opts)

`require('puff/dynamic')`

Promisifies all of the properties of an object.

* `objArg` <Object> The object.
* `opts` <Object> → fn
  * `filter` <Function> A function to filter which keys should be promisified when called. Default = `defaultFilter`
  * `bind` <Boolean> Pass ("bind") the object to the function as its context.

Simplified proxy creation but takes a small hit on property access.

Functions defined on `Object.prototype` as well as some reserved words such as `constructor` and `prototype` are always excluded.

Returns `Proxy<Object>`.

### class(constructorFn, opts)

`require('puff/class')`

Promisifies the properties of an instance of a class after the instance is created, given the class.

* `constructorFn` <Function> The class (constructor function).
* `opts` <Object> → dynamic
  * `bind` has no effect here, so it won't be passed on.

Returns `Proxy<Function>`.

#### Why use dynamic instead of obj?

This is to support Javascript's multiple inheritance model. Using obj is fine if we will be able to know for sure what keys are defined on an object. It's definitely possible if we enumerate all the keys on the object's prototype chain. But if an object inherits from multiple prototypes, there's no way we can find that out. (If there is, please do let me know.)

### auto(objArg, opts)

`require('puff')` **(main module)**

Runs the object through `obj` and possibly `fn` if it's a function.

* `objArg` <Object> | <Function>
* `opts` <Object> → obj, → fn

### defaultFilter(key)

(Internal) The default filter. It filters out strings ending with "Sync".

### Chaining modules together

It is recommended that you know the type of the thing you want to promisify.

For plain objects, you can just use `obj`.
```javascript
x = require('puff/obj')(x)
```

For hybrid function / function containers, you can use `auto`.
```javascript
x = require('puff')(x)
```

But you can also chain calls to `fn` and `obj` to achieve the same result:
```javascript
x = require('puff/fn')(require('puff/obj')(x))
```

The point is that you can mix and match the modules provided to match your needs.

### Notes

`→` means "also passed to (the right side)"

## Special thanks

* Portions of code are derived from `pify`.
* Thanks to the npm team for support with this package!

## License

MIT
