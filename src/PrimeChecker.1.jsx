import React, { useMemo } from "react";
import isPrimeNumber from "./isPrimeNumber";
import { Huge } from './Components';

// Call isPrimeNumber only if the `number` prop changes on render
const PrimeChecker = ({ number, color = "red" }) => {
    console.log("[PrimeChecker1.render]");
    const isPrime = useMemo(() => isPrimeNumber(number), [number]);
    return <Huge>is {isPrime ? "" : <b style={{ color }}>not</b>} prime!</Huge>
};

export default PrimeChecker;