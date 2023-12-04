import React from "react";
import { useRouter } from "@app/front-kit";
import { useSyncToRef } from "@worksolutions/react-utils";

import { CorrespondenceFilterEntity } from "core/storages/correspondence/entities/correspondence/CorrespondenceFilter";

export function useCorrespondenceRouter(entity: CorrespondenceFilterEntity) {
  const { query, push } = useRouter();
  const queryRef = useSyncToRef(query);

  const path = (query.cPath ?? null) as string | null;
  React.useMemo(() => {
    if (path === entity.parentGroupId) return;
    entity.setParentGroupId(path);
  }, [entity, path]);

  React.useEffect(() => {
    if (path === entity.parentGroupId) return;
    push.current(
      { pathname: "/projects/[id]", query: { ...queryRef.current, cPath: entity.parentGroupId } },
      { shallow: true },
    );
  }, [entity.parentGroupId, path, push, queryRef]);
}
