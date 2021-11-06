const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function Promise(executor) {
    this.state = PENDING;
    this.value = null;
    this.error = null;
    this.onFulfilled = [];
    this.onRejected = [];

    function resolve(value) {
        if (this.state === PENDING) {
            this.state = FULFILLED;
            this.value = value
            this.onFulfilled.forEach(fun => fun())

        }
    }

    function reject(error) {
        if (this.state === PENDING) {
            this.state = REJECTED;
            this.error = error;
            this.onRejected.forEach(fun => fun())
        }
    }

    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    onFulfilled = typeof onFulfilled === "function" ? onFulfilled : (val) => val;
    onRejected = typeof onRejected === "function" ? onRejected : (error) => error;
    const newPromise = new Promise((resolve, reject) => {
        if (this.state === FULFILLED) {
            setTimeout(() => {
                let value = onFulfilled(this.value);
                resolvePromise(newPromise, value, resolve, reject)
            })

        }
        if (this.state === REJECTED) {
            setTimeout(() => {
                let value = onRejected(this.error);
                resolvePromise(newPromise, value, resolve, reject)
            })

        }
        if (this.state === PENDING) {
            this.onFulfilled.push(() => {
                setTimeout(() => {
                    let value = onFulfilled(this.value);
                    resolvePromise(newPromise, value, resolve, reject)
                })

            });
            this.onRejected.push(() => {
                setTimeout(() => {
                    let value = onRejected(this.error);
                    resolvePromise(newPromise, value, resolve, reject)
                })
            });
        }

    });
    return newPromise;
}

function resolvePromise(promise, value, resolve, reject) {
    if (!value) {
        resolve(value)
    }
    if (typeof value === 'object') {
        if (value.then && typeof value.then === "function") {
            try {
                value.then((value) => {
                    resolvePromise(promise.value, resolve, reject);
                }, (error) => {
                    resolvePromise(promise.error, resolve, reject);
                })
            } catch (e) {
                reject(e)
            }
        } else {
            resolve(value)
        }

    } else {
        resolve(value);
    }
}


