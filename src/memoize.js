// const memoize = (func) => {
//     return (arg) => {
//         return func(arg);
//     };
// }

const memoize = (func) => {
    const cache = {};
    return (arg) => {
        //console.log("[memoized func] cache:", Object.keys(cache).length);
        if (cache[arg] === undefined) {
            cache[arg] = func(arg);
        }
        return cache[arg];
    };
};

export default memoize;

// Please use a better implementation: https://lodash.com/docs/4.17.15#memoize