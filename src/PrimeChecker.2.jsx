import React from "react";
//import PrimeChecker from "./PrimeChecker"
//import PrimeChecker from "./PrimeChecker.1"
//import PrimeChecker from "./PrimeChecker.3"
import PrimeChecker from "./PrimeChecker.4"

// Re-render component only if both props changes!
const MemoPrimeChecker = React.memo(PrimeChecker);

export default MemoPrimeChecker;