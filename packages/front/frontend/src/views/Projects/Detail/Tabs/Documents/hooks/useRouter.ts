import React from "react";
import { useRouter } from "@app/front-kit";
import { useSyncToRef } from "@worksolutions/react-utils";

import { DocumentFilterEntity } from "core/storages/document/entities/document/DocumentFilter";

export function useDocumentRouter(entity: DocumentFilterEntity) {
  const { query, push } = useRouter();
  const queryRef = useSyncToRef(query);

  const path = (query.dPath ?? null) as string | null;

  React.useMemo(() => {
    if (path === entity.parentGroupId) return;
    entity.setParentGroupId(path);
  }, [entity, path]);

  React.useEffect(() => {
    if (path === entity.parentGroupId) return;
    push.current(
      { pathname: "/projects/[id]", query: { ...queryRef.current, dPath: entity.parentGroupId } },
      { shallow: true },
    );
  }, [entity.parentGroupId, path, push, queryRef]);
}
