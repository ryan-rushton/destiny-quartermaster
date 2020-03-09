import React, { FC } from "react";

import { getFullImagePath } from "util/mappingUtils";
import styles from "./BungieImage.module.scss";
import { useClickAndEnterKey } from "hooks/useClickAndEnterKey";

interface Props {
    url: string;
    title: string;
    onClick(): void;
}

const BungieImage: FC<Props> = ({ url, title, onClick }) => {
    const [onClickHandler, onEnter] = useClickAndEnterKey(onClick);
    return (
        <span onClick={onClickHandler} onKeyPress={onEnter} role="button" tabIndex={0}>
            <img className={styles.bungieImage} alt="" src={getFullImagePath(url)} title={title} />
        </span>
    );
};

export default BungieImage;
