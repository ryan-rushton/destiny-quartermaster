const LAST_USED_PROFILE = "LAST_USED_PROFILE";

export const storeLastUsedProfileInLocalStorage = (id: string, membershipType: number): void => {
    const { localStorage } = window;
    localStorage.setItem(LAST_USED_PROFILE, JSON.stringify({ id, membershipType }));
};

export const getLastUsedProfileFromLocalStorage = (): {
    id: string;
    membershipType: number;
} | null => {
    const { localStorage } = window;
    const fromStorage = localStorage.getItem(LAST_USED_PROFILE);
    return fromStorage && JSON.parse(fromStorage);
};
