const isString = (val): boolean => typeof val === "string";
const isNumber = (val): boolean => typeof val === "number";

export interface AuthToken {
    accessToken: string;
    tokenType: string;
    expiresIn: number;
    refreshToken: string;
    refreshExpiresIn: number;
    membershipId: string;
}

export const isAuthToken = (val): val is AuthToken => {
    if (val && val instanceof Object) {
        const {
            accessToken,
            tokenType,
            expiresIn,
            refreshToken,
            refreshExpiresIn,
            membershipId
        } = val;

        return (
            isString(accessToken) &&
            isString(tokenType) &&
            isNumber(expiresIn) &&
            isString(refreshToken) &&
            isNumber(refreshExpiresIn) &&
            isString(membershipId)
        );
    }
    return false;
};
