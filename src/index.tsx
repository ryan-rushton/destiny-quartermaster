import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

import "./index.css";
import App from "./App";
import * as serviceWorker from "./serviceWorker";
import appReducer from "./appReducer";

const store = configureStore({
    reducer: appReducer
});

export type AppDispatch = typeof store.dispatch;
export const { dispatch } = store;

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>,
    document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
