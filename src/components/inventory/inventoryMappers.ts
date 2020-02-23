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
    DestinySandboxPerkDefinition,
    DestinyDamageTypeDefinition,
    DamageType,
    DestinyItemSocketCategoryDefinition,
    DestinyItemInvestmentStatDefinition
} from "bungie-api-ts/destiny2";

import {
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
    getCompletePerkManifest,
    getCompleteDamageTypeManifest,
    getCompleteInventoryItemManifest
} from "../manifest/manifestStorage";

interface Inventory {
    weapons: Record<string, Weapon>;
    armour: {
        warlock: Record<string, Armour>;
        hunter: Record<string, Armour>;
        titan: Record<string, Armour>;
    };
    ghosts: Record<string, InventoryItem>;
    other: Record<string, InventoryItem>;
}

const mapSockets = (
    itemManifest: Record<string, DestinyInventoryItemDefinition>,
    sockets?: DestinyItemSocketsComponent
): any[] => {
    const mappedSockets: any[] = [];

    if (sockets?.sockets) {
        for (const socket of sockets.sockets) {
            mappedSockets.push({
                ...socket,
                manifest: socket.plugHash && itemManifest[socket.plugHash]
            });
        }
    }

    return mappedSockets;
};

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
    statsManifest: Record<string, DestinyStatDefinition>
): Mod => {
    const { displayProperties, hash, itemCategoryHashes } = plug;
    return {
        name: displayProperties.name,
        description: displayProperties.description,
        iconPath: displayProperties.icon,
        hash,
        categories: itemCategoryHashes,
        stats: mapInventoryStats(statsManifest, plug.investmentStats),
        def: plug
    };
};

