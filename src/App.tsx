import styles from 'App.module.scss';
import LoggingIn from 'components/login/LoggingIn';
import Login from 'components/login/Login';
import NavBar from 'components/navbar/NavBar';
import Quartermaster from 'components/Quartermaster';
import React, { FC } from 'react';
import { Route, Switch, withRouter } from 'react-router-dom';

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
