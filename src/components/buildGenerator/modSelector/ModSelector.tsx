import React, { FC, useState, useRef, MutableRefObject } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";

import { Mod } from "components/itemCommon/commonItemTypes";
import styles from "./ModSelector.module.scss";
import BungieImageButton from "components/bungieImage/BungieImageButton";
import useClickOutside from "hooks/useClickOutside";
import ModImage from "./ModImage";
import { preloadImages } from "util/mappingUtils";

interface Props {
    mods: Mod[];
    onModSelected(mod: Mod): void;
}

const ModSelector: FC<Props> = ({ mods, onModSelected }) => {
    const [open, setOpen] = useState(false);
    const ref: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const { t } = useTranslation();

    useClickOutside(ref, () => setOpen(false));

    preloadImages(mods);

    const groupedMods = _.groupBy(mods, mod => (mod.collectibleHash ? "equipable" : "default"));
    const equipableMods = groupedMods.equipable;
    const defaultMod = (groupedMods.default?.length && groupedMods.default[0]) || equipableMods[0];

    const numberOfModColumns = 8;
    let modColumn = 0;
    let gridTemplateColumns = "";

    for (let i = 0; i < numberOfModColumns; i++) {
        gridTemplateColumns += "50px ";
    }

    return (
        <div ref={ref} className={styles.modSelector}>
            <div className={styles.button}>
                <BungieImageButton
                    url={defaultMod.iconPath}
                    title={t("armourFilter.clickToAddMod")}
                    onClick={(): void => setOpen(!open)}
                />
            </div>
            {open && (
                <div className={styles.modPanel} style={{ gridTemplateColumns }}>
                    {equipableMods.map(mod => (
                        <div
                            key={mod.hash}
                            style={{ gridColumnStart: (modColumn++ % numberOfModColumns) + 1 }}
                        >
                            <ModImage mod={mod} onModClick={(): void => onModSelected(mod)} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModSelector;
