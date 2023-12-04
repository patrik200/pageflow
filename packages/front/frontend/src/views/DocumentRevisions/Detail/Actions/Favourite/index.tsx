import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import AdditionalActionFavourite from "components/AdditionalActionFavourite";

import { DocumentRevisionsStorage } from "core/storages/document/revisions";

function DocumentRevisionFavouriteAction() {
  const { revisionDetail, setFavourite } = useViewContext().containerInstance.get(DocumentRevisionsStorage);

  const handleSetFavourite = React.useCallback(
    (favourite: boolean) => setFavourite(revisionDetail!.id, favourite),
    [revisionDetail, setFavourite],
  );

  return <AdditionalActionFavourite favourite={revisionDetail!.favourite} onChange={handleSetFavourite} />;
}

export default observer(DocumentRevisionFavouriteAction);
