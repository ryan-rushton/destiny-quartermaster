import React, { FC } from "react";

import { getFullImagePath } from "util/mappingUtils";
import styles from "./BungieImage.module.scss";

interface Props {
    url: string;
    title: string;
    className?: string;
}

const BungieImage: FC<Props> = ({ url, title, className }) => {
    return (
        <span>
            <img
                className={`${styles.bungieImage} ${className}`}
                alt=""
                src={getFullImagePath(url)}
                title={title}
            />
        </span>
    );
};

export default BungieImage;
