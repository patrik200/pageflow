import React from "react";
import { observer } from "mobx-react-lite";

import Divider from "components/Divider";

import { EditProjectEntity } from "core/storages/project/entities/EditProject";

import ProjectResponsible from "./Fields/Responsible";
import ProjectMembers from "./Fields/Members";

import { dividerStyles } from "./style.css";

interface EditAdditionalFormInterface {
  loading: boolean;
  showMembers: boolean;
  entity: EditProjectEntity;
}

function EditAdditionalForm({ loading, showMembers, entity }: EditAdditionalFormInterface) {
  return (
    <>
      <ProjectResponsible loading={loading} entity={entity} />
      {showMembers && (
        <>
          <Divider className={dividerStyles} />
          <ProjectMembers loading={loading} entity={entity} />
        </>
      )}
    </>
  );
}

export default observer(EditAdditionalForm);
