import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import AdditionalActionFavourite from "components/AdditionalActionFavourite";
import ArchivedTag from "components/Card/pressets/CardTitle/ArchivedTag";
import ActionsTableCell from "components/ActionsTableCell";

import { DocumentRevisionEntity } from "core/entities/documentRevision/revision";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";

interface DocumentRevisionActionsInterface {
  revision: DocumentRevisionEntity;
}

function DocumentRevisionActions({ revision }: DocumentRevisionActionsInterface) {
  const { setFavourite } = useViewContext().containerInstance.get(DocumentRevisionsStorage);
  const handleSetFavourite = React.useCallback(
    (favourite: boolean) => setFavourite(revision.id, favourite),
    [revision.id, setFavourite],
  );

  return (
    <ActionsTableCell size="122">
      {revision.archived && <ArchivedTag />}
      <AdditionalActionFavourite favourite={revision.favourite} onChange={handleSetFavourite} />
    </ActionsTableCell>
  );
}

export default observer(DocumentRevisionActions);
