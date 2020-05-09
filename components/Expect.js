
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

function expect (received){
    return new Expect(received);
}

expect = new Proxy(expect,{
    apply(target,thisArg,args){
        return target.apply(thisArg,args);
    },
    get(target,prop){
       return Expect[prop];
    },
    set(){

    }
});

class Expect {
    constructor(received) {
        this.received = received;
        this.isObject = typeof this.received === 'object';
        this._not = false;
    }
    pass(expected){
        return !this._not ? true : {expected,received:this.received};
    }
    fail(expected){
        return this._not ? true : {expected,received:this.received};
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
                return this.pass()
            }
        }else{
            return Object.is(this.received,expected);
        }
    };
    toBe(expected){
        return  Object.is(expected, this.received) ? this.pass() : this.fail(expected);
    };
    toHaveReturned(expected){
        if(expect(this.received()).toBe(expected)){
            return this.pass();
        }
        return this.fail(expected);
    };
    toMatchArray(expected){
        if (this.received.length === expected.length) {
            let temp = this.received.map((member, index) => member === expected[index]);
            if (!temp.includes(false)) {
                return this.pass();
            } else {
                return this.fail(expected);
            }

        }
        return false;
    };
    anything(){
        return this.received !== undefined && this.received !== null ? this.pass() : this.fail('To Not be null or undefined');
    };
    arrayContaining(expected){
        if(Array.isArray(expected)){
            return expected.map(member=>{
                return this.received.includes(member)
            }).includes(false) ? this.fail() : this.pass();
        }else{
            return this.received.includes(expected) ? this.fail() : this.pass();
        }
    };
    any(expected){
        return typeof this.received === typeof expected() ? this.pass() : this.fail();
    };
    get not(){
        this._not = true;
        return this
    };
    toHaveLength(expected){
        return this.received.length === expected ? this.pass(): this.fail(`To have length ${expected}`);
    }
    toHaveProperty(expected){
        return Object.keys(mapObjToString(this.received)).includes(expected) ? this.pass() : this.fail(expected);
    };
    toHavePropertyWithValue(expected, value) {
        return (this.toHaveProperty(expected) && mapObjToString(this.received)[expected] === value) ?this.pass() : this.fail();
    };
    toBeFalsy(){
        return this.received ? this.fail() : this.pass();
    };
    toBeDefined(expected){
        return this.toBeUndefined() !== true ? this.pass() : this.fail();
    }
    toBeGreaterThan(expected){
        return (this.received > expected) ? this.pass() : this.fail();
    };
    toBeGreaterThanOrEqual(expected){
        return (this.received >= expected)? this.pass() : this.fail();
    };
    toBeLessThan(expected){
        return (this.received < expected)? this.pass() : this.fail();
    };
    toBeLessThanOrEqual(expected){
        return (this.received <= expected)? this.pass() : this.fail();
    };
    toBeInstanceOf(expected){
        return (this.received instanceof expected)? this.pass(expected) : this.fail(expected);
    };
    toBeNull() {
        return (this.received == null)? this.pass() : this.fail();
    };
    toBeTruthy() {
        return !(!this.received)? this.pass() : this.fail();
    };
    toBeUndefined() {
        return (this.received == undefined)? this.pass() : this.fail();
    };
    toBeNaN () {
        if (
            this.toBeFalsy()
            && this.received !== undefined
            && this.received !== null
            && typeof this.received !== 'boolean'
            && typeof this.received !== 'string'
            && this.received !== 0
            && this.received !== false
        ) {
            return this.pass()
        }
        return this.fail();
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
    toContain(){

    }
    toContainEqual(){

    }
    tomatch(){

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
    static extend(matcher){
        for(let key in matcher){
           if(!Object.keys(this).includes(key)){
               this[key] = matcher[key];
           }
        }
    }
}

export default expect;