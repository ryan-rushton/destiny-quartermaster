const getHashesFromEnum = (anEnum: object): number[] => {
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
    Shaders = 41,
    Subclass = 50,
    Ornaments = 56
}

export enum WeaponModCategories {
    WeaponMods = 610365472,
    Ornaments = 3124752623
}

export enum ArmourModCategories {
    ArmourMods = 4104513227,
    Helmets = 1362265421,
    Arms = 3872696960,
    Chest = 3723676689,
    Legs = 3607371986,
    ClassItems = 3196106184
}

export enum GhostModCategories {
    GhostMods = 1449602859
}

export enum GhostShellSocketCategories {
    Perks = 3301318876,
    Mods = 3379164649
}

export const GeneralItemCategoryHashes = getHashesFromEnum(GeneralItemCategories);

export type CharacterClass = "warlock" | "hunter" | "titan";
export type ArmourSlot = "helmets" | "arms" | "chest" | "legs" | "classItems";
export type ArmourType = "helmet" | "arms" | "chest" | "legs" | "classItem";

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

export interface EnergyCost {
    name: string;
    iconPath: string;
    description: string;
    cost: number;
}

export interface Mod {
    name: string;
    iconPath: string;
    enabled: boolean;
    description: string;
    hash: number;
    categories: number[];
    stats: Stats;
    collectibleHash?: number;
    energyType?: EnergyCost;
}
