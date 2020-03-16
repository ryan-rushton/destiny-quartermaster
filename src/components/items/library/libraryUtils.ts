import { DestinyInventoryItemDefinition } from "bungie-api-ts/destiny2";

import {
    ArmourItemCategories,
    GeneralItemCategories,
    ArmourModCategories
} from "components/items/commonItemTypes";

// This has been deprecated so filter it out
const ParagonModHash = 926084009;

export const isArmour2 = (item: DestinyInventoryItemDefinition): boolean =>
    item.itemCategoryHashes.includes(ArmourItemCategories.Armour) &&
    item.sockets?.socketCategories.some(cat => cat.socketCategoryHash === 760375309) &&
    !item.itemCategoryHashes.includes(GeneralItemCategories.Subclass);

export const isArmour2Mod = (item: DestinyInventoryItemDefinition): boolean =>
    item.hash !== ParagonModHash &&
    item.itemCategoryHashes.includes(ArmourModCategories.ArmourMods) &&
    item.plug?.plugCategoryIdentifier !== "enhancements.season_penumbra" &&
    (item.plug?.plugCategoryIdentifier.startsWith("enhancements.v2") ||
        item.plug?.plugCategoryIdentifier.startsWith("enhancements.season"));
