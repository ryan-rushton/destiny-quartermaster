import React, { ReactElement } from 'react';
import { useSelector } from 'react-redux';
import { Navigate } from 'react-router-dom';
import { RootState } from 'rootReducer';
import { v4 as uuid } from 'uuid';

const Login = (): ReactElement => {
  const isLoggedIn = useSelector((state: RootState) => Boolean(state.authToken));

  if (isLoggedIn) {
    return <Navigate to="/" />;
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
