import React, { FC } from "react";

import styles from "./NavBar.module.scss";

const NavBar: FC = () => {
    return (
        <div className={styles.navBar}>
            <div className={styles.appName}>{"Quartermaster"}</div>
        </div>
    );
};

export default NavBar;
