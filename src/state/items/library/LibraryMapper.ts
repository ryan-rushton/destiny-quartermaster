import _ from 'lodash';
import {
    DestinyInventoryItemDefinition,
    DestinyStatDefinition,
    DestinyDamageTypeDefinition,
    DestinyItemSocketBlockDefinition,
    DestinyPlugSetDefinition,
    DestinyEnergyTypeDefinition,
} from 'bungie-api-ts/destiny2';

import {
    WeaponItemCategories,
    ArmourItemCategories,
    GeneralItemCategories,
    WeaponSocketCategories,
    Mod,
    ArmourSocketCategories,
    GhostShellSocketCategories,
    ArmourModCategories,
    WeaponModCategories,
    ArmourSlot,
} from '../commonItemTypes';
import { Library, LibraryItem, LibraryArmour } from './libraryTypes';
import { mapDamageTypes, mapInventoryStats, mapMod, mapArmourSeason } from '../commonItemMappers';
import { isArmour2, isArmour2Mod } from './libraryUtils';
import { Manifest } from 'state/manifest/manifestTypes';

class LibraryMapper {
    itemsManifest: Manifest<DestinyInventoryItemDefinition>;
    statsManifest: Manifest<DestinyStatDefinition>;
    damageTypeManifests: Manifest<DestinyDamageTypeDefinition>;
    plugSetsManifest: Manifest<DestinyPlugSetDefinition>;
    energyTypeManifest: Manifest<DestinyEnergyTypeDefinition>;

    constructor(
        itemsManifest: Manifest<DestinyInventoryItemDefinition>,
        statsManifest: Manifest<DestinyStatDefinition>,
        damageTypeManifests: Manifest<DestinyDamageTypeDefinition>,
        plugSetsManifest: Manifest<DestinyPlugSetDefinition>,
        energyTypeManifest: Manifest<DestinyEnergyTypeDefinition>
    ) {
        this.itemsManifest = itemsManifest || {};
        this.statsManifest = statsManifest || {};
        this.damageTypeManifests = damageTypeManifests || {};
        this.plugSetsManifest = plugSetsManifest || {};
        this.energyTypeManifest = energyTypeManifest || {};
    }

    mapBaseItem(manifestEntry: DestinyInventoryItemDefinition): LibraryItem {
        return {
            hash: manifestEntry.hash,
            name: manifestEntry.displayProperties.name,
            iconPath: manifestEntry.displayProperties.icon,
            categories: manifestEntry.itemCategoryHashes,
        };
    }

    mapSockets(
        perkCategory: number,
        modCategory: number,
        socketBlock?: DestinyItemSocketBlockDefinition,
        cosmeticCategory?: number
    ): { perks: Mod[][]; mods: Mod[]; cosmetics: Mod[] } {
        const mods: Mod[] = [];
        const perks: Mod[][] = [];
        const cosmetics: Mod[] = [];

        const categoriesByHash = _.keyBy(
            socketBlock?.socketCategories,
            (def) => def.socketCategoryHash
        );

        if (socketBlock?.socketEntries) {
            let index = 0;
            for (const socket of socketBlock.socketEntries) {
                const plug =
                    socket.singleInitialItemHash &&
                    this.itemsManifest[socket.singleInitialItemHash];

                const plugSet =
                    socket.randomizedPlugSetHash &&
                    this.plugSetsManifest?.[socket.randomizedPlugSetHash]?.reusablePlugItems;

                if (plugSet) {
                    const modSet: Mod[] = [];

                    for (const randomisedPlugDef of plugSet) {
                        const plugDef = this.itemsManifest[randomisedPlugDef.plugItemHash];

                        if (plugDef) {
                            modSet.push(
                                mapMod(this.statsManifest, this.energyTypeManifest, plugDef, false)
                            );
                        }
                    }
                    if (modSet.length) {
                        if (categoriesByHash[perkCategory]?.socketIndexes.includes(index)) {
                            perks.push(modSet);
                        } else {
                            console.log("Mod set didn't map to perks");
                        }
                    }
                } else if (plug) {
                    const mod = mapMod(this.statsManifest, this.energyTypeManifest, plug, false);
                    if (categoriesByHash[perkCategory]?.socketIndexes.includes(index)) {
                        perks.push([mod]);
                    } else if (
                        cosmeticCategory &&
                        categoriesByHash[cosmeticCategory]?.socketIndexes.includes(index)
                    ) {
                        cosmetics.push(mod);
                    } else if (categoriesByHash[modCategory]?.socketIndexes.includes(index)) {
                        mods.push(mod);
                    }
                }

                index++;
            }
        }

        return { perks, mods, cosmetics };
    }

