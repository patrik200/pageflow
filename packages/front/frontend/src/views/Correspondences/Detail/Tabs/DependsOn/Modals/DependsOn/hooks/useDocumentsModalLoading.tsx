import React from "react";
import { useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { DocumentFilterEntity } from "core/storages/document/entities/document/DocumentFilter";

import { DocumentSelectModalStorage } from "core/storages/document/selectModal";

export function useDocumentsModalLoading(entity: DocumentFilterEntity, acrossAllProjects: boolean) {
  const { loadDocuments } = useViewContext().containerInstance.get(DocumentSelectModalStorage);

  const [{ loading }, asyncLoad] = useAsyncFn(loadDocuments, [loadDocuments], {
    loading: true,
  });

  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    asyncLoad(acrossAllProjects).then(() => setLoaded(true));
    return entity.subscribeOnChange(() => asyncLoad(acrossAllProjects));
  }, [acrossAllProjects, asyncLoad, entity]);

  return { loading, loaded };
}
