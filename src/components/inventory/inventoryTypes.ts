import { DestinyItemComponent } from "bungie-api-ts/destiny2";

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

export enum GeneralItemCategories {
    Exotic = 31,
    Ghosts = 39
}

export const GeneralItemCategoryHashes = getHashesFromEnum(GeneralItemCategories);

export interface InventoryItem {
    hash: number;
    categories: number[];
    bungieItem: DestinyItemComponent;
    itemManifest: Record<string, any>;
}
