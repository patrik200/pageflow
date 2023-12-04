import React from "react";
import { SelectFieldOption } from "@app/ui-kit";
import { useRouter, useViewContext } from "@app/front-kit";
import { useObservableAsDeferredMemo, useSyncToRef } from "@worksolutions/react-utils";
import { useEffectOnce, useLocalStorage } from "react-use";

import { PrivateIndicatorForSelect } from "components/PrivateIndicator";

import { TicketBoardsStorage } from "core/storages/ticket/boards";

export function useBoardSelectOptions() {
  const { boards } = useViewContext().containerInstance.get(TicketBoardsStorage);

  return useObservableAsDeferredMemo(
    (boards): SelectFieldOption<string | null>[] => [
      ...boards.map((board) => ({
        value: board.id,
        label: board.name,
        leftLayout: board.isPrivate ? <PrivateIndicatorForSelect /> : undefined,
      })),
    ],
    [],
    boards,
  );
}

export function useCurrentBoardId(localStoragePrefix: string, boardSelectOptions: SelectFieldOption<string | null>[]) {
  const { query, push } = useRouter();
  const queryRef = useSyncToRef(query);

  const boardQuery = query.board as string | undefined;
  const [boardLS, setBoardLS] = useLocalStorage<string>(localStoragePrefix + "_selected_ticket_board");

  const handleChangeBoard = React.useCallback(
    (board: string | null) => {
      setBoardLS(board!);
      push.current({ query: { ...queryRef.current, board: board! } }, { shallow: true });
    },
    [push, queryRef, setBoardLS],
  );

  const boardFromAnyStorage = boardQuery || boardLS;

  const board = React.useMemo(() => {
    if (boardFromAnyStorage)
      if (boardSelectOptions.some((board) => board.value === boardFromAnyStorage)) return boardFromAnyStorage;
    return boardSelectOptions[0]?.value ?? null;
  }, [boardFromAnyStorage, boardSelectOptions]);

  useEffectOnce(() => {
    if (boardQuery) {
      if (boardQuery !== boardLS && board) setBoardLS(board);
      return;
    }
    if (!board) return;
    handleChangeBoard(board);
  });

  return [board, handleChangeBoard] as const;
}
