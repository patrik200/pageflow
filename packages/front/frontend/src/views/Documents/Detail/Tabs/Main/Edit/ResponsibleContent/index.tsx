import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import GroupedContent from "components/FormField/GroupedContent";

import { EditDocumentEntity } from "core/storages/document/entities/document/EditDocument";

import DocumentResponsibleUser from "./ResponsibleUser";
import DocumentResponsibleUserFlow from "./ResponsibleUserFlow";

interface ResponsibleContentInterface {
  loading: boolean;
  entity: EditDocumentEntity;
}

function ResponsibleContent({ loading, entity }: ResponsibleContentInterface) {
  const { t } = useTranslation("document-detail");
  return (
    <>
      <GroupedContent title={t({ scope: "main_tab", place: "responsible_user_card", name: "title" })}>
        <DocumentResponsibleUser loading={loading} entity={entity} />
      </GroupedContent>
      <GroupedContent title={t({ scope: "main_tab", place: "responsible_user_flow_card", name: "title" })}>
        <DocumentResponsibleUserFlow loading={loading} entity={entity} />
      </GroupedContent>
    </>
  );
}

export default observer(ResponsibleContent);
