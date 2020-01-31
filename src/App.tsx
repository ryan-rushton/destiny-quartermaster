import React from "react";
import Login from "./components/login/Login";
import styles from "./App.module.scss";

const App: React.FC = () => {
    return (
        <div className={styles.App}>
            <Login />
        </div>
    );
};

export default App;
