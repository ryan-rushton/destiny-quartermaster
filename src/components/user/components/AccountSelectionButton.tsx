import React, { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faXbox, faPlaystation, faSteam, faWindows } from "@fortawesome/free-brands-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";
import { faAngleDown } from "@fortawesome/free-solid-svg-icons";

import { Account, GamePlatform } from "../userTypes";
import styles from "./AccountSelectionButton.module.scss";

const getIcon = (gamePlatform: GamePlatform): IconDefinition => {
    switch (gamePlatform) {
        case GamePlatform.Xbox:
            return faXbox;
        case GamePlatform.Psn:
            return faPlaystation;
        case GamePlatform.Steam:
            return faSteam;
        case GamePlatform.Blizzard:
        case GamePlatform.Stadia:
            return faWindows;
        default:
            return faQuestionCircle;
    }
};

interface Props {
    account: Account;
}

const AccountSelectionButton: FC<Props> = ({ account }) => {
    const { id, displayName, gamePlatform } = account;
    return (
        <div key={id} className={styles.button}>
            {`${displayName} / `}
            <FontAwesomeIcon icon={getIcon(gamePlatform)} />
            {}
        </div>
    );
};

export default AccountSelectionButton;
