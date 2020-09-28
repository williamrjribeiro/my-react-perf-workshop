import './Loading.css';

import React, { useState } from 'react';

import useEscKey from './useEscKey.hook';

const noop = () => {};

const Modal = ({ defaultComponentPath, label, disabled, onClose = noop }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [child, setChild] = useState(null);
    const modalClasses = "Modal" + (isOpen ? " Modal--open" : "");

    const openModal = () => {
        setIsOpen(true);
        loadModule()
    };

    const closeModal = () => {
        setIsOpen(false);
        onClose();
    };

    useEscKey(closeModal, isOpen);

    const loadModule = async () => {
        const { default: Module } = await import(
            /* webpackChunkName: "lazy-ian" */
            /* webpackMode: "lazy-once" */
            `${defaultComponentPath}`
        ); // same as const Module = await import(`${defaultComponentPath}`).default
        console.log("Children loaded:", Module.name);
        setChild(Module());
    };

    return (
        <div className={modalClasses}>
            <button onClick={openModal} disabled={disabled}>{label}</button>
            {
                isOpen &&
                <>
                    <span className="Modal__overlay"></span>
                    <div className="Modal__dialog" role="dialog">
                        <div className="Modal__close"><button title="Close" onClick={closeModal}>X</button></div>
                        <div>{child ? child : "loading..."}</div>
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
                <Modal label={choice ? "Magneto" : "???"} onClose={onModalClose("Magneto")} defaultComponentPath="./Magneto" disabled={!!choice} />

                <Modal label={choice ? "Gandalf" : "???"} onClose={onModalClose("Gandalf")} defaultComponentPath="./Gandalf" disabled={!!choice} />

                <Modal label={choice ? "Death" : "???"} onClose={onModalClose("Death")} defaultComponentPath="./Death" disabled={!!choice} />
            </div>
        </>
    );
};

export default Loading;
