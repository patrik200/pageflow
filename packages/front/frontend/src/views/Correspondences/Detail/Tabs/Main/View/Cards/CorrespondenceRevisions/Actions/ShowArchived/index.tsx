import React from "react";
import { observer } from "mobx-react-lite";
import { Checkbox } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";

import { CorrespondenceRevisionFilterEntity } from "core/storages/correspondence/entities/revision/CorrespondenceRevisionFilter";

interface CorrespondenceRevisionsShowArchivedActionInterface {
  filter: CorrespondenceRevisionFilterEntity;
}

function CorrespondenceRevisionsShowArchivedAction({ filter }: CorrespondenceRevisionsShowArchivedActionInterface) {
  const { t } = useTranslation("correspondence-detail");

  return (
    <Checkbox value={filter.showArchived} onChange={filter.setShowArchived}>
      {t({ scope: "main_tab_revisions", place: "actions", name: "show_archived" })}
    </Checkbox>
  );
}

export default observer(CorrespondenceRevisionsShowArchivedAction);
