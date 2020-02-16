import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";
import { DestinyProfileResponse } from "bungie-api-ts/destiny2";

import { getProfile } from "./../../lib/bungie_api/destiny2";
import { getValidToken } from "../auth/authToken";
import { getMembershipDataForCurrentUser } from "../../lib/bungie_api/user";
import { mapUserMembership } from "./userMappers";
import { UserMembership } from "./userTypes";
import { StoreDispatch } from "../../rootReducer";
import { mapCharactersFromProfileData } from "../characters/characterReducer";
import { setLoading } from "../../appReducer";
import { mapInventoryFromInventoryData } from "../inventory/inventoryReducer";

type ProfileState = DestinyProfileResponse | null;
type SaveUserMembershipAction = PayloadAction<UserMembership>;
type SaveProfileAction = PayloadAction<DestinyProfileResponse>;
type LoadingProfileAction = PayloadAction<boolean>;

interface UserState {
    userMembership: UserMembership | null;
    profile: ProfileState;
}

const saveUserMembershipReducer: CaseReducer<UserState, SaveUserMembershipAction> = (
    state,
    action
) => ({ ...state, userMembership: action.payload });

const saveProfileReducer: CaseReducer<UserState, SaveProfileAction> = (state, action) => ({
    ...state,
    profile: action.payload
});

const initialState: UserState = {
    userMembership: null as UserMembership | null,
    profile: null as ProfileState
};

const { actions, reducer } = createSlice({
    name: "user",
    initialState,
    reducers: {
        saveUserMembership: saveUserMembershipReducer,
        saveProfile: saveProfileReducer
    }
});

export const { saveUserMembership, saveProfile } = actions;

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
        dispatch(setLoading(true));
        if (token) {
            const profile = await getProfile(id, membershipType, token.accessToken);
            Promise.all([
                dispatch(mapCharactersFromProfileData(profile.characters)),
                dispatch(saveProfile(profile))
            ]).finally(() => dispatch(setLoading(false)));
            dispatch(
                mapInventoryFromInventoryData(
                    profile.profileInventory,
                    profile.characterEquipment,
                    profile.characterInventories,
                    profile.itemComponents
                )
            );
        } else {
            dispatch(setLoading(false));
        }
    };
};

export default reducer;
