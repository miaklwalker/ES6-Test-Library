import expect from "../modules/Expect.js";
import Mock from "../modules/Mock.js";
import {describe}from '../modules/TestRunner.js';
import Test from "../modules/Test.js";

let test = Test(()=> {


    describe('Should mimic Jest behavior', () => {

        function forEach(items, callback) {
            for (let index = 0; index < items.length; index++) {
                callback(items[index]);
            }
        }

        const mockCallback = Mock.fn(x => 42 + x);
        forEach([0, 1], mockCallback);

// // The mock function is called twice
// console.log(expect(mockCallback.mock.calls.length).toBe(2));
//
// // The first argument of the first call to the function was 0
// console.log(expect(mockCallback.mock.calls[0][0]).toBe(0));
//
// // The first argument of the second call to the function was 1
// console.log(expect(mockCallback.mock.calls[1][0]).toBe(1));
//
// // The return value of the first call to the function was 42
// console.log(expect(mockCallback.mock.results[0].value).toBe(42));
//
// // The mock function was called at least once
// console.log(expect(mockCallback).toHaveBeenCalled());
//
// // The mock function was called at least once with the specified args
// console.log(expect(mockCallback).toHaveBeenCalledWith(0));
//
// // The last call to the mock function was called with the specified args
// console.log(expect(mockCallback).toHaveBeenLastCalledWith(1));
//
// console.log(expect(2).any(Number));

        expect(2 + 2).toBe(4);

        const data = {one: 1};
        data['two'] = 2;
        expect(data).toEqual({one: 1, two: 2});


        for (let a = 1; a < 10; a++) {
            for (let b = 1; b < 10; b++) {
                expect(a + b).not.toBe(0);
            }
        }


        const n = null;
        expect(n).toBeNull();
        expect(n).toBeDefined();
        expect(n).not.toBeUndefined();
        expect(n).not.toBeTruthy();
        expect(n).toBeFalsy();


        const z = 0;
        expect(z).not.toBeNull();
        expect(z).toBeDefined();
        expect(z).not.toBeUndefined();
        expect(z).not.toBeTruthy();
        expect(z).toBeFalsy();


        {
            const value = 2 + 2;
            expect(value).toBeGreaterThan(3);
            expect(value).toBeGreaterThanOrEqual(3.5);
            expect(value).toBeLessThan(5);
            expect(value).toBeLessThanOrEqual(4.5);

// toBe and toEqual are equivalent for numbers
            expect(value).toBe(4);
            expect(value).toEqual(4);
        }

        {
            const value = 0.1 + 0.2;
            //expect(value).toBe(0.3);           This won't work because of rounding error
            expect(value).toBeCloseTo(0.3);
        }


        const shoppingList = [
            'diapers',
            'kleenex',
            'trash bags',
            'paper towels',
            'beer',
        ];

        expect(shoppingList).toContain('beer');
        expect(new Set(shoppingList)).toContain('beer');


        expect.extend({
            toBeWithinRange(received, floor, ceiling) {
                const pass = received >= floor && received <= ceiling;
                if (pass) {
                    return {
                        message: () =>
                            `expected ${received} not to be within range ${floor} - ${ceiling}`,
                        pass: true,
                    };
                } else {
                    return {
                        message: () =>
                            `expected ${received} to be within range ${floor} - ${ceiling}`,
                        pass: false,
                    };
                }
            },
        });


        expect(100).toBeWithinRange(90, 110);
        expect(101).not.toBeWithinRange(0, 100);
// expect({apples: 6, bananas: 3}).toEqual({
//     apples: expect.toBeWithinRange(1, 10),
//     bananas: expect.not.toBeWithinRange(11, 20),
// });
    })
})

export default test;