import React, { FC } from "react";

import styles from "./NavBar.module.scss";

const NavBar: FC = () => {
    return (
        <div className={styles.navBar}>
            <h2 className={styles.appName}>{"Quartermaster"}</h2>
        </div>
    );
};

export default NavBar;
