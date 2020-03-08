import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";

import { AuthToken } from "./authTypes";

type AuthState = AuthToken | null;
type SaveAuthAction = PayloadAction<AuthState>;

const saveAuthTokenReducer: CaseReducer<AuthState, SaveAuthAction> = (state, action) =>
    action.payload;

const { actions, reducer } = createSlice({
    name: "authToken",
    initialState: null as AuthState,
    reducers: {
        saveAuthToken: saveAuthTokenReducer
    }
});

export const { saveAuthToken } = actions;

export default reducer;
