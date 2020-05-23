let final = {}
let suites = [];
let results = [];
function testRunner(){

suites.forEach(suite=>{
    suite();
})
let log;
for(let test in final ){
    log = `
    Test: ${test}
    `
    final[test].forEach((result,index)=>{
        log+=`
        Test: ${index}
        result: ${result ? 'Passed':'Failed'}
        `
    })
    console.log(log);
}
} 


function describe(description,callback){
    console.log(suites.length);
    suites.push(()=>{
    callback();
    console.log(suites.length);
    final[description] = results;
    results = [];
    })

}

function expect (recieved) {
    return {
        result(result){
            results.push(result)
        },
        toBe(expected){
            this.result(Object.is(recieved,expected))
        },
    }
}

describe('nested describe',()=>{
    describe('Test the built in add method ',()=>{
        expect(2+2).toBe(4);
        expect(3+4).toBe(8);
    })
})

testRunner();