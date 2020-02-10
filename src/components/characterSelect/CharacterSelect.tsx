import React, { FC } from "react";
import { useSelector } from "react-redux";

import { AppStore } from "../../appReducer";
import styles from "./CharacterSelect.module.scss";
import AccountSelection from "../user/AccountSelection";

const CharacterSelect: FC = () => {
    const characters = useSelector((state: AppStore) => state.characters);

    return (
        <>
            <AccountSelection />
            <div className={styles.characterSelect}>
                {characters &&
                    Object.values(characters).map(character => (
                        <div key={character.id} className={styles.emblemButton}>
                            <img
                                className={styles.emblem}
                                alt={character.emblemBackgroundPath}
                                src={character.emblemBackgroundPath}
                            />
                            <div className={styles.demographics}>
                                <div className={styles.classText}>{character.class}</div>
                                <div className={styles.genderText}>
                                    {`${character.gender} ${character.race}`}
                                </div>
                            </div>
                            <div className={styles.lightText}>{character.light}</div>
                        </div>
                    ))}
            </div>
        </>
    );
};

export default CharacterSelect;
