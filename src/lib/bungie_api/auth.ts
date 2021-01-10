import _ from 'lodash';

import { post } from './rest';

export interface JsonAuthToken {
  access_token: string;
  token_type: string;
  expires_in: number;
  refresh_token: string;
  refresh_expires_in: number;
  membership_id: string;
}

const isJsonAuthToken = (token: unknown): token is JsonAuthToken => {
  if (_.isObject(token)) {
    return (
      _.isString(token['access_token']) &&
      _.isString(token['token_type']) &&
      _.isNumber(token['expires_in']) &&
      _.isString(token['refresh_token']) &&
      _.isNumber(token['refresh_expires_in']) &&
      _.isString(token['membership_id'])
    );
  }

  return false;
};

const appOauthToken = async (body: string): Promise<JsonAuthToken | null> => {
  const token = await post('https://www.bungie.net/platform/app/oauth/token/', body, {
    headers: {
      Authorization: `Basic ${btoa(
        `${process.env.REACT_APP_BUNGIE_API_CLIENT_ID}:${process.env.REACT_APP_BUNGIE_API_CLIENT_SECRET}`
      )}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
  });

  if (isJsonAuthToken(token)) {
    return token;
  }

  return null;
};

export const getOAuthToken = async (code: string): Promise<JsonAuthToken | null> => {
  return await appOauthToken(`grant_type=authorization_code&code=${code}`);
};

export const refreshOAuthToken = async (refreshToken: string): Promise<JsonAuthToken | null> => {
  return await appOauthToken(`grant_type=refresh_token&refresh_token=${refreshToken}`);
};
