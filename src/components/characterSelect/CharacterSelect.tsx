import React, { FC, useState } from "react";
import { useSelector } from "react-redux";

import { RootStore } from "../../rootReducer";
import styles from "./CharacterSelect.module.scss";
import AccountSelection from "../user/AccountSelection";
import { Character } from "../characters/characterTypes";

interface EmblemProps {
    character: Character;
}

const Emblem: FC<EmblemProps> = ({ character }) => {
    const [emblemLoaded, setEmblemLoaded] = useState(false);

    return (
        <div key={character.id} className={styles.emblemButton}>
            <img
                className={styles.emblem}
                alt={character.emblemBackgroundPath}
                src={character.emblemBackgroundPath}
                onLoad={(): void => setEmblemLoaded(true)}
            />
            {emblemLoaded && (
                <>
                    <div className={styles.demographics}>
                        <div className={styles.classText}>{character.class}</div>
                        <div
                            className={styles.genderText}
                        >{`${character.gender} ${character.race}`}</div>
                    </div>
                    <div className={styles.lightText}>{character.light}</div>
                </>
            )}
        </div>
    );
};

const CharacterSelect: FC = () => {
    const characters = useSelector((state: RootStore) => state.characters);

    return (
        <>
            <AccountSelection />
            <div className={styles.characterSelect}>
                {characters &&
                    Object.values(characters).map(character => (
                        <Emblem key={character.id} character={character} />
                    ))}
            </div>
        </>
    );
};

export default CharacterSelect;
