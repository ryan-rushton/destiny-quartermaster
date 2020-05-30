import React, { FC } from "react";

import { Mod } from "components/items/commonItemTypes";
import BungieImage from "components/bungieImage/BungieImage";
import { useClickAndEnterKey } from "hooks/useClickAndEnterKey";
import styles from "./ModImage.module.scss";

interface Props {
    mod: Mod;
    onModClick(): void;
}

const ModImage: FC<Props> = ({ mod, onModClick }) => {
    const [onClick, onEnter] = useClickAndEnterKey(onModClick);

    return (
        <div
            className={styles.wrapper}
            role="button"
            onClick={onClick}
            onKeyPress={onEnter}
            tabIndex={0}
        >
            <BungieImage className={styles.mod} url={mod.iconPath} title={mod.name} />
            {mod.energyType && (
                <BungieImage
                    className={styles.energy}
                    url={mod.energyType.iconPath}
                    title={mod.energyType.name}
                />
            )}
        </div>
    );
};

export default ModImage;
