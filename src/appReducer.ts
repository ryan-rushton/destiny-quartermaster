import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";

type SelectedCharacterState = string | null;
type SetLoadingAction = PayloadAction<boolean>;
type SetSelectedCharacter = PayloadAction<SelectedCharacterState>;

interface SelectedProfile {
    id: string;
    membershipType: number;
}

type SelectedProfileState = SelectedProfile | null;
type SetSelectedProfile = PayloadAction<SelectedProfileState>;

interface AppState {
    loadingProfile: boolean;
    selectedCharacter: SelectedCharacterState;
    selectedProfile: SelectedProfileState;
}

const initialState: AppState = {
    loadingProfile: false,
    selectedCharacter: null as SelectedCharacterState,
    selectedProfile: null as SelectedProfileState
};

const setLoadingProfileReducer: CaseReducer<AppState, SetLoadingAction> = (state, action) => ({
    ...state,
    loadingProfile: action.payload
});

const setSelectedCharacterReducer: CaseReducer<AppState, SetSelectedCharacter> = (
    state,
    action
) => ({ ...state, selectedCharacter: action.payload });

const setSelectedProfileReducer: CaseReducer<AppState, SetSelectedProfile> = (state, action) => ({
    ...state,
    selectedProfile: action.payload
});

const { actions, reducer } = createSlice({
    name: "app",
    initialState,
    reducers: {
        setLoadingProfile: setLoadingProfileReducer,
        setSelectedCharacter: setSelectedCharacterReducer,
        setSelectedProfile: setSelectedProfileReducer
    }
});

export const { setLoadingProfile, setSelectedCharacter, setSelectedProfile } = actions;

export default reducer;
