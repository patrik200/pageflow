import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useViewContext } from "@app/front-kit";

import { CorrespondenceFilterEntity } from "core/storages/correspondence/entities/correspondence/CorrespondenceFilter";

import { CorrespondenceStorage } from "core/storages/correspondence";

export function useMoveTable(initialFilter: CorrespondenceFilterEntity) {
  const { getGroupsAndCorrespondences } = useViewContext().containerInstance.get(CorrespondenceStorage);

  const [{ value }, asyncLoad] = useAsyncFn(getGroupsAndCorrespondences, [getGroupsAndCorrespondences]);

  const filter = React.useMemo(() => initialFilter.copy(), [initialFilter]);

  React.useEffect(() => {
    asyncLoad(filter);
    return filter.subscribeOnChange(() => asyncLoad(filter));
  }, [asyncLoad, filter]);

  return [value, filter] as const;
}
