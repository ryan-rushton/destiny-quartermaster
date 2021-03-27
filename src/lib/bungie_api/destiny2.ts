import { DestinyManifest, DestinyProfileResponse } from 'bungie-api-ts/destiny2';
import { bungieApiGet } from './bungieApi';

export interface DestinyManifestComplete extends DestinyManifest {
  jsonWorldComponentContentPaths: {
    [key: string]: {
      [key: string]: string;
    };
  };
}

export const getManifest = async (accessToken: string): Promise<DestinyManifestComplete> => {
  const bungieResponse = await bungieApiGet<DestinyManifestComplete>('/Destiny2/Manifest/', accessToken);
  return bungieResponse.Response;
};

export const getProfile = async (
  destinyMembershipId: string,
  membershipType: number,
  accessToken: string
): Promise<DestinyProfileResponse> => {
  const bungieResponse = await bungieApiGet<DestinyProfileResponse>(
    `/Destiny2/${membershipType}/Profile/${destinyMembershipId}/?components=100,102,200,201,205,300,302,304,305,307,308,310`,
    accessToken
  );

  return bungieResponse.Response;
};
