import { combineReducers, configureStore } from "@reduxjs/toolkit";

import appReducer from "./appReducer";
import authReducer from "./components/auth/authReducer";
import characterReducer from "./components/characters/characterReducer";
import configReducer from "./components/config/configReducer";
import inventoryReducer from "./components/inventory/inventoryReducer";
import userReducer from "./components/user/userReducer";

const rootReducer = combineReducers({
    app: appReducer,
    authToken: authReducer,
    characters: characterReducer,
    config: configReducer,
    inventory: inventoryReducer,
    user: userReducer
});

export type RootStore = ReturnType<typeof rootReducer>;

const store = configureStore({
    reducer: rootReducer
});

export type StoreDispatch = typeof store.dispatch;

export default store;
