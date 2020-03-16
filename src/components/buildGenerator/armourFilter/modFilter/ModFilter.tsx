import React, { FC } from "react";
import { useTranslation } from "react-i18next";

import ModImage from "./ModImage";
import ModSelector from "./ModSelector";
import styles from "./ModFilter.module.scss";
import { LibraryArmourModState } from "components/items/library/libraryTypes";
import { Mod } from "components/items/commonItemTypes";

interface Props {
    selectedMods: Mod[];
    armourMods: LibraryArmourModState;
    onModSelected(mod: Mod): void;
}

const ModFilter: FC<Props> = ({ selectedMods, armourMods, onModSelected }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.modFilter}>
            <div className={styles.title}>{t("armourFilter.requiredMods")}</div>
            <div className={styles.selected}>
                {selectedMods.map(mod => (
                    <ModImage
                        key={mod.hash}
                        mod={mod}
                        onModClick={(): void => onModSelected(mod)}
                    />
                ))}
            </div>
            {armourMods && (
                <>
                    <ModSelector mods={armourMods.helmets} onModSelected={onModSelected} />
                    <ModSelector mods={armourMods.arms} onModSelected={onModSelected} />
                    <ModSelector mods={armourMods.chest} onModSelected={onModSelected} />
                    <ModSelector mods={armourMods.legs} onModSelected={onModSelected} />
                    <ModSelector mods={armourMods.classItems} onModSelected={onModSelected} />
                    <ModSelector mods={armourMods.generic} onModSelected={onModSelected} />
                </>
            )}
        </div>
    );
};

export default ModFilter;
