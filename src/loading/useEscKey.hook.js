import { useCallback, useEffect } from 'react';

const useEscKey = (onEscPress, isOpen) => {
    const onEscPressMemo = useCallback(onEscPress, [onEscPress]);
    const escFunction = useCallback((event) => {
        if (event.keyCode === 27) {
            onEscPressMemo();
        }
    }, [onEscPressMemo]);

    useEffect(() => {
        if(isOpen) document.addEventListener("keyup", escFunction, false);

        return () => {
            document.removeEventListener("keyup", escFunction, false);
        };
    }, [onEscPressMemo, escFunction, isOpen]);
};

export default useEscKey;