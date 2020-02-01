import { OAuthToken, oAuthToken } from "./components/authenticate/authReducer";
import { combineReducers, createStore, applyMiddleware } from "redux";
import thunkMiddleware from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";

export interface AppStore {
    oAuthToken: OAuthToken;
}

const appReducer = combineReducers({
    oAuthToken
});

export const store = createStore(appReducer, composeWithDevTools(applyMiddleware(thunkMiddleware)));

export const { dispatch } = store;
