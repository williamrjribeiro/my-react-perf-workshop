import React from "react";
//import PrimeChecker1 from "./PrimeChecker"
//import PrimeChecker from "./PrimeChecker.1"
//import PrimeChecker from "./PrimeChecker.3"
import PrimeChecker from "./PrimeChecker.4"
// Re-render component only if both props changes!
//const PrimeChecker3 = React.memo(PrimeChecker);
const MemoPrimeChecker = React.memo(PrimeChecker);

export default MemoPrimeChecker;