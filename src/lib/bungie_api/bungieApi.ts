import { isNumber, isString, isObject } from "./types";
import { get } from "./rest";

const BUNGIE_URL = "https://www.bungie.net/Platform";

interface BungieResponse<T> {
    Response: T;
    ErrorCode: number;
    ThrottleSeconds: number;
    ErrorStatus: string;
    Message: string;
    MessageData: Record<string, string>;
    DetailedErrorTrace?: string;
}

const isBungieResponse = <T>(val): val is BungieResponse<T> => {
    if (val) {
        return (
            val.Response &&
            isNumber(val.ErrorCode) &&
            isNumber(val.ThrottleSeconds) &&
            isString(val.ErrorStatus) &&
            isString(val.Message) &&
            isObject(val.MessageData)
        );
    }

    return false;
};

export const bungieApiGet = async <T>(
    relativeUrl: string,
    accessToken: string
): Promise<BungieResponse<T>> => {
    const response = await get(`${BUNGIE_URL}${relativeUrl}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": process.env.REACT_APP_BUNGIE_API_KEY as string
        }
    });

    if (!isBungieResponse<T>(response)) {
        throw Error(`Invalid bungie response from ${relativeUrl}`);
    }

    return response;
};
