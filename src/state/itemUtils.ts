import { Mod } from './items/commonItemTypes';

const energyOrder = {
  Any: 0,
  Void: 1,
  Arc: 2,
  Solar: 3,
} as const;

export const armourModCompare = (a: Mod, b: Mod): number => {
  if (!a.energyType) {
    return -1;
  }

  if (!b.energyType) {
    return 1;
  }

  if (a.energyType.type !== b.energyType.type) {
    return energyOrder[a.energyType.type] - energyOrder[b.energyType.type];
  }

  const aCost = a.energyType?.cost || 0;
  const bCost = b.energyType?.cost || 0;

  if (aCost !== bCost) {
    return aCost - bCost;
  }

  return a.name.localeCompare(b.name);
};
