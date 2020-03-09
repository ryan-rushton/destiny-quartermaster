import React, { FC, ChangeEvent } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useTranslation } from "react-i18next";

import { ArmourStats } from "./armourFilterTypes";
import styles from "./ArmourFilter.module.scss";
import { saveStatFilter, updateArmourMods } from "./armourFilterReducer";
import { RootStore } from "rootReducer";
import ModSelector from "../modSelector/ModSelector";
import { Mod } from "components/itemCommon/commonItemTypes";
import BungieImage from "components/bungieImage/BungieImage";

const ArmourFilter: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const armourFilter = useSelector((state: RootStore) => state.armourFilter);
    const armourMods = useSelector((state: RootStore) => state.library?.mods.armour);

    const onModSelected = (mod: Mod): void => {
        dispatch(updateArmourMods(mod));
    };

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
                        <BungieImage
                            key={mod.hash}
                            url={mod.iconPath}
                            title={mod.name}
                            onClick={(): void => {
                                dispatch(updateArmourMods(mod));
                            }}
                        />
                    ))}
                </div>
                {armourMods && (
                    <>
                        <ModSelector
                            mods={Object.values(armourMods.helmets)}
                            onModSelected={onModSelected}
                        />
                        <ModSelector
                            mods={Object.values(armourMods.arms)}
                            onModSelected={onModSelected}
                        />
                        <ModSelector
                            mods={Object.values(armourMods.chest)}
                            onModSelected={onModSelected}
                        />
                        <ModSelector
                            mods={Object.values(armourMods.legs)}
                            onModSelected={onModSelected}
                        />
                        <ModSelector
                            mods={Object.values(armourMods.classItems)}
                            onModSelected={onModSelected}
                        />
                        <ModSelector
                            mods={Object.values(armourMods.generic)}
                            onModSelected={onModSelected}
                        />
                    </>
                )}
            </div>
        </div>
    );
};

export default ArmourFilter;
