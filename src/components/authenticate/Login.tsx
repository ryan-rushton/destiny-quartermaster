import React, { ReactElement } from "react";
import { v4 as uuid } from "uuid";

const Login = (): ReactElement => {
    const authState = uuid();
    const bungieAuthUrl = `https://www.bungie.net/en/OAuth/Authorize?client_id=${process.env.REACT_APP_BUNGIE_API_CLIENT_ID}&response_type=code&state=${authState}`;
    return (
        <div>
            <a href={bungieAuthUrl}>Login</a>
        </div>
    );
};

export default Login;
