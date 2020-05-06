import React from 'react';

export const Emoji = ({ children }) => <span role="img" aria-label="an emoji">{children}</span>;

export const Huge = ({ children }) => <div className="Huge">{children}</div>;

export const CoolBtn = ({ children, className: _, small, ...props }) => <button className={`CoolBtn${small ? " CoolBtn--small" : ""}`} {...props}>{children}</button>

export const Header = () => (
  <>
    <Huge><Emoji>🏎</Emoji></Huge>
    <h1>My React Performance Workshop</h1>
  </>
);
