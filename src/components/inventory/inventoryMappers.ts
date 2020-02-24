import _ from "lodash";
import {
    DestinyInventoryComponent,
    DestinyItemComponent,
    DestinyInventoryItemDefinition,
    DestinyItemInstanceComponent,
    DestinyItemStatsComponent,
    DestinyItemSocketsComponent,
    DestinyStatDefinition,
    DestinyStat,
    DestinyDamageTypeDefinition,
    DamageType,
    DestinyItemSocketCategoryDefinition,
    DestinyItemInvestmentStatDefinition,
    DestinyItemReusablePlugsComponent,
    DestinyItemSocketState
} from "bungie-api-ts/destiny2";

import {
    Inventory,
    InventoryItem,
    WeaponItemCategories,
    ArmourItemCategories,
    GeneralItemCategories,
    WeaponItemCategoryHashes,
    ArmourItemCategoryHashes,
    GeneralItemCategoryHashes,
    Stats,
    Stat,
    Damage,
    Mod,
    WeaponSocketCategories,
    ArmourSocketCategories,
    GhostShellSocketCategories
} from "./inventoryTypes";
import {
    getCompleteStatManifest,
    getCompleteDamageTypeManifest,
    getInventoryItemManifestByCategory
} from "../manifest/manifestStorage";

class InventoryMapper {
    itemsManifest?: Record<string, DestinyInventoryItemDefinition>;
    statsManifest?: Record<string, DestinyStatDefinition>;
    damageTypeManifests?: Record<string, DestinyDamageTypeDefinition>;

    mapStat({ statHash, value }: DestinyStat): Stat | undefined {
        const statDef = this.statsManifest && this.statsManifest[statHash];
        if (statDef) {
            return {
                statHash,
                value,
                name: statDef.displayProperties.name
            };
        }
    }

    mapStats(stats?: DestinyItemStatsComponent): Stats {
        const mappedStats: Stats = {};
        if (stats) {
            for (const stat of Object.values(stats.stats)) {
                const mappedStat = this.mapStat(stat);
                if (mappedStat) {
                    mappedStats[stat.statHash] = mappedStat;
                }
            }
        }

        return mappedStats;
    }

    mapInventoryStats(stats?: DestinyItemInvestmentStatDefinition[]): Stats {
        const mappedStats: Stats = {};
        if (stats) {
            for (const stat of stats) {
                const { statTypeHash, value } = stat;
                const manifestEntry = this.statsManifest && this.statsManifest[statTypeHash];
                if (manifestEntry) {
                    mappedStats[statTypeHash] = {
                        statHash: statTypeHash,
                        value,
                        name: manifestEntry.displayProperties.name
                    };
                }
            }
        }

        return mappedStats;
    }

    mapDamageTypes(damageTypes: DamageType[]): Damage[] {
        const mappedDamages: Damage[] = [];

        if (this.damageTypeManifests) {
            for (const type of damageTypes) {
                const manifestEntry = this.damageTypeManifests[type];
                if (manifestEntry) {
                    const { hash, displayProperties } = manifestEntry;
                    const { name, icon } = displayProperties;
                    mappedDamages.push({ hash, iconPath: icon, name: name });
                }
            }
        }
        return mappedDamages;
    }

    mapMod(plug: DestinyInventoryItemDefinition, enabled): Mod {
        const { displayProperties, hash, itemCategoryHashes } = plug;
        return {
            name: displayProperties.name,
            description: displayProperties.description,
            iconPath: displayProperties.icon,
            hash,
            enabled,
            categories: itemCategoryHashes,
            stats: this.mapInventoryStats(plug.investmentStats)
        };
    }

    getReusablePlugs(
        socketIndex: number,
        socket: DestinyItemSocketState,
        categoryDefs?: DestinyItemSocketCategoryDefinition,
        reusablePlugs?: DestinyItemReusablePlugsComponent
    ): Mod[] {
        const mods: Mod[] = [];
        const plugsAtIndex = reusablePlugs && reusablePlugs.plugs[socketIndex];
        const enabledPlugHash = socket.isEnabled && socket.plugHash;

        if (plugsAtIndex && this.itemsManifest) {
            for (const plug of plugsAtIndex) {
                const manifestEntry = this.itemsManifest[plug.plugItemHash];

                if (manifestEntry && categoryDefs?.socketIndexes.includes(socketIndex)) {
                    mods.push(this.mapMod(manifestEntry, manifestEntry.hash === enabledPlugHash));
                }
            }
        }

        return mods;
    }

