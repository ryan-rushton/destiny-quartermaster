import React, { FC, useState, ReactNode, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import { LibraryArmour } from 'state/items/library/libraryTypes';
import BungieImageButton from 'components/bungieImage/BungieImageButton';
import DestinyIconImageButton from 'components/bungieImage/DestinyIconImageButton';
import styles from './ArmourSelector.module.scss';
import { CharacterClass } from 'state/items/commonItemTypes';
import Modal from 'components/modal/Modal';
import { updateRequiredArmour } from 'state/filter/filterReducer';
import Closeable from 'components/utils/Closeable';

interface Props {
  libraryArmours: LibraryArmour[];
  defaultImage: ReactNode;
  selectedClass: CharacterClass;
  title: string;
  selectedArmour: LibraryArmour | null;
  canSelectExotic: boolean;
}

const ArmourSelector: FC<Props> = ({
  libraryArmours,
  defaultImage,
  selectedClass,
  title,
  selectedArmour,
  canSelectExotic,
}) => {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const ref = useRef(null);

  const numberOfArmourColumns = 8;
  let armourColumn = 0;
  let gridTemplateColumns = '';

  for (let i = 0; i < numberOfArmourColumns; i++) {
    gridTemplateColumns += '58px ';
  }

  const buttonTitle = libraryArmours ? t('armourFilter.selectRequiredArmour') : t('armourFilter.selectCharacter');

  const isDisabled = (armour: LibraryArmour): boolean => {
    if (armour.exotic && !canSelectExotic) {
      return true;
    }

    return false;
  };

  const getOnArmourClick = (armour: LibraryArmour) => (): void => {
    if (selectedClass && !isDisabled(armour)) {
      dispatch(
        updateRequiredArmour({
          armour,
          characterClass: selectedClass,
        })
      );
    }
  };

  return (
    <div ref={ref} className={styles.armourSelector}>
      {!selectedArmour && (
        <DestinyIconImageButton
          url={defaultImage}
          disabled={!libraryArmours}
          title={buttonTitle}
          onClick={(): void => {
            if (libraryArmours) {
              setOpen(true);
            }
          }}
        />
      )}
      {selectedArmour && (
        <Closeable closeBackground onClose={getOnArmourClick(selectedArmour)}>
          <BungieImageButton
            url={selectedArmour.iconPath}
            title={selectedArmour.name}
            className={styles.selectedArmour}
            onClick={(): void => {
              if (libraryArmours) {
                setOpen(true);
              }
            }}
          />
        </Closeable>
      )}
      <Modal open={Boolean(open && libraryArmours)} title={title} onClose={() => setOpen(false)}>
        <div className={styles.armourPanel} style={{ gridTemplateColumns }}>
          {libraryArmours.map((armour) => (
            <div
              key={armour.hash}
              className={styles.item}
              style={{
                gridColumnStart: (armourColumn++ % numberOfArmourColumns) + 1,
              }}
            >
              <Closeable
                disabled={selectedArmour?.hash !== armour.hash}
                closeBackground
                onClose={getOnArmourClick(armour)}
              >
                <BungieImageButton
                  url={armour.iconPath}
                  title={armour.name}
                  className={clsx(isDisabled(armour) && styles.disabled)}
                  onClick={getOnArmourClick(armour)}
                />
              </Closeable>
            </div>
          ))}
        </div>
      </Modal>
    </div>
  );
};

export default ArmourSelector;
