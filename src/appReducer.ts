import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./components/auth/authReducer";
import configReducer from "./components/config/configReducer";
import characterReducer from "./components/characters/characterReducer";
import userReducer from "./components/user/userReducer";

const appReducer = combineReducers({
    authToken: authReducer,
    config: configReducer,
    user: userReducer,
    characters: characterReducer
});

export type AppStore = ReturnType<typeof appReducer>;

const store = configureStore({
    reducer: appReducer
});

export type AppDispatch = typeof store.dispatch;

export default store;
