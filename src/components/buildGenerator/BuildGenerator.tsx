import React, { FC } from "react";
import { useSelector } from "react-redux";

import { RootStore } from "rootReducer";

const BuildGenerator: FC = () => {
    const library = useSelector((store: RootStore) => store.library);
    return <div>{!library && "Loading Profile Data..."}</div>;
};

export default BuildGenerator;
