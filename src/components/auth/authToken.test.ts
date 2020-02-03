import { isTokenValid } from "./authToken";

/**
 * There is a 120 second buffer in the token being alive so make sure that is accounted for.
 */

test("It validates a token with time left", () => {
    const tokenTime = 3600 + 121; // in seconds
    const authStartedAt = 3600 * 1000; // in millis
    const tokenSavedAt = 0; // in millis

    expect(isTokenValid(tokenTime, tokenSavedAt, authStartedAt)).toBe(true);
});

test("It fails a token with no time left", () => {
    const tokenTime = 3600 + 120; // in seconds
    const authStartedAt = 3600 * 1000; // in millis
    const tokenSavedAt = 0; // in millis

    expect(isTokenValid(tokenTime, tokenSavedAt, authStartedAt)).toBe(false);
});
