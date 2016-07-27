## Warning when testing with ava

Be careful when running these tests; ava (or maybe power-assert) totally breaks when handling proxy objects. Sometimes it just hangs and does not complete the test. Sometimes it runs *through* the test but leaves the event loop hanging.

I haven't pinned down the exact problem so I haven't submitted an issue.

This was a problem in dynamic.test.js -> positive bind, when the object was being bound to the original object instead of the proxy when `bind` is `true`. ava can't show the proxy object in a `t.is`. Of course, the fix was to bind instead to the proxy object. Might be helpful if someone encounters this.
