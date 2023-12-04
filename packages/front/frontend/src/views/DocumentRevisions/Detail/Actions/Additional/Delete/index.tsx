import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";
import { DocumentStorage } from "core/storages/document";

import DeleteDocumentRevisionModal from "../../../../Modals/Delete";

interface DeleteDocumentRevisionActionInterface {
  onOpenedChange: (opened: boolean) => void;
}

function DeleteDocumentRevisionAction({ onOpenedChange }: DeleteDocumentRevisionActionInterface) {
  const { t } = useTranslation("document-revision-detail");
  const [deleteOpened, openDelete, closeDelete] = useBoolean(false);
  React.useEffect(() => onOpenedChange(deleteOpened), [deleteOpened, onOpenedChange]);

  const { containerInstance } = useViewContext();

  const { revisionDetail } = containerInstance.get(DocumentRevisionsStorage);
  const { documentDetail } = containerInstance.get(DocumentStorage);

  if (!documentDetail?.resultCanEdit) return null;

  return (
    <>
      <AdditionalActionButton
        text={t({ scope: "view_revision", place: "actions", name: "delete" })}
        onClick={openDelete}
      />
      <DeleteDocumentRevisionModal revision={revisionDetail!} opened={deleteOpened} close={closeDelete} />
    </>
  );
}

export default observer(DeleteDocumentRevisionAction);
