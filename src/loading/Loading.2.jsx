import './Loading.css';

import React, { Suspense, useState } from 'react';

import useEscKey from './useEscKey.hook';

const LazyMagneto = React.lazy(() => import('./Magneto'));
const LazyGandalf = React.lazy(() => import('./Gandalf'));
const LazyDeath = React.lazy(() => import('./Death'));

const noop = () => {};

const Modal = ({LazyChildren, label, disabled, onClose = noop}) => {
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
                            <Suspense fallback={<div>loading...</div>}>
                                <LazyChildren />
                            </Suspense>
                    </div>
                </>
            }
        </div>
    );
};

const Loading = () => {
    const [choice, setChoice] = useState("");
    const onModalClose = (value) => () => setChoice(value);

    return (
        <>
            { !choice && <h1>Your destiny awaits. Choose wisely</h1>}
            { choice && <h1>{choice} it is!</h1>}
            <div className="Loading">
                <Modal label={choice ? "Magneto" : "???"} onClose={onModalClose("Magneto")} disabled={!!choice} LazyChildren={LazyMagneto} />

                <Modal label={choice ? "Gandalf" : "???"} onClose={onModalClose("Gandalf")} disabled={!!choice} LazyChildren={LazyGandalf} />

                <Modal label={choice ? "Death" : "???"} onClose={onModalClose("Death")} disabled={!!choice} LazyChildren={LazyDeath} />
            </div>
        </>
    );
};

export default Loading;
