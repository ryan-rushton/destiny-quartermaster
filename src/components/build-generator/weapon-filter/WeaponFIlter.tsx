import React, { FC } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'rootReducer';
import { isDefined } from 'util/filters';
import WeaponSelector from './weaponSelector/WeaponSelector';

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
