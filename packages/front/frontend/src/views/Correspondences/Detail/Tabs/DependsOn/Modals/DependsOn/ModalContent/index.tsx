import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { ModalTitle } from "@app/ui-kit";

import GroupedContent from "components/FormField/GroupedContent";

import DocumentsFilters from "views/Documents/ListCommon/Filters";
import { useDocumentRouter } from "views/Projects/Detail/Tabs/Documents/hooks/useRouter";

import { CorrespondenceStorage } from "core/storages/correspondence";
import { DocumentSelectModalStorage } from "core/storages/document/selectModal";

import SelectDocumentsTable from "./SelectDocumentsTable";

import { useDocumentsModalLoading } from "../hooks/useDocumentsModalLoading";

function CreateCorrespondenceDependencyOnDocumentModalContent() {
  const { t } = useTranslation("correspondence-dependencies");

  const { containerInstance } = useViewContext();

  const documentSelectModalStorage = containerInstance.get(DocumentSelectModalStorage);
  const { correspondenceDetail } = containerInstance.get(CorrespondenceStorage);

  const isCorrespondenceProjectLess = correspondenceDetail?.rootGroup?.project == null;

  const projectId = correspondenceDetail?.rootGroup?.project?.id ?? null;

  React.useMemo(() => documentSelectModalStorage.initProjectFilter(projectId), [documentSelectModalStorage, projectId]);

  const { loading } = useDocumentsModalLoading(documentSelectModalStorage.filter, isCorrespondenceProjectLess);
  useDocumentRouter(documentSelectModalStorage.filter);

  return (
    <>
      <ModalTitle>{t({ scope: "modals", place: "create_dependency", name: "title" })}</ModalTitle>
      <GroupedContent size="extra">
        <DocumentsFilters loading={loading} filter={documentSelectModalStorage.filter} />
        <SelectDocumentsTable />
      </GroupedContent>
    </>
  );
}

export default observer(CreateCorrespondenceDependencyOnDocumentModalContent);
