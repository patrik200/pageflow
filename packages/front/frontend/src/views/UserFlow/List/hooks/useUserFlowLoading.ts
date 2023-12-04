import React from "react";
import { useAsyncFn } from "@worksolutions/react-utils";
import { useViewContext } from "@app/front-kit";

import { UserFlowStorage } from "core/storages/user-flow";

export function useUserFlowLoading() {
  const { loadUserFlow } = useViewContext().containerInstance.get(UserFlowStorage);

  const [{ loading }, asyncLoadUserFlow] = useAsyncFn(loadUserFlow, [loadUserFlow], { loading: true });

  React.useEffect(() => void asyncLoadUserFlow(), [asyncLoadUserFlow]);

  return { loading };
}
