## Warning when testing with ava

Be careful when running these tests; ava (or maybe power-assert) totally breaks when handling proxy objects. Sometimes it just hangs and does not complete the test. Sometimes it runs *through* the test but leaves the event loop hanging.

I haven't pinned down the exact problem so I haven't submitted an issue.
