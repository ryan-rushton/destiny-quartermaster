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
    DestinyItemReusablePlugsComponent
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
    Weapon,
    Mod,
    WeaponSocketCategories,
    Armour,
    ArmourSocketCategories,
    GhostShell,
    GhostShellSocketCategories
} from "./inventoryTypes";
import {
    getCompleteStatManifest,
    getCompleteDamageTypeManifest,
    getCompleteInventoryItemManifest
} from "../manifest/manifestStorage";

const mapStat = (
    statsManifest: Record<string, DestinyStatDefinition>,
    { statHash, value }: DestinyStat
): Stat => {
    return {
        statHash,
        value,
        name: statsManifest[statHash]?.displayProperties.name
    };
};

const mapStats = (
    statsManifest: Record<string, DestinyStatDefinition>,
    stats?: DestinyItemStatsComponent
): Stats => {
    const mappedStats: Stats = {};
    if (stats) {
        for (const stat of Object.values(stats.stats)) {
            mappedStats[stat.statHash] = mapStat(statsManifest, stat);
        }
    }

    return mappedStats;
};

const mapInventoryStats = (
    statsManifest: Record<string, DestinyStatDefinition>,
    stats?: DestinyItemInvestmentStatDefinition[]
): Stats => {
    const mappedStats: Stats = {};
    if (stats) {
        for (const stat of stats) {
            const { statTypeHash, value } = stat;
            mappedStats[statTypeHash] = {
                statHash: statTypeHash,
                value,
                name: statsManifest[statTypeHash]?.displayProperties.name
            };
        }
    }

    return mappedStats;
};

const mapDamageTypes = (
    damageTypeManifests: Record<string, DestinyDamageTypeDefinition>,
    damageTypes: DamageType[]
): Damage[] => {
    return damageTypes.map(type => {
        const { hash, displayProperties } = damageTypeManifests[type];
        return { hash, iconPath: displayProperties.icon, name: displayProperties.name };
    });
};

const mapMod = (
    plug: DestinyInventoryItemDefinition,
    statsManifest: Record<string, DestinyStatDefinition>,
    enabled
): Mod => {
    const { displayProperties, hash, itemCategoryHashes } = plug;
    return {
        name: displayProperties.name,
        description: displayProperties.description,
        iconPath: displayProperties.icon,
        hash,
        enabled,
        categories: itemCategoryHashes,
        stats: mapInventoryStats(statsManifest, plug.investmentStats)
    };
};

const mapWeaponSockets = (
    itemsManifest: Record<string, DestinyInventoryItemDefinition>,
    statsManifest: Record<string, DestinyStatDefinition>,
    categoryDefinitions: DestinyItemSocketCategoryDefinition[],
    sockets?: DestinyItemSocketsComponent,
    reusablePlugs?: DestinyItemReusablePlugsComponent
): { perks: Mod[][]; mods: Mod[]; cosmetics: Mod[] } => {
    const mods: Mod[] = [];
    const perks: Mod[][] = [];
    const cosmetics: Mod[] = [];

    const categoriesByHash = _.keyBy(categoryDefinitions, def => def.socketCategoryHash);
    const { Perks, Mods, Cosmetics } = WeaponSocketCategories;

    if (sockets?.sockets) {
        let index = 0;
        for (const socket of sockets.sockets) {
            const plug = socket.plugHash && itemsManifest[socket.plugHash];
            const plugs =
                reusablePlugs &&
                reusablePlugs.plugs[index] &&
                reusablePlugs.plugs[index]
                    .map(plug => itemsManifest[plug.plugItemHash])
                    .filter(Boolean);

            if (plugs && plugs.length && categoriesByHash[Perks]?.socketIndexes.includes(index)) {
                const mods = plugs.map(plug =>
                    mapMod(plug, statsManifest, socket.isEnabled && plug.hash === socket.plugHash)
                );
                perks.push(mods);
            } else if (plug && categoriesByHash[Perks]?.socketIndexes.includes(index)) {
                const mod = mapMod(plug, statsManifest, socket.isEnabled);
                perks.push([mod]);
            } else if (plug && categoriesByHash[Cosmetics]?.socketIndexes.includes(index)) {
                cosmetics.push(mapMod(plug, statsManifest, socket.isEnabled));
            } else if (plug && categoriesByHash[Mods]?.socketIndexes.includes(index)) {
                mods.push(mapMod(plug, statsManifest, socket.isEnabled));
            }

            index++;
        }
    }

    return { perks, mods, cosmetics };
};

