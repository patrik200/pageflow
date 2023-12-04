import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import Card from "components/Card";
import CardTablePreset from "components/Card/pressets/CardTable";

import CorrespondencesFilters from "views/Correspondences/ListCommon/Filters";
import CorrespondenceActions from "views/Correspondences/ListCommon/Actions";
import CorrespondencesTable from "views/Correspondences/ListCommon/Table";
import { useCorrespondencesLoading } from "views/Correspondences/ListCommon/Filters/useCorrespondencesLoading";

import { ProjectDetailEntity } from "core/entities/project/projectDetail";

import { CorrespondenceStorage } from "core/storages/correspondence";

import { useCorrespondenceRouter } from "./hooks/useRouter";
import { useCorrespondenceBreadcrumbs } from "./hooks/useBreadcrumbs";

interface ProjectCorrespondencesTabInterface {
  project: ProjectDetailEntity;
}

function ProjectCorrespondencesTab({ project }: ProjectCorrespondencesTabInterface) {
  const correspondenceStorage = useViewContext().containerInstance.get(CorrespondenceStorage);
  React.useMemo(() => correspondenceStorage.initProjectFilter(project.id), [correspondenceStorage, project.id]);
  React.useMemo(() => correspondenceStorage.initList(), [correspondenceStorage]);

  const { loading } = useCorrespondencesLoading(correspondenceStorage.filter);
  useCorrespondenceRouter(correspondenceStorage.filter);

  const breadcrumbs = useCorrespondenceBreadcrumbs();

  return (
    <>
      <Card>
        <CorrespondencesFilters loading={loading} filter={correspondenceStorage.filter} />
      </Card>
      <CardTablePreset breadcrumbs={breadcrumbs} actions={project.resultCanEdit && <CorrespondenceActions />}>
        <CorrespondencesTable />
      </CardTablePreset>
    </>
  );
}

export default observer(ProjectCorrespondencesTab);
