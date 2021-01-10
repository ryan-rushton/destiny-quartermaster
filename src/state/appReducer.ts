import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

type SetLoadingAction = PayloadAction<boolean>;

interface SelectedProfile {
  id: string;
  membershipType: number;
}

type SelectedProfileState = SelectedProfile | null;
type SetSelectedProfile = PayloadAction<SelectedProfileState>;

interface AppState {
  loadingProfile: boolean;
  selectedProfile: SelectedProfileState;
}

const initialState: AppState = {
  loadingProfile: false,
  selectedProfile: null as SelectedProfileState,
};

const setLoadingProfileReducer: CaseReducer<AppState, SetLoadingAction> = (state, action) => ({
  ...state,
  loadingProfile: action.payload,
});

const setSelectedProfileReducer: CaseReducer<AppState, SetSelectedProfile> = (state, action) => ({
  ...state,
  selectedProfile: action.payload,
});

const { actions, reducer } = createSlice({
  name: 'app',
  initialState,
  reducers: {
    setLoadingProfile: setLoadingProfileReducer,
    setSelectedProfile: setSelectedProfileReducer,
  },
});

export const { setLoadingProfile, setSelectedProfile } = actions;

export default reducer;
