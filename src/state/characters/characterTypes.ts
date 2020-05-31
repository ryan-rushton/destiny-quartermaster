export type CharacterClass = 'warlock' | 'hunter' | 'titan';

export interface Character {
    id: string;
    classDisplay?: string;
    classType: CharacterClass;
    light: number;
    race?: string;
    gender?: string;
    level: number;
    emblemPath: string;
    emblemBackgroundPath: string;
}
