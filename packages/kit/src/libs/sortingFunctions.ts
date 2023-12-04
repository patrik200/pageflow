import { set } from "mobx";

import { BaseEntity } from "entities/BaseEntity";

export function createSortingForFieldGetter<FIELD_NAMES extends string>(filter: BaseEntity) {
  return (field: FIELD_NAMES) => {
    if ((filter as any).sorting === field) return "ASC";
    if ((filter as any).sorting === "-" + field) return "DESC";
    return null;
  };
}

export function createSortingSetter<FIELD_NAMES extends string>(filter: BaseEntity) {
  return (field: FIELD_NAMES, value: "ASC" | "DESC" | null) => {
    if (value === "ASC") set(filter, { sorting: field });
    if (value === "DESC") set(filter, { sorting: "-" + field });
    if (value === null) set(filter, { sorting: undefined });
  };
}
