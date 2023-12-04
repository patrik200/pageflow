import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import { ProjectStorage } from "core/storages/project";

import CreateGroupAction from "./CreateGroup";
import CreateDocumentAction from "./CreateDocument";

function DocumentActions() {
  const { projectDetail } = useViewContext().containerInstance.get(ProjectStorage);
  if (!projectDetail!.resultCanEdit) return null;
  return (
    <>
      <CreateGroupAction />
      <CreateDocumentAction />
    </>
  );
}

export default observer(DocumentActions);