const mapArmourSockets = (
    itemsManifest: Record<string, DestinyInventoryItemDefinition>,
    statsManifest: Record<string, DestinyStatDefinition>,
    categoryDefinitions?: DestinyItemSocketCategoryDefinition[],
    sockets?: DestinyItemSocketsComponent,
    reusablePlugs?: DestinyItemReusablePlugsComponent
): { tier: Mod[]; perks: Mod[][]; mods: Mod[]; cosmetics: Mod[] } => {
    const mods: Mod[] = [];
    const perks: Mod[][] = [];
    const cosmetics: Mod[] = [];
    const tier: Mod[] = [];

    if (sockets?.sockets && categoryDefinitions) {
        const categoriesByHash = _.keyBy(categoryDefinitions, def => def.socketCategoryHash);
        const { Tier, Perks, Mods, Cosmetics } = ArmourSocketCategories;
        let index = 0;

        for (const socket of sockets.sockets) {
            const plug = socket.plugHash && itemsManifest[socket.plugHash];
            const plugs =
                reusablePlugs &&
                reusablePlugs.plugs[index] &&
                reusablePlugs.plugs[index]
                    .map(plug => itemsManifest[plug.plugItemHash])
                    .filter(Boolean);

            if (plugs && plugs.length && categoriesByHash[Perks]?.socketIndexes.includes(index)) {
                const mods = plugs.map(plug =>
                    mapMod(plug, statsManifest, socket.isEnabled && plug.hash === socket.plugHash)
                );
                perks.push(mods);
            } else if (plug && categoriesByHash[Perks]?.socketIndexes.includes(index)) {
                const mod = mapMod(plug, statsManifest, socket.isEnabled);
                perks.push([mod]);
            } else if (plug && categoriesByHash[Tier]?.socketIndexes.includes(index)) {
                tier.push(mapMod(plug, statsManifest, socket.isEnabled));
            } else if (plug && categoriesByHash[Cosmetics]?.socketIndexes.includes(index)) {
                cosmetics.push(mapMod(plug, statsManifest, socket.isEnabled));
            } else if (plug && categoriesByHash[Mods]?.socketIndexes.includes(index)) {
                mods.push(mapMod(plug, statsManifest, socket.isEnabled));
            }

            index++;
        }
    }

    return { tier, perks, mods, cosmetics };
};

const mapGhostSockets = (
    itemsManifest: Record<string, DestinyInventoryItemDefinition>,
    statsManifest: Record<string, DestinyStatDefinition>,
    categoryDefinitions?: DestinyItemSocketCategoryDefinition[],
    sockets?: DestinyItemSocketsComponent,
    reusablePlugs?: DestinyItemReusablePlugsComponent
): { perks: Mod[][]; mods: Mod[] } => {
    const mods: Mod[] = [];
    const perks: Mod[][] = [];

    if (sockets?.sockets && categoryDefinitions) {
        const categoriesByHash = _.keyBy(categoryDefinitions, def => def.socketCategoryHash);
        const { Perks, Mods } = GhostShellSocketCategories;
        let index = 0;

        for (const socket of sockets.sockets) {
            const plug = socket.plugHash && itemsManifest[socket.plugHash];
            const plugs =
                reusablePlugs &&
                reusablePlugs.plugs[index] &&
                reusablePlugs.plugs[index]
                    .map(plug => itemsManifest[plug.plugItemHash])
                    .filter(Boolean);

            if (plugs && plugs.length && categoriesByHash[Perks]?.socketIndexes.includes(index)) {
                const mods = plugs.map(plug =>
                    mapMod(plug, statsManifest, socket.isEnabled && plug.hash === socket.plugHash)
                );
                perks.push(mods);
            } else if (plug && categoriesByHash[Perks]?.socketIndexes.includes(index)) {
                const mod = mapMod(plug, statsManifest, socket.isEnabled);
                perks.push([mod]);
            } else if (plug && categoriesByHash[Mods]?.socketIndexes.includes(index)) {
                mods.push(mapMod(plug, statsManifest, socket.isEnabled));
            }

            index++;
        }
    }

    return { perks, mods };
};

