import React from "react";
import { isArray } from "@worksolutions/utils";

import { QueryParameter, useQueryParams } from "./useQueryParams";

export function parsePage(pageString: QueryParameter) {
  if (isArray(pageString)) return 1;
  const parsedPage = parseFloat(pageString || "");
  return isNaN(parsedPage) ? 1 : parsedPage;
}

export function usePageQuery(paramName = "page") {
  const [{ [paramName]: pageString }, setQuery] = useQueryParams();
  const page = React.useMemo(() => parsePage(pageString), [pageString]);
  const setPage = React.useCallback(
    (page: number) => setQuery({ [paramName]: preparePageNumberToUrl(page) }),
    [paramName, setQuery],
  );
  return [page, setPage] as const;
}

export function preparePageNumberToUrl(page: number) {
  return page === 1 ? undefined : page.toString();
}
