import './Loading.css';

import React, { Suspense, useState } from 'react';
import { Route, BrowserRouter as Router, Switch, withRouter } from 'react-router-dom';

import useEscKey from './useEscKey.hook';

const LazyMagneto = React.lazy(() => import('./Magneto'));
const LazyGandalf = React.lazy(() => import('./Gandalf'));
const LazyDeath = React.lazy(() => import('./Death'));

const LinkButton = withRouter((props) => {
    const {
        history,
        location,
        match,
        staticContext,
        to,
        onClick,
        // ⬆ filtering out props that `button` doesn’t know what to do with.
        ...rest
    } = props
    return (
        <button
            {...rest} // `children` is just another prop!
            onClick={(event) => {
                onClick && onClick(event)
                history.push(to)
            }}
        />
    )
});

const Home = () => {
    const [choice, setChoice] = useState("");
    const onNavigate = (value) => () => setChoice(value);

    console.log("choice:", choice);
    return (
        <div className="Loading">
            {
                choice
                    ? <h1>{choice} it is!</h1>
                    : <h1>Your destiny awaits. Choose wisely</h1>
            }
            <LinkButton to="/magneto" disabled={choice} onClick={onNavigate("Magneto")}>{choice ? "Magneto" : "???"}</LinkButton>
            <LinkButton to="/gandalf" disabled={choice} onClick={onNavigate("Gandalf")}>{choice ? "Gandalf" : "???"}</LinkButton>
            <LinkButton to="/death" disabled={choice} onClick={onNavigate("Death")}>{choice ? "Death" : "???"}</LinkButton>
        </div>
    )
};

const Loading = () => {
    const [choice, setChoice] = useState("");
    const onModalClose = (value) => () => setChoice(value);

    return (
        <Router>
            <Suspense fallback={<div>loading...</div>}>
                <Switch>
                    <Route exact path="/" component={Home} />
                    <Route exact path="/magneto" component={LazyMagneto} />
                    <Route exact path="/gandalf" component={LazyGandalf} />
                    <Route exact path="/death" component={LazyDeath} />
                </Switch>
            </Suspense>
        </Router>
    );
};

export default Loading;
