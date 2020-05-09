import Mock from '../Mock.js';
import expect from '../Expect.js'

function add(a, b){
    return a + b
}

const mockAdd = Mock.fn(add);
mockAdd(4,4)
mockAdd(4,4)
console.log(expect(mockAdd).toHaveBeenCalled())
console.log(expect(mockAdd).toHaveBeenCalledTimes(2))
console.log(expect(mockAdd).toHaveBeenCalledWith(4))
console.log(expect(mockAdd).toHaveBeenLastCalledWith(4,4))
console.log(expect(mockAdd).toHaveBeenNthCalledWith(2,4,4))
console.log(expect(mockAdd).toHaveReturnedTimes(2))
console.log(expect(mockAdd).toHaveLastReturned(8))
console.log(expect(mockAdd).toHaveNthReturnWith(2,8))