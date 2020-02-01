import { getTokenFromLocalStorage } from "./authenticateUtils";
import { AuthToken } from "./authTypes";

const SAVE_OAUTH_TOKEN = "SAVE_TOKEN";

export type OAuthToken = AuthToken | null;

interface SaveOAuthAction {
    type: typeof SAVE_OAUTH_TOKEN;
    oAuthToken: OAuthToken;
}

export const saveOauthToken = (oAuthToken: OAuthToken): SaveOAuthAction => {
    return {
        type: SAVE_OAUTH_TOKEN,
        oAuthToken
    };
};

/**
 * The reducer for the auth state
 */
export const oAuthToken = (state: OAuthToken, action: SaveOAuthAction): OAuthToken => {
    if (!state) {
        return getTokenFromLocalStorage() || null;
    } else if (action.type === SAVE_OAUTH_TOKEN) {
        return action.oAuthToken || null;
    }

    return state || null;
};
