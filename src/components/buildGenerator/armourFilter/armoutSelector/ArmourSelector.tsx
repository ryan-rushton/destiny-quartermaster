import React, { FC, useState, ReactNode, useRef } from 'react';
import { useDispatch } from 'react-redux';
import { useTranslation } from 'react-i18next';

import { LibraryArmour } from 'state/items/library/libraryTypes';
import BungieImageButton from 'components/bungieImage/BungieImageButton';
import { updateRequiredArmour } from '../armourFilterReducer';
import DestinyIconImageButton from 'components/bungieImage/DestinyIconImageButton';
import styles from './ArmourSelector.module.scss';
import useClickOutside from 'hooks/useClickOutside';
import { preloadImages } from 'util/imageUtils';
import { CharacterClass } from 'state/items/commonItemTypes';

interface Props {
    libraryArmours: LibraryArmour[] | null;
    defaultImage: ReactNode;
    selectedClass: CharacterClass | null;
    selectedArmour: LibraryArmour | null;
}

const ArmourSelector: FC<Props> = ({
    libraryArmours,
    defaultImage,
    selectedClass,
    selectedArmour
}) => {
    const [open, setOpen] = useState(false);
    const { t } = useTranslation();
    const dispatch = useDispatch();
    const ref = useRef(null);

    useClickOutside(ref, () => setOpen(false));

    if (libraryArmours) {
        preloadImages(libraryArmours);
    }

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
                    characterClass: selectedClass
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
                            setOpen(!open);
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
            {open && libraryArmours && (
                <div className={styles.armourPanel} style={{ gridTemplateColumns }}>
                    {libraryArmours.map(armour => (
                        <div
                            key={armour.hash}
                            className={styles.item}
                            style={{
                                gridColumnStart: (armourColumn++ % numberOfArmourColumns) + 1
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
            )}
        </div>
    );
};

export default ArmourSelector;
