import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import appReducer from "appReducer";
import armourFilterReducer from "components/buildGenerator/armourFilter/armourFilterReducer";
import authReducer from "components/auth/authReducer";
import characterReducer from "components/characters/characterReducer";
import manifestReducer from "components/manifest/manifestReducer";
import inventoryReducer from "components/itemInventory/inventoryReducer";
import libraryReducer from "components/itemLibrary/libraryReducer";
import userReducer from "components/user/userReducer";
import { getTokenFromLocalStorage } from "components/auth/authStorage";
import { getLastUsedProfileFromLocalStorage } from "components/user/userStorage";

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

export type RootStore = ReturnType<typeof rootReducer>;

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
        stateSanitizer: (state: any): any => {
            if (state.library) {
                return { ...state, library: "The library has been sanitised for redux dev tools." };
            }
            if (state.inventory) {
                return {
                    ...state,
                    inventory: "The inventory has been sanitised for redux dev tools."
                };
            }

            return state;
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
