export enum GamePlatform {
    Xbox = 'Xbox',
    Psn = 'Psn',
    Steam = 'Steam',
    Blizzard = 'Blizzard',
    Stadia = 'Stadia',
    Unknown = 'Unknown',
}

export interface UserMembership {
    accounts: Account[];
    id: string;
}

export interface Account {
    crossSavePrimary: boolean;
    displayName: string;
    gamePlatform: GamePlatform;
    gamePlatformIconPath: string;
    id: string;
    isOverridden: boolean;
    isPublic: boolean;
    membershipType: number;
}

export interface CrossSavePrimaryAccount extends Account {
    overriddenAccounts: Account[];
}

export const isCrossSavePrimary = (account: Account): account is CrossSavePrimaryAccount => {
    return account.crossSavePrimary;
};
