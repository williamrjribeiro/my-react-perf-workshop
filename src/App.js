import React, {useState} from 'react';
import './App.css';
import * as components from './Components';
import PrimeChecker from "./PrimeChecker.2";

const CoolBtn = React.memo(components.CoolBtn);
const RaceCarHeader = React.memo(components.RaceCarHeader);
const InRow = React.memo(components.InRow);
const CoolInput = React.memo(components.CoolInput);

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

const PrimeInput = ({ disabled }) => {
  const [number, setNumber] = useState(initialNumber);
  const [color, setColor] = useState("red");

  const onNumberChange = (e) => setNumber(e.target.value);
  const toggleColor = () => setColor(color === "red" ? "green" : "red");
  const resetNumber = () => setNumber(initialNumber);

  return (
    <div className="PrimeInput">
      <CoolInput value={number} onChange={onNumberChange} min={1} disabled={disabled} />
      <PrimeChecker number={number} color={color} />
      <InRow>
        <CoolBtn small onClick={toggleColor}>{color}</CoolBtn>
        <CoolBtn small onClick={resetNumber} title="Set input value back to its initial value">Reset</CoolBtn>
      </InRow>
    </div>
  );
};

const initialNumber = 992;

export default App;
