import React from "react";
import { useRouter, useViewContext } from "@app/front-kit";

import { ClientCommonStorage } from "core/storages/client/client-common";
import { ProfileStorage } from "core/storages/profile/profile";

import { isAuthPageUrl } from "internal/isAuthPage";

export function useLoadClientNotifications() {
  const { containerInstance } = useViewContext();
  const { loadCurrentClientNotifications } = containerInstance.get(ClientCommonStorage);
  const { user } = containerInstance.get(ProfileStorage);
  const { pathname } = useRouter();
  React.useEffect(() => {
    if (!user) return;
    if (isAuthPageUrl(pathname)) return;
    void loadCurrentClientNotifications();
  }, [loadCurrentClientNotifications, pathname, user]);
}
