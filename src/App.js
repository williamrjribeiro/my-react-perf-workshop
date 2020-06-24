import React, {useState} from 'react';
import './App.css';
import {CoolBtn, CoolInput, Header, InRow} from './Components';
import PrimeChecker from "./PrimeChecker";

const PrimeInput = ({ disabled }) => {
  const [number, setNumber] = useState(992);
  const [color, setColor] = useState("red");

  const onNumberChange = (e) => setNumber(e.target.value);
  const onColorClick = () => setColor(color === "red" ? "green" : "red");
  const onResetClick = () => setNumber(1);

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

  const onDisabledClick = () => setDisabled(!disableInput);

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
