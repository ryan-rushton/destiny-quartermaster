import React, { FC } from 'react';
import { Redirect } from 'react-router-dom';
import { parse } from 'query-string';
import { useSelector, useDispatch } from 'react-redux';

import { getOAuthToken } from 'lib/bungie_api/auth';
import { saveToken } from '../auth/authToken';
import { mapAuthToken } from '../auth/authMappers';
import { RootState, StoreDispatch } from 'rootReducer';

const getCodeFromQueryParam = (): string | undefined => {
    const { location } = window;
    const { code } = parse(location.search);
    const extractedCode = Array.isArray(code) ? code[0] : code;
    return extractedCode || undefined;
};

const LoggingIn: FC = () => {
    const isLoggedIn = useSelector((state: RootState) => Boolean(state.authToken));
    const dispatch: StoreDispatch = useDispatch();

    if (isLoggedIn) {
        return <Redirect to="/" />;
    }

    const code = getCodeFromQueryParam();
    if (code) {
        getOAuthToken(code).then(
            token => token && dispatch(saveToken(Date.now(), mapAuthToken(token)))
        );
        return <div>{'Logging in'}</div>;
    }
    return <Redirect to="/login" />;
};

export default LoggingIn;
