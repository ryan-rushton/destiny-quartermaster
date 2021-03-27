import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useClickAndEnterKeyDown from 'hooks/useClickAndEnterKeyDown';
import useClickOutside from 'hooks/useClickOutside';
import useFocusTrap from 'hooks/useFocusTrap';
import useGlobalEscKeyDown from 'hooks/useGlobalEscapeKeyDown';
import React, { FC, useRef } from 'react';
import styles from './Modal.module.scss';

interface Props {
  open: boolean;
  title?: string;
  onClose(): void;
}

const Modal: FC<Props> = ({ open, title, onClose, children }) => {
  const modalRef = useRef(null);
  const closeRef = useRef(null);

  const [onCloseClick, onCloseEnter] = useClickAndEnterKeyDown(onClose);
  useClickOutside(modalRef, open, onClose);
  useGlobalEscKeyDown(open, onClose);
  useFocusTrap(modalRef, closeRef, open);

  if (!open) {
    return null;
  }

  return (
    <div className={styles.mask}>
      <div className={styles.container}>
        <div className={styles.modal} ref={modalRef}>
          <div className={styles.header}>
            <div className={styles.title}>{title}</div>
            <div
              className={styles.close}
              role="button"
              tabIndex={0}
              onClick={onCloseClick}
              onKeyDown={onCloseEnter}
              ref={closeRef}
            >
              <FontAwesomeIcon icon={faTimes} />
            </div>
          </div>
          <div className={styles.content}>{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Modal;
