import styles from 'App.module.scss';
import LoggingIn from 'components/login/LoggingIn';
import Login from 'components/login/Login';
import NavBar from 'components/navbar/NavBar';
import Quartermaster from 'components/Quartermaster';
import React, { FC } from 'react';
import { Route, Routes } from 'react-router-dom';

const App: FC = () => {
  return (
    <div className={styles.app}>
      <NavBar />
      <div className={styles.body}>
        <Routes>
          <Route path="/" element={<Quartermaster />} />
          <Route path="/login" element={<Login />} />
          <Route path="/redirect" element={<LoggingIn />} />
        </Routes>
      </div>
    </div>
  );
};

export default App;
