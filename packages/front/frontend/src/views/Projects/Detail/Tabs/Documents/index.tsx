import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import Card from "components/Card";
import CardTablePreset from "components/Card/pressets/CardTable";

import DocumentsFilters from "views/Documents/ListCommon/Filters";
import DocumentActions from "views/Documents/ListCommon/Actions";
import DocumentsTable from "views/Documents/ListCommon/Table";
import { useDocumentsLoading } from "views/Documents/ListCommon/Filters/useDocumentsLoading";

import { ProjectDetailEntity } from "core/entities/project/projectDetail";

import { DocumentStorage } from "core/storages/document";

import { useDocumentRouter } from "./hooks/useRouter";
import { useDocumentBreadcrumbs } from "./hooks/useBreadcrumbs";

interface ProjectDocumentsTabInterface {
  project: ProjectDetailEntity;
}

function ProjectDocumentsTab({ project }: ProjectDocumentsTabInterface) {
  const documentStorage = useViewContext().containerInstance.get(DocumentStorage);
  React.useMemo(() => documentStorage.initProjectFilter(project.id), [documentStorage, project.id]);
  React.useMemo(() => documentStorage.initList(), [documentStorage]);

  const { loading } = useDocumentsLoading(documentStorage.filter);
  useDocumentRouter(documentStorage.filter);

  const breadcrumbs = useDocumentBreadcrumbs();

  return (
    <>
      <Card>
        <DocumentsFilters loading={loading} filter={documentStorage.filter} />
      </Card>
      <CardTablePreset breadcrumbs={breadcrumbs} actions={<DocumentActions />}>
        <DocumentsTable />
      </CardTablePreset>
    </>
  );
}

export default observer(ProjectDocumentsTab);
