import { configureStore } from "@reduxjs/toolkit";

import appReducer from "./appReducer";

const store = configureStore({
    reducer: appReducer
});

export type AppDispatch = typeof store.dispatch;
export const { dispatch } = store;

export default store;
