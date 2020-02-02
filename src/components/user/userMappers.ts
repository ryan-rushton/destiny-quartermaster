import { JsonObject } from "../../lib/bungie_api/types";
import { UserMembership } from "./userTypes";

export const mapUserMembership = (data: JsonObject): UserMembership => {
    return data as UserMembership;
};
