import React from "react";
import { observer } from "mobx-react-lite";
import { Checkbox } from "@app/ui-kit";
import { useTranslation } from "@app/front-kit";

import { CommentsFilterEntity } from "core/storages/document/entities/comment/CommentsFilter";

interface CommentsShowUnresolvedActionInterface {
  filter: CommentsFilterEntity;
}

function CommentsShowUnresolvedAction({ filter }: CommentsShowUnresolvedActionInterface) {
  const { t } = useTranslation("document-revision-detail");

  return (
    <Checkbox value={filter.showUnresolved} onChange={filter.setShowUnresolved}>
      {t({ scope: "main_tab", place: "comments", name: "actions", parameter: "show_unresolved" })}
    </Checkbox>
  );
}

export default observer(CommentsShowUnresolvedAction);
