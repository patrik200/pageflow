import React from "react";
import { observer } from "mobx-react-lite";
import { useRouter, useTranslation } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { DocumentEntity } from "core/entities/document/document";

import DeleteDocumentModal from "../../../../Modals/DeleteDocument";

interface DeleteDocumentActionInterface {
  document: DocumentEntity;
  onOpenedChange: (opened: boolean) => void;
}

function DeleteDocumentAction({ document, onOpenedChange }: DeleteDocumentActionInterface) {
  const { t } = useTranslation("document-detail");
  const { push } = useRouter();
  const [deleteOpened, openDelete, closeDelete] = useBoolean(false);
  React.useEffect(() => onOpenedChange(deleteOpened), [deleteOpened, onOpenedChange]);

  const handleDeleteSuccess = React.useCallback(() => push.current("/projects"), [push]);

  if (!document.resultCanEdit) return null;

  return (
    <>
      <AdditionalActionButton
        text={t({ scope: "view_document", place: "actions", name: "delete" })}
        onClick={openDelete}
      />
      <DeleteDocumentModal
        document={document}
        opened={deleteOpened}
        close={closeDelete}
        onSuccess={handleDeleteSuccess}
      />
    </>
  );
}

export default observer(DeleteDocumentAction);
