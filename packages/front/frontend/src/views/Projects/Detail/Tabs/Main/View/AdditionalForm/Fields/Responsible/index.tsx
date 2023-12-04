import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import FormFieldSelect from "components/FormField/Select";
import UserRowCustomSelectFieldTrigger from "components/UserRow/CustomSelectFieldTrigger";
import GroupedContent from "components/FormField/GroupedContent";
import { useAllUsersSelectFieldOptions } from "components/FormField/UserSelect";

import { ProjectDetailEntity } from "core/entities/project/projectDetail";

interface ProjectResponsibleInterface {
  project: ProjectDetailEntity;
}

function ProjectResponsible({ project }: ProjectResponsibleInterface) {
  const { t } = useTranslation("project-detail");
  const options = useAllUsersSelectFieldOptions(true);

  return (
    <GroupedContent title={t({ scope: "main_tab", place: "responsible_field", name: "title" })}>
      <FormFieldSelect
        view
        value={project.responsible?.id ?? null}
        options={options}
        TextViewTrigger={UserRowCustomSelectFieldTrigger}
      />
    </GroupedContent>
  );
}

export default observer(ProjectResponsible);
