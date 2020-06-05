import React, { FC, useState, ReactNode, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { LibraryArmour } from 'state/items/library/libraryTypes';
import BungieImageButton from 'components/bungieImage/BungieImageButton';
import DestinyIconImageButton from 'components/bungieImage/DestinyIconImageButton';
import styles from './ArmourSelector.module.scss';
import useClickOutside from 'hooks/useClickOutside';
import { CharacterClass } from 'state/items/commonItemTypes';
import Modal from 'components/modal/Modal';
import { updateRequiredArmour } from 'state/filter/filterReducer';

interface Props {
    libraryArmours: LibraryArmour[];
    defaultImage: ReactNode;
    selectedClass: CharacterClass;
    title: string;
    selectedArmour: LibraryArmour | null;
}

const ArmourSelector: FC<Props> = ({
    libraryArmours,
    defaultImage,
    selectedClass,
    title,
    selectedArmour,
}) => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const ref = useRef(null);

    useClickOutside(ref, () => setOpen(false));

    const numberOfArmourColumns = 8;
    let armourColumn = 0;
    let gridTemplateColumns = '';

    for (let i = 0; i < numberOfArmourColumns; i++) {
        gridTemplateColumns += '54px ';
    }

    const buttonTitle = libraryArmours
        ? t('armourFilter.selectRequiredArmour')
        : t('armourFilter.selectCharacter');

    const getOnArmourClick = (armour: LibraryArmour) => (): void => {
        if (selectedClass) {
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
                <BungieImageButton
                    url={selectedArmour.iconPath}
                    title={selectedArmour.name}
                    onClick={getOnArmourClick(selectedArmour)}
                />
            )}
            <Modal
                open={Boolean(open && libraryArmours)}
                title={title}
                onClose={() => setOpen(false)}
            >
                <div className={styles.armourPanel} style={{ gridTemplateColumns }}>
                    {libraryArmours.map((armour) => (
                        <div
                            key={armour.hash}
                            className={styles.item}
                            style={{
                                gridColumnStart: (armourColumn++ % numberOfArmourColumns) + 1,
                            }}
                        >
                            <BungieImageButton
                                url={armour.iconPath}
                                title={armour.name}
                                onClick={getOnArmourClick(armour)}
                            />
                        </div>
                    ))}
                </div>
            </Modal>
        </div>
    );
};

export default ArmourSelector;
