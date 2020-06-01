export type JsonObject = Record<string, unknown>;

const handleResponse = async (response: Response): Promise<JsonObject> => {
    if (!response.ok) {
        const { status, statusText, url } = response;
        throw new Error(`Call to ${url} failed with status ${status}: ${statusText}`);
    }

    return (await response.json()) as JsonObject;
};

export const get = async (
    requestInfo: RequestInfo,
    requestInit?: RequestInit
): Promise<JsonObject> =>
    await fetch(requestInfo, { method: 'GET', ...requestInit }).then(handleResponse);

export const post = async (
    requestInfo: RequestInfo,
    body: BodyInit,
    requestInit?: RequestInit
): Promise<JsonObject> =>
    await fetch(requestInfo, { method: 'POST', ...requestInit, body }).then(handleResponse);
