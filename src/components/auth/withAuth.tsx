import React, { FC, ComponentType } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

import { RootStore } from "rootReducer";

const withAuth = <T,>(WrappedComponent: ComponentType<T>): FC<T> => {
    const Authenticate: FC<T> = props => {
        const isLoggedIn = useSelector((state: RootStore) => Boolean(state.authToken));
        const history = useHistory();

        if (!isLoggedIn) {
            history.push("/login");
            return null;
        }

        return <WrappedComponent {...props} />;
    };

    return Authenticate;
};

export default withAuth;
