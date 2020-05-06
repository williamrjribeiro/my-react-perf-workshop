import React, { useState, useMemo, useCallback } from 'react';
import './App.css';
import { CoolBtn } from './Components';
import PrimeChecker from "./PrimeChecker";

const PrimeInput = ({ disabled }) => {
    const [number, setNumber] = useState(13);
    const [color, setColor] = useState("red");
    // useMemo memoise the value/return of the function but these callbacks don't return anything... 
    // useCallback memoizes the function itself, not its returned value. Since these function always does the same thing, it can be used!
    const changeHandler = useCallback((e) => { setNumber(e.target.value) }, []);
    const changeColor = useCallback(() => { setColor(color === "red" ? "green" : "red") }, [color]);
    const resetInput = useCallback(() => { setNumber(1) }, []);

    return (
        <>
            <input className="PrimeInput" type="number" value={number} onChange={changeHandler} max={999} min={1} disabled={disabled} />
            <PrimeChecker number={number} color={color} />
            <CoolBtn small onClick={changeColor}>{color}</CoolBtn>
            <CoolBtn small onClick={resetInput} title="Set input value to 1">Reset</CoolBtn>
        </>
    );
};

export default PrimeInput.