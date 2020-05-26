import testRunner from './modules/TestRunner.js';
let tests = [
"./__tests__/expect.spec.js",
"./__tests__/mock.spec.js",
"./__tests__/Jest.spec.js"
    ]
Promise.all(tests.map(test=>import(test))).then(specs=>{
    specs.forEach(spec=>{
        spec.default()
    })
}).then(()=>{
    testRunner.runTests(0);
})







