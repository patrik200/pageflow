import React from "react";
import { useRouter, useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import CardTitlePreset from "components/Card/pressets/CardTitle";

import { emitRequestError, emitRequestErrorFiles } from "core/emitRequest";

import { EditProjectEntity } from "core/storages/project/entities/EditProject";

import { ProjectStorage } from "core/storages/project";

import ProjectDetailMainEdit from "../Detail/Tabs/Main/Edit";
import PageWrapper from "../../_PageWrapper";

function CreateProjectView() {
  const { t } = useTranslation("project-detail");
  const { push } = useRouter();

  const { createProject } = useViewContext().containerInstance.get(ProjectStorage);

  const entity = React.useMemo(() => EditProjectEntity.buildEmpty(), []);

  const handleCreateProject = React.useCallback(async () => {
    const result = await createProject(entity);
    if (result.success) {
      const hasError = emitRequestErrorFiles({ uploadResults: [result.previewResult] }, t);
      if (!hasError) await push.current("/projects/" + result.projectId);
      return;
    }

    emitRequestError(
      entity,
      result.error,
      t({ scope: "create_project", name: "error_messages", parameter: "unexpected" }),
    );
  }, [createProject, entity, push, t]);

  const [{ loading }, asyncHandleCreateProject] = useAsyncFn(handleCreateProject, [handleCreateProject]);

  const handleCreateClick = React.useCallback(
    () => entity.submit({ onSuccess: asyncHandleCreateProject }),
    [asyncHandleCreateProject, entity],
  );

  return (
    <PageWrapper title={t({ scope: "meta", name: "create" })}>
      <CardTitlePreset
        title={t({ scope: "meta", name: "create" })}
        actions={
          <Button iconLeft="plusLine" size="SMALL" loading={loading} onClick={handleCreateClick}>
            {t({ scope: "create_project", place: "action", name: "create" })}
          </Button>
        }
      />
      <ProjectDetailMainEdit loading={loading} showMembers={false} entity={entity} />
    </PageWrapper>
  );
}

export default React.memo(CreateProjectView);