    map = (): Library => {
        const timerLabel = 'Mapping Library';
        console.time(timerLabel);

        const library: Library = {
            weapons: {
                kinetic: {},
                energy: {},
                heavy: {},
            },
            armour: {
                warlock: {
                    helmets: [],
                    arms: [],
                    chest: [],
                    legs: [],
                    classItems: [],
                },
                hunter: {
                    helmets: [],
                    arms: [],
                    chest: [],
                    legs: [],
                    classItems: [],
                },
                titan: {
                    helmets: [],
                    arms: [],
                    chest: [],
                    legs: [],
                    classItems: [],
                },
            },
            ghosts: {},
            mods: {
                weapons: [],
                armour: {
                    helmets: [],
                    arms: [],
                    chest: [],
                    legs: [],
                    classItems: [],
                    generic: [],
                },
            },
        };

        for (const manifestEntry of Object.values(this.itemsManifest)) {
            if (manifestEntry) {
                const categories = manifestEntry?.itemCategoryHashes;
                const baseItem = this.mapBaseItem(manifestEntry);

                if (categories.includes(WeaponItemCategories.Weapons)) {
                    const weapon = {
                        ...baseItem,
                        damage: mapDamageTypes(
                            this.damageTypeManifests,
                            manifestEntry.damageTypeHashes
                        ),
                        baseStats: mapInventoryStats(
                            this.statsManifest,
                            manifestEntry.investmentStats
                        ),
                        exotic: manifestEntry.equippingBlock.uniqueLabel === 'exotic_weapon',
                        ...this.mapSockets(
                            WeaponSocketCategories.Perks,
                            WeaponSocketCategories.Mods,
                            manifestEntry.sockets,
                            WeaponSocketCategories.Cosmetics
                        ),
                    };

                    if (categories.includes(WeaponItemCategories.KineticWeapons)) {
                        library.weapons.kinetic[manifestEntry.hash] = weapon;
                    } else if (categories.includes(WeaponItemCategories.EnergyWeapons)) {
                        library.weapons.energy[manifestEntry.hash] = weapon;
                    } else if (categories.includes(WeaponItemCategories.PowerWeapons)) {
                        library.weapons.heavy[manifestEntry.hash] = weapon;
                    }
                } else if (isArmour2(manifestEntry)) {
                    const baseArmour = {
                        ...baseItem,
                        baseStats: mapInventoryStats(
                            this.statsManifest,
                            manifestEntry.investmentStats
                        ),
                        exotic: manifestEntry.equippingBlock.uniqueLabel === 'exotic_armor',
                        season: mapArmourSeason(manifestEntry),
                        ...this.mapSockets(
                            ArmourSocketCategories.Perks,
                            ArmourSocketCategories.Mods,
                            manifestEntry.sockets,
                            ArmourSocketCategories.Cosmetics
                        ),
                    };

                    let armourSlot: ArmourSlot | null = null;
                    let armour: LibraryArmour | null = null;

                    if (categories.includes(ArmourItemCategories.Helmets)) {
                        armourSlot = 'helmets';
                        armour = { ...baseArmour, type: 'helmet' };
                    } else if (categories.includes(ArmourItemCategories.Arms)) {
                        armourSlot = 'arms';
                        armour = { ...baseArmour, type: 'arms' };
                    } else if (categories.includes(ArmourItemCategories.Chest)) {
                        armourSlot = 'chest';
                        armour = { ...baseArmour, type: 'chest' };
                    } else if (categories.includes(ArmourItemCategories.Legs)) {
                        armourSlot = 'legs';
                        armour = { ...baseArmour, type: 'legs' };
                    } else if (categories.includes(ArmourItemCategories.ClassItems)) {
                        armourSlot = 'classItems';
                        armour = { ...baseArmour, type: 'classItem' };
                    }

                    if (
                        armour &&
                        armourSlot &&
                        categories.includes(ArmourItemCategories.WarlockArmour)
                    ) {
                        library.armour.warlock[armourSlot].push(armour);
                    } else if (
                        armour &&
                        armourSlot &&
                        categories.includes(ArmourItemCategories.HunterArmour)
                    ) {
                        library.armour.hunter[armourSlot].push(armour);
                    } else if (
                        armour &&
                        armourSlot &&
                        categories.includes(ArmourItemCategories.TitanArmour)
                    ) {
                        library.armour.titan[armourSlot].push(armour);
                    }
                } else if (categories.includes(GeneralItemCategories.Ghosts)) {
                    const ghost = {
                        ...baseItem,
                        ...this.mapSockets(
                            GhostShellSocketCategories.Perks,
                            GhostShellSocketCategories.Mods,
                            manifestEntry.sockets
                        ),
                    };

                    library.ghosts[manifestEntry.hash] = ghost;
                } else if (isArmour2Mod(manifestEntry)) {
                    let armourSlot: ArmourSlot | 'generic' = 'generic';
                    if (categories.includes(ArmourModCategories.Helmets)) {
                        armourSlot = 'helmets';
                    } else if (categories.includes(ArmourModCategories.Arms)) {
                        armourSlot = 'arms';
                    } else if (categories.includes(ArmourModCategories.Chest)) {
                        armourSlot = 'chest';
                    } else if (categories.includes(ArmourModCategories.Legs)) {
                        armourSlot = 'legs';
                    } else if (categories.includes(ArmourModCategories.ClassItems)) {
                        armourSlot = 'classItems';
                    }

                    if (armourSlot) {
                        library.mods.armour[armourSlot].push(
                            mapMod(
                                this.statsManifest,
                                this.energyTypeManifest,
                                manifestEntry,
                                false
                            )
                        );
                    }
                } else if (
                    categories.includes(WeaponModCategories.WeaponMods) &&
                    !categories.includes(WeaponModCategories.Ornaments) &&
                    manifestEntry.plug.plugCategoryIdentifier.startsWith('v400')
                ) {
                    library.mods.weapons.push(
                        mapMod(this.statsManifest, this.energyTypeManifest, manifestEntry, false)
                    );
                }
            }
        }

        console.timeEnd(timerLabel);

        return library;
    };
}

export default LibraryMapper;
