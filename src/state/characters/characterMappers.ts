import { DestinyCharacterComponent } from 'bungie-api-ts/destiny2';
import { getClassManifest, getGenderManifest, getRaceManifest } from 'state/manifest/manifestStorage';
import { getFullImagePath } from 'util/imageUtils';
import { CharacterClass } from '../items/commonItemTypes';
import { Character } from './characterTypes';

const classHashMap: { [hash: number]: CharacterClass } = {
  671679327: 'hunter',
  2271682572: 'warlock',
  3655393761: 'titan',
};

export const mapCharacters = (characters: DestinyCharacterComponent[]): Promise<Character[]> => {
  const classPromise = getClassManifest(characters.map((c) => c.classHash));

  const genderPromise = getGenderManifest(characters.map((c) => c.genderHash));

  const racePromise = getRaceManifest(characters.map((c) => c.raceHash));

  return Promise.all([classPromise, genderPromise, racePromise]).then(
    ([classManifest, genderManifest, raceManifest]) => {
      const mappedCharacters: Character[] = [];

      for (const character of characters) {
        mappedCharacters.push({
          id: character.characterId,
          classDisplay: classManifest[character.classHash]?.displayProperties?.name,
          classType: classHashMap[character.classHash],
          light: character.light,
          race: raceManifest[character.raceHash]?.displayProperties?.name,
          gender: genderManifest[character.genderHash]?.displayProperties?.name,
          level: character.levelProgression.level,
          emblemPath: getFullImagePath(character.emblemPath),
          emblemBackgroundPath: getFullImagePath(character.emblemBackgroundPath),
        });
      }

      return mappedCharacters;
    }
  );
};
