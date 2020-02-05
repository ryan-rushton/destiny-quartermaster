export enum GamePlatform {
    Xbox = "Xbox",
    Psn = "Psn",
    Steam = "Steam",
    Blizzard = "Blizzard",
    Stadia = "Stadia",
    Unknown = "Unknown"
}

export interface UserMembership {
    id: string;
    accounts: Account[];
}

export interface Account {
    id: string;
    displayName: string;
    gamePlatform: GamePlatform;
    gamePlatformIconPath: string;
    isPublic: boolean;
}

export interface CrossSavePrimaryAccount extends Account {
    overriddenAccounts: Account[];
}
