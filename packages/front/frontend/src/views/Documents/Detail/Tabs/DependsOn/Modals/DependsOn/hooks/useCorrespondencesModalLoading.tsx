import React from "react";
import { useViewContext } from "@app/front-kit";
import { useAsyncFn } from "@worksolutions/react-utils";

import { CorrespondenceFilterEntity } from "core/storages/correspondence/entities/correspondence/CorrespondenceFilter";

import { CorrespondenceSelectModalStorage } from "core/storages/correspondence/selectModal";

export function useCorrespondencesModalLoading(entity: CorrespondenceFilterEntity) {
  const { loadCorrespondences } = useViewContext().containerInstance.get(CorrespondenceSelectModalStorage);

  const [{ loading }, asyncLoad] = useAsyncFn(loadCorrespondences, [loadCorrespondences], {
    loading: true,
  });

  const [loaded, setLoaded] = React.useState(false);

  React.useEffect(() => {
    asyncLoad().then(() => setLoaded(true));
    return entity.subscribeOnChange(() => asyncLoad());
  }, [asyncLoad, entity]);

  return { loading, loaded };
}
