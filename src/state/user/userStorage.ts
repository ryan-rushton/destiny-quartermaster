import _ from 'lodash';

const LAST_USED_PROFILE = 'LAST_USED_PROFILE';

interface LastUsed {
  id: string;
  membershipType: number;
}

export const storeLastUsedProfileInLocalStorage = (id: string, membershipType: number): void => {
  const { localStorage } = window;
  localStorage.setItem(LAST_USED_PROFILE, JSON.stringify({ id, membershipType }));
};

const isLastUsedProfile = (lastUsed: unknown): lastUsed is LastUsed => {
  if (_.isObject(lastUsed)) {
    if (_.isString(lastUsed['id']) && _.isNumber(lastUsed['membershipType'])) {
      return true;
    }
  }

  return false;
};

export const getLastUsedProfileFromLocalStorage = (): LastUsed | null => {
  const { localStorage } = window;
  const fromStorage = localStorage.getItem(LAST_USED_PROFILE);
  if (fromStorage) {
    const parsed = JSON.parse(fromStorage) as unknown;
    if (isLastUsedProfile(parsed)) {
      return { id: parsed.id, membershipType: parsed.membershipType };
    }
  }

  return null;
};
