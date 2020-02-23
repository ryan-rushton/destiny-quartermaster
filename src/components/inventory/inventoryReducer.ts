import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";
import {
    DestinyInventoryComponent,
    DictionaryComponentResponse,
    SingleComponentResponse,
    DestinyItemComponentSetOfint64
} from "bungie-api-ts/destiny2";

import { StoreDispatch } from "../../rootReducer";
import { mapCharacterInventories } from "./inventoryMappers";

type SaveInventoryAction = PayloadAction<any>;

const initialState: any = null as any;

const saveInventoryReducer: CaseReducer<any, SaveInventoryAction> = (state, action) =>
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
    profileInventory: SingleComponentResponse<DestinyInventoryComponent>,
    characterEquipment: DictionaryComponentResponse<DestinyInventoryComponent>,
    characterInventoryData: DictionaryComponentResponse<DestinyInventoryComponent>,
    itemComponents: DestinyItemComponentSetOfint64
) => async (dispatch: StoreDispatch): Promise<void> => {
    const { instances, sockets, stats } = itemComponents;
    const inventory = await mapCharacterInventories(
        profileInventory.data,
        characterEquipment.data,
        characterInventoryData.data,
        instances.data,
        stats.data,
        sockets.data
    );
    dispatch(saveInventory(inventory));
};

export default reducer;
