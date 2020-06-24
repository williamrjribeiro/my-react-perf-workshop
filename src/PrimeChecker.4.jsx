import React from "react";
import isPrimeNumber from "./isPrimeNumber";
import { Huge as origHuge} from './Components';

const Huge = React.memo(origHuge);
const ColoredItalic = React.memo(({color, children}) => <em style={{ color }}>{children}</em>);

const memoize = (func) => {
  const cache = {};
  return (...args) => {
    if(cache[args] === undefined) {
      cache[args] = func(...args);
      console.log("[memoize] cache:", cache);
    }
    return cache[args];
  };
}


const memoizedIsPrime = memoize(isPrimeNumber); // HOF: it takes a function and returns another function.

// Call isPrimeNumber only if the `number` prop changes on render
const PrimeChecker = ({ number, color = "red" }) => {
    console.log("[PrimeChecker3.render]");
    // const isPrime = useMemo(() => isPrimeNumber(number), [number]); // recalculate only when number changes
    const isPrime = memoizedIsPrime(number);
    const hugeChildren = <>is {isPrime ? "" : <ColoredItalic color={color}>not </ColoredItalic>} prime!</>;
    return <Huge>{hugeChildren}</Huge>
};

export default PrimeChecker;