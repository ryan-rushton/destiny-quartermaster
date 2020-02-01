import { parse } from "query-string";
import { getOAuthToken, refreshOAuthToken } from "../../lib/rest/auth";
import {
    getTokenFromLocalStorage,
    deleteAuthTokenFromLocalStorage,
    hasTokenExpired,
    putTokenInLocalStorage
} from "./authenticateUtils";
import { saveOauthToken } from "./authReducer";
import { dispatch } from "../../appReducer";
import { AuthToken } from "./authTypes";
import { getMembershipDataForCurrentUser } from "../../lib/rest/user";

const getCodeFromQueryParam = (): string | null => {
    const { location } = window;
    const { code } = parse(location.search);
    const extractedCode = Array.isArray(code) ? code[0] : code;
    return extractedCode || null;
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
    const canReAuth = token && !hasTokenExpired(token.refreshExpiresIn, startAuth);
    deleteAuthTokenFromLocalStorage();
    if (token && canReAuth) {
        console.log("refreshing token");
        const newToken = await refreshOAuthToken(token.refreshToken);
        saveToken(startAuth, newToken);
        return newToken;
    }
};

/**
 * This HOC will check authentication tokens for a page and refresh them if need be or in the event
 * Authorisation code is present as a query parameter it will extract it, request a token and save
 * it in both local storage and the store.
 *
 * @param WrappedComponent The component to wrap.
 */
const authenticate = <T,>(WrappedComponent: T): T => {
    const startAuth = Date.now();
    const token = getTokenFromLocalStorage();
    const authCode = getCodeFromQueryParam();
    const isTokenValid = token && !hasTokenExpired(token.expiresIn, startAuth);

    if (isTokenValid) {
        getMembershipDataForCurrentUser().then(data => console.log(data));
    } else if (token && !isTokenValid) {
        renewToken(token, startAuth);
    } else if (authCode && !token) {
        getOAuthToken(authCode).then(token => {
            saveToken(startAuth, token);
            window.location.replace(window.location.pathname);
        });
    }

    return WrappedComponent;
};

export default authenticate;
