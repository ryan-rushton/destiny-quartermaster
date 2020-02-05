import React, { FC } from "react";
import { useSelector, useDispatch } from "react-redux";

import { AppStore } from "../../appReducer";
import withAuth from "../auth/withAuth";
import { fetchUserMembershipData } from "./userReducer";

const UserSelection: FC = () => {
    const dispatch = useDispatch();
    const userMembership = useSelector((store: AppStore) => store.userMembership);

    if (!userMembership) {
        dispatch(fetchUserMembershipData());
    }

    return (
        <>
            <div>Account Selection</div>
            <div>{JSON.stringify(userMembership)}</div>
        </>
    );
};

export default withAuth(UserSelection);
