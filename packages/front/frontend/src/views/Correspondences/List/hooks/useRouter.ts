import React from "react";
import { useRouter } from "@app/front-kit";

import { CorrespondenceFilterEntity } from "core/storages/correspondence/entities/correspondence/CorrespondenceFilter";

export function useCorrespondenceRouter(entity: CorrespondenceFilterEntity) {
  const { query, push } = useRouter();
  const path = (query.path ?? null) as string | null;
  React.useMemo(() => {
    if (path === entity.parentGroupId) return;
    entity.setParentGroupId(path);
  }, [entity, path]);

  React.useEffect(() => {
    if (path === entity.parentGroupId) return;
    push.current(
      { pathname: "/correspondences", query: entity.parentGroupId ? { path: entity.parentGroupId } : {} },
      { shallow: true },
    );
  }, [entity.parentGroupId, path, push]);
}
