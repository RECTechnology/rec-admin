import * as memoizee from 'memoizee';

export function memoize(config = {}) {
    return function (target, key, descriptor) {
        const oldFunction = descriptor.value;
        const newFunction = memoizee(oldFunction, config);
        descriptor.value = function () {
            return newFunction.apply(this, arguments);
        };
    };
};
