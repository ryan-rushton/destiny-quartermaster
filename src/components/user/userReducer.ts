import { createAction } from "@reduxjs/toolkit";

import { getValidToken } from "../auth/authToken";
import { getMembershipDataForCurrentUser } from "../../lib/bungie_api/user";
import { mapUserMembership } from "./userMappers";
import { UserMembership } from "./userTypes";
import { Action } from "../../types";
import { AppDispatch } from "../../index";

const RECEIVE_USER_MEMBERSHIP = "RECEIVE_USER_MEMBERSHIP";

type ReceiveUserMembershipAction = Action<UserMembership>;

const receiveUserMembership = createAction<UserMembership>(RECEIVE_USER_MEMBERSHIP);

export const fetchUserMembershipData = () => {
    return (dispatch: AppDispatch): Promise<ReceiveUserMembershipAction | void> =>
        getValidToken().then(token => {
            if (token) {
                getMembershipDataForCurrentUser(token.accessToken)
                    .then(mapUserMembership)
                    .then(userMembership => dispatch(receiveUserMembership(userMembership)));
            }
        });
};

type UserState = UserMembership | null;
type UserAction = ReceiveUserMembershipAction;

const userMembershipReducer = (state: UserState, action: UserAction): UserMembership | null => {
    const { payload, type } = action;
    switch (type) {
        case RECEIVE_USER_MEMBERSHIP:
            return payload;
        default:
            return state || null;
    }
};

export default userMembershipReducer;
