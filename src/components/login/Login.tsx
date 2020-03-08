import React, { ReactElement } from "react";
import { v4 as uuid } from "uuid";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { RootStore } from "rootReducer";

const Login = (): ReactElement => {
    const isLoggedIn = useSelector((state: RootStore) => Boolean(state.authToken));

    if (isLoggedIn) {
        return <Redirect to="/" />;
    }

    const authState = uuid();
    const bungieAuthUrl = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_BUNGIE_API_CLIENT_ID}&response_type=code&state=${authState}`;

    return (
        <div>
            <a href={bungieAuthUrl}>Login</a>
        </div>
    );
};

export default Login;
