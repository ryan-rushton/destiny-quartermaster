import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';
import {
    DestinyInventoryItemDefinition,
    DestinyStatDefinition,
    DestinyDamageTypeDefinition,
    DestinyPlugSetDefinition,
    DestinyEnergyTypeDefinition,
} from 'bungie-api-ts/destiny2';

import { StoreDispatch } from 'rootReducer';
import { Library } from './libraryTypes';
import LibraryMapper from './LibraryMapper';
import { Manifest } from 'state/manifest/manifestTypes';
import { Mod, CharacterClass, ArmourSlots, ModSlots } from '../commonItemTypes';
import { compareLibraryArmour } from './libraryUtils';

type SaveLibraryAction = PayloadAction<Library>;
type LibraryState = Library | null;
const initialState = null as LibraryState;

const energyOrder = {
    Any: 0,
    Void: 1,
    Arc: 2,
    Solar: 3,
} as const;

const armourModCompare = (a: Mod, b: Mod): number => {
    if (a.season !== b.season) {
        return b.season - a.season;
    }

    if (!a.energyType) {
        return -1;
    }

    if (!b.energyType) {
        return 1;
    }

    if (a.energyType.name !== b.energyType.name) {
        return energyOrder[a.energyType.name] - energyOrder[b.energyType.name];
    }

    const aCost = a.energyType?.cost || 0;
    const bCost = b.energyType?.cost || 0;

    return aCost - bCost;
};

const saveLibraryReducer: CaseReducer<LibraryState, SaveLibraryAction> = (state, action) => {
    const library = action.payload;
    const classes: CharacterClass[] = ['warlock', 'hunter', 'titan'];

    for (const c of classes) {
        for (const s of ArmourSlots) {
            library.armour[c][s].sort(compareLibraryArmour);
        }
    }

    for (const s of ModSlots) {
        library.mods.armour[s].sort(armourModCompare);
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
