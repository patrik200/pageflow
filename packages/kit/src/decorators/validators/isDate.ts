import { Transform } from "class-transformer";
import { isDateString, isNumberString } from "class-validator";

import { applyDecorators } from "libs/applyDecorators";

export function IsDate() {
  return applyDecorators(
    Transform(
      (params) => {
        if (params.value === undefined) return null;
        if (params.value === null) return null;
        if (params.value instanceof Date) return params.value;
        if (isNumberString(params.value)) return new Date(parseInt(params.value));
        if (isDateString(params.value)) return new Date(params.value);
        return null;
      },
      { toClassOnly: true },
    ),
    Transform(
      (params) => {
        if (params.value === undefined) return null;
        if (params.value === null) return null;
        if (params.value instanceof Date) return params.value.toISOString();
        return null;
      },
      { toPlainOnly: true },
    ),
  );
}
