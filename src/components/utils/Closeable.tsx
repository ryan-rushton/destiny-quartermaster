import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import clsx from 'clsx';
import useClickAndEnterKeyDown from 'hooks/useClickAndEnterKeyDown';
import React, { FC } from 'react';
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

  const [onClick, onEnter] = useClickAndEnterKeyDown(onClose);

  return (
    <div className={styles.container}>
      {children}
      {!disabled && (
        <div
          className={clsx(styles.close, closeBackground && styles.closeBackground)}
          style={{ right, top }}
          onClick={onClick}
          onKeyDown={onEnter}
          tabIndex={0}
          role="button"
        >
          <FontAwesomeIcon icon={faTimes} />
        </div>
      )}
    </div>
  );
};

export default Closeable;
