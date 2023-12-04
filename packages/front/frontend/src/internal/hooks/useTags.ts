import React from "react";
import { useRouter } from "@app/front-kit";
import { useSyncToRef } from "@worksolutions/react-utils";

export function useTabs<TABS extends string>(initialTab: TABS) {
  const { push, query } = useRouter();
  const queryRef = useSyncToRef(query);

  const { tab = initialTab } = query as { tab: TABS };

  const setTab = React.useCallback(
    (tab: TABS) => push.current({ query: { ...queryRef.current, tab } }, { shallow: true }),
    [push, queryRef],
  );

  return { tab, setTab };
}
