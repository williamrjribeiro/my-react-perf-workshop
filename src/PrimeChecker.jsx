import React from 'react';
import { Huge } from './Components';
import isPrimeNumber from "./isPrimeNumber";

// Naive implementation, always calls isPrimeNumber
const PrimeChecker = ({ number, color = "red" }) => {
    console.log("[PrimeChecker.render]");
    return <Huge>is {isPrimeNumber(number) ? "" : <b style={{ color }}>not</b>} prime!</Huge>;
};

export default PrimeChecker;