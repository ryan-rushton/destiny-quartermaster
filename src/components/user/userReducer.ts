import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getValidToken } from "../auth/authToken";
import { getMembershipDataForCurrentUser } from "../../lib/bungie_api/user";
import { mapUserMembership } from "./userMappers";
import { UserMembership } from "./userTypes";
import { AppDispatch } from "../../appStore";

type ReceiveUserMembershipAction = PayloadAction<UserMembership>;

export const fetchUserMembershipData = () => {
    return async (dispatch: AppDispatch): Promise<ReceiveUserMembershipAction | void> => {
        const token = await dispatch(getValidToken());
        if (token) {
            return getMembershipDataForCurrentUser(token.accessToken)
                .then(mapUserMembership)
                .then(userMembership => dispatch(receiveUserMembership(userMembership)));
        }
    };
};

type UserState = UserMembership | null;
type UserAction = ReceiveUserMembershipAction;

const saveUserMembership = (state: UserState, action: UserAction): UserState => {
    const { payload, type } = action;
    switch (type) {
        case RECEIVE_USER_MEMBERSHIP:
            return payload;
        default:
            return state;
    }
};

const initialState = null as UserState;

export const { actions, reducer } = createSlice({
    name: "userMembership",
    initialState,
    reducers: {
        saveUserMembership
    }
});

export default reducer;
