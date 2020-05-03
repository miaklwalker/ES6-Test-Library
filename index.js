const expect = require('./components/Expect.js');
const Mock = require('./components/Mock.js');





/*
testRunner -> Runs all describe blocks
    describe -> runs callback and clears previous tests
        CALLBACK -> runs all expects and adds them to test  queue
            Expect ->  runs and returns pass fail
 */