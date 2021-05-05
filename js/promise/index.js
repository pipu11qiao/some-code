const STATE = {
    'pending': 'pending',
    'done': 'done',
    'fail': 'fail'
};

class _Promise {
    constructor(executor = () => {}) {
        this.#state = STATE.pending;
        this.#result = undefined;
        const resolve = function (result){
            this.#state = STATE.done;
            setTimeout(()=>{
              this.then();
              this.finally()
            },0)
        }
        const reject = function (){
            this.#state = STATE.fail;
            setTimeout(()=>{
                this.catch();
                this.finally()
            })
        }
        try {
            executor(resolve,reject)
        } catch (e){
            this.catch(e);
            this.finally(e)
        }
    }

    then(doneFunc,failFunc) {
        const res = doneFunc();
        return new _Promise(function (resolve,reject){
            if(res instanceof _Promise){
                return res
            }
            resolve(res);
        })
    }

    catch() {

    }

    finally() {

    }
}

const promiseObj = new Promise(function (resolve, reject) {

});

promiseObj.then().catch().finally()

Promise.all();

Promise.race();
