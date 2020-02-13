import _ from "lodash";
import { DestinyInventoryComponent, DestinyItemComponent } from "bungie-api-ts/destiny2";

import { DefinitionManifestsEnum } from "../config/configTypes";
import { getDefinitionManifestFromIndexDB } from "../config/configStorage";
import {
    WeaponItemCategoryHashes,
    ArmourItemCategoryHashes,
    GeneralItemCategoryHashes,
    InventoryItem
} from "./inventoryTypes";

interface Inventory {
    items: Record<string, InventoryItem>;
}

const filterByCategory = (
    item: DestinyItemComponent,
    itemsManifest: Record<string, any>
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
    itemsManifest: Record<string, any>
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

    const { DestinyInventoryItemDefinition } = DefinitionManifestsEnum;

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

    const itemsManifest = await getDefinitionManifestFromIndexDB(
        DestinyInventoryItemDefinition,
        allItems.map(b => b.itemHash)
    );

    const keyedItems = _.chain(allItems)
        .filter(item => filterByCategory(item, itemsManifest))
        .map(item => mapSingleItem(item, itemsManifest))
        .keyBy(item => item.hash)
        .value();

    console.timeEnd(timerLabel);

    return { items: keyedItems };
};
