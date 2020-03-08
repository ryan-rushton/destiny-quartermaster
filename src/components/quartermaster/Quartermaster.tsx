import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchManifest } from "../manifest/manifestReducer";
import { fetchUserMembershipData, fetchProfileData } from "../user/userReducer";
import { RootStore } from "rootReducer";
import withAuth from "../auth/withAuth";
import AccountSelection from "../user/AccountSelection";
import BuildGenerator from "../buildGenerator/BuildGenerator";
import { setLoadingProfile } from "appReducer";
import LoadingMask from "components/loadingMask/LoadingMask";

const Quartermaster: FC = () => {
    const dispatch = useDispatch();

    const manifest = useSelector((store: RootStore) => store.manifest);
    const userMembership = useSelector((store: RootStore) => store.user.userMembership);
    const selectedProfile = useSelector((store: RootStore) => store.app.selectedProfile);
    const loadingProfile = useSelector((store: RootStore) => store.app.loadingProfile);
    const itemsHaveLoaded = useSelector((store: RootStore) =>
        Boolean(store.inventory && store.library)
    );

    if (!manifest) {
        dispatch(fetchManifest());
    }

    if (!userMembership) {
        dispatch(fetchUserMembershipData());
    }

    if (selectedProfile && !itemsHaveLoaded && !loadingProfile) {
        dispatch(fetchProfileData(selectedProfile.id, selectedProfile.membershipType));
    }

    if (itemsHaveLoaded && loadingProfile) {
        dispatch(setLoadingProfile(false));
    }

    return (
        <div>
            <LoadingMask isLoading={!itemsHaveLoaded} />
            {!selectedProfile && <AccountSelection />}
            {!loadingProfile && itemsHaveLoaded && <BuildGenerator />}
        </div>
    );
};

export default withAuth(Quartermaster);
