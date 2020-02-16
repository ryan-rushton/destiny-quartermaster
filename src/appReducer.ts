import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";

type SelectedCharacterState = string | null;
type SetLoadingAction = PayloadAction<boolean>;
type SetSelectedCharacter = PayloadAction<SelectedCharacterState>;

interface AppState {
    loading: boolean;
    selectedCharacter: SelectedCharacterState;
}

const initialState: AppState = {
    loading: false,
    selectedCharacter: null as SelectedCharacterState
};

const setLoadingReducer: CaseReducer<AppState, SetLoadingAction> = (state, action) => ({
    ...state,
    loading: action.payload
});
const setSelectedCharacterReducer: CaseReducer<AppState, SetSelectedCharacter> = (
    state,
    action
) => ({ ...state, selectedCharacter: action.payload });

const { actions, reducer } = createSlice({
    name: "app",
    initialState,
    reducers: {
        setLoading: setLoadingReducer,
        setSelectedCharacter: setSelectedCharacterReducer
    }
});

export const { setLoading, setSelectedCharacter } = actions;

export default reducer;
