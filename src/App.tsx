import React, { FC } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';

import Login from 'components/login/Login';
import NavBar from 'components/navbar/NavBar';
import styles from 'App.module.scss';
import LoggingIn from 'components/login/LoggingIn';
import Quartermaster from 'components/Quartermaster';

const App: FC = () => {
  return (
    <div className={styles.app}>
      <NavBar />
      <div className={styles.body}>
        <Switch>
          <Route exact path="/">
            <Quartermaster />
          </Route>
          <Route path="/login">
            <Login />
          </Route>
          <Route path="/redirect">
            <LoggingIn />
          </Route>
        </Switch>
      </div>
    </div>
  );
};

export default withRouter(App);
