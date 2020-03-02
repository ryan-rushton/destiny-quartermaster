import _ from "lodash";
import {
    DestinyInventoryItemDefinition,
    DestinyStatDefinition,
    DestinyDamageTypeDefinition,
    DestinyItemSocketBlockDefinition,
    DestinyPlugSetDefinition
} from "bungie-api-ts/destiny2";

import {
    WeaponItemCategories,
    ArmourItemCategories,
    GeneralItemCategories,
    WeaponSocketCategories,
    Mod
} from "../itemCommon/commonItemTypes";
import { Library, LibraryItem } from "./libraryTypes";
import { mapDamageTypes, mapInventoryStats, mapMod } from "../itemCommon/commonItemMappers";

class LibraryMapper {
    itemsManifest: Record<string, DestinyInventoryItemDefinition>;
    statsManifest: Record<string, DestinyStatDefinition>;
    damageTypeManifests: Record<string, DestinyDamageTypeDefinition>;
    plugSetsManifest: Record<string, DestinyPlugSetDefinition>;

    constructor(itemsManifest, statsManifest, damageTypeManifests, plugSetsManifest) {
        this.itemsManifest = itemsManifest || {};
        this.statsManifest = statsManifest || {};
        this.damageTypeManifests = damageTypeManifests || {};
        this.plugSetsManifest = plugSetsManifest || {};
    }

    mapBaseItem(manifestEntry: DestinyInventoryItemDefinition): LibraryItem {
        return {
            hash: manifestEntry.hash,
            name: manifestEntry.displayProperties.name,
            iconPath: manifestEntry.displayProperties.icon,
            categories: manifestEntry.itemCategoryHashes
        };
    }

    mapWeaponSockets(
        socketBlock?: DestinyItemSocketBlockDefinition
    ): { perks: Mod[][]; mods: Mod[]; cosmetics: Mod[] } {
        const mods: Mod[] = [];
        const perks: Mod[][] = [];
        const cosmetics: Mod[] = [];

        const categoriesByHash = _.keyBy(
            socketBlock?.socketCategories,
            def => def.socketCategoryHash
        );
        const { Perks, Mods, Cosmetics } = WeaponSocketCategories;

        if (socketBlock?.socketEntries) {
            let index = 0;
            for (const socket of socketBlock.socketEntries) {
                const plug =
                    socket.singleInitialItemHash &&
                    this.itemsManifest[socket.singleInitialItemHash];

                const plugSet =
                    socket.randomizedPlugSetHash &&
                    this.plugSetsManifest[socket.randomizedPlugSetHash] &&
                    this.plugSetsManifest[socket.randomizedPlugSetHash].reusablePlugItems;

                if (plugSet) {
                    const modSet: Mod[] = [];

                    for (const randomisedPlugDef of plugSet) {
                        const plugDef = this.itemsManifest[randomisedPlugDef.plugItemHash];

                        if (plugDef) {
                            modSet.push(mapMod(this.statsManifest, plugDef, false));
                        }
                    }
                    if (modSet.length) {
                        if (categoriesByHash[Perks]?.socketIndexes.includes(index)) {
                            perks.push(modSet);
                        } else {
                            console.log("Mod set didn't map to perks");
                        }
                    }
                } else if (plug) {
                    const mod = mapMod(this.statsManifest, plug, false);
                    if (categoriesByHash[Perks]?.socketIndexes.includes(index)) {
                        perks.push([mod]);
                    } else if (categoriesByHash[Cosmetics]?.socketIndexes.includes(index)) {
                        cosmetics.push(mod);
                    } else if (categoriesByHash[Mods]?.socketIndexes.includes(index)) {
                        mods.push(mod);
                    }
                }

                index++;
            }
        }

        return { perks, mods, cosmetics };
    }

    map = (): Library => {
        const timerLabel = "Mapping Library";
        console.time(timerLabel);

        const library: Library = {
            weapons: {
                kinetic: {},
                energy: {},
                heavy: {}
            },
            armour: {
                warlock: {
                    helmets: {},
                    arms: {},
                    chest: {},
                    legs: {},
                    classItems: {}
                },
                hunter: {
                    helmets: {},
                    arms: {},
                    chest: {},
                    legs: {},
                    classItems: {}
                },
                titan: {
                    helmets: {},
                    arms: {},
                    chest: {},
                    legs: {},
                    classItems: {}
                }
            },
            ghosts: {},
            other: {}
        };

        for (const manifestEntry of Object.values(this.itemsManifest)) {
            const categories = manifestEntry.itemCategoryHashes;
            const baseItem = this.mapBaseItem(manifestEntry);

            if (categories.includes(WeaponItemCategories.Weapons)) {
                const weapon = {
                    ...baseItem,
                    damage: mapDamageTypes(
                        this.damageTypeManifests,
                        manifestEntry.damageTypeHashes
                    ),
                    baseStats: mapInventoryStats(this.statsManifest, manifestEntry.investmentStats),
                    exotic: manifestEntry.equippingBlock.uniqueLabel === "exotic_weapon",
                    ...this.mapWeaponSockets(manifestEntry.sockets)
                };

                if (categories.includes(WeaponItemCategories.KineticWeapons)) {
                    library.weapons.kinetic[manifestEntry.hash] = weapon;
                } else if (categories.includes(WeaponItemCategories.EnergyWeapons)) {
                    library.weapons.energy[manifestEntry.hash] = weapon;
                } else if (categories.includes(WeaponItemCategories.PowerWeapons)) {
                    library.weapons.heavy[manifestEntry.hash] = weapon;
                }
            } else if (
                categories.includes(ArmourItemCategories.Armour) &&
                !categories.includes(GeneralItemCategories.Subclass)
            ) {
                const armour = {
                    ...baseItem,
                    baseStats: mapInventoryStats(this.statsManifest, manifestEntry.investmentStats),
                    exotic: manifestEntry.equippingBlock.uniqueLabel === "exotic_armor"
                };

                let armourSlot;

                if (categories.includes(ArmourItemCategories.Helmets)) {
                    armourSlot = "helmets";
                } else if (categories.includes(ArmourItemCategories.Arms)) {
                    armourSlot = "arms";
                } else if (categories.includes(ArmourItemCategories.Chest)) {
                    armourSlot = "chest";
                } else if (categories.includes(ArmourItemCategories.Legs)) {
                    armourSlot = "legs";
                } else if (categories.includes(ArmourItemCategories.ClassItems)) {
                    armourSlot = "classItems";
                }

                if (categories.includes(ArmourItemCategories.WarlockArmour)) {
                    library.armour.warlock[armourSlot][manifestEntry.hash] = armour;
                } else if (categories.includes(ArmourItemCategories.HunterArmour)) {
                    library.armour.hunter[armourSlot][manifestEntry.hash] = armour;
                } else if (categories.includes(ArmourItemCategories.TitanArmour)) {
                    library.armour.titan[armourSlot][manifestEntry.hash] = armour;
                }
            } else if (categories.includes(GeneralItemCategories.Ghosts)) {
                const ghost = {
                    ...baseItem
                };

                library.ghosts[manifestEntry.hash] = ghost;
            } else {
                library.other[manifestEntry.hash] = baseItem;
            }
        }

        console.timeEnd(timerLabel);

        return library;
    };
}

export default LibraryMapper;
