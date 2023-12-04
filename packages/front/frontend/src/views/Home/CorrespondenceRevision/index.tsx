import React from "react";
import { observer } from "mobx-react-lite";

import { CorrespondenceRevisionEntity } from "core/entities/correspondenceRevision/revision";

import HomeTableRowTemplate from "../TableRowTemplate";

interface HomeCorrespondenceRevisionInterface {
  revision: CorrespondenceRevisionEntity;
}

function HomeCorrespondenceRevision({ revision }: HomeCorrespondenceRevisionInterface) {
  return <HomeTableRowTemplate title={revision.number} href={`/correspondence-revisions/${revision.id}`} />;
}

export default observer(HomeCorrespondenceRevision);
