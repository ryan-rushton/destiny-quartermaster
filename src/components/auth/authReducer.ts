import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";

import { getTokenFromLocalStorage } from "./authStorage";
import { AuthToken } from "./authTypes";

type AuthState = AuthToken | null;
type SaveAuthAction = PayloadAction<AuthState>;

const initialState: AuthState = getTokenFromLocalStorage() || null;

const saveAuthTokenReducer: CaseReducer<AuthState, SaveAuthAction> = (state, action) =>
    action.payload;

const { actions, reducer } = createSlice({
    name: "authToken",
    initialState,
    reducers: {
        saveAuthToken: saveAuthTokenReducer
    }
});

export const { saveAuthToken } = actions;

export default reducer;
