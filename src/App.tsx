import React, { FC } from "react";
import { Switch, Route, withRouter } from "react-router-dom";

import Login from "./components/login/Login";
import NavBar from "./components/navbar/NavBar";
import AccountSelection from "./components/user/AccountSelection";
import styles from "./App.module.scss";
import LoggingIn from "./components/login/LoggingIn";

const App: FC = () => {
    return (
        <div className={styles.App}>
            <NavBar />
            <Switch>
                <Route exact path="/">
                    <AccountSelection />
                </Route>
                <Route path="/login">
                    <Login />
                </Route>
                <Route path="/redirect">
                    <LoggingIn />
                </Route>
            </Switch>
        </div>
    );
};

export default withRouter(App);
