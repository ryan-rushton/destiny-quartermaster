import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import styles from './Closeable.module.scss';

interface Props {
    onClose(): void;
}

const Closeable: FC<Props> = ({ onClose, children }) => {
    return (
        <div className={styles.container}>
            {children}
            <div className={styles.close}>
                <FontAwesomeIcon icon={faTimes} onClick={onClose} />
            </div>
        </div>
    );
};

export default Closeable;
