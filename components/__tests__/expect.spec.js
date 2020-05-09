import expect from "../Expect.js";

function add (a, b) {
    return a + b ;
}

function sayHi() {
    return 'Hi'
}

class A {}

console.log(expect(add(2,2)).toEqual(4));
console.log(expect(add(2,2)).toBe(4));
console.log(expect(sayHi).toHaveReturned('Hi'));
console.log(expect([4,4]).toMatchArray([4,4]));
console.log(expect(4).anything());
console.log(expect([1,2,3,4,5]).arrayContaining([1,2,3]));
console.log(expect(add(3,3)).any(Number));
console.log(expect(add(2,2)).not.toBe(5));
console.log(expect([1,2,3]).toHaveLength(3));
console.log(expect({a:0}).toHaveProperty('a'));
console.log(expect({a:0}).toHavePropertyWithValue('a', 0));
console.log(expect('').toBeFalsy());
console.log(expect(add(2,2)).toBeDefined());
console.log(expect(add(2,2)).toBeGreaterThan(3));
console.log(expect(add(2,2)).toBeGreaterThanOrEqual(4));
console.log(expect(add(2,2)).toBeLessThan(5));
console.log(expect(add(2,2)).toBeLessThanOrEqual(4));
console.log(expect(new A).toBeInstanceOf(A));
console.log(expect(null).toBeNull());
console.log(expect('Could Be True').toBeTruthy());
console.log(expect(undefined).toBeUndefined());
console.log(expect(NaN).toBeNaN ());
