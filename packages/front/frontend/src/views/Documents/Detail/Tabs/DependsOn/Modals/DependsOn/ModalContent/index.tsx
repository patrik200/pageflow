import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { ModalTitle } from "@app/ui-kit";

import GroupedContent from "components/FormField/GroupedContent";

import CorrespondencesFilters from "views/Correspondences/ListCommon/Filters";

import { DocumentStorage } from "core/storages/document";
import { CorrespondenceSelectModalStorage } from "core/storages/correspondence/selectModal";

import SelectCorrespondencesTable from "./SelectCorrespondenceTable";

import { useCorrespondencesModalLoading } from "../hooks/useCorrespondencesModalLoading";

function CreateDocumentDependencyOnCorrespondenceModalContent() {
  const { t } = useTranslation("document-dependencies");

  const { containerInstance } = useViewContext();

  const correspondenceSelectModalStorage = containerInstance.get(CorrespondenceSelectModalStorage);
  const { documentDetail } = containerInstance.get(DocumentStorage);

  React.useMemo(
    () => correspondenceSelectModalStorage.initProjectFilter(documentDetail!.rootGroup!.project!.id),
    [correspondenceSelectModalStorage, documentDetail],
  );

  const { loading } = useCorrespondencesModalLoading(correspondenceSelectModalStorage.filter);

  return (
    <>
      <ModalTitle>{t({ scope: "modals", place: "create_dependency", name: "title" })}</ModalTitle>
      <GroupedContent size="extra">
        <CorrespondencesFilters loading={loading} filter={correspondenceSelectModalStorage.filter} />
        <SelectCorrespondencesTable />
      </GroupedContent>
    </>
  );
}

export default observer(CreateDocumentDependencyOnCorrespondenceModalContent);
