import clsx from 'clsx';
import CharacterSelect from 'components/character-select/CharacterSelect';
import React, { FC, KeyboardEvent, useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from 'rootReducer';
import ArmourFilter from './armour-filter/ArmourFilter';
import styles from './BuildGenerator.module.scss';

enum Category {
  Armour = 'armour',
  Weapons = 'weapons',
  Ghosts = 'ghosts',
}

interface CategoryButtonProps {
  text: string;
  selected: boolean;
  onClick(): void;
}

const CategoryButton: FC<CategoryButtonProps> = ({ text, selected, onClick }) => {
  const getOnEnter = (callback: () => void) => (event: KeyboardEvent<HTMLDivElement>): void => {
    if (event.key === 'Enter') {
      callback();
    }
  };

  return (
    <div
      className={clsx(styles.categoryButton, selected && styles.selected)}
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
  const library = useSelector((store: RootState) => store.library);

  const [category, setCategory] = useState(Category.Armour);

  if (!library) {
    return null;
  }

  return (
    <div className={styles.buildGenerator}>
      <div className={styles.categorySelector}>
        <CharacterSelect />
        <div className={styles.categoryButtons}>
          <CategoryButton
            text={'Armour'}
            selected={category === Category.Armour}
            onClick={(): void => setCategory(Category.Armour)}
          />
          <CategoryButton
            text={'Weapons'}
            selected={category === Category.Weapons}
            onClick={(): void => setCategory(Category.Weapons)}
          />
          <CategoryButton
            text={'Ghosts'}
            selected={category === Category.Ghosts}
            onClick={(): void => setCategory(Category.Ghosts)}
          />
        </div>
      </div>
      <div className={styles.categoryFilter}>{category === Category.Armour && <ArmourFilter />}</div>
    </div>
  );
};

export default BuildGenerator;
