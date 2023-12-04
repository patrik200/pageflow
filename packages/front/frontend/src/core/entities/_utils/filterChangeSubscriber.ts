import { BaseEntity } from "@app/kit";

export function filterChangeSubscriber(
  fields: {
    checkboxes?: string[];
    search?: string[];
    parent?: string[];
    selects?: string[];
    attributes?: string[];
    sorting?: string;
  },
  entity: BaseEntity,
  callback: () => void,
) {
  const disposeCheckboxes = fields.checkboxes
    ? entity.registerCustomOnMultipleFieldChangeCallback(callback, fields.checkboxes, 100)
    : null;
  const disposeSearch = fields.search
    ? entity.registerCustomOnMultipleFieldChangeCallback(callback, fields.search, 500)
    : null;
  const disposeParent = fields.parent
    ? entity.registerCustomOnMultipleFieldChangeCallback(callback, fields.parent, 30)
    : null;
  const disposeSelects = fields.selects
    ? entity.registerCustomOnMultipleFieldChangeCallback(callback, fields.selects, 30)
    : null;
  const disposeAttributes = fields.attributes
    ? entity.registerCustomOnMultipleFieldChangeCallback(callback, fields.attributes, 30, false, true)
    : null;
  const disposeSorting = fields.sorting
    ? entity.registerCustomOnFieldChangeCallback(callback, fields.sorting, 30)
    : null;

  return function () {
    disposeCheckboxes?.();
    disposeSearch?.();
    disposeParent?.();
    disposeSelects?.();
    disposeAttributes?.();
    disposeSorting?.();
  };
}
