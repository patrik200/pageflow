import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useViewContext } from "@app/front-kit";

import { DocumentFilterEntity } from "core/storages/document/entities/document/DocumentFilter";

import { DocumentStorage } from "core/storages/document";

export function useMoveTable(initialFilter: DocumentFilterEntity) {
  const { getGroupsAndDocuments } = useViewContext().containerInstance.get(DocumentStorage);

  const [{ value }, asyncLoad] = useAsyncFn(getGroupsAndDocuments, [getGroupsAndDocuments]);

  const filter = React.useMemo(() => initialFilter.copy(), [initialFilter]);

  React.useEffect(() => {
    asyncLoad(filter);
    return filter.subscribeOnChange(() => asyncLoad(filter));
  }, [asyncLoad, filter]);

  return [value, filter] as const;
}
