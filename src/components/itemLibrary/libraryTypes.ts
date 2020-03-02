import { Stat, Damage, Stats, Mod } from "../itemCommon/commonItemTypes";

export interface LibraryItem {
    hash: number;
    name: string;
    iconPath: string;
    categories: number[];
    other?: any;
}

export interface LibraryWeapon extends LibraryItem {
    damage: Damage[];
    baseStats: Stats;
    perks?: Mod[][];
    mods?: Mod[];
    cosmetics?: Mod[];
    exotic: boolean;
}

export interface LibraryArmour extends LibraryItem {
    perks?: Mod[][];
    mods?: Mod[];
    cosmetics?: Mod[];
    exotic: boolean;
}

export interface LibraryGhostShell extends LibraryItem {
    perks?: Mod[][];
    mods?: Mod[];
}

export interface ArmourLibrary {
    helmets: Record<string, LibraryArmour>;
    arms: Record<string, LibraryArmour>;
    chest: Record<string, LibraryArmour>;
    legs: Record<string, LibraryArmour>;
    classItems: Record<string, LibraryArmour>;
}

export interface Library {
    weapons: {
        kinetic: Record<string, LibraryWeapon>;
        energy: Record<string, LibraryWeapon>;
        heavy: Record<string, LibraryWeapon>;
    };
    armour: {
        warlock: ArmourLibrary;
        hunter: ArmourLibrary;
        titan: ArmourLibrary;
    };
    ghosts: Record<string, LibraryItem>;
    other: Record<string, LibraryItem>;
}
