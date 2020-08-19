import React from 'react';

export const Emoji = ({children}) => <span role="img" aria-label="an emoji">{children}</span>;

export const Huge = ({children, title}) => <div className="Huge" title={title}>{children}</div>;

export const InRow = ({children}) => <div className="InRow">{children}</div>;

export const CoolBtn = ({children, className: _, small, ...props}) => (
    <button
        className={`CoolBtn${small ? " CoolBtn--small" : ""}`} {...props}>{children}
    </button>
);

export const RaceCarHeader = () => <Huge title="My React Performance Workshop"><Emoji>🏎</Emoji></Huge>;

export const CoolInput = (props) => <input className="CoolInput" type="number" min={1} {...props} />;
