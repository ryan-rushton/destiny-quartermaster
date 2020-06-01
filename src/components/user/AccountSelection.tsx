import React, { FC } from 'react';
import { useSelector, useDispatch } from 'react-redux';

import { RootState } from 'rootReducer';
import withAuth from '../withAuth';
import AccountSelectionButton from './AccountSelectionButton';
import styles from './AccountSelection.module.scss';
import { setSelectedProfile } from 'state/appReducer';
import { storeLastUsedProfileInLocalStorage } from '../../state/user/userStorage';

const AccountSelection: FC = () => {
    const dispatch = useDispatch();
    const userMembership = useSelector((store: RootState) => store.user.userMembership);
    const isLoading = useSelector((store: RootState) => store.app.loadingProfile);

    const getProfile = (id: string, membershipType: number): void => {
        storeLastUsedProfileInLocalStorage(id, membershipType);
        dispatch(setSelectedProfile({ id, membershipType }));
    };

    return (
        <div className={styles.accountSelection}>
            <div className={styles.buttons}>
                {userMembership?.accounts.map((account) => (
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
