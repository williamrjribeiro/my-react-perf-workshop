import './Loading.css';

import React, {useState} from 'react';

import Death from './Death'
import Gandalf from './Gandalf'
import Magneto from './Magneto'
import useEscKey from './useEscKey.hook';

const noop = () => {};

const Modal = ({children, label, disabled, onClose = noop}) => {
    const [isOpen, setIsOpen] = useState(false);
    const modalClasses = "Modal" + (isOpen ? " Modal--open" : "");
    
    const openModal = () => setIsOpen(true);
    const closeModal = () => {
        setIsOpen(false);
        onClose();
    };

    useEscKey(closeModal, isOpen);

    return (
        <div className={modalClasses}>
            <button onClick={openModal} disabled={disabled}>{label}</button>
            {
                isOpen &&
                <>
                    <span className="Modal__overlay"></span>
                    <div className="Modal__dialog" role="dialog">
                        <div className="Modal__close"><button title="Close" onClick={closeModal}>X</button></div>
                        <div>{children}</div>
                    </div>
                </>
            }
        </div>
    )
};


const Loading = () => {
    const [choice, setChoice] = useState("");
    const onModalClose = (value) => () => setChoice(value);

    return (
        <>
            { !choice && <h1>Your destiny awaits. Choose wisely</h1> }
            { choice && <h1>{choice} it is!</h1> }
            <div className="Loading">
                <Modal label={choice ? "Magneto" : "???"} onClose={onModalClose("Magneto")} disabled={!!choice}>
                    <Magneto />
                </Modal>

                <Modal label={choice ? "Gandalf" : "???"} onClose={onModalClose("Gandalf")} disabled={!!choice}>
                    <Gandalf />
                </Modal>

                <Modal label={choice ? "Death" : "???"} onClose={onModalClose("Death")} disabled={!!choice}>
                    <Death />
                </Modal>
            </div>
        </>
    );
};

export default Loading;
