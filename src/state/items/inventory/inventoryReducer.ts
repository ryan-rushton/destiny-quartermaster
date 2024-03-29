import { CaseReducer, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  DestinyDamageTypeDefinition,
  DestinyEnergyTypeDefinition,
  DestinyInventoryComponent,
  DestinyInventoryItemDefinition,
  DestinyItemComponentSetOfint64,
  DestinyStatDefinition,
  DictionaryComponentResponse,
  SingleComponentResponse,
} from 'bungie-api-ts/destiny2';
import { StoreDispatch } from 'rootReducer';
import { Manifest } from 'state/manifest/manifestTypes';
import InventoryMapper from './InventoryMapper';
import { Inventory } from './inventoryTypes';

type SaveInventoryAction = PayloadAction<Inventory>;
type InventoryState = Inventory | null;
const initialState = null as InventoryState;

const saveInventoryReducer: CaseReducer<InventoryState, SaveInventoryAction> = (state, action) => action.payload;

const { actions, reducer } = createSlice({
  name: 'inventory',
  initialState,
  reducers: {
    saveInventory: saveInventoryReducer,
  },
});

export const { saveInventory } = actions;

export const mapInventoryFromInventoryData =
  (
    itemsManifest: Manifest<DestinyInventoryItemDefinition>,
    statsManifest: Manifest<DestinyStatDefinition>,
    damageTypeManifests: Manifest<DestinyDamageTypeDefinition>,
    energyTypeManifest: Manifest<DestinyEnergyTypeDefinition>,
    profileInventory: SingleComponentResponse<DestinyInventoryComponent>,
    characterEquipment: DictionaryComponentResponse<DestinyInventoryComponent>,
    characterInventoryData: DictionaryComponentResponse<DestinyInventoryComponent>,
    itemComponents: DestinyItemComponentSetOfint64
  ) =>
  (dispatch: StoreDispatch): void => {
    const { instances, sockets, stats, reusablePlugs } = itemComponents;

    const inventory = new InventoryMapper(itemsManifest, statsManifest, damageTypeManifests, energyTypeManifest).map(
      profileInventory.data,
      characterEquipment.data,
      characterInventoryData.data,
      instances.data,
      stats.data,
      sockets.data,
      reusablePlugs.data
    );

    dispatch(saveInventory(inventory));
  };

export default reducer;
