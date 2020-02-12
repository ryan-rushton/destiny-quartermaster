import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./components/auth/authReducer";
import configReducer from "./components/config/configReducer";
import characterReducer from "./components/characters/characterReducer";
import loadingReducer from "./components/loadingReducer";
import userReducer from "./components/user/userReducer";

const appReducer = combineReducers({
    authToken: authReducer,
    characters: characterReducer,
    config: configReducer,
    loading: loadingReducer,
    user: userReducer
});

export type AppStore = ReturnType<typeof appReducer>;

const store = configureStore({
    reducer: appReducer
});

export type AppDispatch = typeof store.dispatch;

export default store;
