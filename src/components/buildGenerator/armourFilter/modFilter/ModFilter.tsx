import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import ModImage from './ModImage';
import ModSelector from './ModSelector';
import styles from './ModFilter.module.scss';
import { LibraryArmourModState } from 'state/items/library/libraryTypes';
import { Mod, ModSlot, ModSlots } from 'state/items/commonItemTypes';
import { ModFilterState } from 'state/filter/filterReducer';
import Closeable from 'components/utils/Closeable';

const translations: { [key in ModSlot]: string } = {
    general: 'armourFilter.generalMods',
    helmet: 'armourFilter.helmetMods',
    arms: 'armourFilter.gauntletMods',
    chest: 'armourFilter.chestMods',
    legs: 'armourFilter.bootMods',
    classItem: 'armourFilter.classItemMods',
    seasonal: 'armourFilter.seasonalMods',
};

interface Props {
    selectedMods: ModFilterState;
    armourMods: LibraryArmourModState;
    onModSelected(mod: Mod, slot: ModSlot): void;
    onModRemoved(mod: Mod, slot: ModSlot): void;
}

const ModFilter: FC<Props> = ({ selectedMods, armourMods, onModSelected, onModRemoved }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.modFilter}>
            <div className={styles.title}>{t('armourFilter.requiredMods')}</div>
            {ModSlots.map((slot) => (
                <div className={styles.selected} key={slot}>
                    {selectedMods[slot].map((mod, index) => (
                        <Closeable key={`${slot}-${index}`} onClose={() => onModRemoved(mod, slot)}>
                            <ModImage mod={mod} onModClick={(): void => onModSelected(mod, slot)} />
                        </Closeable>
                    ))}
                </div>
            ))}
            {ModSlots.map((slot) => (
                <ModSelector
                    key={slot}
                    mods={armourMods[slot]}
                    title={t(translations[slot])}
                    onModSelected={(mod) => onModSelected(mod, slot)}
                    onModRemoved={(mod) => onModRemoved(mod, slot)}
                />
            ))}
        </div>
    );
};

export default ModFilter;
