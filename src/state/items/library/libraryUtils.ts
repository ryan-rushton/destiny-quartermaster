import { DestinyInventoryItemDefinition } from 'bungie-api-ts/destiny2';

import { LibraryArmour } from 'state/items/library/libraryTypes';
import {
    ArmourItemCategories,
    GeneralItemCategories,
    ArmourModCategories
} from 'state/items/commonItemTypes';

// This has been deprecated so filter it out
const ParagonModHash = 926084009;

export const isArmour2 = (item: DestinyInventoryItemDefinition): boolean =>
    item.itemCategoryHashes.includes(ArmourItemCategories.Armour) &&
    item.sockets?.socketCategories.some(cat => cat.socketCategoryHash === 760375309) &&
    !item.itemCategoryHashes.includes(GeneralItemCategories.Subclass) &&
    item.inventory.tierType !== 4 && // ignore rare items
    item.inventory.tierType !== 3 && // ignore common items
    item.inventory.tierType !== 2;

export const isArmour2Mod = (item: DestinyInventoryItemDefinition): boolean =>
    item.hash !== ParagonModHash &&
    item.itemCategoryHashes.includes(ArmourModCategories.ArmourMods) &&
    item.plug?.plugCategoryIdentifier !== 'enhancements.season_penumbra' &&
    (item.plug?.plugCategoryIdentifier.startsWith('enhancements.v2') ||
        item.plug?.plugCategoryIdentifier.startsWith('enhancements.season'));

export const compareLibraryArmour = (a: LibraryArmour, b: LibraryArmour): number => {
    if (a.exotic && !b.exotic) {
        return -1;
    }

    if (!a.exotic && b.exotic) {
        return 1;
    }

    if (a.season !== b.season) {
        return b.season - a.season;
    }

    return a.name.localeCompare(b.name);
};
