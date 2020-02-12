import React, { FC } from "react";
import { useSelector, useDispatch } from "react-redux";

import { AppStore } from "../../appReducer";
import withAuth from "../auth/withAuth";
import { fetchUserMembershipData, fetchProfileData } from "./userReducer";
import AccountSelectionButton from "./components/AccountSelectionButton";
import styles from "./AccountSelection.module.scss";
import { fetchManifest } from "../config/configReducer";

const AccountSelection: FC = () => {
    const dispatch = useDispatch();
    const userMembership = useSelector((store: AppStore) => store.user.userMembership);
    const isLoading = useSelector((store: AppStore) => store.loading);

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
