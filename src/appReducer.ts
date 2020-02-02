import { combineReducers } from "redux";

import authReducer from "./components/auth/authReducer";
import userMembershipReducer from "./components/user/userReducer";

const appReducer = combineReducers({
    oAuthToken: authReducer,
    userMembership: userMembershipReducer
});

export type AppStore = ReturnType<typeof appReducer>;

export default appReducer;
