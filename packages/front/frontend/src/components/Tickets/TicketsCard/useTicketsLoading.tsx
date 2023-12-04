import React from "react";
import { useAsyncFn, useInfinityScroll } from "@worksolutions/react-utils";
import { useViewContext } from "@app/front-kit";

import { TicketsStorage } from "core/storages/ticket";

function useLoadKanban(isEnabled: boolean) {
  const { loadTicketsAsKanban, filter } = useViewContext().containerInstance.get(TicketsStorage);

  const [{ loading }, asyncLoadTickets] = useAsyncFn(loadTicketsAsKanban, [loadTicketsAsKanban]);

  React.useEffect(() => {
    if (!isEnabled) return;

    asyncLoadTickets(filter);
    return filter.subscribeOnChange(() => asyncLoadTickets(filter));
  }, [isEnabled, asyncLoadTickets, filter]);

  return { loading };
}

function useLoadList(isEnabled: boolean) {
  const { loadTicketsAsListPage, ticketsList, filter } = useViewContext().containerInstance.get(TicketsStorage);

  const [{ loading }, asyncLoadTickets] = useAsyncFn(loadTicketsAsListPage, [loadTicketsAsListPage]);

  const [, setPage] = React.useState(1);

  const handleLoadTickets = React.useCallback(
    async (page?: number) => {
      if (page === undefined) {
        setPage((page) => {
          const nextPage = page + 1;
          asyncLoadTickets(filter, nextPage);
          return nextPage;
        });
        return;
      }
      setPage(page);
      await asyncLoadTickets(filter, page);
    },
    [asyncLoadTickets, filter],
  );

  React.useEffect(() => {
    if (!isEnabled) return;
    handleLoadTickets(1);
    return filter.subscribeOnChange(() => handleLoadTickets(1));
  }, [filter, handleLoadTickets, isEnabled]);

  const handleInitInfinityScroll = useInfinityScroll({
    loading,
    hasNextPage: isEnabled && ticketsList.pagination.canGetMore,
    onLoadMore: handleLoadTickets,
  });

  React.useEffect(() => {
    if (!isEnabled) return;

    return handleInitInfinityScroll(window);
  }, [isEnabled, handleInitInfinityScroll]);

  return { loading };
}

export function useTicketsLoading() {
  const { presentationType } = useViewContext().containerInstance.get(TicketsStorage).filter;
  const { loading: loadingKanban } = useLoadKanban(presentationType === "kanban");
  const { loading: loadingList } = useLoadList(presentationType === "list");
  return { loading: loadingKanban || loadingList };
}
