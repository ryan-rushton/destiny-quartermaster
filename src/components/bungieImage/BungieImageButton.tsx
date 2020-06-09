import React, { FC } from 'react';
import clsx from 'clsx';

import { getFullImagePath } from 'util/imageUtils';
import styles from './BungieImage.module.scss';
import useClickAndEnterKeyDown from 'hooks/useClickAndEnterKeyDown';

interface Props {
    url: string;
    title: string;
    className?: string;
    onClick(): void;
}

const BungieImageButton: FC<Props> = ({ url, title, className, onClick }) => {
    const [onClickHandler, onEnter] = useClickAndEnterKeyDown(onClick);

    return (
        <div onClick={onClickHandler} onKeyPress={onEnter} role="button" tabIndex={0}>
            <img
                className={clsx(styles.bungieImage, className)}
                alt=""
                src={getFullImagePath(url)}
                title={title}
            />
        </div>
    );
};

export default BungieImageButton;
