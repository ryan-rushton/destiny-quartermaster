import { Stat, Damage, Stats, Mod, ArmourSlot, CharacterClass } from '../commonItemTypes';
import { Manifest } from 'state/manifest/manifestTypes';

export interface InventoryItem {
  hash: number;
  name: string;
  iconPath: string;
  primaryStat?: Stat;
  categories?: number[];
}

export interface Weapon extends InventoryItem {
  damage: Damage[];
  stats: Stats;
  baseStats: Stats;
  perks: Mod[][];
  mods: Mod[];
  cosmetics: Mod[];
  exotic: boolean;
}

export interface Armour extends InventoryItem {
  tier: Mod[];
  stats: Stats;
  baseStats: Stats;
  perks: Mod[][];
  mods: Mod[];
  cosmetics: Mod[];
  exotic: boolean;
}

export interface GhostShell extends InventoryItem {
  perks: Mod[][];
  mods: Mod[];
}

export interface Inventory {
  weapons: {
    kinetic: Manifest<Weapon>;
    energy: Manifest<Weapon>;
    heavy: Manifest<Weapon>;
  };
  armour: {
    [key in CharacterClass]: {
      [key in ArmourSlot]: Manifest<Armour>;
    };
  };
  ghosts: Manifest<InventoryItem>;
  other: Manifest<InventoryItem>;
}
