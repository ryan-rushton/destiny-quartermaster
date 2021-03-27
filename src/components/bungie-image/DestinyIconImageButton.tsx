import useClickAndEnterKeyDown from 'hooks/useClickAndEnterKeyDown';
import React, { FC, ReactNode } from 'react';
import styles from './DestinyIconImageButton.module.scss';

interface Props {
  url: ReactNode;
  title: string;
  disabled: boolean;
  onClick(): void;
}

const DestinyIconImageButton: FC<Props> = ({ url, disabled, title, onClick }) => {
  const [onClickHandler, onEnter] = useClickAndEnterKeyDown(onClick);
  const className = disabled ? `${styles.destinyIcon} ${styles.disabled}` : styles.destinyIcon;
  return (
    <div className={className} title={title} onClick={onClickHandler} onKeyPress={onEnter} role="button" tabIndex={0}>
      {url}
    </div>
  );
};

export default DestinyIconImageButton;
