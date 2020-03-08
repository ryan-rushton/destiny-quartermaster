import React, { FC } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootStore } from "rootReducer";
import withAuth from "../auth/withAuth";
import AccountSelectionButton from "./components/AccountSelectionButton";
import styles from "./AccountSelection.module.scss";
import { setSelectedProfile } from "appReducer";
import { storeLastUsedProfileInLocalStorage } from "./userStorage";

const AccountSelection: FC = () => {
    const dispatch = useDispatch();
    const userMembership = useSelector((store: RootStore) => store.user.userMembership);
    const isLoading = useSelector((store: RootStore) => store.app.loadingProfile);

    const getProfile = (id: string, membershipType: number): void => {
        storeLastUsedProfileInLocalStorage(id, membershipType);
        dispatch(setSelectedProfile({ id, membershipType }));
    };

    return (
        <div className={styles.accountSelection}>
            <div className={styles.buttons}>
                {userMembership?.accounts.map(account => (
                    <AccountSelectionButton
                        key={account.id}
                        account={account}
                        profileIsLoading={isLoading}
                        getProfile={getProfile}
                    />
                ))}
            </div>
        </div>
    );
};

export default withAuth(AccountSelection);
