import { createAction } from "@reduxjs/toolkit";

import { getTokenFromLocalStorage } from "./authStorage";
import { AuthToken } from "./authTypes";
import { Action } from "../../types";

const SAVE_OAUTH_TOKEN = "SAVE_TOKEN";

type OAuthType = AuthToken | null;
type SaveOAuthAction = Action<OAuthType>;

export const saveOauthToken = createAction<OAuthType>(SAVE_OAUTH_TOKEN);

/**
 * The reducer for the auth state
 */
const authReducer = (state: AuthToken | null, action: SaveOAuthAction): AuthToken | null => {
    const { payload, type } = action;
    switch (type) {
        case SAVE_OAUTH_TOKEN:
            return payload;
        default:
            return state || getTokenFromLocalStorage() || null;
    }
};

export default authReducer;
