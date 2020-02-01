import { JsonObject } from "./types";
import { bungieApiGet } from "./bungie";

export const getMembershipDataForCurrentUser = (): Promise<JsonObject | void> => {
    return bungieApiGet("/User/GetMembershipsForCurrentUser/");
};
