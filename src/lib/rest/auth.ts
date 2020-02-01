import { post } from "./rest";
import { AuthToken } from "../../components/authenticate/authTypes";

export interface JsonAuthToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
    membership_id: string;
}

const mapToken = (jsonToken: JsonAuthToken): AuthToken => {
    return {
        accessToken: jsonToken.access_token,
        tokenType: jsonToken.token_type,
        expiresIn: jsonToken.expires_in,
        refreshToken: jsonToken.refresh_token,
        refreshExpiresIn: jsonToken.refresh_expires_in,
        membershipId: jsonToken.membership_id
    };
};

export const getOAuthToken = async (code: string): Promise<AuthToken> => {
    const token = await post(
        "https://www.bungie.net/platform/app/oauth/token/",
        `grant_type=authorization_code&code=${code}`,
        {
            headers: {
                Authorization: `Basic ${btoa(
                    `${process.env.REACT_APP_BUNGIE_API_CLIENT_ID}:${process.env.REACT_APP_BUNGIE_API_CLIENT_SECRET}`
                )}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );

    return mapToken(token as JsonAuthToken);
};

export const refreshOAuthToken = async (refreshToken: string): Promise<AuthToken> => {
    const token = await post(
        "https://www.bungie.net/platform/app/oauth/token/",
        `grant_type=refresh_token&refresh_token=${refreshToken}`,
        {
            headers: {
                Authorization: `Basic ${btoa(
                    `${process.env.REACT_APP_BUNGIE_API_CLIENT_ID}:${process.env.REACT_APP_BUNGIE_API_CLIENT_SECRET}`
                )}`,
                "Content-Type": "application/x-www-form-urlencoded"
            }
        }
    );

    return mapToken(token as JsonAuthToken);
};
