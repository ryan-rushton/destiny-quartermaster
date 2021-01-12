import React, { FC, ChangeEvent, ReactNode } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { ArmourStats } from '../../../state/filter/filterTypes';
import styles from './ArmourFilter.module.scss';
import { saveStatFilter, addArmourMod, removeArmourMod } from '../../../state/filter/filterReducer';
import { RootState } from 'rootReducer';
import { Mod, ArmourSlot, ArmourSlots } from 'state/items/commonItemTypes';
import ArmourSelector from './armourSelector/ArmourSelector';
import { ReactComponent as HelmetIcon } from 'submodules/destiny-icons/armor_types/helmet.svg';
import { ReactComponent as ArmsIcon } from 'submodules/destiny-icons/armor_types/gloves.svg';
import { ReactComponent as ChestIcon } from 'submodules/destiny-icons/armor_types/chest.svg';
import { ReactComponent as LegsIcon } from 'submodules/destiny-icons/armor_types/boots.svg';
import { ReactComponent as ClassIcon } from 'submodules/destiny-icons/armor_types/class.svg';
import { LibraryArmour } from 'state/items/library/libraryTypes';
import ModFilter from './modFilter/ModFilter';

const translations: { [key in ArmourSlot]: string } = {
  helmet: 'armourFilter.helmets',
  arms: 'armourFilter.gauntlets',
  chest: 'armourFilter.chest',
  legs: 'armourFilter.boots',
  classItem: 'armourFilter.classItems',
};

const slotIcons: { [key in ArmourSlot]: ReactNode } = {
  helmet: <HelmetIcon />,
  arms: <ArmsIcon />,
  chest: <ChestIcon />,
  legs: <LegsIcon />,
  classItem: <ClassIcon />,
};

const ArmourFilter: FC = () => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const armourFilter = useSelector((state: RootState) => state.filter);
  const armourMods = useSelector((state: RootState) => state.library?.mods.armour);
  const armour = useSelector((state: RootState) => state.library?.armour);
  const selectedCharacter = useSelector(
    (state: RootState) => state.characters.selected && state.characters.characters?.[state.characters.selected]
  );

  const selectedClass = (selectedCharacter && selectedCharacter.classType) || null;

  if (!selectedClass) {
    return null;
  }

  const addMod = (mod: Mod, plugCategoryHash: number): void => {
    dispatch(addArmourMod({ mod, plugCategoryHash }));
  };

  const removeMod = (mod: Mod, plugCategoryHash: number): void => {
    dispatch(removeArmourMod({ mod, plugCategoryHash }));
  };

  const getArmourItems = (type: ArmourSlot): LibraryArmour[] => (selectedClass && armour?.[selectedClass][type]) || [];

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
                  value={armourFilter.stats[stat] || undefined}
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
          onModSelected={addMod}
          onModRemoved={removeMod}
        />
      )}
      <div className={styles.modFilter}>
        <div className={styles.sectionTitle}>{t('armourFilter.requiredArmour')}</div>
        {ArmourSlots.map((slot) => (
          <ArmourSelector
            key={slot}
            defaultImage={slotIcons[slot]}
            libraryArmours={getArmourItems(slot)}
            title={t(translations[slot])}
            selectedClass={selectedClass}
            selectedArmour={armourFilter.armour[selectedClass][slot]}
            canSelectExotic={Object.values(armourFilter.armour[selectedClass]).every(
              (item) => !item?.exotic || item.type === slot
            )}
          />
        ))}
      </div>
    </div>
  );
};

export default ArmourFilter;
