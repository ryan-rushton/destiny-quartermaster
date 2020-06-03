import React, { FC, ChangeEvent } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ArmourStats } from './armourFilterTypes';
import styles from './ArmourFilter.module.scss';
import { saveStatFilter, addArmourMod } from './armourFilterReducer';
import { RootState } from 'rootReducer';
import { Mod, ArmourSlot } from 'state/items/commonItemTypes';
import ArmourSelector from './armoutSelector/ArmourSelector';
import { ReactComponent as HelmetIcon } from 'destiny-icons/armor_types/helmet.svg';
import { ReactComponent as ArmsIcon } from 'destiny-icons/armor_types/gloves.svg';
import { ReactComponent as ChestIcon } from 'destiny-icons/armor_types/chest.svg';
import { ReactComponent as LegsIcon } from 'destiny-icons/armor_types/boots.svg';
import { ReactComponent as ClassIcon } from 'destiny-icons/armor_types/class.svg';
import { LibraryArmour } from 'state/items/library/libraryTypes';
import ModFilter from './modFilter/ModFilter';

const ArmourFilter: FC = () => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const armourFilter = useSelector((state: RootState) => state.armourFilter);
    const armourMods = useSelector((state: RootState) => state.library?.mods.armour);
    const armour = useSelector((state: RootState) => state.library?.armour);
    const selectedCharacter = useSelector(
        (state: RootState) =>
            state.characters.selected && state.characters.characters?.[state.characters.selected]
    );

    const selectedClass = (selectedCharacter && selectedCharacter.classType) || null;

    if (!selectedClass) {
        return null;
    }

    const onModSelected = (mod: Mod): void => {
        dispatch(addArmourMod(mod));
    };

    const getArmourItems = (type: ArmourSlot): LibraryArmour[] =>
        (selectedClass && armour?.[selectedClass][type]) || [];

    return (
        <div className={styles.armourFilter}>
            <div className={styles.statsFilter}>
                <div className={styles.sectionTitle}>{t('armourFilter.statsFilter')}</div>
                <div>
                    {ArmourStats.map((stat) => (
                        <span className={styles.stat} key={stat}>
                            <label>
                                {t(`armourFilter.${stat}`)}{' '}
                                <input
                                    className={styles.statInput}
                                    type="text"
                                    name={stat}
                                    value={armourFilter.stats[stat] || ''}
                                    onChange={(event: ChangeEvent<HTMLInputElement>): void => {
                                        dispatch(
                                            saveStatFilter({
                                                stat,
                                                value: Number.parseInt(event.target.value),
                                            })
                                        );
                                    }}
                                />
                            </label>
                        </span>
                    ))}
                </div>
            </div>
            {armourMods && (
                <ModFilter
                    selectedMods={armourFilter.mods}
                    armourMods={armourMods}
                    onModSelected={onModSelected}
                />
            )}
            <div className={styles.modFilter}>
                <div className={styles.sectionTitle}>{t('armourFilter.requiredArmour')}</div>
                <ArmourSelector
                    defaultImage={<HelmetIcon />}
                    libraryArmours={getArmourItems('helmets')}
                    title={t('armourFilter.helmets')}
                    selectedClass={selectedClass}
                    selectedArmour={selectedClass && armourFilter.armour[selectedClass].helmet}
                />
                <ArmourSelector
                    defaultImage={<ArmsIcon />}
                    libraryArmours={getArmourItems('arms')}
                    title={t('armourFilter.gauntlets')}
                    selectedClass={selectedClass}
                    selectedArmour={selectedClass && armourFilter.armour[selectedClass].arms}
                />
                <ArmourSelector
                    defaultImage={<ChestIcon />}
                    libraryArmours={getArmourItems('chest')}
                    title={t('armourFilter.chest')}
                    selectedClass={selectedClass}
                    selectedArmour={selectedClass && armourFilter.armour[selectedClass].chest}
                />
                <ArmourSelector
                    defaultImage={<LegsIcon />}
                    libraryArmours={getArmourItems('legs')}
                    title={t('armourFilter.boots')}
                    selectedClass={selectedClass}
                    selectedArmour={selectedClass && armourFilter.armour[selectedClass].legs}
                />
                <ArmourSelector
                    defaultImage={<ClassIcon />}
                    libraryArmours={getArmourItems('classItems')}
                    title={t('armourFilter.classItems')}
                    selectedClass={selectedClass}
                    selectedArmour={selectedClass && armourFilter.armour[selectedClass].classItem}
                />
            </div>
        </div>
    );
};

export default ArmourFilter;
