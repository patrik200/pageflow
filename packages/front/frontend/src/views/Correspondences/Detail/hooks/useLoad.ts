import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useRouter, useViewContext } from "@app/front-kit";

import { CorrespondenceStorage } from "core/storages/correspondence";

export function useLoadCorrespondence() {
  const { id } = useRouter().query as { id: string };
  const { loadCorrespondence } = useViewContext().containerInstance.get(CorrespondenceStorage);
  const [{ loading }, asyncLoadCorrespondenceDetail] = useAsyncFn(loadCorrespondence, [loadCorrespondence], {
    loading: true,
  });
  React.useEffect(() => void asyncLoadCorrespondenceDetail(id), [asyncLoadCorrespondenceDetail, id]);

  return loading;
}
