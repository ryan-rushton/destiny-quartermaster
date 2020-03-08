import { Stat, Damage, Stats, Mod, Class, ArmourSlot } from "../itemCommon/commonItemTypes";

export interface InventoryItem {
    hash: number;
    name: string;
    iconPath: string;
    primaryStat?: Stat;
    categories: number[];
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
        kinetic: Record<string, Weapon>;
        energy: Record<string, Weapon>;
        heavy: Record<string, Weapon>;
    };
    armour: {
        [key in Class]: {
            [key in ArmourSlot]: Record<string, Armour>;
        };
    };
    ghosts: Record<string, InventoryItem>;
    other: Record<string, InventoryItem>;
}
