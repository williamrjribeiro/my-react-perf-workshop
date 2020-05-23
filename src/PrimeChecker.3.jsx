import React, { useMemo } from "react";
import isPrimeNumber from "./isPrimeNumber";
import { Huge as origHuge} from './Components';

const Huge = React.memo(origHuge);
const ColoredItalic = React.memo(({color, children}) => <em style={{ color }}>{children}</em>);

// Call isPrimeNumber only if the `number` prop changes on render
const PrimeChecker = ({ number, color = "red" }) => {
    console.log("[PrimeChecker3.render]");
    const isPrime = useMemo(() => isPrimeNumber(number), [number]); // recalculate only when number changes
    const hugeChildren = <>is {isPrime ? "" : <ColoredItalic color={color}>not </ColoredItalic>} prime!</>;
    return <Huge>{hugeChildren}</Huge>
};

export default PrimeChecker;