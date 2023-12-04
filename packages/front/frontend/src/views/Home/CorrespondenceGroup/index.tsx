import React from "react";
import { observer } from "mobx-react-lite";

import { CorrespondenceGroupEntity } from "core/entities/correspondence/group";

import HomeTableRowTemplate from "../TableRowTemplate";

interface HomeCorrespondenceGroupInterface {
  group: CorrespondenceGroupEntity;
}

function HomeCorrespondenceGroup({ group }: HomeCorrespondenceGroupInterface) {
  return <HomeTableRowTemplate title={group.name} href={{ pathname: "/correspondences", query: { path: group.id } }} />;
}

export default observer(HomeCorrespondenceGroup);
