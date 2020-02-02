import {
    getTokenTimeFromLocalStorage,
    getTokenFromLocalStorage,
    deleteAuthTokenFromLocalStorage,
    putTokenInLocalStorage
} from "./authStorage";
import { AuthToken } from "./authTypes";
import { mapAuthToken } from "./authMappers";
import { refreshOAuthToken, getOAuthToken } from "../../lib/bungie_api/auth";
import { dispatch } from "../../index";
import { saveOauthToken } from "./authReducer";
/**
 * Checks whether the auth token has run out of life, either in regards to token life or reauth life.
 *
 * @param tokenTime The time param on the token in seconds
 * @param startOfAuth The start of the auth process
 */
const isTokenValid = (tokenTime: number, savedTokenTime: number, startOfAuth: number): boolean => {
    const timeAlive = (startOfAuth - savedTokenTime) / 1000;
    return tokenTime - timeAlive > 120;
};

const saveToken = (startAuth: number, token: AuthToken): void => {
    putTokenInLocalStorage(token, startAuth);
    dispatch(saveOauthToken(token));
};

const renewToken = async (
    token: AuthToken,
    savedTime: number,
    startAuth: number
): Promise<AuthToken | undefined> => {
    const canReAuth = token && isTokenValid(token.refreshExpiresIn, savedTime, startAuth);
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
    const startAuth = Date.now();

    if (savedToken && savedTime) {
        if (isTokenValid(savedToken.expiresIn, savedTime, startAuth)) {
            return savedToken;
        } else {
            return await renewToken(savedToken, savedTime, startAuth);
        }
    } else if (codeFromQueryParam) {
        const newToken = await getOAuthToken(codeFromQueryParam);
        const mappedToken = mapAuthToken(newToken);
        saveToken(startAuth, mappedToken);
        return mappedToken;
    }
};
