import './Loading.css';

import React, {useState} from 'react';

import Death from './Death'
import Gandalf from './Gandalf'
import Magneto from './Magneto'

const Modal = ({children, label}) => {
    const [isOpen, setIsOpen] = useState(false);
    const openModal = () => setIsOpen(true);
    const closeModal = () => setIsOpen(false);
    const modalClasses = "Modal" + (isOpen ? " Modal--open" : "");

    return (
        <div className={modalClasses}>
            <button onClick={openModal}>{label}</button>
            <span className="Modal__overlay"></span>
            <div className="Modal__dialog" role="dialog">
                <div className="Modal__close"><button title="Close" onClick={closeModal}>X</button></div>
                <div>{children}</div>
            </div>
        </div>
    )
};


const Loading = () => (
    <div className="Loading">
        <Modal label="Magneto">
            <Magneto />
        </Modal>

        <Modal label="Gandalf">
            <Gandalf />
        </Modal>

        <Modal label="Death">
            <Death />
        </Modal>
    </div>
);

export default Loading;
