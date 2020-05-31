import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

import { CharacterClass, Mod, ArmourType } from '../../../state/items/commonItemTypes';
import { ArmourStat } from './armourFilterTypes';
import { LibraryArmour } from 'state/items/library/libraryTypes';

interface ArmourFilterState {
    stats: {
        [key in ArmourStat]: number;
    };
    mods: Mod[];
    armour: {
        warlock: { [key in ArmourType]: LibraryArmour | null };
        hunter: { [key in ArmourType]: LibraryArmour | null };
        titan: { [key in ArmourType]: LibraryArmour | null };
    };
}

const armourSlotState: { [key in ArmourType]: LibraryArmour | null } = {
    helmet: null,
    arms: null,
    chest: null,
    legs: null,
    classItem: null
};

const initialState: ArmourFilterState = {
    stats: {
        intellect: NaN,
        discipline: NaN,
        strength: NaN,
        mobility: NaN,
        resilience: NaN,
        recovery: NaN
    },
    mods: [] as Mod[],
    armour: {
        warlock: armourSlotState,
        hunter: armourSlotState,
        titan: armourSlotState
    }
};

type UpdateArmourMods = PayloadAction<Mod>;
type UpdateRequiredArmour = PayloadAction<{
    armour: LibraryArmour;
    characterClass: CharacterClass;
}>;

type SaveStatFilterAction = PayloadAction<{ stat: ArmourStat; value: number }>;

const saveStatFilterReducer: CaseReducer<ArmourFilterState, SaveStatFilterAction> = (
    state,
    action
) => {
    const { stat, value } = action.payload;
    state.stats[stat] = value;
};

const updateArmourModsReducer: CaseReducer<ArmourFilterState, UpdateArmourMods> = (
    state,
    action
) => {
    if (state.mods.some(mod => mod.hash === action.payload.hash)) {
        state.mods = state.mods.filter(mod => mod.hash !== action.payload.hash);
    } else {
        state.mods.push(action.payload);
    }
};

const updateRequiredArmourReducer: CaseReducer<ArmourFilterState, UpdateRequiredArmour> = (
    state,
    action
) => {
    const { characterClass, armour } = action.payload;
    if (characterClass) {
        if (state.armour[characterClass][armour.type]?.hash === armour.hash) {
            state.armour[characterClass][armour.type] = null;
        } else {
            state.armour[characterClass][armour.type] = armour;
        }
    }
};

const { actions, reducer } = createSlice({
    name: 'armourFilter',
    initialState,
    reducers: {
        saveStatFilter: saveStatFilterReducer,
        updateArmourMods: updateArmourModsReducer,
        updateRequiredArmour: updateRequiredArmourReducer
    }
});

export const { saveStatFilter, updateArmourMods, updateRequiredArmour } = actions;

export default reducer;
