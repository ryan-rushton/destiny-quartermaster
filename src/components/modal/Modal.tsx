import React, { FC } from 'react';

import styles from './Modal.module.scss';

const Modal: FC = ({ children }) => {
    return (
        <div className={styles.mask}>
            <div className={styles.modal}>{children}</div>
        </div>
    );
};

export default Modal;
