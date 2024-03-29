import clsx from 'clsx';
import React, { FC, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'rootReducer';
import { setSelectedCharacter } from 'state/characters/characterReducer';
import { Character } from '../../state/characters/characterTypes';
import styles from './CharacterSelect.module.scss';

interface EmblemProps {
  character: Character;
  isSelected: boolean;
  onClick(id: string): void;
}

const Emblem: FC<EmblemProps> = ({ character, isSelected, onClick }) => {
  const [emblemLoaded, setEmblemLoaded] = useState(false);

  return (
    <div
      key={character.id}
      className={clsx(styles.emblemButton, !isSelected && styles.disabled)}
      role="button"
      tabIndex={0}
      onClick={(): void => onClick(character.id)}
      onKeyPress={(e): void => {
        e.key === 'Enter' && onClick(character.id);
      }}
    >
      <img
        className={styles.emblem}
        alt={character.emblemBackgroundPath}
        src={character.emblemBackgroundPath}
        onLoad={(): void => setEmblemLoaded(true)}
      />
      {emblemLoaded && (
        <>
          <div className={styles.demographics}>
            <div className={styles.classText}>{character.classDisplay}</div>
            <div className={styles.genderText}>{`${character.gender} ${character.race}`}</div>
          </div>
          <div className={styles.lightText}>{character.light}</div>
        </>
      )}
    </div>
  );
};

const CharacterSelect: FC = () => {
  const dispatch = useDispatch();
  const characters = useSelector((state: RootState) => state.characters.characters);
  const selectedCharacter = useSelector((state: RootState) => state.characters.selected);

  const dispatchSelectedCharacter = (id: string): void => {
    if (id === selectedCharacter) {
      dispatch(setSelectedCharacter(null));
    } else {
      dispatch(setSelectedCharacter(id));
    }
  };

  return (
    <>
      <div className={styles.characterSelect}>
        {characters &&
          Object.values(characters).map((character) => (
            <Emblem
              key={character.id}
              character={character}
              isSelected={selectedCharacter === character.id}
              onClick={dispatchSelectedCharacter}
            />
          ))}
      </div>
    </>
  );
};

export default CharacterSelect;
