import { combineReducers, configureStore } from "@reduxjs/toolkit";
import { useSelector, TypedUseSelectorHook } from "react-redux";

import authReducer from "./components/auth/authReducer";
import configReducer from "./components/config/configReducer";
import userReducer from "./components/user/userReducer";

/**
 * This gets its own file (rather than in appReducer) as there were issues with circular imports.
 * Some things needed the AppStore type and exported to app reducer at the same time.
 */

const appReducer = combineReducers({
    authToken: authReducer,
    config: configReducer,
    user: userReducer
});

export type AppStore = ReturnType<typeof appReducer>;

export const useTypedSelector: TypedUseSelectorHook<AppStore> = useSelector;

const store = configureStore({
    reducer: appReducer
});

export type AppDispatch = typeof store.dispatch;

export default store;