const mapWeaponSockets = (
    itemsManifest: Record<string, DestinyInventoryItemDefinition>,
    statsManifest: Record<string, DestinyStatDefinition>,
    categoryDefinitions: DestinyItemSocketCategoryDefinition[],
    sockets?: DestinyItemSocketsComponent
): { perks: Mod[]; mods: Mod[]; cosmetics: Mod[] } => {
    const mods: Mod[] = [];
    const perks: Mod[] = [];
    const cosmetics: Mod[] = [];

    const categoriesByHash = _.keyBy(categoryDefinitions, def => def.socketCategoryHash);
    const { Perks, Mods, Cosmetics } = WeaponSocketCategories;

    if (sockets?.sockets) {
        let index = 0;
        for (const socket of sockets.sockets) {
            const plug = socket.plugHash && itemsManifest[socket.plugHash];
            if (plug) {
                const mod: Mod = mapMod(plug, statsManifest);
                if (categoriesByHash[Perks]?.socketIndexes.includes(index)) {
                    perks.push(mod);
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

const mapArmourSockets = (
    itemsManifest: Record<string, DestinyInventoryItemDefinition>,
    statsManifest: Record<string, DestinyStatDefinition>,
    categoryDefinitions?: DestinyItemSocketCategoryDefinition[],
    sockets?: DestinyItemSocketsComponent
): { tier: Mod[]; perks: Mod[]; mods: Mod[]; cosmetics: Mod[] } => {
    const mods: Mod[] = [];
    const perks: Mod[] = [];
    const cosmetics: Mod[] = [];
    const tier: Mod[] = [];

    if (sockets?.sockets && categoryDefinitions) {
        const categoriesByHash = _.keyBy(categoryDefinitions, def => def.socketCategoryHash);
        const { Tier, Perks, Mods, Cosmetics } = ArmourSocketCategories;
        let index = 0;

        for (const socket of sockets.sockets) {
            const plug = socket.plugHash && itemsManifest[socket.plugHash];
            if (plug) {
                const mod: Mod = mapMod(plug, statsManifest);
                if (categoriesByHash[Tier]?.socketIndexes.includes(index)) {
                    tier.push(mod);
                } else if (categoriesByHash[Perks]?.socketIndexes.includes(index)) {
                    perks.push(mod);
                } else if (categoriesByHash[Cosmetics]?.socketIndexes.includes(index)) {
                    cosmetics.push(mod);
                } else if (categoriesByHash[Mods]?.socketIndexes.includes(index)) {
                    mods.push(mod);
                }
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
    sockets?: DestinyItemSocketsComponent
): { perks: Mod[]; mods: Mod[] } => {
    const mods: Mod[] = [];
    const perks: Mod[] = [];

    if (sockets?.sockets && categoryDefinitions) {
        const categoriesByHash = _.keyBy(categoryDefinitions, def => def.socketCategoryHash);
        const { Perks, Mods } = GhostShellSocketCategories;
        let index = 0;

        for (const socket of sockets.sockets) {
            const plug = socket.plugHash && itemsManifest[socket.plugHash];
            if (plug) {
                const mod: Mod = mapMod(plug, statsManifest);
                if (categoriesByHash[Perks]?.socketIndexes.includes(index)) {
                    perks.push(mod);
                } else if (categoriesByHash[Mods]?.socketIndexes.includes(index)) {
                    mods.push(mod);
                }
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
    perksManifest: Record<string, DestinySandboxPerkDefinition>,
    damageTypeManifests: Record<string, DestinyDamageTypeDefinition>,
    itemsManifest: Record<string, DestinyInventoryItemDefinition>,
    instance?: DestinyItemInstanceComponent,
    stats?: DestinyItemStatsComponent,
    sockets?: DestinyItemSocketsComponent
): InventoryItem => {
    return {
        hash: bungieItem.itemHash,
        name: manifestEntry.displayProperties.name,
        iconPath: manifestEntry.displayProperties.icon,
        primaryStat: instance?.primaryStat && mapStat(statsManifest, instance?.primaryStat),
        sockets: mapSockets(itemsManifest, sockets),
        categories: manifestEntry.itemCategoryHashes,
        bungieItem,
        itemManifest: manifestEntry,
        itemComponents: {
            instance,
            stats,
            sockets
        }
    };
};

const mapWeapon = (
    bungieItem: DestinyItemComponent,
    manifestEntry: DestinyInventoryItemDefinition,
    statsManifest: Record<string, DestinyStatDefinition>,
    perksManifest: Record<string, DestinySandboxPerkDefinition>,
    damageTypeManifests: Record<string, DestinyDamageTypeDefinition>,
    itemsManifest: Record<string, DestinyInventoryItemDefinition>,
    instance?: DestinyItemInstanceComponent,
    stats?: DestinyItemStatsComponent,
    sockets?: DestinyItemSocketsComponent
): Weapon => {
    const baseItem = mapSingleItem(
        bungieItem,
        manifestEntry,
        statsManifest,
        perksManifest,
        damageTypeManifests,
        itemsManifest,
        instance,
        stats,
        sockets
    );
    return {
        ...baseItem,
        damage: mapDamageTypes(damageTypeManifests, manifestEntry.damageTypeHashes),
        stats: mapStats(statsManifest, stats),
        baseStats: mapInventoryStats(statsManifest, manifestEntry.investmentStats),
        ...mapWeaponSockets(
            itemsManifest,
            statsManifest,
            manifestEntry?.sockets?.socketCategories,
            sockets
        )
    };
};

const mapArmour = (
    bungieItem: DestinyItemComponent,
    manifestEntry: DestinyInventoryItemDefinition,
    statsManifest: Record<string, DestinyStatDefinition>,
    perksManifest: Record<string, DestinySandboxPerkDefinition>,
    damageTypeManifests: Record<string, DestinyDamageTypeDefinition>,
    itemsManifest: Record<string, DestinyInventoryItemDefinition>,
    instance?: DestinyItemInstanceComponent,
    stats?: DestinyItemStatsComponent,
    sockets?: DestinyItemSocketsComponent
): Armour => {
    const baseItem = mapSingleItem(
        bungieItem,
        manifestEntry,
        statsManifest,
        perksManifest,
        damageTypeManifests,
        itemsManifest,
        instance,
        stats,
        sockets
    );

    return {
        ...baseItem,
        stats: mapStats(statsManifest, stats),
        baseStats: mapInventoryStats(statsManifest, manifestEntry.investmentStats),
        ...mapArmourSockets(
            itemsManifest,
            statsManifest,
            manifestEntry?.sockets?.socketCategories,
            sockets
        )
    };
};

const mapGhosts = (
    bungieItem: DestinyItemComponent,
    manifestEntry: DestinyInventoryItemDefinition,
    statsManifest: Record<string, DestinyStatDefinition>,
    perksManifest: Record<string, DestinySandboxPerkDefinition>,
    damageTypeManifests: Record<string, DestinyDamageTypeDefinition>,
    itemsManifest: Record<string, DestinyInventoryItemDefinition>,
    instance?: DestinyItemInstanceComponent,
    stats?: DestinyItemStatsComponent,
    sockets?: DestinyItemSocketsComponent
): GhostShell => {
    const baseItem = mapSingleItem(
        bungieItem,
        manifestEntry,
        statsManifest,
        perksManifest,
        damageTypeManifests,
        itemsManifest,
        instance,
        stats,
        sockets
    );

    return {
        ...baseItem,
        ...mapGhostSockets(
            itemsManifest,
            statsManifest,
            manifestEntry?.sockets?.socketCategories,
            sockets
        )
    };
};

const isANeededCategory = (
    item: DestinyItemComponent,
    manifestEntry: DestinyInventoryItemDefinition
): boolean => {
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
    allSockets?: Record<string, DestinyItemSocketsComponent>
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
    const perksManifest = await getCompletePerkManifest();
    const damageTypeManifests = await getCompleteDamageTypeManifest();

    const inventory: Inventory = {
        weapons: {},
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

            if (manifestEntry && isANeededCategory(item, manifestEntry)) {
                const categories = manifestEntry.itemCategoryHashes;
                const mapItemWith = <T extends InventoryItem>(mappingFn): T =>
                    mappingFn(
                        item,
                        manifestEntry,
                        statsManifest,
                        perksManifest,
                        damageTypeManifests,
                        itemsManifest,
                        instance,
                        stats,
                        sockets
                    );

                if (categories.includes(WeaponItemCategories.Weapons)) {
                    inventory.weapons[itemHash] = mapItemWith(mapWeapon);
                } else if (
                    categories.includes(ArmourItemCategories.WarlockArmour) &&
                    !categories.includes(GeneralItemCategories.Subclass)
                ) {
                    inventory.armour.warlock[itemHash] = mapItemWith(mapArmour);
                } else if (
                    categories.includes(ArmourItemCategories.HunterArmour) &&
                    !categories.includes(GeneralItemCategories.Subclass)
                ) {
                    inventory.armour.hunter[itemHash] = mapItemWith(mapArmour);
                } else if (
                    categories.includes(ArmourItemCategories.TitanArmour) &&
                    !categories.includes(GeneralItemCategories.Subclass)
                ) {
                    inventory.armour.titan[itemHash] = mapItemWith(mapArmour);
                } else if (categories.includes(GeneralItemCategories.Ghosts)) {
                    inventory.ghosts[itemHash] = mapItemWith(mapGhosts);
                } else {
                    inventory.other[itemHash] = mapItemWith(mapSingleItem);
                }
            }
        }
    }

    console.timeEnd(timerLabel);

    return inventory;
};
