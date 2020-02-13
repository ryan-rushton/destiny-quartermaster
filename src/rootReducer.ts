import { combineReducers, configureStore } from "@reduxjs/toolkit";

import appReducer from "./appReducer";
import authReducer from "./components/auth/authReducer";
import characterReducer from "./components/characters/characterReducer";
import manifestReducer from "./components/manifest/manifestReducer";
import inventoryReducer from "./components/inventory/inventoryReducer";
import userReducer from "./components/user/userReducer";

const rootReducer = combineReducers({
    app: appReducer,
    authToken: authReducer,
    characters: characterReducer,
    manifest: manifestReducer,
    inventory: inventoryReducer,
    user: userReducer
});

export type RootStore = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer
});

export type StoreDispatch = typeof store.dispatch;

export default store;
