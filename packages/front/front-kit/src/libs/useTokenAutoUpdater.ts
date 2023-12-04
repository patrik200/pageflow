import React from "react";
import Cookies from "js-cookie";
import { DateTime } from "luxon";
import { setAsyncInterval } from "@worksolutions/utils";

import { fastAccessJWTParse } from "./fastAccessJWTParse";

export function useTokenAutoUpdater(enabled: boolean, refresh: () => Promise<void>) {
  React.useEffect(() => {
    if (!enabled) return;
    const token = Cookies.get("token_proxy");
    if (!token) return;
    const parsedToken = fastAccessJWTParse(token);
    if (!parsedToken) return;

    const expirationDateTime = DateTime.fromMillis(parsedToken.expirationAt).minus({ minute: 2 });
    const createdAtDateTime = DateTime.fromMillis(parsedToken.createdAt);

    const localAndExpireDeltaMS = expirationDateTime.diff(DateTime.local(), "milliseconds").milliseconds;
    const tokenAliveMS = expirationDateTime.diff(createdAtDateTime, "milliseconds").milliseconds;
    let disposeEachRefreshTokenTimer: (() => void) | undefined = undefined;

    const firstRefreshTokenTimeout = setTimeout(() => {
      void refresh();

      disposeEachRefreshTokenTimer = setAsyncInterval(() => refresh(), Math.min(100000000, tokenAliveMS));
    }, Math.min(100000000, localAndExpireDeltaMS));

    return () => {
      clearTimeout(firstRefreshTokenTimeout);
      disposeEachRefreshTokenTimer?.();
    };
  }, [enabled, refresh]);
}
