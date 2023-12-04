import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import GroupedContent from "components/FormField/GroupedContent";
import FormFieldUserSelect from "components/FormField/UserSelect";

import { EditProjectEntity } from "core/storages/project/entities/EditProject";

interface ProjectResponsibleInterface {
  loading: boolean;
  entity: EditProjectEntity;
}

function ProjectResponsible({ loading, entity }: ProjectResponsibleInterface) {
  const { t } = useTranslation("project-detail");

  return (
    <GroupedContent title={t({ scope: "main_tab", place: "responsible_field", name: "title" })}>
      <FormFieldUserSelect
        disabled={loading}
        hasNoUser
        value={entity.responsible}
        errorMessage={entity.viewErrors.responsible}
        onChange={entity.setResponsible}
      />
    </GroupedContent>
  );
}

export default observer(ProjectResponsible);
