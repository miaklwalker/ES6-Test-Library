const {MOCK} = require('./Globals.js');

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
                    return this.mock.nextValue.pop();
                }
            }
        });
        this.func = spy;
        return spy;
    },
    returnOnceWith(value){
        if(this.func !== undefined) {
            this.func[MOCK].nextValue.push(value);
        }
    }
};

module.exports = Mock;