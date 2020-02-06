import { combineReducers, configureStore } from "@reduxjs/toolkit";

import authReducer from "./components/auth/authReducer";
import userMembershipReducer from "./components/user/userReducer";

/**
 * This gets its own file (rather than in appReducer) as there were issues with circular imports.
 * Some things needed the AppStore type and exported to app reducer at the same time.
 */

const appReducer = combineReducers({
    authToken: authReducer,
    userMembership: userMembershipReducer
});

export type AppStore = ReturnType<typeof appReducer>;

const store = configureStore({
    reducer: appReducer
});

export type AppDispatch = typeof store.dispatch;

export default store;
