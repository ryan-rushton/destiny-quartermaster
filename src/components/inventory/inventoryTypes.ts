const getHashesFromEnum = (anEnum: any): number[] => {
    const hashes: number[] = [];
    for (const val of Object.values(anEnum)) {
        if (typeof val === "number") {
            hashes.push(val);
        }
    }

    return hashes;
};

/* Not doing Mods for now but it needs to be done
 */

export enum WeaponItemCategories {
    Weapons = 1,
    KineticWeapons = 2,
    EnergyWeapons = 3,
    PowerWeapons = 4,
    AutoRifles = 5,
    HandCannons = 6,
    PulseRifles = 7,
    ScoutRifles = 8,
    FusionRifles = 9,
    SniperRifles = 10,
    Shotguns = 11,
    MachineGuns = 12,
    RocketLaunchers = 13,
    Sidearms = 14,
    Swords = 54,
    TraceRifle = 2489664120,
    GrenadeLaunchers = 153950757,
    SubmachineGuns = 3954685534,
    LinearFusionRifles = 1504945536
}

export const WeaponItemCategoryHashes = getHashesFromEnum(WeaponItemCategories);

export enum WeaponSocketCategories {
    Perks = 4241085061,
    Mods = 2685412949,
    Cosmetics = 2048875504
}

export enum ArmourItemCategories {
    Armour = 20,
    WarlockArmour = 21,
    TitanArmour = 22,
    HunterArmour = 23,
    Helmets = 45,
    Arms = 46,
    Chest = 47,
    Legs = 48,
    ClassItems = 49,
    Masks = 55
}

export const ArmourItemCategoryHashes = getHashesFromEnum(ArmourItemCategories);

export enum ArmourSocketCategories {
    Tier = 760375309,
    Perks = 2518356196,
    Mods = 590099826,
    Cosmetics = 1926152773
}

export enum GeneralItemCategories {
    Exotic = 31,
    Ghosts = 39,
    Subclass = 50
}

export enum GhostShellSocketCategories {
    Perks = 3301318876,
    Mods = 3379164649
}

export const GeneralItemCategoryHashes = getHashesFromEnum(GeneralItemCategories);

export interface Damage {
    hash: number;
    iconPath: string;
    name: string;
}

export interface Stat {
    statHash: number;
    name: string;
    value: number;
}

export interface Stats {
    [key: string]: Stat;
}

export interface Mod {
    name: string;
    iconPath: string;
    enabled: boolean;
    description: string;
    hash: number;
    categories: number[];
    stats: Stats;
}

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
        warlock: Record<string, Armour>;
        hunter: Record<string, Armour>;
        titan: Record<string, Armour>;
    };
    ghosts: Record<string, InventoryItem>;
    other: Record<string, InventoryItem>;
}
