import { Huge } from './Components';
import React from 'react';
import isPrimeNumber from "./isPrimeNumber";

const PrimeChecker = ({ number, color = "red" }) => {
    const isPrime = isPrimeNumber(number);
    return <Huge>is {isPrime ? "" : <em style={{ color }}>not </em>}prime</Huge>;
};

export default PrimeChecker;