import React, { FC } from "react";
import { useSelector, useDispatch } from "react-redux";

import { RootStore } from "../../rootReducer";
import withAuth from "../auth/withAuth";
import { fetchUserMembershipData, fetchProfileData } from "./userReducer";
import AccountSelectionButton from "./components/AccountSelectionButton";
import styles from "./AccountSelection.module.scss";
import { fetchManifest } from "../manifest/manifestReducer";

const AccountSelection: FC = () => {
    const dispatch = useDispatch();
    const userMembership = useSelector((store: RootStore) => store.user.userMembership);
    const isLoading = useSelector((store: RootStore) => store.app.loading);

    const getProfile = (id: string, membershipType: number): void => {
        dispatch(fetchProfileData(id, membershipType));
    };

    if (!userMembership) {
        dispatch(fetchManifest());
        dispatch(fetchUserMembershipData());
    }

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
