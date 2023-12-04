import React from "react";
import { preventDefaultAndStopPropagationHandler, useMemoizeCallback } from "@worksolutions/react-utils";
import { identity } from "@worksolutions/utils";

import { calculatePagination } from "./libs";
import { controlKeyIsPressed } from "./libs/libs";

export interface UsePaginationInterface {
  currentPage: number;
  maxPages: number;
  onChange: (page: number) => void;
  maxLinksCount?: number;
}

const MIN_LINKS_COUNT = 3;

export function usePagination({ currentPage, maxPages, maxLinksCount = 8, onChange }: UsePaginationInterface) {
  const pagesArray = React.useMemo(
    () => calculatePagination(maxPages, currentPage, Math.max(maxLinksCount, MIN_LINKS_COUNT)),
    [currentPage, maxLinksCount, maxPages],
  );

  const handleClickFabric = useMemoizeCallback(
    (page: number) => (ev: React.MouseEvent) => {
      if (currentPage === page) {
        preventDefaultAndStopPropagationHandler(ev);
        return;
      }
      if (controlKeyIsPressed(ev)) return;
      preventDefaultAndStopPropagationHandler(ev);
      onChange(page);
    },
    [currentPage, onChange],
    identity,
  );

  const canGoLeft = currentPage !== 1;
  const canGoRight = currentPage !== maxPages;

  return { pagesArray, handleClickFabric, canGoLeft, canGoRight };
}
