import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";
import {
    DestinyInventoryItemDefinition,
    DestinyStatDefinition,
    DestinyDamageTypeDefinition,
    DestinyPlugSetDefinition
} from "bungie-api-ts/destiny2";

import { StoreDispatch } from "rootReducer";
import { Library } from "./libraryTypes";
import LibraryMapper from "./LibraryMapper";

type SaveLibraryAction = PayloadAction<Library>;
type LibraryState = Library | null;
const initialState = null as LibraryState;

const saveLibraryReducer: CaseReducer<LibraryState, SaveLibraryAction> = (state, action) =>
    action.payload;

const { actions, reducer } = createSlice({
    name: "library",
    initialState,
    reducers: {
        saveLibrary: saveLibraryReducer
    }
});

export const { saveLibrary } = actions;

export const buildLibrary = (
    itemsManifest: Record<string, DestinyInventoryItemDefinition>,
    statsManifest: Record<string, DestinyStatDefinition>,
    damageTypeManifests: Record<string, DestinyDamageTypeDefinition>,
    plugSetsManifest: Record<string, DestinyPlugSetDefinition>
) => (dispatch: StoreDispatch): void => {
    const library = new LibraryMapper(
        itemsManifest,
        statsManifest,
        damageTypeManifests,
        plugSetsManifest
    ).map();

    dispatch(saveLibrary(library));
};

export default reducer;
