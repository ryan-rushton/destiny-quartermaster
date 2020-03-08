import { combineReducers, configureStore, getDefaultMiddleware } from "@reduxjs/toolkit";

import appReducer from "./appReducer";
import authReducer from "./components/auth/authReducer";
import characterReducer from "./components/characters/characterReducer";
import manifestReducer from "./components/manifest/manifestReducer";
import inventoryReducer from "./components/itemInventory/inventoryReducer";
import libraryReducer from "./components/itemLibrary/libraryReducer";
import userReducer from "./components/user/userReducer";

const rootReducer = combineReducers({
    app: appReducer,
    authToken: authReducer,
    characters: characterReducer,
    manifest: manifestReducer,
    inventory: inventoryReducer,
    library: libraryReducer,
    user: userReducer
});

export type RootStore = ReturnType<typeof rootReducer>;

const middleware = [...getDefaultMiddleware()];

if (process.env.NODE_ENV === `development`) {
    // eslint-disable-next-line
    const { createLogger } = require(`redux-logger`);
    const logger = createLogger({ duration: true });
    middleware.push(logger);
}

const store = configureStore({
    reducer: rootReducer,
    middleware
});

export type StoreDispatch = typeof store.dispatch;

export default store;
