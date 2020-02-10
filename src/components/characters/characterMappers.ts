import { DestinyCharacterComponent } from "bungie-api-ts/destiny2";

import { Character } from "./characterTypes";
import { DefinitionManifestsEnum } from "../config/configTypes";
import { getDefinitionManifestFromIndexDB } from "../config/configStorage";
import { getFullImagePath } from "../../util/mappingUtils";

export const mapCharacters = (characters: DestinyCharacterComponent[]): Promise<Character[]> => {
    const {
        DestinyClassDefinition,
        DestinyGenderDefinition,
        DestinyRaceDefinition
    } = DefinitionManifestsEnum;

    const classPromise = getDefinitionManifestFromIndexDB(
        DestinyClassDefinition,
        characters.map(c => c.classHash)
    );

    const genderPromise = getDefinitionManifestFromIndexDB(
        DestinyGenderDefinition,
        characters.map(c => c.genderHash)
    );

    const racePromise = getDefinitionManifestFromIndexDB(
        DestinyRaceDefinition,
        characters.map(c => c.raceHash)
    );

    return Promise.all([classPromise, genderPromise, racePromise]).then(
        ([classManifest, genderManifest, raceManifest]) => {
            const mappedCharacters: Character[] = [];

            for (const character of characters) {
                mappedCharacters.push({
                    id: character.characterId,
                    class: classManifest[character.classHash]?.displayProperties?.name,
                    light: character.light,
                    race: raceManifest[character.raceHash]?.displayProperties?.name,
                    gender: genderManifest[character.genderHash]?.displayProperties?.name,
                    level: character.levelProgression.level,
                    emblemPath: getFullImagePath(character.emblemPath),
                    emblemBackgroundPath: getFullImagePath(character.emblemBackgroundPath)
                });
            }

            return mappedCharacters;
        }
    );
};
