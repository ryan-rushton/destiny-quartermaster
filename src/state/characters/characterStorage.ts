const SELECTED_CHARACTER = 'SELECTED_CHARACTER';

export const saveSelectedCharacterToLocalStorage = (selectedCharacter: string): void => {
    const { localStorage } = window;
    localStorage.setItem(SELECTED_CHARACTER, selectedCharacter);
};

export const removeSelectedCharacterFromLocalStorage = (): void => {
    const { localStorage } = window;
    localStorage.removeItem(SELECTED_CHARACTER);
};

export const getSelectedCharacterFromLocalStorage = (): string | null => {
    const { localStorage } = window;
    return localStorage.getItem(SELECTED_CHARACTER);
};
