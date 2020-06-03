import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import ModImage from './ModImage';
import ModSelector from './ModSelector';
import styles from './ModFilter.module.scss';
import { LibraryArmourModState } from 'state/items/library/libraryTypes';
import { Mod } from 'state/items/commonItemTypes';

interface Props {
    selectedMods: Mod[];
    armourMods: LibraryArmourModState;
    onModSelected(mod: Mod): void;
}

const ModFilter: FC<Props> = ({ selectedMods, armourMods, onModSelected }) => {
    const { t } = useTranslation();
    return (
        <div className={styles.modFilter}>
            <div className={styles.title}>{t('armourFilter.requiredMods')}</div>
            <div className={styles.selected}>
                {selectedMods.map((mod) => (
                    <ModImage
                        key={mod.hash}
                        mod={mod}
                        onModClick={(): void => onModSelected(mod)}
                    />
                ))}
            </div>
            {armourMods && (
                <>
                    <ModSelector
                        mods={armourMods.general}
                        title={t('armourFilter.generalMods')}
                        onModSelected={onModSelected}
                    />
                    <ModSelector
                        mods={armourMods.helmets}
                        title={t('armourFilter.helmetMods')}
                        onModSelected={onModSelected}
                    />
                    <ModSelector
                        mods={armourMods.arms}
                        title={t('armourFilter.gauntletMods')}
                        onModSelected={onModSelected}
                    />
                    <ModSelector
                        mods={armourMods.chest}
                        title={t('armourFilter.chestMods')}
                        onModSelected={onModSelected}
                    />
                    <ModSelector
                        mods={armourMods.legs}
                        title={t('armourFilter.bootMods')}
                        onModSelected={onModSelected}
                    />
                    <ModSelector
                        mods={armourMods.classItems}
                        title={t('armourFilter.classItemMods')}
                        onModSelected={onModSelected}
                    />
                    <ModSelector
                        mods={armourMods.seasonal}
                        title={t('armourFilter.seasonalMods')}
                        onModSelected={onModSelected}
                    />
                </>
            )}
        </div>
    );
};

export default ModFilter;
