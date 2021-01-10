import React, { FC, useState, useRef, MutableRefObject } from 'react';
import _ from 'lodash';
import { useTranslation } from 'react-i18next';

import { Mod } from 'state/items/commonItemTypes';
import styles from './ModSelector.module.scss';
import BungieImageButton from 'components/bungieImage/BungieImageButton';
import ModImage from './ModImage';
import Modal from 'components/modal/Modal';
import Closeable from 'components/utils/Closeable';

interface Props {
  mods: Mod[];
  selectedMods: Mod[];
  title: string;
  energyMustMatch: boolean;
  maximumSelectable: number;
  onModSelected(mod: Mod): void;
  onModRemoved(mod: Mod): void;
}

const ModSelector: FC<Props> = ({
  mods,
  selectedMods,
  title,
  energyMustMatch,
  maximumSelectable,
  onModSelected,
  onModRemoved,
}) => {
  const [open, setOpen] = useState(false);
  const ref: MutableRefObject<HTMLDivElement | null> = useRef(null);
  const { t } = useTranslation();

  if (!mods.length) {
    return null;
  }

  const isModDisabled = (mod: Mod): boolean =>
    selectedMods.length >= maximumSelectable ||
    (energyMustMatch &&
      mod.energyType?.type !== 'Any' &&
      selectedMods.some(
        (selected) => selected.energyType?.type !== 'Any' && selected.energyType?.type !== mod.energyType?.type
      )) ||
    selectedMods.reduce((total, mod) => (mod.energyType?.cost || 0) + total, 0) > 10;

  const groupedMods = _.groupBy(mods, (mod) => (mod.collectibleHash ? 'equipable' : 'default'));
  const equipableMods = groupedMods.equipable;
  const defaultMod = (groupedMods.default?.length && groupedMods.default[0]) || equipableMods[0];

  const numberOfModColumns = 8;
  let modColumn = 0;
  let gridTemplateColumns = '';

  for (let i = 0; i < numberOfModColumns; i++) {
    gridTemplateColumns += '52px ';
  }

  return (
    <div ref={ref} className={styles.modSelector}>
      <div className={styles.button}>
        <BungieImageButton
          url={defaultMod.iconPath}
          title={t('armourFilter.clickToAddMod')}
          onClick={(): void => setOpen(!open)}
        />
      </div>
      <Modal open={open} title={title} onClose={() => setOpen(false)}>
        <div className={styles.modPanel} style={{ gridTemplateColumns }}>
          {equipableMods.map((mod) => (
            <div key={mod.hash} style={{ gridColumnStart: (modColumn++ % numberOfModColumns) + 1 }}>
              <Closeable
                disabled={!selectedMods.some((selected) => selected.hash === mod.hash)}
                position={{ right: 3, top: 3 }}
                onClose={() => onModRemoved(mod)}
              >
                <ModImage mod={mod} disabled={isModDisabled(mod)} onModClick={() => onModSelected(mod)} />
              </Closeable>
            </div>
          ))}
        </div>
        <div className={styles.divider} />
        <div className={styles.selected}>
          {selectedMods.map((mod, index) => (
            <Closeable key={index} position={{ right: 3, top: 3 }} onClose={() => onModRemoved(mod)}>
              <ModImage mod={mod} onModClick={() => onModRemoved(mod)} />
            </Closeable>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default ModSelector;
