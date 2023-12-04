import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useViewContext } from "@app/front-kit";

import { CorrespondenceFilterEntity } from "core/storages/correspondence/entities/correspondence/CorrespondenceFilter";

import { CorrespondenceStorage } from "core/storages/correspondence";

export function useCorrespondencesLoading(entity: CorrespondenceFilterEntity) {
  const { loadGroupsAndCorrespondences } = useViewContext().containerInstance.get(CorrespondenceStorage);

  const [{ loading }, asyncLoad] = useAsyncFn(loadGroupsAndCorrespondences, [loadGroupsAndCorrespondences], {
    loading: true,
  });

  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    asyncLoad().then(() => setLoaded(true));
    return entity.subscribeOnChange(() => asyncLoad());
  }, [asyncLoad, entity]);

  return { loading, loaded };
}
