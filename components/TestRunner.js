import {___test___} from "../index.js";

function Log(message,color){
    console.log("%c" + message, "color:" + color);
}

function FailLog(message){
    Log(message,'Red');
}

function passLog(message){
    Log(message,'Green');
}

export function runTest(logLevel=0){
    if(logLevel>2||typeof logLevel !== 'number')return'Please only put a number 0 - 2';
    let testNumber = 0;
    let passed = [];
    let failed = [];
    ___test___.forEach(({test,description})=>{
        if(logLevel === 0){
            if(!test){
                return false;
            }
        }else if( logLevel === 1){
            if(test===true){
                passed.push(testNumber);
            }else{
                failed.push(testNumber);
            }
            testNumber++
        }else{
            if(test===true){
                passLog(`${description} Passed`,'Green');
                testNumber++
            }else{
                FailLog(`Test ${description} Failed`,'Red');
                Log(`Expected`,'Green');
                Log(test.expected,'Green');
                Log(`Received`,'Red');
                Log(test.received,'Red');
                testNumber++
            }
        }
    });
    return{passed,failed};
}