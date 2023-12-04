import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useToggle } from "@worksolutions/react-utils";
import { Button } from "@app/ui-kit";

import GroupedContent from "components/FormField/GroupedContent";

import { EditDocumentEntity } from "core/storages/document/entities/document/EditDocument";

import { DocumentStorage } from "core/storages/document";

import DocumentPermissionsList from "../../../../Edit/PermissionsContent/PermissionsList";

function PermissionsContent() {
  const { t } = useTranslation("document-detail");
  const document = useViewContext().containerInstance.get(DocumentStorage).documentDetail!;

  const [editing, toggleEditing] = useToggle(false);

  const entity = React.useMemo(() => EditDocumentEntity.buildFromDocument(document), [document]);

  return (
    <GroupedContent
      title={t({ scope: "main_tab", place: "members_field", name: "title" })}
      actions={
        <Button
          iconLeft={editing ? "closeLine" : "editLine"}
          size="EXTRA_SMALL"
          type="WITHOUT_BORDER"
          onClick={toggleEditing}
        />
      }
    >
      <DocumentPermissionsList entity={entity} editing={editing} />
    </GroupedContent>
  );
}

export default observer(PermissionsContent);
