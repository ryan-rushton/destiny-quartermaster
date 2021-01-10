import React, { FC } from 'react';
import { useSelector } from 'react-redux';

import { RootState } from 'rootReducer';
import WeaponSelector from './weaponSelector/WeaponSelector';
import { isDefined } from 'util/filters';

const WeaponFilter: FC = () => {
  const weapons = useSelector((state: RootState) => state.library?.weapons);
  return (
    <div>
      {weapons &&
        Object.entries(weapons).map(([slot, items]) => (
          <WeaponSelector key={slot} items={Object.values(items).filter(isDefined)} />
        ))}
    </div>
  );
};

export default WeaponFilter;
