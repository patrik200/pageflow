import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import { AdditionalActionButton } from "components/AdditionalActions";

import { DocumentEntity } from "core/entities/document/document";
import { DocumentFilterEntity } from "core/storages/document/entities/document/DocumentFilter";

import MoveDocumentModal from "../../../../Modals/MoveDocument";

interface MoveDocumentActionInterface {
  document: DocumentEntity;
  onOpenedChange: (opened: boolean) => void;
}

function MoveDocumentAction({ document, onOpenedChange }: MoveDocumentActionInterface) {
  const { t } = useTranslation("document-detail");
  const [moveOpened, openMove, closeMove] = useBoolean(false);
  React.useEffect(() => onOpenedChange(moveOpened), [moveOpened, onOpenedChange]);
  const initialFilterForMove = React.useMemo(() => DocumentFilterEntity.buildForDocument(document), [document]);

  if (!document.resultCanEdit) return null;

  return (
    <>
      <AdditionalActionButton text={t({ scope: "view_document", place: "actions", name: "move" })} onClick={openMove} />
      <MoveDocumentModal
        document={document}
        opened={moveOpened}
        initialFilter={initialFilterForMove}
        close={closeMove}
      />
    </>
  );
}

export default observer(MoveDocumentAction);
