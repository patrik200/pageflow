import React from "react";
import { useViewContext } from "@app/front-kit";
import { useEventEmitter } from "@worksolutions/react-utils";

import { globalEventBus } from "core/eventBus";

import { ProfileStorage } from "core/storages/profile/profile";

export function useTokenForceRefreshGlobalEvent() {
  const { containerInstance } = useViewContext();

  const runRefreshLogic = React.useCallback(
    (callback: () => void) => void containerInstance.get(ProfileStorage).refreshToken().finally(callback),
    [containerInstance],
  );

  useEventEmitter(globalEventBus, "FORCE_REFRESH_TOKEN", runRefreshLogic);
}
