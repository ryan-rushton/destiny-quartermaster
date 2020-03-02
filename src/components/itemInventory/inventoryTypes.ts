import { Stat, Damage, Stats, Mod } from "../itemCommon/commonItemTypes";

export interface InventoryItem {
    hash: number;
    name: string;
    iconPath: string;
    primaryStat?: Stat;
    categories: number[];
    other?: any;
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

export interface ArmourInventory {
    helmets: Record<string, Armour>;
    arms: Record<string, Armour>;
    chest: Record<string, Armour>;
    legs: Record<string, Armour>;
    classItems: Record<string, Armour>;
}

export interface Inventory {
    weapons: {
        kinetic: Record<string, Weapon>;
        energy: Record<string, Weapon>;
        heavy: Record<string, Weapon>;
    };
    armour: {
        warlock: ArmourInventory;
        hunter: ArmourInventory;
        titan: ArmourInventory;
    };
    ghosts: Record<string, InventoryItem>;
    other: Record<string, InventoryItem>;
}
