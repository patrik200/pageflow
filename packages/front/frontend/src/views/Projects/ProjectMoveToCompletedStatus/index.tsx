import React from "react";
import { observer } from "mobx-react-lite";
import { Button } from "@app/ui-kit";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError, emitRequestSuccess } from "core/emitRequest";

import { ProjectDetailEntity } from "core/entities/project/projectDetail";

import { ProjectStorage } from "core/storages/project";

import { buttonStyles } from "./style.css";

interface ProjectMoveToCompletedStatusInterface {
  project: ProjectDetailEntity;
}

function ProjectMoveToCompletedStatusAction({ project }: ProjectMoveToCompletedStatusInterface) {
  const { t } = useTranslation("project-detail");

  const { moveProjectToCompletedStatus } = useViewContext().containerInstance.get(ProjectStorage);

  const handleMoveProject = React.useCallback(async () => {
    const result = await moveProjectToCompletedStatus(project.id!);

    if (result.success)
      return emitRequestSuccess(
        t({ scope: "edit_project", place: "success_messages", name: "move_to_completed_success" }),
      );
    emitRequestError(project, result.error, t({ scope: "edit_project", place: "error_messages", name: "unexpected" }));
  }, [project, t, moveProjectToCompletedStatus]);

  const [{ loading }, asyncHandleMoveProject] = useAsyncFn(handleMoveProject, [handleMoveProject, project]);

  if (!project.canMoveToCompletedStatus) return null;

  return (
    <Button className={buttonStyles} size="SMALL" onClick={asyncHandleMoveProject} loading={loading}>
      {t({ scope: "edit_project", place: "action", name: "move_to_completed" })}
    </Button>
  );
}

export default observer(ProjectMoveToCompletedStatusAction);
