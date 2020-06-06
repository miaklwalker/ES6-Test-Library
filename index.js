import expect from "./modules/Expect.js";
import Mock from "./modules/Mock.js";
import startTestRunner from "./modules/startTest.js";
import test from "./__tests__/Jest.spec.js";
import {describe} from "./modules/TestRunner.js";


let JTL = {
    expect,
    Mock,
    startTestRunner,
    test,
    describe
}

export default JTL
window.JTL = JTL;