    mapWeaponSockets = (
        categoryDefinitions: DestinyItemSocketCategoryDefinition[],
        sockets?: DestinyItemSocketsComponent,
        reusablePlugs?: DestinyItemReusablePlugsComponent
    ): { perks: Mod[][]; mods: Mod[]; cosmetics: Mod[] } => {
        const mods: Mod[] = [];
        const perks: Mod[][] = [];
        const cosmetics: Mod[] = [];

        const categoriesByHash = _.keyBy(categoryDefinitions, def => def.socketCategoryHash);
        const { Perks, Mods, Cosmetics } = WeaponSocketCategories;

        if (sockets?.sockets && this.itemsManifest) {
            let index = 0;
            for (const socket of sockets.sockets) {
                const plug = socket.plugHash && this.itemsManifest[socket.plugHash];
                const reusableMods = this.getReusablePlugs(
                    index,
                    socket,
                    categoriesByHash[Perks],
                    reusablePlugs
                );

                if (reusableMods && reusableMods.length) {
                    perks.push(reusableMods);
                } else if (plug) {
                    const mod = this.mapMod(plug, socket.isEnabled);
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
    };

    mapArmourSockets(
        categoryDefinitions?: DestinyItemSocketCategoryDefinition[],
        sockets?: DestinyItemSocketsComponent,
        reusablePlugs?: DestinyItemReusablePlugsComponent
    ): { tier: Mod[]; perks: Mod[][]; mods: Mod[]; cosmetics: Mod[] } {
        const mods: Mod[] = [];
        const perks: Mod[][] = [];
        const cosmetics: Mod[] = [];
        const tier: Mod[] = [];

        if (sockets?.sockets && categoryDefinitions && this.itemsManifest) {
            const categoriesByHash = _.keyBy(categoryDefinitions, def => def.socketCategoryHash);
            const { Tier, Perks, Mods, Cosmetics } = ArmourSocketCategories;
            let index = 0;

            for (const socket of sockets.sockets) {
                const plug = socket.plugHash && this.itemsManifest[socket.plugHash];
                const reusableMods = this.getReusablePlugs(
                    index,
                    socket,
                    categoriesByHash[Perks],
                    reusablePlugs
                );

                if (reusableMods && reusableMods.length) {
                    perks.push(reusableMods);
                } else if (plug) {
                    const mod = this.mapMod(plug, socket.isEnabled);
                    if (categoriesByHash[Perks]?.socketIndexes.includes(index)) {
                        perks.push([mod]);
                    } else if (categoriesByHash[Cosmetics]?.socketIndexes.includes(index)) {
                        cosmetics.push(mod);
                    } else if (categoriesByHash[Tier]?.socketIndexes.includes(index)) {
                        tier.push(mod);
                    } else if (categoriesByHash[Mods]?.socketIndexes.includes(index)) {
                        mods.push(mod);
                    }
                }

                index++;
            }
        }

        return { tier, perks, mods, cosmetics };
    }

    mapGhostSockets(
        categoryDefinitions?: DestinyItemSocketCategoryDefinition[],
        sockets?: DestinyItemSocketsComponent,
        reusablePlugs?: DestinyItemReusablePlugsComponent
    ): { perks: Mod[][]; mods: Mod[] } {
        const mods: Mod[] = [];
        const perks: Mod[][] = [];

        if (sockets?.sockets && categoryDefinitions && this.itemsManifest) {
            const categoriesByHash = _.keyBy(categoryDefinitions, def => def.socketCategoryHash);
            const { Perks, Mods } = GhostShellSocketCategories;
            let index = 0;

            for (const socket of sockets.sockets) {
                const plug = socket.plugHash && this.itemsManifest[socket.plugHash];
                const reusableMods = this.getReusablePlugs(
                    index,
                    socket,
                    categoriesByHash[Perks],
                    reusablePlugs
                );

                if (reusableMods && reusableMods.length) {
                    perks.push(reusableMods);
                } else if (plug) {
                    const mod = this.mapMod(plug, socket.isEnabled);
                    if (categoriesByHash[Perks]?.socketIndexes.includes(index)) {
                        perks.push([mod]);
                    } else if (categoriesByHash[Mods]?.socketIndexes.includes(index)) {
                        mods.push(mod);
                    }
                }

                index++;
            }
        }

        return { perks, mods };
    }

    mapBaseItem(
        bungieItem: DestinyItemComponent,
        manifestEntry: DestinyInventoryItemDefinition,
        instance: DestinyItemInstanceComponent
    ): InventoryItem {
        return {
            hash: bungieItem.itemHash,
            name: manifestEntry.displayProperties.name,
            iconPath: manifestEntry.displayProperties.icon,
            primaryStat: instance.primaryStat && this.mapStat(instance.primaryStat),
            categories: manifestEntry.itemCategoryHashes
        };
    }

    isANeededCategory(manifestEntry: DestinyInventoryItemDefinition): boolean {
        const categoriesOfInterest = [
            ...WeaponItemCategoryHashes,
            ...ArmourItemCategoryHashes,
            ...GeneralItemCategoryHashes
        ];

        const itemCategories = manifestEntry?.itemCategoryHashes || [];

        return _.intersection(categoriesOfInterest, itemCategories).length > 0;
    }

    map = async (
        profileInventory?: DestinyInventoryComponent,
        characterEquipment?: Record<string, DestinyInventoryComponent>,
        characterInventories?: Record<string, DestinyInventoryComponent>,
        allInstances?: Record<string, DestinyItemInstanceComponent>,
        allStats?: Record<string, DestinyItemStatsComponent>,
        allSockets?: Record<string, DestinyItemSocketsComponent>,
        allReusablePlugs?: Record<string, DestinyItemReusablePlugsComponent>
    ): Promise<Inventory> => {
        const timerLabel = "Mapping Inventory";
        console.time(timerLabel);

        const profileValues = (profileInventory && Object.values(profileInventory.items)) || [];

        const charEquipValues =
            (characterEquipment &&
                Object.values(characterEquipment)
                    .map(char => char.items)
                    .flat()) ||
            [];

        const charValues =
            (characterInventories &&
                Object.values(characterInventories)
                    .map(char => char.items)
                    .flat()) ||
            [];

        const allItems = [...profileValues, ...charEquipValues, ...charValues];

        const allCategories = [
            WeaponItemCategories.Weapons,
            ArmourItemCategories.Armour,
            ...GeneralItemCategoryHashes
        ];

        await Promise.all([
            getInventoryItemManifestByCategory(allCategories),
            getCompleteStatManifest(),
            getCompleteDamageTypeManifest()
        ]).then(([itemsManifest, statsManifest, damageTypeManifests]) => {
            this.itemsManifest = itemsManifest;
            this.statsManifest = statsManifest;
            this.damageTypeManifests = damageTypeManifests;
        });

        const inventory: Inventory = {
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

        for (const item of allItems) {
            const { itemHash, itemInstanceId } = item;

            if (itemInstanceId && this.itemsManifest) {
                const manifestEntry = this.itemsManifest[itemHash];
                const instance = allInstances && allInstances[itemInstanceId];
                const stats = allStats && allStats[itemInstanceId];
                const sockets = allSockets && allSockets[itemInstanceId];
                const reusablePlugs = allReusablePlugs && allReusablePlugs[itemInstanceId];

                if (instance) {
                    if (manifestEntry && this.isANeededCategory(manifestEntry)) {
                        const categories = manifestEntry.itemCategoryHashes;
                        const baseItem = this.mapBaseItem(item, manifestEntry, instance);

                        if (categories.includes(WeaponItemCategories.Weapons)) {
                            const weapon = {
                                ...baseItem,
                                damage: this.mapDamageTypes(manifestEntry.damageTypeHashes),
                                stats: this.mapStats(stats),
                                baseStats: this.mapInventoryStats(manifestEntry.investmentStats),
                                exotic:
                                    manifestEntry.equippingBlock.uniqueLabel === "exotic_weapon",
                                ...this.mapWeaponSockets(
                                    manifestEntry.sockets.socketCategories,
                                    sockets,
                                    reusablePlugs
                                )
                            };

                            if (categories.includes(WeaponItemCategories.KineticWeapons)) {
                                inventory.weapons.kinetic[itemHash] = weapon;
                            } else if (categories.includes(WeaponItemCategories.EnergyWeapons)) {
                                inventory.weapons.energy[itemHash] = weapon;
                            } else if (categories.includes(WeaponItemCategories.PowerWeapons)) {
                                inventory.weapons.heavy[itemHash] = weapon;
                            }
                        } else if (
                            categories.includes(ArmourItemCategories.Armour) &&
                            !categories.includes(GeneralItemCategories.Subclass)
                        ) {
                            const armour = {
                                ...baseItem,
                                stats: this.mapStats(stats),
                                baseStats: this.mapInventoryStats(manifestEntry.investmentStats),
                                exotic: manifestEntry.equippingBlock.uniqueLabel === "exotic_armor",
                                ...this.mapArmourSockets(
                                    manifestEntry.sockets.socketCategories,
                                    sockets,
                                    reusablePlugs
                                )
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
                                inventory.armour.warlock[armourSlot][itemHash] = armour;
                            } else if (categories.includes(ArmourItemCategories.HunterArmour)) {
                                inventory.armour.hunter[armourSlot][itemHash] = armour;
                            } else if (categories.includes(ArmourItemCategories.TitanArmour)) {
                                inventory.armour.titan[armourSlot][itemHash] = armour;
                            }
                        } else if (categories.includes(GeneralItemCategories.Ghosts)) {
                            const ghost = {
                                ...baseItem,
                                ...this.mapGhostSockets(
                                    manifestEntry.sockets?.socketCategories,
                                    sockets,
                                    reusablePlugs
                                )
                            };

                            inventory.ghosts[itemHash] = ghost;
                        } else {
                            inventory.other[itemHash] = baseItem;
                        }
                    }
                }
            }
        }

        console.timeEnd(timerLabel);

        return inventory;
    };
}

export default InventoryMapper;
