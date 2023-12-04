import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import GroupedContent from "components/FormField/GroupedContent";

import { EditProjectEntity } from "core/storages/project/entities/EditProject";

import ProjectPermissionsList from "./PermissionsList";

interface ProjectMembersInterface {
  loading: boolean;
  entity: EditProjectEntity;
}

function ProjectMembers({ loading, entity }: ProjectMembersInterface) {
  const { t } = useTranslation("project-detail");

  return (
    <GroupedContent title={t({ scope: "main_tab", place: "members_field", name: "title" })}>
      <ProjectPermissionsList loading={loading} entity={entity} editing />
    </GroupedContent>
  );
}

export default observer(ProjectMembers);
