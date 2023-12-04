import React from "react";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";
import { Button } from "@app/ui-kit";

import CardTitlePreset from "components/Card/pressets/CardTitle";
import CardLoadingPreset from "components/Card/pressets/CardLoading";

import { emitRequestError, emitRequestErrorFiles } from "core/emitRequest";

import { EditProjectEntity } from "core/storages/project/entities/EditProject";

import { ProjectStorage } from "core/storages/project";

import ProjectDetailMainEdit from "../Detail/Tabs/Main/Edit";
import { useLoadProject } from "../Detail/hooks/useLoad";
import PageWrapper from "../../_PageWrapper";

function EditProjectView() {
  const { t } = useTranslation("project-detail");

  const [projectLoading, projectDetail] = useLoadProject();

  const entity = React.useMemo(
    () => (projectDetail ? EditProjectEntity.buildFromProjectEntity(projectDetail) : null),
    [projectDetail],
  );

  const { updateProject } = useViewContext().containerInstance.get(ProjectStorage);

  const { push } = useRouter();

  const handleUpdateProject = React.useCallback(async () => {
    const result = await updateProject(entity!);
    if (result.success) {
      const hasError = emitRequestErrorFiles(
        { uploadResults: [result.previewResult], deleteResults: [result.previewResult] },
        t,
      );
      if (!hasError) await push.current("/projects/" + entity!.project!.id);
      return;
    }

    emitRequestError(
      entity!,
      result.error,
      t({ scope: "edit_project", name: "error_messages", parameter: "unexpected" }),
    );
  }, [entity, push, t, updateProject]);

  const [{ loading }, asyncHandleUpdateProject] = useAsyncFn(handleUpdateProject, [handleUpdateProject]);

  const handleUpdateClick = React.useCallback(
    () => entity!.submit({ onSuccess: asyncHandleUpdateProject }),
    [asyncHandleUpdateProject, entity],
  );

  const handleCancelClick = React.useCallback(() => push.current("/projects/" + entity!.project!.id), [entity, push]);

  if (projectLoading || !entity || !projectDetail)
    return (
      <PageWrapper title={t({ scope: "meta", name: "view" }, { name: "" })}>
        <CardLoadingPreset
          title={t({ scope: "meta", name: "view" }, { name: "" })}
          actions={
            <Button size="SMALL" type="WITHOUT_BORDER" loading={loading} onClick={handleCancelClick}>
              {t({ scope: "edit_project", place: "action", name: "cancel" })}
            </Button>
          }
        />
      </PageWrapper>
    );

  return (
    <PageWrapper title={t({ scope: "meta", name: "view" }, { name: projectDetail.name })}>
      <CardTitlePreset
        title={projectDetail.name}
        actions={
          <>
            <Button size="SMALL" type="WITHOUT_BORDER" disabled={loading} onClick={handleCancelClick}>
              {t({ scope: "edit_project", place: "action", name: "cancel" })}
            </Button>
            <Button size="SMALL" loading={loading} onClick={handleUpdateClick}>
              {t({ scope: "edit_project", place: "action", name: "save" })}
            </Button>
          </>
        }
      />
      <ProjectDetailMainEdit loading={loading} showMembers entity={entity} />
    </PageWrapper>
  );
}

export default React.memo(EditProjectView);
