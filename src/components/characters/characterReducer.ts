import { PayloadAction, createSlice, CaseReducer } from "@reduxjs/toolkit";
import { DictionaryComponentResponse, DestinyCharacterComponent } from "bungie-api-ts/destiny2";

import { Character } from "./characterTypes";
import { StoreDispatch } from "../../rootReducer";
import { mapCharacters } from "./characterMappers";

type CharacterState = Character | null;
type SaveCharactersAction = PayloadAction<Character[]>;

interface CharactersState {
    [id: string]: Character;
}

const saveCharactersReducer: CaseReducer<CharactersState, SaveCharactersAction> = (
    state,
    action
) => {
    const characters = {};

    for (const character of action.payload) {
        characters[character.id] = character;
    }

    return { ...state, ...characters };
};

const initialState = {} as CharactersState;

const { actions, reducer } = createSlice({
    name: "characters",
    initialState,
    reducers: {
        saveCharacters: saveCharactersReducer
    }
});

export const { saveCharacters } = actions;

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
