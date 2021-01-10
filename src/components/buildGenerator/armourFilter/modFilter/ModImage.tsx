import React, { FC } from 'react';
import clsx from 'clsx';

import { Mod } from 'state/items/commonItemTypes';
import BungieImage from 'components/bungieImage/BungieImage';
import useClickAndEnterKeyDown from 'hooks/useClickAndEnterKeyDown';
import styles from './ModImage.module.scss';

interface Props {
  mod: Mod;
  disabled?: boolean;
  onModClick?(): void;
}

const createTitle = (mod: Mod): string => {
  if (mod.name && mod.description) {
    return `${mod.name}\n\n${mod.description}`;
  }

  return mod.name;
};
const ModImage: FC<Props> = ({ mod, disabled, onModClick }) => {
  const [onClick, onEnter] = useClickAndEnterKeyDown(() => {
    if (!disabled && onModClick) {
      onModClick();
    }
  });

  return (
    <div className={styles.wrapper} role="button" onClick={onClick} onKeyPress={onEnter} tabIndex={0}>
      <BungieImage className={clsx(styles.mod, disabled && styles.disabled)} url={mod.iconPath} title={mod.name} />
      {mod.energyType && (
        <BungieImage className={styles.energy} url={mod.energyType.iconPath} title={createTitle(mod)} />
      )}
    </div>
  );
};

export default ModImage;
