import { PayloadAction, createSlice, CaseReducer } from '@reduxjs/toolkit';
import { DictionaryComponentResponse, DestinyCharacterComponent } from 'bungie-api-ts/destiny2';

import { Character } from './characterTypes';
import { StoreDispatch } from 'rootReducer';
import { mapCharacters } from './characterMappers';
import {
  saveSelectedCharacterToLocalStorage,
  getSelectedCharacterFromLocalStorage,
  removeSelectedCharacterFromLocalStorage,
} from './characterStorage';

type SelectedCharacterState = string | null;

type SaveCharactersAction = PayloadAction<Character[]>;
type SetSelectedCharacter = PayloadAction<SelectedCharacterState>;

interface CharactersState {
  characters: {
    [id: string]: Character;
  };
  selected: SelectedCharacterState;
}

const saveCharactersReducer: CaseReducer<CharactersState, SaveCharactersAction> = (state, action) => {
  const characters = {};

  for (const character of action.payload) {
    characters[character.id] = character;
  }

  const selected = getSelectedCharacterFromLocalStorage();

  if (Object.keys(characters).some((id: string): boolean => id === selected)) {
    return { ...state, characters, selected };
  }

  return { ...state, characters };
};

const setSelectedCharacterReducer: CaseReducer<CharactersState, SetSelectedCharacter> = (state, action) => {
  const selected = action.payload;
  if (selected) {
    saveSelectedCharacterToLocalStorage(selected);
  } else {
    removeSelectedCharacterFromLocalStorage();
  }
  return { ...state, selected };
};

const initialState = {
  selected: null as SelectedCharacterState,
} as CharactersState;

const { actions, reducer } = createSlice({
  name: 'characters',
  initialState,
  reducers: {
    saveCharacters: saveCharactersReducer,
    setSelectedCharacter: setSelectedCharacterReducer,
  },
});

export const { saveCharacters, setSelectedCharacter } = actions;

export const mapCharactersFromProfileData = (
  characterResponse: DictionaryComponentResponse<DestinyCharacterComponent>
) => {
  return async (dispatch: StoreDispatch): Promise<SaveCharactersAction | void> => {
    if (characterResponse.data) {
      const characters = await mapCharacters(Object.values(characterResponse.data));
      return dispatch(saveCharacters(characters));
    }
  };
};

export default reducer;
