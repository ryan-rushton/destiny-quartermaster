import { JsonObject } from "./types";
import { bungieApiGet } from "./bungieApi";
import { JsonAuthToken } from "./auth";

interface UserMembershipData {
    destinyMemberships: any;
    bungieNetUser: any;
}

export const getMembershipDataForCurrentUser = async (accessToken: string): Promise<JsonObject> => {
    const bungieResponse = await bungieApiGet<JsonAuthToken>(
        "/User/GetMembershipsForCurrentUser/",
        accessToken
    );
    return bungieResponse.Response;
};
