import { JsonAuthToken } from 'lib/bungie_api/auth';
import { AuthToken } from './authTypes';

export const mapAuthToken = (jsonToken: JsonAuthToken): AuthToken => {
    return {
        accessToken: jsonToken.access_token,
        tokenType: jsonToken.token_type,
        expiresIn: jsonToken.expires_in,
        refreshToken: jsonToken.refresh_token,
        refreshExpiresIn: jsonToken.refresh_expires_in,
        membershipId: jsonToken.membership_id
    };
};
