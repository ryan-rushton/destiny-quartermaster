import LoadingMask from 'components/loading-mask/LoadingMask';
import React, { FC } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from 'rootReducer';
import { fetchManifest } from 'state/manifest/manifestReducer';
import { fetchProfileData, fetchUserMembershipData } from '../state/user/userReducer';
import BuildGenerator from './build-generator/BuildGenerator';
import AccountSelection from './user/AccountSelection';
import withAuth from './withAuth';

const Quartermaster: FC = () => {
  const dispatch = useDispatch();

  const manifest = useSelector((store: RootState) => store.manifest.manifest);
  const userMembership = useSelector((store: RootState) => store.user.userMembership);
  const selectedProfile = useSelector((store: RootState) => store.app.selectedProfile);
  const itemsHaveLoaded = useSelector((store: RootState) => Boolean(store.inventory && store.library));

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
      {!selectedProfile && <AccountSelection />}
      {selectedProfile && <LoadingMask isLoading={!itemsHaveLoaded} />}
      {itemsHaveLoaded && <BuildGenerator />}
    </div>
  );
};

export default withAuth(Quartermaster);
