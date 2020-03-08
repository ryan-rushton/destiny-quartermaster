import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";
import { DestinyProfileResponse } from "bungie-api-ts/destiny2";

import { getProfile } from "lib/bungie_api/destiny2";
import { getValidToken } from "../auth/authToken";
import { getMembershipDataForCurrentUser } from "lib/bungie_api/user";
import { mapUserMembership } from "./userMappers";
import { UserMembership } from "./userTypes";
import { StoreDispatch } from "rootReducer";
import { mapCharactersFromProfileData } from "../characters/characterReducer";
import { mapInventoryFromInventoryData } from "../itemInventory/inventoryReducer";
import { buildLibrary } from "../itemLibrary/libraryReducer";
import {
    WeaponItemCategories,
    ArmourItemCategories,
    GeneralItemCategoryHashes,
    WeaponModCategories,
    ArmourModCategories,
    GhostModCategories
} from "../itemCommon/commonItemTypes";
import {
    getInventoryItemManifestByCategory,
    getCompleteStatManifest,
    getCompleteDamageTypeManifest,
    getCompletePlugSetManifest
} from "../manifest/manifestStorage";
import { setLoadingProfile } from "appReducer";

type SaveUserMembershipAction = PayloadAction<UserMembership>;
type SaveProfileAction = PayloadAction<DestinyProfileResponse>;
type LoadingProfileAction = PayloadAction<boolean>;

interface UserState {
    userMembership: UserMembership | null;
}

const saveUserMembershipReducer: CaseReducer<UserState, SaveUserMembershipAction> = (
    state,
    action
) => ({ ...state, userMembership: action.payload });

const initialState: UserState = {
    userMembership: null as UserMembership | null
};

const { actions, reducer } = createSlice({
    name: "user",
    initialState,
    reducers: {
        saveUserMembership: saveUserMembershipReducer
    }
});

export const { saveUserMembership } = actions;

/*
 * Complex actions
 */

export const fetchUserMembershipData = () => {
    return async (dispatch: StoreDispatch): Promise<SaveUserMembershipAction | void> => {
        const token = await dispatch(getValidToken());
        if (token) {
            const userMembership = await getMembershipDataForCurrentUser(token.accessToken);
            dispatch(saveUserMembership(mapUserMembership(userMembership)));
        }
    };
};

export const fetchProfileData = (id: string, membershipType: number) => {
    return async (dispatch: StoreDispatch): Promise<void> => {
        const token = await dispatch(getValidToken());
        if (token) {
            dispatch(setLoadingProfile(true));

            const profile = await getProfile(id, membershipType, token.accessToken);
            dispatch(mapCharactersFromProfileData(profile.characters));

            const allCategories = [
                WeaponItemCategories.Weapons,
                ArmourItemCategories.Armour,
                ...GeneralItemCategoryHashes,
                WeaponModCategories.WeaponMods,
                ArmourModCategories.ArmourMods,
                GhostModCategories.GhostMods
            ];
            const [
                itemsManifest,
                statsManifest,
                damageTypeManifests,
                plugSetDefinition
            ] = await Promise.all([
                getInventoryItemManifestByCategory(allCategories),
                getCompleteStatManifest(),
                getCompleteDamageTypeManifest(),
                getCompletePlugSetManifest()
            ]);

            dispatch(
                buildLibrary(itemsManifest, statsManifest, damageTypeManifests, plugSetDefinition)
            );

            dispatch(
                mapInventoryFromInventoryData(
                    itemsManifest,
                    statsManifest,
                    damageTypeManifests,
                    profile.profileInventory,
                    profile.characterEquipment,
                    profile.characterInventories,
                    profile.itemComponents
                )
            );
        }
    };
};

export default reducer;
