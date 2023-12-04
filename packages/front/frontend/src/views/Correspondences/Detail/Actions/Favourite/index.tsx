import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import AdditionalActionFavourite from "components/AdditionalActionFavourite";

import { CorrespondenceEntity } from "core/entities/correspondence/correspondence";

import { CorrespondenceStorage } from "core/storages/correspondence";

interface CorrespondenceFavouriteActionInterface {
  correspondence: CorrespondenceEntity;
}

function CorrespondenceFavouriteAction({ correspondence }: CorrespondenceFavouriteActionInterface) {
  const { setCorrespondenceFavourite } = useViewContext().containerInstance.get(CorrespondenceStorage);

  const handleSetFavourite = React.useCallback(
    (favourite: boolean) => setCorrespondenceFavourite(correspondence.id, favourite),
    [correspondence.id, setCorrespondenceFavourite],
  );

  return <AdditionalActionFavourite favourite={correspondence.favourite} onChange={handleSetFavourite} />;
}

export default observer(CorrespondenceFavouriteAction);
