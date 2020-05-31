import React, { FC } from 'react';

import { getFullImagePath } from 'util/imageUtils';
import styles from './BungieImage.module.scss';

interface Props {
    url: string;
    title: string;
    className?: string;
}

const BungieImage: FC<Props> = ({ url, title, className }) => {
    return (
        <img
            className={`${styles.bungieImage} ${className}`}
            alt=""
            src={getFullImagePath(url)}
            title={title}
        />
    );
};

export default BungieImage;
