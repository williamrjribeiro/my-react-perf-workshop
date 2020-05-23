// const memoize = (func) => {
//     return (arg) => {
//         return func(arg);
//     };
// }

const memoize = (func) => {
    const cache = {};
    return (...args) => {
        //console.log("[memoized func] cache:", Object.keys(cache).length);
        if (cache[args] === undefined) {
            cache[args] = func(...args);
        }
        return cache[args];
    };
};

export default memoize;

// Please use a better implementation: https://lodash.com/docs/4.17.15#memoize