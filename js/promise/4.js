const PENDING = 'pending';
const FULFILLED = 'fulfilled';
const REJECTED = 'rejected';

function Promise(executor) {
    let self = this;
    self.state = PENDING;
    self.onFulfilled = [];
    self.onRejected = [];

    function resolve(value) {
        if (self.state === PENDING) {
            self.state = FULFILLED;
            self.value = value;
            self.onFulfilled.forEach(fn => fn());
        }
    }

    function reject(reason) {
        if (self.state === PENDING) {
            self.state = REJECTED;
            self.reason = reason;
            self.onRejected.forEach(fn => fn())
        }
    }

    try {
        executor(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

Promise.prototype.then = function (onFulfilled, onRejected) {
    let self = this;
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    onRejected = typeof onRejected === 'function' ? onRejected : err => {
        throw err
    };
    let x;

    let promise2 = new Promise(function (resolve, reject) {
        if (self.state === FULFILLED) {
            setTimeout(() => {
                try {
                    x = onFulfilled(self.value);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            })
        } else if (self.state === REJECTED) {
            setTimeout(() => {
                try {
                    x = onRejected(self.reason);
                    resolvePromise(promise2, x, resolve, reject);
                } catch (e) {
                    reject(e);
                }
            })
        } else if (self.state === PENDING) {
            self.onFulfilled.push(() => {
                setTimeout(() => {
                    try {
                        x = onFulfilled(self.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                });
            });
            self.onRejected.push(() => {
                setTimeout(() => {
                    try {
                        x = onRejected(self.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                });
            });
        }
    });

    return promise2;
}

function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
        throw new TypeError('chaining promise');
    }
    if (x && typeof x === 'object' || typeof x === 'function') {
        let used;
        try {
            const then = x.then;
            if (typeof then === "function") {
                then.call(x, (value) => {
                    if (used) return;
                    used = true;
                    resolvePromise(promise, value, resolve, reject);
                }, (err) => {
                    if (used) return;
                    used = true;
                    reject(err)
                });
            } else {
                if (used) return;
                used = true;
                resolve(x);
            }
        } catch (e) {
            if (used) return;
            used = true;
            reject(e);
        }
    } else {
        resolve(x)
    }

}

Promise.resolve = function (val) {
    if (val instanceof Promise) {
        return val;
    }
    return new Promise(function (resolve, reject) {
        if (val && typeof val === 'object' && val.then && typeof val.then === "function") {
            setTimeout(() => {
                val.then(resolve, reject);
            })
        } else {
            resolve(val);
        }
    });
}
Promise.reject = function (err) {
    return new Promise((resolv, reject) => {
        reject(err)
    });
}
Promise.prototype.catch = function (catchFn) {
    return this.then(null, catchFn)
}
Promise.prototype.finally = function (finalFn) {
    return this.then(
        (value) => {
            return Promise.resolve(finalFn()).then(() => {
                return value;
            })

        },
        (err) => {
            return Promise.resolve(finalFn()).then(() => {
                throw err
            })
        }
    )
}

Promise.all = function (promises) {
    let result = [];
    return new Promise(function (resolve, reject) {
        if (promises.length === 0) {
            resolve(result);
        }
        try {
            let finishCount = 0;
            let len = promises.length;

            function resolveOne(i, value) {
                result[i] = value;
                finishCount++
                if (finishCount >= len) {
                    resolve(result);
                }
            }

            for (let i = 0; i < len; i++) {
                Promise.resolve(promises[i]).then((value) => {
                    resolveOne(i, value)
                }, (err) => {
                    reject(err);
                    return
                })
            }

        } catch (e) {
            reject(e)
        }
    })
}

Promise.race = function (promises) {
    let result = [];
    return new Promise(function (resolve, reject) {
        if (promises.length === 0) {
            resolve(result);
        }
        try {
            let len = promises.length;
            for (let i = 0; i < len; i++) {
                Promise.resolve(promises[i]).then((value) => {
                    resolve(value);
                }, (err) => {
                    reject(err);
                    return
                })
            }
        } catch (e) {
            reject(e)
        }
    })
}

module.exports = Promise;
