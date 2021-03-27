import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DestinyDamageTypeDefinition,
  DestinyEnergyTypeDefinition,
  DestinyInventoryItemDefinition,
  DestinyPlugSetDefinition,
  DestinyStatDefinition,
} from 'bungie-api-ts/destiny2';
import { StoreDispatch } from 'rootReducer';
import { armourModCompare } from 'state/itemUtils';
import { Manifest } from 'state/manifest/manifestTypes';
import { ArmourSlots, CharacterClass } from '../commonItemTypes';
import LibraryMapper from './LibraryMapper';
import { Library } from './libraryTypes';
import { compareLibraryArmour } from './libraryUtils';

type SaveLibraryAction = PayloadAction<Library>;
type LibraryState = Library | null;
const initialState = null as LibraryState;

const saveLibraryReducer: CaseReducer<LibraryState, SaveLibraryAction> = (state, action) => {
  const library = action.payload;
  const classes: CharacterClass[] = ['warlock', 'hunter', 'titan'];

  for (const c of classes) {
    for (const s of ArmourSlots) {
      library.armour[c][s].sort(compareLibraryArmour);
    }
  }

  for (const mods of Object.values(library.mods.armour)) {
    mods.sort(armourModCompare);
  }

  return library;
};

const { actions, reducer } = createSlice({
  name: 'library',
  initialState,
  reducers: {
    saveLibrary: saveLibraryReducer,
  },
});

export const { saveLibrary } = actions;

export const buildLibrary = (
  itemsManifest: Manifest<DestinyInventoryItemDefinition>,
  statsManifest: Manifest<DestinyStatDefinition>,
  damageTypeManifests: Manifest<DestinyDamageTypeDefinition>,
  plugSetsManifest: Manifest<DestinyPlugSetDefinition>,
  energyTypeManifest: Manifest<DestinyEnergyTypeDefinition>
) => (dispatch: StoreDispatch): void => {
  const library = new LibraryMapper(
    itemsManifest,
    statsManifest,
    damageTypeManifests,
    plugSetsManifest,
    energyTypeManifest
  ).map();

  dispatch(saveLibrary(library));
};

export default reducer;
