import React, { FC, ComponentType } from "react";
import { useSelector } from "react-redux";
import { Redirect } from "react-router-dom";

import { RootState } from "rootReducer";

const withAuth = <T,>(WrappedComponent: ComponentType<T>): FC<T> => {
    const Authenticate: FC<T> = props => {
        const isLoggedIn = useSelector((state: RootState) => Boolean(state.authToken));

        if (!isLoggedIn) {
            return <Redirect to="/login" />;
        }

        return <WrappedComponent {...props} />;
    };

    return Authenticate;
};

export default withAuth;
