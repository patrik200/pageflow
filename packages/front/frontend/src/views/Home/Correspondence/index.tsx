import React from "react";
import { observer } from "mobx-react-lite";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";

import HomeTableRowTemplate from "../TableRowTemplate";

interface HomeCorrespondenceInterface {
  correspondence: CorrespondenceEntity;
}

function HomeCorrespondence({ correspondence }: HomeCorrespondenceInterface) {
  return <HomeTableRowTemplate title={correspondence.name} href={`/correspondences/${correspondence.id}`} />;
}

export default observer(HomeCorrespondence);
