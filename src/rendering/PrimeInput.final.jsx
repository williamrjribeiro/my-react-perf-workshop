const PrimeInput = ({ disabled }) => {
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

export default PrimeInput;