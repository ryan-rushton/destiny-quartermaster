import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";

type SetLoadingAction = PayloadAction<boolean>;

const setLoadingReducer: CaseReducer<boolean, SetLoadingAction> = (state, action) => action.payload;

const { actions, reducer } = createSlice({
    name: "loading",
    initialState: false,
    reducers: {
        setLoading: setLoadingReducer
    }
});

export const { setLoading } = actions;

export default reducer;
