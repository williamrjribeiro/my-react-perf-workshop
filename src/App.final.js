import React, { useState, useCallback } from 'react';
import './App.css';
import * as components from './Components';
import PrimeChecker from "./PrimeChecker.4";

const CoolBtn = React.memo(components.CoolBtn);
const Header = React.memo(components.Header);
const InRow = React.memo(components.InRow);
const CoolInput = React.memo(components.CoolInput);

const PrimeInput = ({ disabled }) => {
  const [number, setNumber] = useState(992);
  const [color, setColor] = useState("red");

  const onNumberChange = useCallback((e) => { setNumber(e.target.value) }, [setNumber]);
  const onColorClick = useCallback(() => { setColor(color === "red" ? "green" : "red") }, [color, setColor]);
  const onResetClick = useCallback(() => { setNumber(1) }, [setNumber]);

  return (
    <>
      <CoolInput value={number} onChange={onNumberChange} min={1} disabled={disabled} />
      <PrimeChecker number={number} color={color} />
      <InRow>
        <CoolBtn small onClick={onColorClick}>{color}</CoolBtn>
        <CoolBtn small onClick={onResetClick} title="Set input value to 1">Reset</CoolBtn>
      </InRow>
    </>
  );
};

function App() {
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
}

export default App;
