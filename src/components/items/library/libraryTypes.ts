import { Damage, Stats, Mod, CharacterClass, ArmourSlot, ArmourType } from "../commonItemTypes";

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
    type: ArmourType;
    baseStats: Stats;
    perks?: Mod[][];
    mods?: Mod[];
    cosmetics?: Mod[];
    exotic: boolean;
}

export interface LibraryGhostShell extends LibraryItem {
    perks?: Mod[][];
    mods?: Mod[];
}

export type LibraryArmourModState = { [key in ArmourSlot | "generic"]: Mod[] };

export interface Library {
    weapons: {
        kinetic: Record<string, LibraryWeapon>;
        energy: Record<string, LibraryWeapon>;
        heavy: Record<string, LibraryWeapon>;
    };
    armour: {
        [key in CharacterClass]: {
            [key in ArmourSlot]: Record<string, LibraryArmour>;
        };
    };
    ghosts: Record<string, LibraryItem>;
    mods: {
        armour: LibraryArmourModState;
        weapons: Mod[];
    };
}
