import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";

import { getValidToken } from "../auth/authToken";
import { getMembershipDataForCurrentUser } from "../../lib/bungie_api/user";
import { mapUserMembership } from "./userMappers";
import { UserMembership } from "./userTypes";
import { AppDispatch } from "../../appReducer";

type SaveUserMembershipAction = PayloadAction<UserMembership>;
type UserState = UserMembership | null;

const saveUserMembershipReducer: CaseReducer<UserState, SaveUserMembershipAction> = (
    state,
    action
) => action.payload;

const initialState = null as UserState;

const { actions, reducer } = createSlice({
    name: "userMembership",
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
    return async (dispatch: AppDispatch): Promise<SaveUserMembershipAction | void> => {
        const token = await dispatch(getValidToken());
        if (token) {
            return getMembershipDataForCurrentUser(token.accessToken)
                .then(mapUserMembership)
                .then(userMembership => dispatch(actions.saveUserMembership(userMembership)));
        }
    };
};

export default reducer;
