import keys from './Globals.js';
const ___test___ = keys.___test___;

export function describe(description,test){
    let testSuite = {description,test};
    ___test___.push(testSuite);
}
export function it(description,test){
    describe(description,test);
}
export function should(desc,test){
    describe(desc,test);
}

