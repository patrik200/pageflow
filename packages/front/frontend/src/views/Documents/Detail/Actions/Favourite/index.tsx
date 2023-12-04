import React from "react";
import { observer } from "mobx-react-lite";
import { useViewContext } from "@app/front-kit";

import AdditionalActionFavourite from "components/AdditionalActionFavourite";

import { DocumentEntity } from "core/entities/document/document";

import { DocumentStorage } from "core/storages/document";

interface DocumentFavouriteActionInterface {
  document: DocumentEntity;
}

function DocumentFavouriteAction({ document }: DocumentFavouriteActionInterface) {
  const { setDocumentFavourite } = useViewContext().containerInstance.get(DocumentStorage);

  const handleSetFavourite = React.useCallback(
    (favourite: boolean) => setDocumentFavourite(document.id, favourite),
    [document.id, setDocumentFavourite],
  );

  return <AdditionalActionFavourite favourite={document.favourite} onChange={handleSetFavourite} />;
}

export default observer(DocumentFavouriteAction);
