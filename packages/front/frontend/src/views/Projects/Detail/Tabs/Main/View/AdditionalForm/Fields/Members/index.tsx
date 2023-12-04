import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { useToggle } from "@worksolutions/react-utils";
import { Button } from "@app/ui-kit";

import GroupedContent from "components/FormField/GroupedContent";

import { ProjectDetailEntity } from "core/entities/project/projectDetail";
import { EditProjectEntity } from "core/storages/project/entities/EditProject";

import ProjectPermissionsList from "../../../../Edit/AdditionalForm/Fields/Members/PermissionsList";

interface ProjectMembersInterface {
  project: ProjectDetailEntity;
}

function ProjectMembers({ project }: ProjectMembersInterface) {
  const { t } = useTranslation("project-detail");

  const [editing, toggleEditing] = useToggle(false);

  const entity = React.useMemo(() => EditProjectEntity.buildFromProjectEntity(project), [project]);

  return (
    <GroupedContent
      title={t({ scope: "main_tab", place: "members_field", name: "title" })}
      actions={
        <Button
          iconLeft={editing ? "closeLine" : "editLine"}
          size="EXTRA_SMALL"
          type="WITHOUT_BORDER"
          onClick={toggleEditing}
        />
      }
    >
      <ProjectPermissionsList entity={entity} editing={editing} />
    </GroupedContent>
  );
}

export default observer(ProjectMembers);
