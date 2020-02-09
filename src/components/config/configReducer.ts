import { PayloadAction, createSlice, CaseReducer } from "@reduxjs/toolkit";

import { getManifest, DestinyManifestComplete } from "../../lib/bungie_api/destiny2";
import { AppDispatch } from "../../appReducer";
import { getValidToken } from "../auth/authToken";
import { DefinitionManifests } from "./configTypes";
import { getCommonJsonAsset } from "../../lib/bungie_api/common";
import {
    getManifestVersionInLocalStorage,
    putManifestVersionInLocalStorage,
    freshSaveOfAllDefinitionManifests,
    isManifestDBPresent,
    ManifestResponseWrapper
} from "./configStorage";

type ManifestState = DestinyManifestComplete | null;
type SaveManifestAction = PayloadAction<ManifestState>;

interface ConfigState {
    manifest: ManifestState;
}

const saveManifestReducer: CaseReducer<ConfigState, SaveManifestAction> = (state, action) => {
    return { ...state, manifest: action.payload };
};

const initialState: ConfigState = {
    manifest: null as ManifestState
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

    if (manifestVersion !== manifest.version || !isManifestDBPresent()) {
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
    return async (dispatch: AppDispatch): Promise<SaveManifestAction | void> => {
        const token = await dispatch(getValidToken());
        if (token) {
            return getManifest(token.accessToken)
                .then(manifest => fetchDefinitionManifestsIfRequired("en", manifest))
                .then(manifest => dispatch(saveManifest(manifest)));
        }
    };
};

export default reducer;
