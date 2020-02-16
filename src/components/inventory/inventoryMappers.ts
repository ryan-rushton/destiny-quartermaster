import _ from "lodash";
import {
    DestinyInventoryComponent,
    DestinyItemComponent,
    DestinyInventoryItemDefinition,
    DestinyItemInstanceComponent,
    DestinyItemPerksComponent,
    DestinyItemStatsComponent,
    DestinyItemSocketsComponent,
    DestinyItemReusablePlugsComponent,
    DestinyStatDefinition,
    DestinyStat,
    DestinySandboxPerkDefinition,
    DestinyDamageTypeDefinition,
    DamageType
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
    Perks,
    Damage
} from "./inventoryTypes";
import {
    getInventoryItemManifest,
    getCompleteStatManifest,
    getCompletePerkManifest,
    getCompleteDamageTypeManifest
} from "../manifest/manifestStorage";

interface Inventory {
    weapons: Record<string, InventoryItem>;
    armour: {
        warlock: Record<string, InventoryItem>;
        hunter: Record<string, InventoryItem>;
        titan: Record<string, InventoryItem>;
    };
    ghosts: Record<string, InventoryItem>;
    other: Record<string, InventoryItem>;
}

const mapPerks = (
    perksManifest: Record<string, DestinySandboxPerkDefinition>,
    perks?: DestinyItemPerksComponent
): Perks | undefined => {
    if (perks) {
        const mappedPerks = {};

        for (const perk of perks.perks) {
            const { perkHash, iconPath, isActive } = perk;
            const manifestEntry = perksManifest[perkHash];

            mappedPerks[perkHash] = {
                perkHash,
                iconPath,
                name: manifestEntry.displayProperties.name,
                isActive,
                manifestEntry,
                perk
            };
        }

        return mappedPerks;
    }
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

const mapDamageTypes = (
    damageTypeManifests: Record<string, DestinyDamageTypeDefinition>,
    damageTypes?: DamageType[]
): Damage[] | undefined => {
    return damageTypes?.map(type => {
        const { hash, displayProperties } = damageTypeManifests[type];
        return { hash, iconPath: displayProperties.icon, name: displayProperties.name };
    });
};

const mapSingleItem = (
    bungieItem: DestinyItemComponent,
    manifestEntry: DestinyInventoryItemDefinition,
    statsManifest: Record<string, DestinyStatDefinition>,
    perksManifest: Record<string, DestinySandboxPerkDefinition>,
    damageTypeManifests: Record<string, DestinyDamageTypeDefinition>,
    instance?: DestinyItemInstanceComponent,
    perks?: DestinyItemPerksComponent,
    stats?: DestinyItemStatsComponent,
    sockets?: DestinyItemSocketsComponent,
    reuseablePlugs?: DestinyItemReusablePlugsComponent
): InventoryItem => {
    return {
        hash: bungieItem.itemHash,
        name: manifestEntry.displayProperties.name,
        iconPath: manifestEntry.displayProperties.icon,
        stats: mapStats(statsManifest, stats),
        primaryStat: instance?.primaryStat && mapStat(statsManifest, instance?.primaryStat),
        perks: mapPerks(perksManifest, perks),
        categories: manifestEntry.itemCategoryHashes,
        damage: mapDamageTypes(damageTypeManifests, manifestEntry.damageTypeHashes),
        bungieItem,
        itemManifest: manifestEntry,
        itemComponents: {
            instance,
            perks,
            stats,
            sockets,
            reuseablePlugs
        }
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
    allPerks?: Record<string, DestinyItemPerksComponent>,
    allStats?: Record<string, DestinyItemStatsComponent>,
    allSockets?: Record<string, DestinyItemSocketsComponent>,
    allReuseablePlugs?: Record<string, DestinyItemReusablePlugsComponent>
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

    const itemsManifest = await getInventoryItemManifest(allItems.map(b => b.itemHash));
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
            const perks = allPerks && allPerks[itemInstanceId];
            const stats = allStats && allStats[itemInstanceId];
            const sockets = allSockets && allSockets[itemInstanceId];
            const reuseablePlugs = allReuseablePlugs && allReuseablePlugs[itemInstanceId];

            if (manifestEntry && isANeededCategory(item, manifestEntry)) {
                const categories = manifestEntry.itemCategoryHashes;
                const mappedItem = mapSingleItem(
                    item,
                    manifestEntry,
                    statsManifest,
                    perksManifest,
                    damageTypeManifests,
                    instance,
                    perks,
                    stats,
                    sockets,
                    reuseablePlugs
                );

                if (categories.includes(WeaponItemCategories.Weapons)) {
                    inventory.weapons[itemHash] = mappedItem;
                } else if (categories.includes(ArmourItemCategories.WarlockArmour)) {
                    inventory.armour.warlock[itemHash] = mappedItem;
                } else if (categories.includes(ArmourItemCategories.HunterArmour)) {
                    inventory.armour.hunter[itemHash] = mappedItem;
                } else if (categories.includes(ArmourItemCategories.TitanArmour)) {
                    inventory.armour.titan[itemHash] = mappedItem;
                } else if (categories.includes(GeneralItemCategories.Ghosts)) {
                    inventory.ghosts[itemHash] = mappedItem;
                } else {
                    console.error(`Item with hash ${itemHash} was missed from mapping`);
                }
            }
        }
    }

    console.timeEnd(timerLabel);

    return inventory;
};
