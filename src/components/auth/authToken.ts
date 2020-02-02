import {
    getTokenTimeFromLocalStorage,
    getTokenFromLocalStorage,
    deleteAuthTokenFromLocalStorage,
    putTokenInLocalStorage
} from "./authStorage";
import { AuthToken } from "./authTypes";
import { mapAuthToken } from "./mappers";
import { refreshOAuthToken, getOAuthToken } from "../../lib/bungie_api/auth";
import { dispatch } from "../../appReducer";
import { saveOauthToken } from "./authReducer";
/**
 * Checks whether the auth token has run out of life, either in regards to token life or reauth life.
 *
 * @param tokenTime The time param on the token in seconds
 * @param startOfAuth The start of the auth process
 */
export const isTokenValid = (
    tokenTime: number,
    savedTokenTime = getTokenTimeFromLocalStorage(),
    startOfAuth = Date.now()
): boolean => {
    if (savedTokenTime) {
        const timeAlive = (startOfAuth - savedTokenTime) / 1000;
        return tokenTime - timeAlive > 60;
    }

    return true;
};

export const saveToken = (startAuth: number, token?: AuthToken): void => {
    if (token) {
        putTokenInLocalStorage(token, startAuth);
        dispatch(saveOauthToken(token));
    }
};

export const renewToken = async (
    token: AuthToken,
    startAuth = Date.now()
): Promise<AuthToken | undefined> => {
    const canReAuth = token && isTokenValid(token.refreshExpiresIn, startAuth);
    deleteAuthTokenFromLocalStorage();
    if (token && canReAuth) {
        const newToken = mapAuthToken(await refreshOAuthToken(token.refreshToken));
        saveToken(startAuth, newToken);
        return newToken;
    }
};

/**
 * Gets a valid token if at all possible. If not, undefined will be returned and the login
 * work flow should be triggered.
 *
 * @param codeFromQueryParam the code query parameter from the url which is present after authorisation.
 */
export const getValidToken = async (
    codeFromQueryParam?: string
): Promise<AuthToken | undefined> => {
    const savedToken = getTokenFromLocalStorage();
    const savedTime = getTokenTimeFromLocalStorage();

    if (savedToken && savedTime) {
        if (isTokenValid(savedToken.expiresIn, savedTime)) {
            return savedToken;
        } else {
            return await renewToken(savedToken);
        }
    } else if (codeFromQueryParam) {
        const startAuth = Date.now();
        const newToken = await getOAuthToken(codeFromQueryParam);
        const mappedToken = mapAuthToken(newToken);
        saveToken(startAuth, mappedToken);
        return mappedToken;
    }
};
