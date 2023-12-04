import React from "react";
import { isArray, isDeepEqual, isNil } from "@worksolutions/utils";

import { useRouter } from "./useRouter";

export type QueryParameter = string | string[] | undefined;

export function prepareQueryParams(queryParams: Record<string, QueryParameter>) {
  const res: Record<string, string | undefined> = {};
  Object.keys(queryParams).forEach((key) => {
    const value = queryParams[key];
    if (isArray(value) || value === undefined) return;
    res[key] = value;
  });
  return res;
}

export function useQueryParams() {
  const { query: rawQuery, replace, push } = useRouter();
  const query = React.useMemo(() => prepareQueryParams(rawQuery), [rawQuery]);

  const setQueries = React.useCallback(
    (data: Record<any, string | number | undefined | null>, mode = "push") => {
      const filteredData = { ...query };
      Object.keys(data).forEach((key) => {
        if (isNil(data[key])) {
          delete filteredData[key];
          return;
        }
        filteredData[key] = data[key]!.toString();
      });
      if (isDeepEqual(query, filteredData)) return;
      (mode === "push" ? push.current : replace.current)({ query: filteredData }, { shallow: true });
    },
    [push, query, replace],
  );

  return [query, setQueries] as const;
}
