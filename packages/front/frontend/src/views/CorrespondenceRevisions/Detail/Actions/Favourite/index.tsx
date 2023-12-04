import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import AdditionalActionFavourite from "components/AdditionalActionFavourite";

import { CorrespondenceRevisionsStorage } from "core/storages/correspondence/revisions";

function CorrespondenceRevisionFavouriteAction() {
  const { revisionDetail, setFavourite } = useViewContext().containerInstance.get(CorrespondenceRevisionsStorage);

  const handleSetFavourite = React.useCallback(
    (favourite: boolean) => setFavourite(revisionDetail!.id, favourite),
    [revisionDetail, setFavourite],
  );

  return <AdditionalActionFavourite favourite={revisionDetail!.favourite} onChange={handleSetFavourite} />;
}

export default observer(CorrespondenceRevisionFavouriteAction);
