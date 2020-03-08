import { Damage, Stats, Mod, Class, ArmourSlot } from "../itemCommon/commonItemTypes";

export interface LibraryItem {
    hash: number;
    name: string;
    iconPath: string;
    categories: number[];
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

export interface Library {
    weapons: {
        kinetic: Record<string, LibraryWeapon>;
        energy: Record<string, LibraryWeapon>;
        heavy: Record<string, LibraryWeapon>;
    };
    armour: {
        [key in Class]: {
            [key in ArmourSlot]: Record<string, LibraryArmour>;
        };
    };
    ghosts: Record<string, LibraryItem>;
    mods: {
        armour: {
            [key in ArmourSlot]: Record<string, Mod>;
        };
        weapons: Record<string, Mod>;
    };
}
