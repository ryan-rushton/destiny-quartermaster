import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

import { CharacterClass, Mod, ArmourSlot, ModSlot } from '../items/commonItemTypes';
import { ArmourStat } from './filterTypes';
import { LibraryArmour } from 'state/items/library/libraryTypes';
import { armourModCompare } from 'state/itemUtils';

export type ModFilterState = {
  [key in ModSlot]: Mod[];
};

interface ArmourFilterState {
  stats: {
    [key in ArmourStat]: number;
  };
  mods: ModFilterState;
  armour: {
    warlock: { [key in ArmourSlot]: LibraryArmour | null };
    hunter: { [key in ArmourSlot]: LibraryArmour | null };
    titan: { [key in ArmourSlot]: LibraryArmour | null };
  };
}

const armourSlotState: { [key in ArmourSlot]: LibraryArmour | null } = {
  helmet: null,
  arms: null,
  chest: null,
  legs: null,
  classItem: null,
};

const modSlotState: ModFilterState = {
  general: [],
  helmet: [],
  arms: [],
  chest: [],
  legs: [],
  classItem: [],
  seasonal: [],
};

const initialState: ArmourFilterState = {
  stats: {
    intellect: NaN,
    discipline: NaN,
    strength: NaN,
    mobility: NaN,
    resilience: NaN,
    recovery: NaN,
  },
  mods: modSlotState,
  armour: {
    warlock: armourSlotState,
    hunter: armourSlotState,
    titan: armourSlotState,
  },
};

type UpdateArmourMods = PayloadAction<{ mod: Mod; slot: ModSlot }>;
type UpdateRequiredArmour = PayloadAction<{
  armour: LibraryArmour;
  characterClass: CharacterClass;
}>;

type SaveStatFilterAction = PayloadAction<{ stat: ArmourStat; value: number }>;

const saveStatFilterReducer: CaseReducer<ArmourFilterState, SaveStatFilterAction> = (state, action) => {
  const { stat, value } = action.payload;
  state.stats[stat] = value;
};

const addArmourModReducer: CaseReducer<ArmourFilterState, UpdateArmourMods> = (state, action) => {
  const { mod, slot } = action.payload;
  state.mods[slot].push(mod);
  state.mods[slot].sort(armourModCompare);
  return state;
};

const removeArmourModReducer: CaseReducer<ArmourFilterState, UpdateArmourMods> = (state, action) => {
  const { mod, slot } = action.payload;
  const index = state.mods[slot].findIndex((ex) => ex.hash === mod.hash);
  state.mods[slot].splice(index, 1);
  return state;
};

const updateRequiredArmourReducer: CaseReducer<ArmourFilterState, UpdateRequiredArmour> = (state, action) => {
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
    addArmourMod: addArmourModReducer,
    removeArmourMod: removeArmourModReducer,
    updateRequiredArmour: updateRequiredArmourReducer,
  },
});

export const { saveStatFilter, addArmourMod, removeArmourMod, updateRequiredArmour } = actions;

export default reducer;
