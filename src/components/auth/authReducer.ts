import { createSlice, PayloadAction } from "@reduxjs/toolkit";

import { getTokenFromLocalStorage } from "./authStorage";
import { AuthToken } from "./authTypes";

const SAVE_OAUTH_TOKEN = "SAVE_TOKEN";

type AuthState = AuthToken | null;
type SaveOAuthAction = PayloadAction<OAuthType>;

const saveAuthToken = (state: AuthState, action: SaveOAuthAction): AuthState => {
    const { payload, type } = action;
    switch (type) {
        case SAVE_OAUTH_TOKEN:
            return payload;
        default:
            return state;
    }
};

const initialState: AuthState = getTokenFromLocalStorage() || null;

export const { actions, reducer } = createSlice({
    name: "authToken",
    initialState,
    reducers: {
        saveAuthToken
    }
});

export default reducer;