const mapSingleItem = (
    bungieItem: DestinyItemComponent,
    manifestEntry: DestinyInventoryItemDefinition,
    statsManifest: Record<string, DestinyStatDefinition>,
    instance: DestinyItemInstanceComponent
): InventoryItem => {
    return {
        hash: bungieItem.itemHash,
        name: manifestEntry.displayProperties.name,
        iconPath: manifestEntry.displayProperties.icon,
        primaryStat: instance.primaryStat && mapStat(statsManifest, instance.primaryStat),
        categories: manifestEntry.itemCategoryHashes
    };
};

const mapWeapon = (
    bungieItem: DestinyItemComponent,
    manifestEntry: DestinyInventoryItemDefinition,
    statsManifest: Record<string, DestinyStatDefinition>,
    damageTypeManifests: Record<string, DestinyDamageTypeDefinition>,
    itemsManifest: Record<string, DestinyInventoryItemDefinition>,
    instance: DestinyItemInstanceComponent,
    stats?: DestinyItemStatsComponent,
    sockets?: DestinyItemSocketsComponent,
    reusablePlugs?: DestinyItemReusablePlugsComponent
): Weapon => {
    const baseItem = mapSingleItem(bungieItem, manifestEntry, statsManifest, instance);
    return {
        ...baseItem,
        damage: mapDamageTypes(damageTypeManifests, manifestEntry.damageTypeHashes),
        stats: mapStats(statsManifest, stats),
        baseStats: mapInventoryStats(statsManifest, manifestEntry.investmentStats),
        exotic: manifestEntry.equippingBlock.uniqueLabel === "exotic_weapon",
        ...mapWeaponSockets(
            itemsManifest,
            statsManifest,
            manifestEntry?.sockets?.socketCategories,
            sockets,
            reusablePlugs
        )
    };
};

const mapArmour = (
    bungieItem: DestinyItemComponent,
    manifestEntry: DestinyInventoryItemDefinition,
    statsManifest: Record<string, DestinyStatDefinition>,
    itemsManifest: Record<string, DestinyInventoryItemDefinition>,
    instance: DestinyItemInstanceComponent,
    stats?: DestinyItemStatsComponent,
    sockets?: DestinyItemSocketsComponent,
    reusablePlugs?: DestinyItemReusablePlugsComponent
): Armour => {
    const baseItem = mapSingleItem(bungieItem, manifestEntry, statsManifest, instance);

    return {
        ...baseItem,
        stats: mapStats(statsManifest, stats),
        baseStats: mapInventoryStats(statsManifest, manifestEntry.investmentStats),
        exotic: manifestEntry.equippingBlock.uniqueLabel === "exotic_armor",
        ...mapArmourSockets(
            itemsManifest,
            statsManifest,
            manifestEntry?.sockets?.socketCategories,
            sockets,
            reusablePlugs
        )
    };
};

const mapGhost = (
    bungieItem: DestinyItemComponent,
    manifestEntry: DestinyInventoryItemDefinition,
    statsManifest: Record<string, DestinyStatDefinition>,
    itemsManifest: Record<string, DestinyInventoryItemDefinition>,
    instance: DestinyItemInstanceComponent,
    sockets?: DestinyItemSocketsComponent,
    reusablePlugs?: DestinyItemReusablePlugsComponent
): GhostShell => {
    const baseItem = mapSingleItem(bungieItem, manifestEntry, statsManifest, instance);

    return {
        ...baseItem,
        ...mapGhostSockets(
            itemsManifest,
            statsManifest,
            manifestEntry?.sockets?.socketCategories,
            sockets,
            reusablePlugs
        )
    };
};

