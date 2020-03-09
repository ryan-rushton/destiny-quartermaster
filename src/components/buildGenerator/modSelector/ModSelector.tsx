import React, { FC, useState, useRef, MutableRefObject } from "react";
import _ from "lodash";
import { useTranslation } from "react-i18next";

import { Mod } from "components/itemCommon/commonItemTypes";
import styles from "./ModSelector.module.scss";
import BungieImage from "components/bungieImage/BungieImage";
import useClickOutside from "hooks/useClickOutside";

interface Props {
    mods: Mod[];
    onModSelected(mod: Mod): void;
}

const ModSelector: FC<Props> = ({ mods, onModSelected }) => {
    const [open, setOpen] = useState(false);
    const ref: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const popupRef: MutableRefObject<HTMLDivElement | null> = useRef(null);
    const { t } = useTranslation();

    useClickOutside(ref, () => setOpen(false));

    const groupedMods = _.groupBy(mods, mod => Boolean(mod.collectibleHash));
    const equipableMods = groupedMods["true"];
    const defaultMod = (groupedMods["false"].length && groupedMods["false"][0]) || equipableMods[0];

    const numberOfModColumns = 8;
    let modColumn = 0;
    let gridTemplateColumns = "";

    for (let i = 0; i < numberOfModColumns; i++) {
        gridTemplateColumns += "50px ";
    }

    return (
        <div ref={ref} className={styles.modSelector}>
            <div className={styles.button}>
                <BungieImage
                    url={defaultMod.iconPath}
                    title={t("armourFilter.clickToAddMod")}
                    onClick={(): void => setOpen(!open)}
                />
            </div>
            {open && (
                <div ref={popupRef} className={styles.modPanel} style={{ gridTemplateColumns }}>
                    {equipableMods.map(mod => (
                        <div
                            key={mod.hash}
                            style={{ gridColumnStart: (modColumn++ % numberOfModColumns) + 1 }}
                        >
                            <BungieImage
                                url={mod.iconPath}
                                title={mod.name}
                                onClick={(): void => onModSelected(mod)}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ModSelector;
