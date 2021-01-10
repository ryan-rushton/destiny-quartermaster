import React, { FC } from 'react';

import { LibraryWeapon } from 'state/items/library/libraryTypes';

interface Props {
  items: LibraryWeapon[];
}

const WeaponSelector: FC<Props> = ({ items }) => {
  return <div />;
};

export default WeaponSelector;
