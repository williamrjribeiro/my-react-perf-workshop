import React, { useState, useCallback } from 'react';
import './App.css';
import * as components from './Components';
import PrimeChecker from "./PrimeChecker.4";

const CoolBtn = React.memo(components.CoolBtn);
const Header = React.memo(components.Header);
const InRow = React.memo(components.InRow);
const CoolInput = React.memo(components.CoolInput);

const App = () => {
  const [disableInput, setDisabled] = useState(false);

  const onDisabledClick = useCallback(() => { setDisabled(!disableInput) }, [disableInput]);

  return (
    <div className="App">
      <Header />

      <CoolBtn small onClick={onDisabledClick} title="Click to enable or disable the input">
        {disableInput ? "Disabled" : "Enabled"}
      </CoolBtn>

      <PrimeInput disabled={disableInput} />
    </div>
  );
};

const PrimeInput = ({ disabled }) => {
  const [number, setNumber] = useState(initialNumber);
  const [color, setColor] = useState("red");

  const onNumberChange = useCallback((e) => { setNumber(e.target.value) }, [setNumber]);
  const toggleColor = useCallback(() => { setColor(color === "red" ? "green" : "red") }, [color, setColor]);
  const resetNumber = useCallback(() => { setNumber(initialNumber) }, [setNumber]);

  return (
    <>
      <CoolInput value={number} onChange={onNumberChange} min={1} disabled={disabled} />
      <PrimeChecker number={number} color={color} />
      <InRow>
        <CoolBtn small onClick={toggleColor}>{color}</CoolBtn>
        <CoolBtn small onClick={resetNumber} title="Set input value to 1">Reset</CoolBtn>
      </InRow>
    </>
  );
};

const initialNumber = 992;

export default App;
