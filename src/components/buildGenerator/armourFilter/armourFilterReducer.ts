import { createSlice, PayloadAction, CaseReducer } from "@reduxjs/toolkit";

import { ArmourStat } from "./armourFilterTypes";
import { Mod } from "components/itemCommon/commonItemTypes";

interface ArmourFilterState {
    stats: {
        [key in ArmourStat]: number;
    };
    mods: Mod[];
}

const initialState: ArmourFilterState = {
    stats: {
        intellect: NaN,
        discipline: NaN,
        strength: NaN,
        mobility: NaN,
        resilience: NaN,
        recovery: NaN
    },
    mods: [] as Mod[]
};

type UpdateArmourMods = PayloadAction<Mod>;

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

const { actions, reducer } = createSlice({
    name: "armourFilter",
    initialState,
    reducers: {
        saveStatFilter: saveStatFilterReducer,
        updateArmourMods: updateArmourModsReducer
    }
});

export const { saveStatFilter, updateArmourMods } = actions;

export default reducer;
