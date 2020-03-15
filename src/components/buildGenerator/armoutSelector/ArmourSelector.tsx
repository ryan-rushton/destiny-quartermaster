import React, { FC, useState, ReactNode, useRef } from "react";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";

import { LibraryArmour } from "components/itemLibrary/libraryTypes";
import BungieImageButton from "components/bungieImage/BungieImageButton";
import { updateRequiredArmour } from "../armourFilter/armourFilterReducer";
import DestinyIconImageButton from "components/bungieImage/DestinyIconImageButton";
import styles from "./ArmourSelector.module.scss";
import useClickOutside from "hooks/useClickOutside";
import { preloadImages } from "util/mappingUtils";

interface Props {
    libraryArmours: LibraryArmour[] | null;
    defaultImage: ReactNode;
}

const ArmourSelector: FC<Props> = ({ libraryArmours, defaultImage }) => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const ref = useRef(null);

    useClickOutside(ref, () => setOpen(false));

    if (libraryArmours) {
        preloadImages(libraryArmours);
    }

    const numberOfArmourColumns = 8;
    let armourColumn = 0;
    let gridTemplateColumns = "";

    for (let i = 0; i < numberOfArmourColumns; i++) {
        gridTemplateColumns += "50px ";
    }

    const buttonTitle = libraryArmours
        ? t("armourFilter.selectRequiredArmour")
        : t("armourFilter.selectCharacter");

    return (
        <div ref={ref} className={styles.armourSelector}>
            <DestinyIconImageButton
                url={defaultImage}
                disabled={!libraryArmours}
                title={buttonTitle}
                onClick={(): void => {
                    if (libraryArmours) {
                        setOpen(!open);
                    }
                }}
            />
            {open && libraryArmours && (
                <div className={styles.armourPanel} style={{ gridTemplateColumns }}>
                    {libraryArmours.map(armour => (
                        <div
                            key={armour.hash}
                            style={{
                                gridColumnStart: (armourColumn++ % numberOfArmourColumns) + 1
                            }}
                        >
                            <BungieImageButton
                                url={armour.iconPath}
                                title={armour.name}
                                onClick={(): void => {
                                    dispatch(updateRequiredArmour(armour));
                                }}
                            />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ArmourSelector;
