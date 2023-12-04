import React from "react";
import { observer } from "mobx-react-lite";
import { Checkbox } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";

import { DocumentRevisionFilterEntity } from "core/storages/document/entities/revision/DocumentRevisionFilter";

interface DocumentRevisionsShowArchivedActionInterface {
  filter: DocumentRevisionFilterEntity;
}

function DocumentRevisionsShowArchivedAction({ filter }: DocumentRevisionsShowArchivedActionInterface) {
  const { t } = useTranslation("document-detail");

  return (
    <Checkbox value={filter.showArchived} onChange={filter.setShowArchived}>
      {t({ scope: "main_tab_revisions", place: "actions", name: "show_archived" })}
    </Checkbox>
  );
}

export default observer(DocumentRevisionsShowArchivedAction);
