import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useViewContext } from "@app/front-kit";

import { DocumentFilterEntity } from "core/storages/document/entities/document/DocumentFilter";

import { DocumentStorage } from "core/storages/document";

export function useDocumentsLoading(entity: DocumentFilterEntity) {
  const { loadGroupsAndDocuments } = useViewContext().containerInstance.get(DocumentStorage);

  const [{ loading }, asyncLoad] = useAsyncFn(loadGroupsAndDocuments, [loadGroupsAndDocuments], {
    loading: true,
  });

  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    asyncLoad().then(() => setLoaded(true));
    return entity.subscribeOnChange(() => asyncLoad());
  }, [asyncLoad, entity]);

  return { loading, loaded };
}
