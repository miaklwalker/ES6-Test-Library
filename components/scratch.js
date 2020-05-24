let MOCK = Symbol('MOCK');
let tests = [];
let suite = [];
let results = {};



function mapObjToString(obj,result = {},parentKey=undefined){
    for(let key in obj) {
        if(obj.hasOwnProperty(key)) {
            if (typeof obj[key] === 'object') {
                result[key] = true;
                mapObjToString(obj[key], result, key);
            } else {
                if(parentKey !== undefined ) {
                    result[`${parentKey}.${key}`] = obj[key];
                }else{
                    result[`${key}`] = obj[key];
                }
            }
        }
    }
    return result
}

class Expect {
    constructor(received) {
        this.received = received;
        this.isObject = typeof this.received === 'object';
        this._not = false;
        this.result = {
            message:'',
            pass:null,
        }
    }
    pass(expected,received = this.received){
        this.result = {
            message :  !this._not ? 'Passed' : {expected,received} ,
            passed  :  !this._not
        };
        tests.push(this.result);
        return this;
    }
    fail(expected,received = this.received){
        this.result = {
            message : this._not ? 'Passed' : {expected,received},
            passed  : this._not
        };
        tests.push(this.result);
        return this;
    }
    toEqual(expected){
        if(this.isObject){
            let e = mapObjToString(expected);
            let r = mapObjToString(this.received);
            let keyLength = (obj) => Object.keys(obj).length;
            if(keyLength(e)===keyLength(r)){
                for(let key in expected){
                    if(e[key] !== r[key]){
                        return this.fail(expected);
                    }
                }
                return this.pass(expected)
            }
        }else{
            return Object.is(this.received,expected) ? this.pass(expected) : this.fail(expected);
        }
    };
    toBe(expected){
        return  Object.is(expected, this.received) ? this.pass(expected) : this.fail(expected);
    };
    toHaveReturned(expected){
        if(Object.is(expected,this.received())){
            return this.pass(expected,this.received());
        }
        return this.fail(expected,this.received());
    };
    toMatchArray(expected){
        if (this.received.length === expected.length) {
            let temp = this.received.map((member, index) => member === expected[index]);
            if (!temp.includes(false)) {
                return this.pass(expected);
            } else {
                return this.fail(expected);
            }

        }
        return this.fail(expected);
    };
    anything(){
        return this.received !== undefined && this.received !== null ? this.pass('to Be Null') : this.fail('To Not be null or undefined');
    };
    arrayContaining(expected){
        if(Array.isArray(expected)){
            return expected.map(member=>{
                return this.received.includes(member)
            }).includes(false) ? this.fail() : this.pass();
        }else{
            return this.received.includes(expected) ? this.fail(expected) : this.pass(expected);
        }
    };
    any(expected){
        return typeof this.received === typeof expected() ? this.pass(expected) : this.fail(expected);
    };
    get not(){
        this._not = true;
        return this
    };
    toHaveLength(expected){
        return this.received.length === expected ? this.pass(expected): this.fail(`To have length ${expected}`);
    }
    toHaveProperty(expected){
        console.log(Object.keys(mapObjToString(this.received)).includes(expected),expected,this.received,'end')
        return Object.keys(mapObjToString(this.received)).includes(expected) ? this.pass(expected) : this.fail(expected);
    };
    toHavePropertyWithValue(expected, value) {
        let hasProperty = this.toHaveProperty(expected).result.passed;
        let hasValue = mapObjToString(this.received)[expected] === value;
        console.log(hasProperty && hasValue)
        return ( hasProperty && hasValue ) ? this.pass(expected) : this.fail(expected);
    };
    toBeFalsy(){
        return this.received ? this.fail('Expected a falsey value') : this.pass(' ');
    };
    toBeDefined(){
        return this.received !== undefined ? this.pass() : this.fail();
    }
    toBeGreaterThan(expected){
        return (this.received > expected) ? this.pass(expected) : this.fail(expected);
    };
    toBeGreaterThanOrEqual(expected){
        return (this.received >= expected)? this.pass(expected) : this.fail(expected);
    };
    toBeLessThan(expected){
        return (this.received < expected)? this.pass(expected) : this.fail(expected);
    };
    toBeLessThanOrEqual(expected){
        return (this.received <= expected)? this.pass(expected) : this.fail(expected);
    };
    toBeInstanceOf(expected){
        return (this.received instanceof expected)? this.pass(expected) : this.fail(expected);
    };
    toBeNull() {
        return (this.received === null)? this.pass('null',`${this.received}`) : this.fail('null',`${this.received}`);
    };
    toBeTruthy() {
        return !(!this.received)? this.pass() : this.fail();
    };
    toBeUndefined() {
        return (this.received == undefined)? this.pass('expected to not be undefined') : this.fail('expected undefined');
    };
    toBeNaN () {
        return isNaN(this.received) ? this.pass('expected not to be NaN') : this.fail('Expected NaN');
    };
    toHaveBeenCalled(){
        return this.received.mock.calls.length > 0 ? this.pass() : this.fail() ;
    }
    toHaveBeenCalledTimes(expected){
        return this.received.mock.calls.length === expected ? this.pass() : this.fail() ;
    }
    toHaveBeenCalledWith(...args){
        let calls = this.received.mock.calls;
        let passes = false;
        if(args.length === 1){
            calls.forEach(call=>{
                call.forEach(arg=>{
                    if(expect(arg).toBe(args[0])){passes = true}
                })
            })
        }else{
            calls.forEach(call=>{
                if(expect(call).toMatchArray(args)){passes = true}
            })
        }
        return passes ? this.pass() : this.fail();
    }
    toHaveBeenLastCalledWith(...args){
        return expect(this.received.mock.calls[this.received.mock.calls.length-1]).toMatchArray(args);
    }
    toHaveBeenNthCalledWith(nth,...args){
        return expect(this.received.mock.calls[nth-1]).toMatchArray(args) ? this.pass() : this.fail();
    }
    toHaveReturnedTimes(expected){
        return this.received.mock.results.length === expected ? this.pass(expected) : this.fail(expected);
    }
    toHaveLastReturned(expected){
        return expect(this.received.mock.calls[this.received.mock.calls.length-1]).toBe(expected) ? this.pass(expected) : this.fail(expected);
    }
    toHaveNthReturnWith(nth,args){
        return expect(this.received.mock.results[nth-1].value).toBe(args);
    }
    toContain(expected){
        return this.received.includes(expected) ? this.pass(expected) : this.fail(expected);
    }
    toContainEqual(expected){
        let passes = true;
        let message;
        function checkObject(received){
            for(let key in received){
                if(received.hasOwnProperty(key)) {
                    if (received[key] === Object) {
                        return checkObject(received[key])
                    }
                    if (expected[key] === undefined) {
                        passes = false;
                        message = `Object with ${key}, When expected has no such key`;
                    }
                    if (expected[key] !== received[key]) {
                        passes = false;
                        message = `${key}:${received[key]} does not match expected ${JSON.stringify(expected)}`;
                    }
                }
            }
        }
        if(this.received instanceof Object && expected instanceof Object){
            checkObject(this.received);
            return passes ? this.pass(message) : this.fail(message)
        }
    }
    toMatchObject(){

    }
    toStrictlyEqual(){

    }
    toThrow(){

    }
    toBeCloseTo(expected,numDigits){
        const precise = ( x ) => Number.parseFloat(x).toPrecision(numDigits);
        return precise(this.received) === precise(expected) ? this.pass(expected):this.fail(expected);
    }
    static extend (matcher){
        for(let key in matcher){
            Expect.prototype[key] = matcher[key];
        }

    }
}

