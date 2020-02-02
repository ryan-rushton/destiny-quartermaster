import React, { FC } from "react";
import { connect } from "react-redux";

import Login from "./components/auth/Login";
import NavBar from "./components/navbar/NavBar";
import styles from "./App.module.scss";
import authenticate from "./components/auth/authComponentWrapper";
import { AppStore } from "./appReducer";
import { fetchUserMembershipData } from "./components/user/userReducer";
import { AppDispatch } from ".";

interface DispatchProps {
    dispatch: AppDispatch;
}

interface StateProps {
    isLoggedIn: boolean;
}

type Props = DispatchProps & StateProps;

const App: FC<Props> = ({ dispatch, isLoggedIn }: Props) => {
    dispatch(fetchUserMembershipData());
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
