import { combineReducers, configureStore, getDefaultMiddleware, Action } from '@reduxjs/toolkit';

import authReducer from 'state/auth/authReducer';
import manifestReducer from 'state/manifest/manifestReducer';
import appReducer from 'appReducer';
import armourFilterReducer from 'components/buildGenerator/armourFilter/armourFilterReducer';
import characterReducer from 'state/characters/characterReducer';
import inventoryReducer from 'state/items/inventory/inventoryReducer';
import libraryReducer from 'state/items/library/libraryReducer';
import userReducer from 'state/user/userReducer';
import { getTokenFromLocalStorage } from 'state/auth/authStorage';
import { getLastUsedProfileFromLocalStorage } from 'state/user/userStorage';

const rootReducer = combineReducers({
    app: appReducer,
    authToken: authReducer,
    characters: characterReducer,
    armourFilter: armourFilterReducer,
    manifest: manifestReducer,
    inventory: inventoryReducer,
    library: libraryReducer,
    user: userReducer
});

export type RootState = ReturnType<typeof rootReducer>;

const middleware = [
    ...getDefaultMiddleware({
        immutableCheck: false,
        serializableCheck: false
    })
];

const store = configureStore({
    reducer: rootReducer,
    middleware,
    devTools: {
        actionSanitizer: <A extends Action<any>>(action: A): A => {
            const message = 'This action has been sanitized to improve performance';
            if (action.type === 'library/saveLibrary') {
                return { ...action, payload: message };
            } else if (action.type === 'inventory/saveInventory') {
                return { ...action, payload: message };
            }

            return action;
        },
        stateSanitizer: (state: any): any => {
            let sanitised = state;
            if (sanitised.library) {
                sanitised = {
                    ...sanitised,
                    library: 'The library has been sanitised for redux dev tools performance.'
                };
            }
            if (sanitised.inventory) {
                sanitised = {
                    ...sanitised,
                    inventory: 'The inventory has been sanitised for redux dev tools performance.'
                };
            }

            return sanitised;
        }
    },
    preloadedState: {
        authToken: getTokenFromLocalStorage(),
        app: {
            selectedProfile: getLastUsedProfileFromLocalStorage()
        }
    }
});

export type StoreDispatch = typeof store.dispatch;

export default store;
