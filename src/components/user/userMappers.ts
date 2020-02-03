import { GroupUserInfoCard, BungieMembershipType } from "bungie-api-ts/groupv2";
import { UserMembershipData } from "bungie-api-ts/user";

import { UserMembership, Account, CrossSavePrimaryAccount, GamePlatform } from "./userTypes";

const mapGamePlatformEnum = (bungieMembershipTypeEnum: BungieMembershipType): GamePlatform => {
    switch (bungieMembershipTypeEnum) {
        case 1:
            return GamePlatform.Xbox;
        case 2:
            return GamePlatform.Psn;
        case 3:
            return GamePlatform.Steam;
        case 4:
            return GamePlatform.Blizzard;
        case 5:
            return GamePlatform.Stadia;
        default:
            return GamePlatform.Unknown;
    }
};

const mapAccount = (destinyMembership: GroupUserInfoCard): Account => {
    return {
        membershipId: destinyMembership.membershipId,
        displayName: destinyMembership.LastSeenDisplayName,
        gamePlatform: mapGamePlatformEnum(destinyMembership.membershipType),
        gamePlatformIconPath: destinyMembership.iconPath,
        isPublic: destinyMembership.isPublic
    };
};

export const mapUserMembership = ({ destinyMemberships }: UserMembershipData): UserMembership => {
    const accounts: Account[] = [];
    const nonCrossSaveAccounts = destinyMemberships.filter(
        mem => mem.applicableMembershipTypes.length === 1
    );
    const crossSavePrimaryAccounts = destinyMemberships.filter(
        mem => mem.applicableMembershipTypes.length > 1
    );
    const overriddenAccounts = destinyMemberships.filter(
        mem => mem.applicableMembershipTypes.length === 0
    );

    for (const bungieAccount of nonCrossSaveAccounts) {
        accounts.push(mapAccount(bungieAccount));
    }

    for (const bungieAccount of crossSavePrimaryAccounts) {
        const crossSaveAccount = mapAccount(bungieAccount) as CrossSavePrimaryAccount;
        const relatedAccounts = overriddenAccounts
            .filter(overridden =>
                bungieAccount.applicableMembershipTypes.includes(overridden.membershipType)
            )
            .map(mapAccount);

        crossSaveAccount.overriddenAccounts = relatedAccounts;
        accounts.push(crossSaveAccount);
    }

    return { accounts };
};
