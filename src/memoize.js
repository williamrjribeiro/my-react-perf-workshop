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