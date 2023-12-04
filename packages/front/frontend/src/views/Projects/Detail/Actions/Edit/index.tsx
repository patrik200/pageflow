import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";

import { Link } from "components/Link";

import { ProjectDetailEntity } from "core/entities/project/projectDetail";

interface ProjectEditActionInterface {
  project: ProjectDetailEntity;
}

function ProjectEditAction({ project }: ProjectEditActionInterface) {
  const { t } = useTranslation("project-detail");
  if (!project.resultCanEdit) return null;

  return (
    <Link href={`/projects/${project.id}/edit`}>
      <Button preventDefault={false} size="SMALL">
        {t({ scope: "edit_project", place: "action", name: "edit" })}
      </Button>
    </Link>
  );
}

export default observer(ProjectEditAction);
