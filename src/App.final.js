import React, { useState, useCallback } from 'react';
import './App.css';
import {CoolBtn, Header, InRow} from './Components';
import PrimeChecker from "./PrimeChecker.3";

const PrimeInput = ({ disabled }) => {
  // Make sure you know which components must re-render when state changes
  const [number, setNumber] = useState(992);
  const [color, setColor] = useState("red");
  const changeHandler = (e) => { setNumber(e.target.value) };
  const changeColor = () => { setColor(color === "red" ? "green" : "red") };
  const resetInput = () => { setNumber(1) };

  return (
    <>
      <input className="PrimeInput" type="number" value={number} onChange={changeHandler} min={1} disabled={disabled} />
      <PrimeChecker number={number} color={color} />
      <InRow>
        <CoolBtn small onClick={changeColor}>{color}</CoolBtn>
        <CoolBtn small onClick={resetInput} title="Set input value to 1">Reset</CoolBtn>
      </InRow>
    </>
  );
};

function App() {
  const [disableInput, setDisabled] = useState(false);
  // useCallback does not have any effect here because the event handler always changes its dependency
  const handleClick = useCallback(() => { setDisabled(!disableInput) }, [disableInput]);

  return (
    <div className="App">
      <Header />

      <CoolBtn small onClick={handleClick} title="Click to enable or disable the input">
        {disableInput ? "Disabled" : "Enabled"}
      </CoolBtn>

      <PrimeInput disabled={disableInput} />
    </div>
  );
}

export default App;
