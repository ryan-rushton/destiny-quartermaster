import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";
import { DestinyProfileResponse } from "bungie-api-ts/destiny2";

import { getProfile } from "./../../lib/bungie_api/destiny2";
import { getValidToken } from "../auth/authToken";
import { getMembershipDataForCurrentUser } from "../../lib/bungie_api/user";
import { mapUserMembership } from "./userMappers";
import { UserMembership } from "./userTypes";
import { AppDispatch } from "../../appReducer";
import { mapCharactersFromProfileData } from "../characters/characterReducer";

type ProfileState = DestinyProfileResponse | null;
type SaveUserMembershipAction = PayloadAction<UserMembership>;
type SaveProfileAction = PayloadAction<DestinyProfileResponse>;
type LoadingProfileAction = PayloadAction<boolean>;

interface UserState {
    userMembership: UserMembership | null;
    profile: {
        isLoading: boolean;
        data: ProfileState;
    };
}

const saveUserMembershipReducer: CaseReducer<UserState, SaveUserMembershipAction> = (
    state,
    action
) => ({ ...state, userMembership: action.payload });

const saveProfileReducer: CaseReducer<UserState, SaveProfileAction> = (state, action) => ({
    ...state,
    profile: { data: action.payload, isLoading: false }
});

const loadingProfileReducer: CaseReducer<UserState, LoadingProfileAction> = (state, action) => ({
    ...state,
    profile: { ...state.profile, isLoading: action.payload }
});

const initialState: UserState = {
    userMembership: null as UserMembership | null,
    profile: {
        isLoading: false,
        data: null as ProfileState
    }
};

const { actions, reducer } = createSlice({
    name: "user",
    initialState,
    reducers: {
        saveUserMembership: saveUserMembershipReducer,
        saveProfile: saveProfileReducer,
        loadingProfile: loadingProfileReducer
    }
});

export const { saveUserMembership, saveProfile, loadingProfile } = actions;

/*
 * Complex actions
 */

export const fetchUserMembershipData = () => {
    return async (dispatch: AppDispatch): Promise<SaveUserMembershipAction | void> => {
        const token = await dispatch(getValidToken());
        if (token) {
            const userMembership = await getMembershipDataForCurrentUser(token.accessToken);
            dispatch(saveUserMembership(mapUserMembership(userMembership)));
        }
    };
};

export const fetchProfileData = (id: string, membershipType: number) => {
    return async (dispatch: AppDispatch): Promise<void> => {
        dispatch(loadingProfile(true));
        const token = await dispatch(getValidToken());
        if (token) {
            const profile = await getProfile(id, membershipType, token.accessToken);
            dispatch(mapCharactersFromProfileData(profile.characters));
            dispatch(saveProfile(profile));
        } else {
            dispatch(loadingProfile(false));
        }
    };
};

export default reducer;
