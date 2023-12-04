import type { Sorting } from "@app/kit";
import type { SortOptions } from "@elastic/elasticsearch/lib/api/types";

import { TrimDash } from "types";

function getOrderAndField<FIELD_NAMES extends string>(sorting: Sorting<FIELD_NAMES>) {
  if (!sorting) return undefined;
  const order = sorting[0] === "-" ? "desc" : "asc";
  const field = (sorting[0] === "-" ? sorting.slice(1) : sorting) as TrimDash<FIELD_NAMES>;
  return { order, field } as const;
}

export function convertSortingToTypeOrm<FIELD_NAMES extends string>(
  sorting: Sorting<FIELD_NAMES>,
  mapSortingToSubField: Partial<Record<TrimDash<FIELD_NAMES>, string>> = {},
  exceptionalFields?: string[],
) {
  const valueAndField = getOrderAndField(sorting);
  if (!valueAndField) return undefined;
  const { order, field } = valueAndField;

  if (exceptionalFields?.includes(field)) return undefined;
  if (mapSortingToSubField[field]) return { [field]: { [mapSortingToSubField[field]!]: order } };
  return { [field]: order };
}

export function convertSortingToElasticSearch<FIELD_NAMES extends string>(
  sorting: Sorting<FIELD_NAMES>,
  exceptionalFields?: string[],
): SortOptions | undefined {
  const valueAndField = getOrderAndField(sorting);
  if (!valueAndField) return undefined;
  const { order, field } = valueAndField;

  if (exceptionalFields?.includes(field)) return undefined;
  return { [field]: { order } };
}
