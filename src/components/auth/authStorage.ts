import { AuthToken, isAuthToken } from "./authTypes";

const AUTH_TOKEN = "AUTH_TOKEN";
const AUTH_TIME = "AUTH_TIME";

export const putTokenInLocalStorage = (token: AuthToken, timeAcquired: number): void => {
    localStorage.setItem(AUTH_TOKEN, JSON.stringify(token));
    localStorage.setItem(AUTH_TIME, JSON.stringify(timeAcquired));
};

export const getTokenFromLocalStorage = (): AuthToken | undefined => {
    const { localStorage } = window;
    const savedToken = localStorage.getItem(AUTH_TOKEN);
    if (savedToken) {
        const jsonToken = JSON.parse(savedToken);
        if (isAuthToken(jsonToken)) {
            return jsonToken;
        }
    }
};

export const getTokenTimeFromLocalStorage = (): number | undefined => {
    const { localStorage } = window;
    const savedTime = localStorage.getItem(AUTH_TIME);

    if (savedTime) {
        return Number.parseInt(savedTime);
    }
};

export const deleteAuthTokenFromLocalStorage = (): void => {
    const { localStorage } = window;
    localStorage.removeItem(AUTH_TOKEN);
    localStorage.removeItem(AUTH_TIME);
};
