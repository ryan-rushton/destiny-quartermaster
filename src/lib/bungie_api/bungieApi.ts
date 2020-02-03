import { ServerResponse } from "bungie-api-ts/common";

import { get } from "./rest";

const BUNGIE_URL = "https://www.bungie.net/Platform";

const isString = (val): boolean => typeof val === "string";
const isNumber = (val): boolean => typeof val === "number";
const isObject = (val): boolean => typeof val === "object";

const isServerResponse = <T>(val): val is ServerResponse<T> => {
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
): Promise<ServerResponse<T>> => {
    const response = await get(`${BUNGIE_URL}${relativeUrl}`, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
            "X-API-Key": process.env.REACT_APP_BUNGIE_API_KEY as string
        }
    });

    if (!isServerResponse<T>(response)) {
        throw Error(`Invalid bungie response from ${relativeUrl}`);
    }

    return response;
};
