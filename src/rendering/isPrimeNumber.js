// Recursive function. It will hurt your CPU!
const isPrimeNumber = (n, step = n - 1) => {
    // This console.log call is what kills the performance with dev tools open!!!
    console.log("[isPrimeNumber]", n);
    if (step <= 1)
        return true;
    if (n % step === 0) {
        return false;
    }
    return isPrimeNumber(n, step - 1);
};

export default isPrimeNumber;