function expect (received){
    return new Expect(received);
}

expect = new Proxy(expect,{
    apply(target,thisArg,args){
        return target.apply(thisArg,args);
    },
    get(target,prop){
        if(prop === 'extend'){
            console.log('ran');
            return Expect.extend
        }
        return Expect[prop];
    },
    set(){

    }
});

const Mock = {
    fn(func){
        let spy = new Proxy(func,{
            mock: {
                calls: [],
                nextValue: [],
                results:[]
            },
            get(target,prop){
                if(prop === MOCK || prop === 'mock' ){
                    return this.mock;
                }else{
                    return this.target;
                }
            },
            apply(target,thisArg,args){
                if(this.mock.nextValue.length === 0){
                    let product = target.apply(thisArg,args);
                    this.mock.calls.push([...args]);
                    this.mock.results.push({value:product});
                    return product;
                }else{
                    this.mock.calls.push([...args]);
                    return this.mock.nextValue.pop();
                }
            }
        });
        this.func = spy;
        return spy;
    },
    mockReturnValueOnce(value){
        if(this.func !== undefined) {
            this.func[MOCK].nextValue.push(value);
            return this;
        }
    }
};


function describe(description,callback){
    suite.push(()=>{
        callback();
        results[description] = tests;
        tests = [];
    })
}

