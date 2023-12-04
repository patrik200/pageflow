import React from "react";
import { observer } from "mobx-react-lite";

import { DocumentGroupEntity } from "core/entities/document/group";

import HomeTableRowTemplate from "../TableRowTemplate";

interface HomeDocumentGroupInterface {
  group: DocumentGroupEntity;
}

function HomeDocumentGroup({ group }: HomeDocumentGroupInterface) {
  if (!group.rootGroup) return null;
  return (
    <HomeTableRowTemplate
      title={group.name}
      href={{
        pathname: "/projects/[projectId]",
        query: { projectId: group.rootGroup.project.id, dPath: group.id },
      }}
    />
  );
}

export default observer(HomeDocumentGroup);
