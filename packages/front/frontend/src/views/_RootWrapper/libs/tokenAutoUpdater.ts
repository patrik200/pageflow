import React from "react";
import { useTokenAutoUpdater as kitUseTokenAutoUpdater, useViewContext } from "@app/front-kit";

import { ProfileStorage } from "core/storages/profile/profile";

export function useTokenAutoUpdater() {
  const { containerInstance } = useViewContext();
  const { user, refreshToken } = containerInstance.get(ProfileStorage);

  kitUseTokenAutoUpdater(
    !!user,
    React.useCallback(() => refreshToken().then(() => undefined), [refreshToken]),
  );
}