function logLevelOne(results,test){
    let log = `
        Test: ${test}
        `;
    results[test].forEach((result,index)=>{
        log+=`
        Test: ${index}
        Passed: ${result.passed}
        ${JSON.stringify(result.message)}
        `
    });
    console.log(log);
}
function logLevelTwo(results,test){
    let log = `${test}`;
    let pass = true;
    results[test].forEach(result=>{
        if(!result.passed){
            pass = false;
        }
    });
    log+= ` :: ${pass ? 'Passed' : 'Failed'} :: `;
    console.log(log);
}
function testRunner(logLevel){
    suite.forEach(suite=>{
        suite();
    });

    for(let test in results ){
        switch(logLevel){
            case 1 :
                logLevelOne(results,test);
                break;
            case 2 :
                logLevelTwo(results,test);
                break;
            default:
                logLevelOne(results,test);
        }
    }
}

function add (x,y){
    return x + y;
}

function add (a, b) {
    return a + b ;
}

function sayHi() {
    return 'Hi'
}

class A {}

function myBeverages(){
    return {delicious: true, sour: false}
}
const myBeverage = {delicious: true, sour: false};


describe('Add Function Should add two numbers together',()=> {
    expect(add(2, 2)).toEqual(4);
    expect(add(2, 2)).toBe(4);
})
describe('sayHi should return a string that says hi',()=> {
    expect(sayHi).toHaveReturned('Hi')
})
describe('expect all matchers to work',()=> {
    expect([4, 4]).toMatchArray([4, 4]);
    expect(4).anything();
    expect([1, 2, 3, 4, 5]).arrayContaining([1, 2, 3]);
    expect(add(3, 3)).any(Number);
    expect(add(2, 2)).not.toBe(5);
    expect([1, 2, 3]).toHaveLength(3);
    expect({a: 0}).toHaveProperty('a');
    expect({a: 0}).toHavePropertyWithValue('a', 0);
    expect('').toBeFalsy();
    expect(add(2, 2)).toBeDefined();
    expect(add(2, 2)).toBeGreaterThan(3);
    expect(add(2, 2)).toBeGreaterThanOrEqual(4);
    expect(add(2, 2)).toBeLessThan(5);
    expect(add(2, 2)).toBeLessThanOrEqual(4);
    expect(new A).toBeInstanceOf(A);
    expect(null).toBeNull();
    expect('Could Be True').toBeTruthy();
    expect(undefined).toBeUndefined();
    expect(NaN).toBeNaN();
    expect(['lime', 'coconut', 'orange']).toContain('lime');
    expect(myBeverages()).toContainEqual(myBeverage);
});
class B {}
describe('ALL Should fail',()=> {
    expect(add(2, 2)).not.toEqual(5),
        expect(add(2, 2)).not.toBe(5),
        expect(sayHi).not.toHaveReturned('Hi!'),
        expect([4, 4]).not.toMatchArray([4, 3, 4]),
        expect(null).not.anything(),
        expect([1, 2, 3, 4, 5]).not.arrayContaining([1, 2, 3, 7]),
        expect(add(3, 3)).not.any(String),
        expect(add(2, 2)).toBe(4),
        expect([1, 2, 3]).not.toHaveLength(4),
        expect({a: 0}).not.toHaveProperty('b'),
        expect({a: 0}).not.toHavePropertyWithValue('a', 1),
        expect('Fail').not.toBeFalsy(),
        expect().not.toBeDefined(),
        expect(add(2, 2)).not.toBeGreaterThan(5),
        expect(add(2, 2)).not.toBeGreaterThanOrEqual(5),
        expect(add(2, 2)).not.toBeLessThan(3),
        expect(add(2, 2)).not.toBeLessThanOrEqual(3),
        expect(new A).not.toBeInstanceOf(B),
        expect(undefined).not.toBeNull(),
        expect('').not.toBeTruthy(),
        expect('hello world').not.toBeUndefined(),
        expect(null).not.toBeNaN(),
        expect(['lime', 'coconut', 'orange']).not.toContain('banana'),
        expect(myBeverages()).not.toContainEqual({apple: 0})
});

testRunner();