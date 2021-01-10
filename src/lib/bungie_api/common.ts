import { get, JsonObject } from './rest';

const BUNGIE_URL = 'https://www.bungie.net';

/**
 * Fetches bungie assets and returns their parsed json from. Manifest definitions are a good example.
 *
 * @param relativePath relative path to fetch
 */
export const getCommonJsonAsset = (relativePath: string): Promise<JsonObject> => {
  return get(`${BUNGIE_URL}${relativePath}`);
};
