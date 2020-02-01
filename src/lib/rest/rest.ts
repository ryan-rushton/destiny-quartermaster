import { JsonObject } from "./types";
const withTimeout = (promise: Promise<Response>): Promise<Response> =>
    Promise.race<any>([
        promise,
        new Promise<Error>((_, reject) => setTimeout(() => reject(new Error("timeout")), 10000))
    ]);

const handleResponse = async (response: Response): Promise<JsonObject> => {
    const { ok, status, statusText, url } = response;
    if (!ok) {
        throw new Error(`Call to ${url} failed with status ${status}: ${statusText}`);
    }

    return (await response.json()) as JsonObject;
};

export const get = async (
    requestInfo: RequestInfo,
    requestInit?: RequestInit
): Promise<JsonObject> =>
    await withTimeout(fetch(requestInfo, { method: "GET", ...requestInit })).then(handleResponse);

export const post = async (
    requestInfo: RequestInfo,
    body: BodyInit,
    requestInit?: RequestInit
): Promise<JsonObject> =>
    await withTimeout(fetch(requestInfo, { method: "POST", ...requestInit, body })).then(
        handleResponse
    );
