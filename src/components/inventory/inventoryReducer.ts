import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";
import {
    DestinyInventoryComponent,
    DictionaryComponentResponse,
    SingleComponentResponse
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
    characterInventoryData: DictionaryComponentResponse<DestinyInventoryComponent>
) => async (dispatch: StoreDispatch): Promise<void> => {
    const inventory = await mapCharacterInventories(
        profileInventory.data,
        characterEquipment.data,
        characterInventoryData.data
    );
    dispatch(saveInventory(inventory));
};

export default reducer;
