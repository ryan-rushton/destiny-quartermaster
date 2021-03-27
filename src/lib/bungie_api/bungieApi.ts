import { ServerResponse } from 'bungie-api-ts/common';
import _ from 'lodash';
import { get } from './rest';

const BUNGIE_URL = 'https://www.bungie.net/Platform';

const isServerResponse = <T>(val: unknown): val is ServerResponse<T> => {
  if (_.isObject(val)) {
    return Boolean(
      val['Response'] &&
        _.isNumber(val['ErrorCode']) &&
        _.isNumber(val['ThrottleSeconds']) &&
        _.isString(val['ErrorStatus']) &&
        _.isString(val['Message']) &&
        _.isObject(val['MessageData'])
    );
  }

  return false;
};

export const bungieApiGet = async <T>(relativeUrl: string, accessToken: string): Promise<ServerResponse<T>> => {
  const response = await get(`${BUNGIE_URL}${relativeUrl}`, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'X-API-Key': process.env.REACT_APP_BUNGIE_API_KEY as string,
    },
  });

  if (!isServerResponse<T>(response)) {
    throw Error(`Invalid bungie response from ${relativeUrl}`);
  }

  return response;
};
