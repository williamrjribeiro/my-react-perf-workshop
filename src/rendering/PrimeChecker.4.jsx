import React, { useMemo } from "react";
import { Huge as OriginalHuge} from './Components';
import isPrimeNumber from "./isPrimeNumber";

const memoize = (func) => {
  const cache = {};
  return (arg) => {
    if(cache[arg] === undefined) {
      cache[arg] = func(arg);
      //console.log("[memoize] cache:", cache);
    }
    return cache[arg];
  };
};

const Huge = React.memo(OriginalHuge);
const redStyle = {color: 'red'};
const greenStyle = {color: 'green'};
const ColoredItalic = React.memo(({color, children}) => <em style={color === 'red' ? redStyle : greenStyle}>{children}</em>);
const memoizedIsPrime = memoize(isPrimeNumber); // HOF: it takes a function and returns another function.

// Call isPrimeNumber only if the `number` prop changes on render
const PrimeChecker = ({ number, color = "red" }) => {
    console.log("[PrimeChecker4.render]");
    //const isPrime = useMemo(() => isPrimeNumber(number), [number]); // recalculate only when number changes
    //const isPrime = memoizedIsPrime(number);
    const isPrime = useMemo(() => memoizedIsPrime(number), [number]);
    return <Huge>is {isPrime ? "" : <ColoredItalic color={color}>not </ColoredItalic>} prime!</Huge>
};

export default PrimeChecker;