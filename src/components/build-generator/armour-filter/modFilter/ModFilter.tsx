import React, { FC } from 'react';
import { useTranslation } from 'react-i18next';

import ModImage from './ModImage';
import ModSelector from './ModSelector';
import styles from './ModFilter.module.scss';
import { LibraryArmourModState } from 'state/items/library/libraryTypes';
import { Mod } from 'state/items/commonItemTypes';
import { ModFilterState } from 'state/filter/filterReducer';
import Closeable from 'components/utils/Closeable';

interface Props {
  selectedMods: ModFilterState;
  armourMods: LibraryArmourModState;
  onModSelected(mod: Mod, plugCategoryHash: number): void;
  onModRemoved(mod: Mod, plugCategoryHash: number): void;
}

const ModFilter: FC<Props> = ({ selectedMods, armourMods, onModSelected, onModRemoved }) => {
  const { t } = useTranslation();
  return (
    <div className={styles.modFilter}>
      <div className={styles.title}>{t('armourFilter.requiredMods')}</div>
      <div className={styles.selected}>
        {Object.entries(selectedMods).map(([plugCategoryHash, selectedMods]) =>
          selectedMods?.map((mod, index) => (
            <Closeable
              key={`${plugCategoryHash}-${index}`}
              position={{ right: 3, top: 3 }}
              onClose={() => onModRemoved(mod, Number(plugCategoryHash))}
            >
              <ModImage mod={mod} onModClick={(): void => onModSelected(mod, Number(plugCategoryHash))} />
            </Closeable>
          ))
        )}
      </div>

      {Object.entries(armourMods).map(([plugCategoryHash, mods]) => (
        <ModSelector
          key={plugCategoryHash}
          mods={mods}
          selectedMods={selectedMods[Number(plugCategoryHash)] || []}
          energyMustMatch={false}
          maximumSelectable={5}
          title={mods[1]?.plugCategoryName}
          onModSelected={(mod) => onModSelected(mod, Number(plugCategoryHash))}
          onModRemoved={(mod) => onModRemoved(mod, Number(plugCategoryHash))}
        />
      ))}
    </div>
  );
};

export default ModFilter;
