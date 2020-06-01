import { createSlice, PayloadAction, CaseReducer } from '@reduxjs/toolkit';

import { StoreDispatch } from 'rootReducer';
import {
    getTokenTimeFromLocalStorage,
    getTokenFromLocalStorage,
    deleteAuthTokenFromLocalStorage,
    putTokenInLocalStorage,
} from './authStorage';
import { AuthToken } from './authTypes';
import { mapAuthToken } from './authMappers';
import { refreshOAuthToken } from 'lib/bungie_api/auth';

type AuthState = AuthToken | null;
type SaveAuthAction = PayloadAction<AuthState>;

const saveAuthTokenReducer: CaseReducer<AuthState, SaveAuthAction> = (state, action) =>
    action.payload;

const { actions, reducer } = createSlice({
    name: 'authToken',
    initialState: null as AuthState,
    reducers: {
        saveAuthToken: saveAuthTokenReducer,
    },
});

export const { saveAuthToken } = actions;

/**
 * Checks whether the auth token has run out of life, either in regards to token life or reauth life.
 *
 * @param tokenTime The time param on the token in seconds
 * @param savedTokenTime The time the token was put into storage
 * @param startOfAuth The start of the auth process
 */
export const isTokenValid = (
    tokenTime: number,
    savedTokenTime: number,
    startOfAuth: number
): boolean => {
    const timeAlive = (startOfAuth - savedTokenTime) / 1000;
    return tokenTime - timeAlive > 120;
};

export const saveToken = (startAuth: number, token: AuthToken | null) => (
    dispatch: StoreDispatch
): void => {
    putTokenInLocalStorage(token, startAuth);
    dispatch(saveAuthToken(token));
};

const renewToken = async (
    dispatch: StoreDispatch,
    token: AuthToken,
    savedTime: number,
    startAuth: number
): Promise<AuthToken | undefined> => {
    const canReAuth = token && isTokenValid(token.refreshExpiresIn, savedTime, startAuth);
    deleteAuthTokenFromLocalStorage();

    console.info(`Refresh token expires at ${new Date(token.refreshExpiresIn * 1000 + savedTime)}`);

    if (token && canReAuth) {
        const newToken = mapAuthToken(await refreshOAuthToken(token.refreshToken));
        dispatch(saveToken(startAuth, newToken));
        return newToken || undefined;
    }
};

/**
 * Gets a valid token if at all possible. If not, undefined will be returned and the login
 * work flow should be triggered.
 *
 * @param codeFromQueryParam the code query parameter from the url which is present after authorisation.
 */
export const getValidToken = () => async (
    dispatch: StoreDispatch
): Promise<AuthToken | undefined> => {
    const savedToken = getTokenFromLocalStorage();
    const savedTime = getTokenTimeFromLocalStorage();
    const startAuth = Date.now();

    if (savedToken && savedTime) {
        console.info(`Auth token expires at ${new Date(savedToken.expiresIn * 1000 + savedTime)}`);
        if (isTokenValid(savedToken.expiresIn, savedTime, startAuth)) {
            return savedToken;
        } else {
            return await renewToken(dispatch, savedToken, savedTime, startAuth);
        }
    } else {
        deleteAuthTokenFromLocalStorage();
        dispatch(saveAuthToken(null));
    }
};

export default reducer;
