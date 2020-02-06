import React, { FC } from "react";
import { useSelector, useDispatch } from "react-redux";

import { AppStore } from "../../appReducer";
import withAuth from "../auth/withAuth";
import { fetchUserMembershipData } from "./userReducer";
import AccountSelectionButton from "./components/AccountSelectionButton";
import styles from "./AccountSelection.module.scss";

const AccountSelection: FC = () => {
    const dispatch = useDispatch();
    const userMembership = useSelector((store: AppStore) => store.userMembership);

    if (!userMembership) {
        dispatch(fetchUserMembershipData());
    }

    return (
        <div className={styles.accountSelection}>
            {userMembership?.accounts.map(account => (
                <AccountSelectionButton key={account.id} account={account} />
            ))}
        </div>
    );
};

export default withAuth(AccountSelection);
