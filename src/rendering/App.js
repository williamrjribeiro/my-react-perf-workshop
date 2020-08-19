import './App.css';

import {CoolBtn, CoolInput, InRow, RaceCarHeader} from './Components';
import React, {useCallback, useState} from 'react';

import PrimeChecker from "./PrimeChecker";

const App = () => {
  const [disableInput, setDisabled] = useState(false);

  const onDisabledClick = () => setDisabled(!disableInput);

  return (
    <div className="App">
      <RaceCarHeader />

      <CoolBtn small onClick={onDisabledClick} title="Click to enable or disable the input">
        {disableInput ? "Disabled" : "Enabled"}
      </CoolBtn>

      <PrimeInput disabled={disableInput} />
    </div>
  );
};

const MimePrimeChecker = React.memo(PrimeChecker);

const ResetButton = React.memo(CoolBtn);

//const resetNumber = () => setNumber(initialNumber);

const PrimeInput = ({ disabled }) => {
  const [number, setNumber] = useState(initialNumber);
  const [color, setColor] = useState("red");

  const onNumberChange = (e) => setNumber(e.target.value);
  //const toggleColor = () => setColor(color === "red" ? "green" : "red");
  const toggleColor = useCallback(() => setColor(color === "red" ? "green" : "red"), [color]);
  const resetNumber = useCallback( () => { setNumber(initialNumber) });

  return (
    <div className="PrimeInput">
      <CoolInput value={number} onChange={onNumberChange} min={1} disabled={disabled} />
      <MimePrimeChecker number={number} color={color} />
      <InRow>
        <CoolBtn small onClick={toggleColor}>{color}</CoolBtn>
        <ResetButton small onClick={resetNumber} title="Set input value back to its initial value">Reset</ResetButton>
      </InRow>
    </div>
  );
};

const initialNumber = 992;

export default App;
