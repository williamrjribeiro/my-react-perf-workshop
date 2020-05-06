import React, { useMemo } from "react";
import { Huge } from './Components';
import isPrimeNumber from "./isPrimeNumber";
import memoize from "./memoize";

const memoizedIsPrimeNumber = memoize(isPrimeNumber);

const PrimeChecker = ({ number, color = "red" }) => {
  console.log("[PrimeChecker3.render]");
  return <Huge>is {memoizedIsPrimeNumber(number) ? "" : <b style={{ color }}>not</b>} prime!</Huge>
};

export default PrimeChecker;