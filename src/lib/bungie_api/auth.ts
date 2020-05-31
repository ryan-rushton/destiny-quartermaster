import { post } from './rest';

export interface JsonAuthToken {
    access_token: string;
    token_type: string;
    expires_in: number;
    refresh_token: string;
    refresh_expires_in: number;
    membership_id: string;
}

const appOauthToken = async (body: string): Promise<JsonAuthToken> => {
    const token = await post('https://www.bungie.net/platform/app/oauth/token/', body, {
        headers: {
            Authorization: `Basic ${btoa(
                `${process.env.REACT_APP_BUNGIE_API_CLIENT_ID}:${process.env.REACT_APP_BUNGIE_API_CLIENT_SECRET}`
            )}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    });

    return token as JsonAuthToken;
};

export const getOAuthToken = async (code: string): Promise<JsonAuthToken> => {
    return await appOauthToken(`grant_type=authorization_code&code=${code}`);
};

export const refreshOAuthToken = async (refreshToken: string): Promise<JsonAuthToken> => {
    return await appOauthToken(`grant_type=refresh_token&refresh_token=${refreshToken}`);
};
