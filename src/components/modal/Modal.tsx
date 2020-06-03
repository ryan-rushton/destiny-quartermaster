import React, { FC, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/free-solid-svg-icons';

import styles from './Modal.module.scss';
import useClickOutside from 'hooks/useClickOutside';

interface Props {
    open: boolean;
    title?: string;
    onClose(): void;
}

const Modal: FC<Props> = ({ open, title, onClose, children }) => {
    const modalRef = useRef(null);
    useClickOutside(modalRef, () => {
        if (open) {
            onClose();
        }
    });

    if (!open) {
        return null;
    }

    return (
        <div className={styles.mask}>
            <div className={styles.container}>
                <div className={styles.modal} ref={modalRef}>
                    <div className={styles.header}>
                        <div className={styles.title}>{title}</div>
                        <FontAwesomeIcon
                            icon={faTimes}
                            className={styles.close}
                            onClick={onClose}
                        />
                    </div>
                    <div className={styles.content}>{children}</div>
                </div>
            </div>
        </div>
    );
};

export default Modal;
