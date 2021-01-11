import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

import { CharacterClass, Mod, ArmourSlot } from '../items/commonItemTypes';
import { ArmourStat } from './filterTypes';
import { LibraryArmour } from 'state/items/library/libraryTypes';
import { armourModCompare } from 'state/itemUtils';

export type ModFilterState = {
  [plugCategoryHash: number]: Mod[] | undefined;
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

const modSlotState: ModFilterState = {};

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

type UpdateArmourMods = PayloadAction<{ mod: Mod; plugCategoryHash: number }>;
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
  const { mod, plugCategoryHash } = action.payload;
  const mods = state.mods[plugCategoryHash] || [];

  if (!state.mods[plugCategoryHash]) {
    state.mods[plugCategoryHash] = mods;
  }

  mods.push(mod);
  mods.sort(armourModCompare);
  return state;
};

const removeArmourModReducer: CaseReducer<ArmourFilterState, UpdateArmourMods> = (state, action) => {
  const { mod, plugCategoryHash } = action.payload;
  const mods = state.mods[plugCategoryHash];

  if (mods) {
    const index = mods.findIndex((ex) => ex.hash === mod.hash);
    mods.splice(index, 1);
  }

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
