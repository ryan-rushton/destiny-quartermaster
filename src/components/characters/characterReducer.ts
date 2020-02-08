import { PayloadAction, createSlice, CaseReducer } from "@reduxjs/toolkit";

import { Character } from "./characterTypes";

type CharacterState = Character | null;
type SaveCharacterAction = PayloadAction<Character>;

interface CharactersState {
    [id: string]: Character;
}

const saveCharacterReducer: CaseReducer<CharactersState, SaveCharacterAction> = (state, action) => {
    return { ...state, characters: { ...state.characters, [action.payload.id]: action.payload } };
};

const initialState = {} as CharactersState;

const { actions, reducer } = createSlice({
    name: "characters",
    initialState,
    reducers: {
        saveCharacter: saveCharacterReducer
    }
});

export const { saveCharacter } = actions;

export default reducer;
