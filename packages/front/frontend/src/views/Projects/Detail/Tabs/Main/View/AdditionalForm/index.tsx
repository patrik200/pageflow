import React from "react";
import { observer } from "mobx-react-lite";

import Divider from "components/Divider";

import { ProjectDetailEntity } from "core/entities/project/projectDetail";

import ProjectResponsible from "./Fields/Responsible";
import ProjectMembers from "./Fields/Members";

import { dividerStyles } from "./style.css";

interface ViewAdditionalFormInterface {
  project: ProjectDetailEntity;
}

function ViewAdditionalForm({ project }: ViewAdditionalFormInterface) {
  return (
    <>
      <ProjectResponsible project={project} />
      <Divider className={dividerStyles} />
      <ProjectMembers project={project} />
    </>
  );
}

export default observer(ViewAdditionalForm);
