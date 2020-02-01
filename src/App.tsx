import React, { FC } from "react";
import Login from "./components/authenticate/Login";
import NavBar from "./components/navbar/NavBar";
import styles from "./App.module.scss";
import authenticate from "./components/authenticate/authenticate";
import { connect } from "react-redux";
import { AppStore } from "./appReducer";

interface StateProps {
    isLoggedIn: boolean;
}

const App: FC<StateProps> = ({ isLoggedIn }: StateProps) => {
    return (
        <div className={styles.App}>
            <NavBar />
            {isLoggedIn ? "Logged in!" : <Login />}
        </div>
    );
};

const mapStateToProps = (state: AppStore): StateProps => ({
    isLoggedIn: Boolean(state.oAuthToken)
});

export default connect(mapStateToProps)(authenticate(App));
