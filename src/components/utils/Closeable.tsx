import React, { FC } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import clsx from 'clsx';

import styles from './Closeable.module.scss';

interface Props {
    disabled?: boolean;
    closeBackground?: boolean;
    position?: { right: number; top: number };
    onClose(): void;
}

const Closeable: FC<Props> = ({ disabled, closeBackground, position, onClose, children }) => {
    const right = position?.right || 0;
    const top = position?.top || 0;

    return (
        <div className={styles.container}>
            {children}
            {!disabled && (
                <div
                    className={clsx(styles.close, closeBackground && styles.closeBackground)}
                    style={{ right, top }}
                >
                    <FontAwesomeIcon icon={faTimes} onClick={onClose} />
                </div>
            )}
        </div>
    );
};

export default Closeable;
