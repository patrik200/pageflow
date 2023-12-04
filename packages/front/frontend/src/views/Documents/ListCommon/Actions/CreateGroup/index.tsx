import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { Button } from "@app/ui-kit";
import { useBoolean } from "@worksolutions/react-utils";

import EditDocumentGroupModal from "views/Documents/Modals/EditGroup";

import { DocumentStorage } from "core/storages/document";

function CreateGroupAction() {
  const { t } = useTranslation("document-list");
  const { loadGroupsAndDocuments } = useViewContext().containerInstance.get(DocumentStorage);
  const [opened, oped, close] = useBoolean(false);

  const reloadDocumentGroupsAndDocuments = React.useCallback(() => loadGroupsAndDocuments(), [loadGroupsAndDocuments]);

  return (
    <>
      <Button size="SMALL" type="OUTLINE" onClick={oped}>
        {t({ scope: "actions", place: "create_group", name: "button" })}
      </Button>
      <EditDocumentGroupModal opened={opened} close={close} onSuccess={reloadDocumentGroupsAndDocuments} />
    </>
  );
}

export default observer(CreateGroupAction);
