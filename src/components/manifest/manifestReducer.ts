import { PayloadAction, createSlice, CaseReducer } from "@reduxjs/toolkit";

import { getManifest, DestinyManifestComplete } from "lib/bungie_api/destiny2";
import { StoreDispatch } from "rootReducer";
import { getValidToken } from "../auth/authToken";
import { DefinitionManifests } from "./manifestTypes";
import { getCommonJsonAsset } from "lib/bungie_api/common";
import {
    getManifestVersionInLocalStorage,
    putManifestVersionInLocalStorage,
    freshSaveOfAllDefinitionManifests,
    ManifestResponseWrapper
} from "./manifestStorage";

type DestinyManifestState = DestinyManifestComplete | null;
type SaveManifestAction = PayloadAction<DestinyManifestState>;

interface ManifestState {
    manifest: DestinyManifestState;
}

const saveManifestReducer: CaseReducer<ManifestState, SaveManifestAction> = (state, action) => {
    return { ...state, manifest: action.payload };
};

const initialState: ManifestState = {
    manifest: null as DestinyManifestState
};

const { actions, reducer } = createSlice({
    name: "config",
    initialState,
    reducers: {
        saveManifest: saveManifestReducer
    }
});

export const { saveManifest } = actions;

/*
 * Complex actions
 */

const fetchDefinitionManifestsIfRequired = (
    locale: string,
    manifest: DestinyManifestComplete
): DestinyManifestComplete => {
    const localisedDefs = manifest.jsonWorldComponentContentPaths[locale];
    const manifestVersion = getManifestVersionInLocalStorage();

    if (manifestVersion !== manifest.version) {
        putManifestVersionInLocalStorage(manifest.version);

        const promises: Promise<ManifestResponseWrapper>[] = [];
        for (const manifestName of DefinitionManifests) {
            promises.push(
                getCommonJsonAsset(localisedDefs[manifestName]).then(response => ({
                    name: manifestName,
                    data: response
                }))
            );
        }
        Promise.all(promises).then(results => freshSaveOfAllDefinitionManifests(results));
    }

    return manifest;
};

export const fetchManifest = () => {
    return async (dispatch: StoreDispatch): Promise<SaveManifestAction | void> => {
        const token = await dispatch(getValidToken());
        if (token) {
            return getManifest(token.accessToken)
                .then(manifest => fetchDefinitionManifestsIfRequired("en", manifest))
                .then(manifest => dispatch(saveManifest(manifest)));
        }
    };
};

export default reducer;
