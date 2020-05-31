import React, { FC, ReactNode } from 'react';

import styles from './DestinyIconImageButton.module.scss';
import { useClickAndEnterKey } from 'hooks/useClickAndEnterKey';

interface Props {
    url: ReactNode;
    title: string;
    disabled: boolean;
    onClick(): void;
}

const DestinyIconImageButton: FC<Props> = ({ url, disabled, title, onClick }) => {
    const [onClickHandler, onEnter] = useClickAndEnterKey(onClick);
    const className = disabled ? `${styles.destinyIcon} ${styles.disabled}` : styles.destinyIcon;
    return (
        <div
            className={className}
            title={title}
            onClick={onClickHandler}
            onKeyPress={onEnter}
            role="button"
            tabIndex={0}
        >
            {url}
        </div>
    );
};

export default DestinyIconImageButton;
