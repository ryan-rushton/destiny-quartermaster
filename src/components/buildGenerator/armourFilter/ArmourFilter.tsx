import React, { FC, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { ArmourStats } from "./armourFilterTypes";
import styles from "./ArmourFilter.module.scss";
import { saveStatFilter, updateArmourMods, updateRequiredArmour } from "./armourFilterReducer";
import { RootStore } from "rootReducer";
import ModSelector from "../modSelector/ModSelector";
import { Mod } from "components/itemCommon/commonItemTypes";
import ModImage from "../modSelector/ModImage";
import BungieImageButton from "components/bungieImage/BungieImageButton";
import ArmourSelector from "../armoutSelector/ArmourSelector";
import { ReactComponent as HelmetIcon } from "destiny-icons/armor_types/helmet.svg";
import { ReactComponent as ArmsIcon } from "destiny-icons/armor_types/gloves.svg";
import { ReactComponent as ChestIcon } from "destiny-icons/armor_types/chest.svg";
import { ReactComponent as LegsIcon } from "destiny-icons/armor_types/boots.svg";
import { ReactComponent as ClassIcon } from "destiny-icons/armor_types/class.svg";
import { LibraryArmour } from "components/itemLibrary/libraryTypes";

const ArmourFilter: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const armourFilter = useSelector((state: RootStore) => state.armourFilter);
    const armourMods = useSelector((state: RootStore) => state.library?.mods.armour);
    const armour = useSelector((state: RootStore) => state.library?.armour);
    const selectedCharacter = useSelector(
        (state: RootStore) =>
            state.app.selectedCharacter && state.characters?.[state.app.selectedCharacter]
    );

    const selectedClass = selectedCharacter && selectedCharacter.class.toLowerCase();

    const onModSelected = (mod: Mod): void => {
        dispatch(updateArmourMods(mod));
    };

    const getArmourItems = (type: string): LibraryArmour[] | null =>
        selectedClass && armour ? Object.values(armour[selectedClass][type]) : null;

    return (
        <div className={styles.armourFilter}>
            <div className={styles.statsFilter}>
                <div className={styles.sectionTitle}>{t("armourFilter.statsFilter")}</div>
                <div>
                    {ArmourStats.map(stat => (
                        <span className={styles.stat} key={stat}>
                            <label>
                                {t(`armourFilter.${stat}`)}{" "}
                                <input
                                    className={styles.statInput}
                                    type="text"
                                    name={stat}
                                    value={armourFilter.stats[stat] || ""}
                                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                        dispatch(
                                            saveStatFilter({
                                                stat,
                                                value: Number.parseInt(event.target.value)
                                            })
                                        );
                                    }}
                                />
                            </label>
                        </span>
                    ))}
                </div>
            </div>
            <div className={styles.modFilter}>
                <div className={styles.sectionTitle}>{t("armourFilter.requiredMods")}</div>
                <div className={styles.selectedMods}>
                    {armourFilter.mods.map(mod => (
                        <ModImage
                            key={mod.hash}
                            mod={mod}
                            onModClick={(): void => {
                                dispatch(updateArmourMods(mod));
                            }}
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
            <div className={styles.modFilter}>
                <div className={styles.sectionTitle}>{t("armourFilter.requiredArmour")}</div>
                <div className={styles.selectedMods}>
                    {armourFilter.armour.map(armour => (
                        <BungieImageButton
                            key={armour.hash}
                            url={armour.iconPath}
                            title={armour.name}
                            onClick={(): void => {
                                dispatch(updateRequiredArmour(armour));
                            }}
                        />
                    ))}
                </div>
                <ArmourSelector
                    defaultImage={<HelmetIcon />}
                    libraryArmours={getArmourItems("helmets")}
                />
                <ArmourSelector
                    defaultImage={<ArmsIcon />}
                    libraryArmours={getArmourItems("arms")}
                />
                <ArmourSelector
                    defaultImage={<ChestIcon />}
                    libraryArmours={getArmourItems("chest")}
                />
                <ArmourSelector
                    defaultImage={<LegsIcon />}
                    libraryArmours={getArmourItems("legs")}
                />
                <ArmourSelector
                    defaultImage={<ClassIcon />}
                    libraryArmours={getArmourItems("classItems")}
                />
            </div>
        </div>
    );
};

export default ArmourFilter;
