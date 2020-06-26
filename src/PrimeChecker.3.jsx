import React, { useMemo } from "react";
import { Huge as OriginalHuge} from './Components';
import isPrimeNumber from "./isPrimeNumber";

const Huge = React.memo(OriginalHuge);
const redStyle = {color: 'red'};
const greenStyle = {color: 'green'};
const ColoredItalic = React.memo(({color, children}) => <em style={color === 'red' ? redStyle : greenStyle}>{children}</em>);

// Call isPrimeNumber only if the `number` prop changes on render
const PrimeChecker = ({ number, color = "red" }) => {
    console.log("[PrimeChecker3.render]");
    const isPrime = useMemo(() => isPrimeNumber(number), [number]); // recalculate only when number changes
    return <Huge>is {isPrime ? "" : <ColoredItalic color={color}>not </ColoredItalic>} prime!</Huge>
};

export default PrimeChecker;