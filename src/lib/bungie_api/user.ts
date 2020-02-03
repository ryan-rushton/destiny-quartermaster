import { UserMembershipData } from "bungie-api-ts/user";

import { bungieApiGet } from "./bungieApi";

export const getMembershipDataForCurrentUser = async (
    accessToken: string
): Promise<UserMembershipData> => {
    const bungieResponse = await bungieApiGet<UserMembershipData>(
        "/User/GetMembershipsForCurrentUser/",
        accessToken
    );
    return bungieResponse.Response;
};
