import _ from "lodash";
import {
    DestinyInventoryComponent,
    DestinyItemComponent,
    DestinyInventoryItemDefinition
} from "bungie-api-ts/destiny2";

import {
    WeaponItemCategoryHashes,
    ArmourItemCategoryHashes,
    GeneralItemCategoryHashes,
    InventoryItem
} from "./inventoryTypes";
import { getInventoryItemManifest } from "../manifest/manifestStorage";

interface Inventory {
    items: Record<string, InventoryItem>;
}

const filterByCategory = (
    item: DestinyItemComponent,
    itemsManifest: Record<string, DestinyInventoryItemDefinition>
): boolean => {
    const categoriesOfInterest = [
        ...WeaponItemCategoryHashes,
        ...ArmourItemCategoryHashes,
        ...GeneralItemCategoryHashes
    ];

    const itemCategories = itemsManifest[item.itemHash]?.itemCategoryHashes || [];

    return _.intersection(categoriesOfInterest, itemCategories).length > 0;
};

const mapSingleItem = (
    bungieItem: DestinyItemComponent,
    itemsManifest: Record<string, DestinyInventoryItemDefinition>
): InventoryItem => {
    const manifestEntry = itemsManifest[bungieItem.itemHash];
    return {
        hash: bungieItem.itemHash,
        categories: manifestEntry.itemCategoryHashes,
        bungieItem,
        itemManifest: manifestEntry
    };
};

export const mapCharacterInventories = async (
    profileInventory?: DestinyInventoryComponent,
    characterEquipment?: Record<string, DestinyInventoryComponent>,
    characterInventories?: Record<string, DestinyInventoryComponent>
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

    const keyedItems = _.chain(allItems)
        .filter(item => filterByCategory(item, itemsManifest))
        .map(item => mapSingleItem(item, itemsManifest))
        .keyBy(item => item.hash)
        .value();

    console.timeEnd(timerLabel);

    return { items: keyedItems };
};
