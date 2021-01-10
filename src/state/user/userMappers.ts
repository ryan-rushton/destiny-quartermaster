import { GroupUserInfoCard, BungieMembershipType } from 'bungie-api-ts/groupv2';
import { UserMembershipData } from 'bungie-api-ts/user';

import { UserMembership, Account, CrossSavePrimaryAccount, GamePlatform } from './userTypes';

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

const mapAccount = (
  destinyMembership: GroupUserInfoCard,
  isOverridden: boolean,
  crossSavePrimary: boolean
): Account => {
  return {
    crossSavePrimary,
    displayName: destinyMembership.LastSeenDisplayName,
    gamePlatform: mapGamePlatformEnum(destinyMembership.membershipType),
    gamePlatformIconPath: destinyMembership.iconPath,
    id: destinyMembership.membershipId,
    isOverridden,
    isPublic: destinyMembership.isPublic,
    membershipType: destinyMembership.membershipType,
  };
};

export const mapUserMembership = (userMembershipData: UserMembershipData): UserMembership => {
  const { bungieNetUser, destinyMemberships } = userMembershipData;
  const accounts: Account[] = [];
  const nonCrossSaveAccounts = destinyMemberships.filter((mem) => mem.applicableMembershipTypes.length === 1);
  const crossSavePrimaryAccounts = destinyMemberships.filter((mem) => mem.applicableMembershipTypes.length > 1);
  const overriddenAccounts = destinyMemberships.filter((mem) => mem.applicableMembershipTypes.length === 0);

  for (const bungieAccount of nonCrossSaveAccounts) {
    accounts.push(mapAccount(bungieAccount, false, false));
  }

  for (const bungieAccount of crossSavePrimaryAccounts) {
    const crossSaveAccount = mapAccount(bungieAccount, true, true) as CrossSavePrimaryAccount;
    const relatedAccounts = overriddenAccounts
      .filter((overridden) => bungieAccount.applicableMembershipTypes.includes(overridden.membershipType))
      .map((acc) => mapAccount(acc, true, false));

    crossSaveAccount.overriddenAccounts = relatedAccounts;
    accounts.push(crossSaveAccount);
  }

  return { id: bungieNetUser.membershipId, accounts };
};
