import React from "react";
import { observer } from "mobx-react-lite";
import { Checkbox, ModalActions, ModalTitle } from "@app/ui-kit";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { emitRequestError } from "core/emitRequest";

import { ProjectEntity } from "core/entities/project/project";
import { DeleteProjectEntity } from "core/storages/project/entities/DeleteProject";

import { ProjectStorage } from "core/storages/project";

import { contentWrapperStyles, wrapperStyles } from "./style.css";

interface DeleteProjectModalContentInterface {
  project: ProjectEntity;
}

function DeleteProjectModalContent({ project }: DeleteProjectModalContentInterface) {
  const { t } = useTranslation("project-detail");
  const { push } = useRouter();
  const { deleteProject } = useViewContext().containerInstance.get(ProjectStorage);

  const entity = React.useMemo(() => DeleteProjectEntity.buildEmpty(), []);

  const handleDeleteProject = React.useCallback(async () => {
    const result = await deleteProject(project.id, entity);
    if (result.success) {
      await push.current("/projects");
      return;
    }

    emitRequestError(
      undefined,
      result.error,
      t({ scope: "delete_project_modal", place: "error_messages", name: "unexpected" }),
    );
  }, [deleteProject, entity, project.id, push, t]);

  const [{ loading }, asyncHandleDeleteProject] = useAsyncFn(handleDeleteProject, [handleDeleteProject]);

  return (
    <div className={wrapperStyles}>
      <ModalTitle>{t({ scope: "delete_project_modal", name: "title" }, { name: project.name })}</ModalTitle>
      <div className={contentWrapperStyles}>
        <Checkbox
          value={entity.moveDocumentsToAnotherProject}
          disabled
          onChange={entity.setMoveDocumentsToAnotherProject}
        >
          {t({ scope: "delete_project_modal", name: "move_documents_to_another_project_checkbox" })}
        </Checkbox>
        <Checkbox value={entity.moveCorrespondencesToClient} onChange={entity.setMoveCorrespondencesToClient}>
          {t({ scope: "delete_project_modal", name: "move_correspondence_to_client_checkbox" })}
        </Checkbox>
      </div>
      <ModalActions
        primaryActionText={t({ scope: "delete_project_modal", place: "actions", name: "delete" })}
        primaryActionLoading={loading}
        onPrimaryActionClick={asyncHandleDeleteProject}
      />
    </div>
  );
}

export default observer(DeleteProjectModalContent);
