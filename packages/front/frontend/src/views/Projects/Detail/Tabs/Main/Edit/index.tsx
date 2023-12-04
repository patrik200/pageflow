import React from "react";
import { observer } from "mobx-react-lite";

import Card from "components/Card";

import { EditProjectEntity } from "core/storages/project/entities/EditProject";

import EditMainForm from "./MainForm";
import EditAdditionalForm from "./AdditionalForm";

import { additionalWrapperStyles, mainWrapperStyles, wrapperStyles } from "../View/style.css";

interface ProjectDetailMainEditInterface {
  loading: boolean;
  showMembers: boolean;
  entity: EditProjectEntity;
}

function ProjectDetailMainEdit({ loading, showMembers, entity }: ProjectDetailMainEditInterface) {
  return (
    <div className={wrapperStyles}>
      <div className={mainWrapperStyles}>
        <Card>
          <EditMainForm loading={loading} entity={entity} />
        </Card>
      </div>
      <div className={additionalWrapperStyles}>
        <Card>
          <EditAdditionalForm loading={loading} showMembers={showMembers} entity={entity} />
        </Card>
      </div>
    </div>
  );
}

export default observer(ProjectDetailMainEdit);
