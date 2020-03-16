import { combineReducers, configureStore, getDefaultMiddleware, Action } from "@reduxjs/toolkit";

import appReducer from "appReducer";
import armourFilterReducer from "components/buildGenerator/armourFilter/armourFilterReducer";
import authReducer from "components/auth/authReducer";
import characterReducer from "components/characters/characterReducer";
import manifestReducer from "components/manifest/manifestReducer";
import inventoryReducer from "components/items/inventory/inventoryReducer";
import libraryReducer from "components/items/library/libraryReducer";
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
            const message = "This action has been sanitized to improve performance";
            if (action.type === "library/saveLibrary") {
                return { ...action, payload: message };
            } else if (action.type === "inventory/saveInventory") {
                return { ...action, payload: message };
            }

            return action;
        },
        stateSanitizer: (state: any): any => {
            let sanitised = state;
            if (sanitised.library) {
                sanitised = {
                    ...sanitised,
                    library: "The library has been sanitised for redux dev tools performance."
                };
            }
            if (sanitised.inventory) {
                sanitised = {
                    ...sanitised,
                    inventory: "The inventory has been sanitised for redux dev tools performance."
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
