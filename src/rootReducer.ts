/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-unsafe-return */
import { Action, combineReducers, configureStore, getDefaultMiddleware } from '@reduxjs/toolkit';
import appReducer from 'state/appReducer';
import authReducer from 'state/auth/authReducer';
import { getTokenFromLocalStorage } from 'state/auth/authStorage';
import characterReducer from 'state/characters/characterReducer';
import filterReducer from 'state/filter/filterReducer';
import inventoryReducer from 'state/items/inventory/inventoryReducer';
import libraryReducer from 'state/items/library/libraryReducer';
import manifestReducer from 'state/manifest/manifestReducer';
import userReducer from 'state/user/userReducer';
import { getLastUsedProfileFromLocalStorage } from 'state/user/userStorage';

const rootReducer = combineReducers({
  app: appReducer,
  authToken: authReducer,
  characters: characterReducer,
  filter: filterReducer,
  manifest: manifestReducer,
  inventory: inventoryReducer,
  library: libraryReducer,
  user: userReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

const middleware = [
  ...getDefaultMiddleware({
    immutableCheck: false,
    serializableCheck: false,
  }),
];

const store = configureStore({
  reducer: rootReducer,
  middleware,
  devTools: {
    actionSanitizer: <A extends Action<unknown>>(action: A): A => {
      const message = 'This action has been sanitized to improve performance';
      if (action.type === 'library/saveLibrary') {
        return { ...action, payload: message };
      } else if (action.type === 'inventory/saveInventory') {
        return { ...action, payload: message };
      }

      return action;
    },
    // eslint-disable-next-line
    stateSanitizer: (state: any): any => {
      let sanitised = state;
      if (sanitised?.library) {
        sanitised = {
          ...sanitised,
          library: 'The library has been sanitised for redux dev tools performance.',
        };
      }
      if (sanitised?.inventory) {
        sanitised = {
          ...sanitised,
          inventory: 'The inventory has been sanitised for redux dev tools performance.',
        };
      }

      return sanitised;
    },
  },
  preloadedState: {
    authToken: getTokenFromLocalStorage(),
    app: {
      selectedProfile: getLastUsedProfileFromLocalStorage(),
    },
  },
});

export type StoreDispatch = typeof store.dispatch;

export default store;
