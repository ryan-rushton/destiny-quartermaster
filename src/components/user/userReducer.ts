import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";

import { getProfile } from "./../../lib/bungie_api/destiny2";
import { getValidToken } from "../auth/authToken";
import { getMembershipDataForCurrentUser } from "../../lib/bungie_api/user";
import { mapUserMembership } from "./userMappers";
import { UserMembership } from "./userTypes";
import { AppDispatch } from "../../appReducer";

type SaveUserMembershipAction = PayloadAction<UserMembership>;
type SaveProfileAction = PayloadAction<any>;

interface UserState {
    userMembership: UserMembership | null;
    profile: {
        isLoading: boolean;
        data: any;
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

const loadingProfileReducer: CaseReducer<UserState, SaveProfileAction> = (state, action) => ({
    ...state,
    profile: { ...state.profile, isLoading: action.payload }
});

const initialState: UserState = {
    userMembership: null as UserMembership | null,
    profile: {
        isLoading: false,
        data: null as any
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
            return getMembershipDataForCurrentUser(token.accessToken)
                .then(mapUserMembership)
                .then(userMembership => dispatch(saveUserMembership(userMembership)));
        }
    };
};

export const fetchProfileData = (id: string, membershipType: number) => {
    return async (dispatch: AppDispatch): Promise<SaveProfileAction | void> => {
        dispatch(loadingProfile(true));
        const token = await dispatch(getValidToken());
        if (token) {
            return getProfile(id, membershipType, token.accessToken).then(data =>
                dispatch(saveProfile(data))
            );
        } else {
            dispatch(loadingProfile(false));
        }
    };
};

export default reducer;
