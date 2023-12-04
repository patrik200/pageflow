import type { Sorting } from "@app/kit";

export function sortByExceptionalField<FIELD_NAMES extends string>(
  sorting: Sorting<FIELD_NAMES>,
  exceptionalField: string,
  sortFunctions: { asc: () => void; desc: () => void },
) {
  if (sorting === exceptionalField) {
    sortFunctions.asc();
    return;
  }

  if (sorting === "-" + exceptionalField) {
    sortFunctions.desc();
  }
}
