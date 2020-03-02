import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";
import {
    DestinyInventoryComponent,
    DictionaryComponentResponse,
    SingleComponentResponse,
    DestinyItemComponentSetOfint64,
    DestinyInventoryItemDefinition,
    DestinyStatDefinition,
    DestinyDamageTypeDefinition
} from "bungie-api-ts/destiny2";

import { Inventory } from "./inventoryTypes";
import { StoreDispatch } from "../../rootReducer";
import InventoryMapper from "./InventoryMapper";

type SaveInventoryAction = PayloadAction<Inventory>;
type InventoryState = Inventory | null;
const initialState = null as InventoryState;

const saveInventoryReducer: CaseReducer<InventoryState, SaveInventoryAction> = (state, action) =>
    action.payload;

const { actions, reducer } = createSlice({
    name: "inventory",
    initialState,
    reducers: {
        saveInventory: saveInventoryReducer
    }
});

export const { saveInventory } = actions;

export const mapInventoryFromInventoryData = (
    itemsManifest: Record<string, DestinyInventoryItemDefinition>,
    statsManifest: Record<string, DestinyStatDefinition>,
    damageTypeManifests: Record<string, DestinyDamageTypeDefinition>,
    profileInventory: SingleComponentResponse<DestinyInventoryComponent>,
    characterEquipment: DictionaryComponentResponse<DestinyInventoryComponent>,
    characterInventoryData: DictionaryComponentResponse<DestinyInventoryComponent>,
    itemComponents: DestinyItemComponentSetOfint64
) => (dispatch: StoreDispatch): void => {
    const { instances, sockets, stats, reusablePlugs } = itemComponents;

    const inventory = new InventoryMapper(itemsManifest, statsManifest, damageTypeManifests).map(
        profileInventory.data,
        characterEquipment.data,
        characterInventoryData.data,
        instances.data,
        stats.data,
        sockets.data,
        reusablePlugs.data
    );

    dispatch(saveInventory(inventory));
};

export default reducer;
