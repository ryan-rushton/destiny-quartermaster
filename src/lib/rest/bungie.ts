import { JsonObject } from "./types";
import {
    getTokenFromLocalStorage,
    hasTokenExpired
} from "./../../components/authenticate/authenticateUtils";
import { get } from "./rest";
import { renewToken } from "../../components/authenticate/authenticate";

const BUNGIE_URL = "https://www.bungie.net/Platform";

export const bungieApiGet = async (relativeUrl: string): Promise<JsonObject | undefined> => {
    let token = getTokenFromLocalStorage();

    if (token && hasTokenExpired(token.expiresIn)) {
        token = await renewToken(token);
    }

    if (!token) {
        window.location.reload();
        return;
    }

    const { accessToken } = token;

    return get(`${BUNGIE_URL}${relativeUrl}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": process.env.REACT_APP_BUNGIE_API_KEY as string
        }
    });
};
