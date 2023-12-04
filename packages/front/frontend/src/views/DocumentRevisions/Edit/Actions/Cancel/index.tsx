import React from "react";
import { observer } from "mobx-react-lite";
import { useRouter, useTranslation } from "@app/front-kit";
import { Button } from "@app/ui-kit";

import { EditDocumentRevisionEntity } from "core/storages/document/entities/revision/EditDocumentRevision";

interface DocumentRevisionCancelActionInterface {
  entity: EditDocumentRevisionEntity;
  enableLoading: () => void;
}

function DocumentRevisionCancelAction({ entity, enableLoading }: DocumentRevisionCancelActionInterface) {
  const { t } = useTranslation("document-revision-detail");

  const { push } = useRouter();

  const handleCancelClick = React.useCallback(() => {
    enableLoading();
    push.current("/document-revisions/" + entity!.revisionId!);
  }, [enableLoading, entity, push]);

  return (
    <Button size="SMALL" type="WITHOUT_BORDER" onClick={handleCancelClick}>
      {t({ scope: "edit_revision", place: "actions", name: "cancel" })}
    </Button>
  );
}

export default observer(DocumentRevisionCancelAction);
