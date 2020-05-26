import Mock from '../modules/Mock.js';
import expect from '../modules/Expect.js'
import {describe}from '../modules/TestRunner.js';
import Test from "../modules/Test.js";

let test = Test(()=> {


    function add(a, b) {
        return a + b
    }

    const mockAdd = Mock.fn(add);
    mockAdd(4, 4)
    mockAdd(4, 4)

    describe('mock function matchers should work', () => {
        expect(mockAdd).toHaveBeenCalled()
        expect(mockAdd).toHaveBeenCalledTimes(2)
        expect(mockAdd).toHaveBeenCalledWith(4)
        expect(mockAdd).toHaveBeenLastCalledWith(4, 4)
        expect(mockAdd).toHaveBeenNthCalledWith(2, 4, 4)
        expect(mockAdd).toHaveReturnedTimes(2)
        expect(mockAdd).toHaveLastReturned(8)
        expect(mockAdd).toHaveNthReturnWith(2, 8)
    })

})
export default test;