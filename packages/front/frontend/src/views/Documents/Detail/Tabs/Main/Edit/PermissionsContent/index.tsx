import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";

import GroupedContent from "components/FormField/GroupedContent";

import { EditDocumentEntity } from "core/storages/document/entities/document/EditDocument";

import DocumentPermissionsList from "./PermissionsList";

interface DocumentPermissionsInterface {
  loading: boolean;
  entity: EditDocumentEntity;
}

function DocumentPermissions({ loading, entity }: DocumentPermissionsInterface) {
  const { t } = useTranslation("document-detail");

  return (
    <GroupedContent title={t({ scope: "main_tab", place: "members_field", name: "title" })}>
      <DocumentPermissionsList loading={loading} entity={entity} editing />
    </GroupedContent>
  );
}

export default observer(DocumentPermissions);
