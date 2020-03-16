import React, { FC } from "react";
import { useDispatch, useSelector } from "react-redux";

import { fetchManifest } from "./manifest/manifestReducer";
import { fetchUserMembershipData, fetchProfileData } from "./user/userReducer";
import { RootState } from "rootReducer";
import withAuth from "./auth/withAuth";
import AccountSelection from "./user/AccountSelection";
import BuildGenerator from "./buildGenerator/BuildGenerator";
import LoadingMask from "components/loadingMask/LoadingMask";

const Quartermaster: FC = () => {
    const dispatch = useDispatch();

    const manifest = useSelector((store: RootState) => store.manifest.manifest);
    const userMembership = useSelector((store: RootState) => store.user.userMembership);
    const selectedProfile = useSelector((store: RootState) => store.app.selectedProfile);
    const itemsHaveLoaded = useSelector((store: RootState) =>
        Boolean(store.inventory && store.library)
    );

    if (!manifest) {
        dispatch(fetchManifest());
    }

    if (!userMembership) {
        dispatch(fetchUserMembershipData());
    }

    if (selectedProfile && !itemsHaveLoaded) {
        dispatch(fetchProfileData(selectedProfile.id, selectedProfile.membershipType));
    }

    return (
        <div>
            <LoadingMask isLoading={!itemsHaveLoaded} />
            {!selectedProfile && <AccountSelection />}
            {itemsHaveLoaded && <BuildGenerator />}
        </div>
    );
};

export default withAuth(Quartermaster);
