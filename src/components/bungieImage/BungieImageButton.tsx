import React, { FC } from 'react';

import { getFullImagePath } from 'util/imageUtils';
import styles from './BungieImage.module.scss';
import useClickAndEnterKeyDown from 'hooks/useClickAndEnterKeyDown';

interface Props {
    url: string;
    title: string;
    onClick(): void;
}

const BungieImageButton: FC<Props> = ({ url, title, onClick }) => {
    const [onClickHandler, onEnter] = useClickAndEnterKeyDown(onClick);

    return (
        <div onClick={onClickHandler} onKeyPress={onEnter} role="button" tabIndex={0}>
            <img className={styles.bungieImage} alt="" src={getFullImagePath(url)} title={title} />
        </div>
    );
};

export default BungieImageButton;
