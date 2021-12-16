import { getOAuthToken } from 'lib/bungie_api/auth';
import { parse } from 'query-string';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState, StoreDispatch } from 'rootReducer';
import { mapAuthToken } from 'state/auth/authMappers';
import { saveToken } from 'state/auth/authReducer';

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
    return <Navigate to="/" />;
  }

  const code = getCodeFromQueryParam();
  if (code) {
    getOAuthToken(code).then((token) => token && dispatch(saveToken(Date.now(), mapAuthToken(token))));
    return <div>{'Logging in'}</div>;
  }
  return <Navigate to="/login" />;
};

export default LoggingIn;
