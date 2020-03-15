import React, { FC, useState, KeyboardEvent } from "react";
import { useSelector } from "react-redux";

import { RootStore } from "rootReducer";
import styles from "./BuildGenerator.module.scss";
import ArmourFilter from "./armourFilter/ArmourFilter";
import CharacterSelect from "components/characterSelect/CharacterSelect";

enum Category {
    Armour = "armour",
    Weapons = "weapons",
    Ghosts = "ghosts"
}

interface CategoryButtonProps {
    text: string;
    selected: boolean;
    onClick(): void;
}

const CategoryButton: FC<CategoryButtonProps> = ({ text, selected, onClick }) => {
    const getOnEnter = (callback: () => void) => (event: KeyboardEvent<HTMLDivElement>): void => {
        if (event.key === "Enter") {
            callback();
        }
    };

    const selectedClass = selected ? ` ${styles.selected}` : "";

    return (
        <div
            className={`${styles.categoryButton}${selectedClass}`}
            onClick={onClick}
            onKeyPress={getOnEnter(onClick)}
            role="button"
            tabIndex={0}
        >
            {text}
        </div>
    );
};

const BuildGenerator: FC = () => {
    const library = useSelector((store: RootStore) => store.library);

    const [category, setCategory] = useState(Category.Armour);

    if (!library) {
        return null;
    }

    return (
        <div className={styles.buildGenerator}>
            <div className={styles.categorySelector}>
                <CharacterSelect />
                <CategoryButton
                    text={"Armour"}
                    selected={category === Category.Armour}
                    onClick={(): void => setCategory(Category.Armour)}
                />
                <CategoryButton
                    text={"Weapons"}
                    selected={category === Category.Weapons}
                    onClick={(): void => setCategory(Category.Weapons)}
                />
                <CategoryButton
                    text={"Ghosts"}
                    selected={category === Category.Ghosts}
                    onClick={(): void => setCategory(Category.Ghosts)}
                />
            </div>
            <div className={styles.categoryFilter}>
                {category === Category.Armour && <ArmourFilter />}
            </div>
        </div>
    );
};

export default BuildGenerator;
