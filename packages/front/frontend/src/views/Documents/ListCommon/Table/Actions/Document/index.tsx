import React from "react";
import { observer } from "mobx-react-lite";
import { useTranslation, useViewContext } from "@app/front-kit";
import { useBoolean } from "@worksolutions/react-utils";

import AdditionalActions, { AdditionalActionButton } from "components/AdditionalActions";
import AdditionalActionFavourite from "components/AdditionalActionFavourite";
import ActionsTableCell from "components/ActionsTableCell";
import ArchivedTag from "components/Card/pressets/CardTitle/ArchivedTag";

import MoveDocumentModal from "views/Documents/Modals/MoveDocument";
import DeleteDocumentModal from "views/Documents/Modals/DeleteDocument";

import { DocumentEntity } from "core/entities/document/document";

import { DocumentStorage } from "core/storages/document";

interface DocumentActionsInterface {
  entity: DocumentEntity;
}

function DocumentActions({ entity }: DocumentActionsInterface) {
  const { t } = useTranslation("document-list");
  const [moveOpened, openMove, closeMove] = useBoolean(false);
  const [deleteOpened, openDelete, closeDelete] = useBoolean(false);
  const { filter, loadGroupsAndDocuments, setDocumentFavourite } =
    useViewContext().containerInstance.get(DocumentStorage);

  const handleReload = React.useCallback(() => loadGroupsAndDocuments(), [loadGroupsAndDocuments]);
  const handleSetFavourite = React.useCallback(
    (favourite: boolean) => setDocumentFavourite(entity.id, favourite),
    [entity.id, setDocumentFavourite],
  );

  return (
    <ActionsTableCell size="160">
      {entity.archived && <ArchivedTag />}
      <AdditionalActionFavourite favourite={entity.favourite} onChange={handleSetFavourite} />
      <AdditionalActions closeOnClickOutside={!moveOpened && !deleteOpened}>
        {entity.resultCanEdit && (
          <>
            <AdditionalActionButton
              text={t({ scope: "table", place: "body_group", name: "actions", parameter: "move" })}
              onClick={openMove}
            />
            <AdditionalActionButton
              text={t({ scope: "table", place: "body_group", name: "actions", parameter: "delete" })}
              onClick={openDelete}
            />
          </>
        )}
        <MoveDocumentModal
          opened={moveOpened}
          initialFilter={filter}
          document={entity}
          close={closeMove}
          onSuccess={handleReload}
        />
        <DeleteDocumentModal opened={deleteOpened} document={entity} close={closeDelete} onSuccess={handleReload} />
      </AdditionalActions>
    </ActionsTableCell>
  );
}

export default observer(DocumentActions);
