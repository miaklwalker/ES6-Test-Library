const expect = require('./components/Expect.js');
const Mock = require('./components/Mock.js');


function forEach(items, callback) {
    for (let index = 0; index < items.length; index++) {
        callback(items[index]);
    }
}

const mockCallback = Mock.fn(x => 42 + x);
forEach([0, 1], mockCallback);

// The mock function is called twice
console.log(expect(mockCallback.mock.calls.length).toBe(2));

// The first argument of the first call to the function was 0
console.log(expect(mockCallback.mock.calls[0][0]).toBe(0));

// The first argument of the second call to the function was 1
console.log(expect(mockCallback.mock.calls[1][0]).toBe(1));

// The return value of the first call to the function was 42
console.log(expect(mockCallback.mock.results[0].value).toBe(42));

// The mock function was called at least once
console.log(expect(mockCallback).toHaveBeenCalled());

// The mock function was called at least once with the specified args
console.log(expect(mockCallback).toHaveBeenCalledWith(0));

// The last call to the mock function was called with the specified args
console.log(expect(mockCallback).toHaveBeenLastCalledWith(1));