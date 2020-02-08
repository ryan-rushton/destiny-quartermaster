import React, { FC } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { IconDefinition } from "@fortawesome/fontawesome-svg-core";
import { faXbox, faPlaystation, faSteam, faWindows } from "@fortawesome/free-brands-svg-icons";
import { faQuestionCircle } from "@fortawesome/free-regular-svg-icons";

import { Account, GamePlatform, isCrossSavePrimary } from "../userTypes";
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
    profileIsLoading: boolean;
    getProfile(id: string, membershipType: number): void;
}

const AccountSelectionButton: FC<Props> = ({ account, profileIsLoading, getProfile }) => {
    const { id, displayName, gamePlatform, membershipType } = account;
    return (
        <>
            <button
                key={id}
                className={styles.button}
                disabled={profileIsLoading}
                onClick={(): void => getProfile(id, membershipType)}
            >
                {`${displayName} / `}
                <FontAwesomeIcon icon={getIcon(gamePlatform)} />
            </button>
            {isCrossSavePrimary(account) &&
                account.overriddenAccounts.map(overridden => (
                    <button
                        key={overridden.id}
                        className={styles.button}
                        disabled={profileIsLoading}
                        onClick={(): void => getProfile(id, membershipType)}
                    >
                        {`${overridden.displayName} / `}
                        <FontAwesomeIcon icon={getIcon(overridden.gamePlatform)} />
                    </button>
                ))}
        </>
    );
};

export default AccountSelectionButton;
