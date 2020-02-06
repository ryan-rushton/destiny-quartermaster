import { combineReducers } from "redux";

import authReducer from "./components/auth/authReducer";
import userMembershipReducer from "./components/user/userReducer";

/**
 * This gets its own file (rather than in appReducer) as there were issues with circular imports.
 * Some things needed the AppStore type and exported to app reducer at the same time.
 */

const appReducer = combineReducers({
    authReducer,
    userMembershipReducer
});

export type AppStore = ReturnType<typeof appReducer>;

export default appReducer;