const isANeededCategory = (manifestEntry: DestinyInventoryItemDefinition): boolean => {
    const categoriesOfInterest = [
        ...WeaponItemCategoryHashes,
        ...ArmourItemCategoryHashes,
        ...GeneralItemCategoryHashes
    ];

    const itemCategories = manifestEntry?.itemCategoryHashes || [];

    return _.intersection(categoriesOfInterest, itemCategories).length > 0;
};

export const mapCharacterInventories = async (
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

    //const itemsManifest = await getInventoryItemManifest(allItems.map(b => [b.itemHash]));
    const itemsManifest = await getCompleteInventoryItemManifest();
    const statsManifest = await getCompleteStatManifest();
    const damageTypeManifests = await getCompleteDamageTypeManifest();

    const inventory: Inventory = {
        weapons: {
            kinetic: {},
            energy: {},
            heavy: {}
        },
        armour: { warlock: {}, hunter: {}, titan: {} },
        ghosts: {},
        other: {}
    };

    for (const item of allItems) {
        const { itemHash, itemInstanceId } = item;

        if (itemInstanceId) {
            const manifestEntry = itemsManifest[itemHash];
            const instance = allInstances && allInstances[itemInstanceId];
            const stats = allStats && allStats[itemInstanceId];
            const sockets = allSockets && allSockets[itemInstanceId];
            const reusablePlugs = allReusablePlugs && allReusablePlugs[itemInstanceId];

            if (instance) {
                if (manifestEntry && isANeededCategory(manifestEntry)) {
                    const categories = manifestEntry.itemCategoryHashes;
                    if (categories.includes(WeaponItemCategories.Weapons)) {
                        const weapon = mapWeapon(
                            item,
                            manifestEntry,
                            statsManifest,
                            damageTypeManifests,
                            itemsManifest,
                            instance,
                            stats,
                            sockets,
                            reusablePlugs
                        );
                        if (categories.includes(WeaponItemCategories.KineticWeapons)) {
                            inventory.weapons.kinetic[itemHash] = weapon;
                        } else if (categories.includes(WeaponItemCategories.EnergyWeapons)) {
                            inventory.weapons.energy[itemHash] = weapon;
                        } else if (categories.includes(WeaponItemCategories.PowerWeapons)) {
                            inventory.weapons.heavy[itemHash] = weapon;
                        }
                    } else if (
                        categories.includes(ArmourItemCategories.Armour) &&
                        instance.energy &&
                        !categories.includes(GeneralItemCategories.Subclass)
                    ) {
                        const armour = mapArmour(
                            item,
                            manifestEntry,
                            statsManifest,
                            itemsManifest,
                            instance,
                            stats,
                            sockets,
                            reusablePlugs
                        );

                        if (categories.includes(ArmourItemCategories.WarlockArmour)) {
                            inventory.armour.warlock[itemHash] = armour;
                        } else if (categories.includes(ArmourItemCategories.HunterArmour)) {
                            inventory.armour.hunter[itemHash] = armour;
                        } else if (categories.includes(ArmourItemCategories.TitanArmour)) {
                            inventory.armour.titan[itemHash] = armour;
                        }
                    } else if (categories.includes(GeneralItemCategories.Ghosts)) {
                        const ghost = mapGhost(
                            item,
                            manifestEntry,
                            statsManifest,
                            itemsManifest,
                            instance,
                            sockets,
                            reusablePlugs
                        );
                        inventory.ghosts[itemHash] = ghost;
                    } else {
                        const mappedItem = mapSingleItem(
                            item,
                            manifestEntry,
                            statsManifest,
                            instance
                        );
                        inventory.other[itemHash] = mappedItem;
                    }
                }
            }
        }
    }

    console.timeEnd(timerLabel);

    return inventory;
};
