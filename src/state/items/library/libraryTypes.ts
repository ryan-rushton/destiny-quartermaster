import { Damage, Stats, Mod, CharacterClass, ArmourSlot, ArmourType } from '../commonItemTypes';
import { Manifest } from 'state/manifest/manifestTypes';

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
    season: number;
}

export interface LibraryGhostShell extends LibraryItem {
    perks?: Mod[][];
    mods?: Mod[];
}

export type LibraryArmourModState = { [key in ArmourSlot | 'generic']: Mod[] };

export interface Library {
    weapons: {
        kinetic: Manifest<LibraryWeapon>;
        energy: Manifest<LibraryWeapon>;
        heavy: Manifest<LibraryWeapon>;
    };
    armour: {
        [key in CharacterClass]: {
            [key in ArmourSlot]: LibraryArmour[];
        };
    };
    ghosts: Manifest<LibraryItem>;
    mods: {
        armour: LibraryArmourModState;
        weapons: Mod[];
    };
}
