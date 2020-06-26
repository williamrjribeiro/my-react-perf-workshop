import React, { useMemo } from "react";
import { Huge } from './Components';
import isPrimeNumber from "./isPrimeNumber";

// Call isPrimeNumber only if the `number` prop changes on render
const PrimeChecker = ({ number, color = "red" }) => {
    console.log("[PrimeChecker1.render]");
    const isPrime = useMemo(() => isPrimeNumber(number), [number]); // recalculate only when number changes
    return <Huge>is {isPrime ? "" : <em style={{ color }}>not </em>} prime!</Huge>
};

export default PrimeChecker;