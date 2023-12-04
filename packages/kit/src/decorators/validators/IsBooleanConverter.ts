import { Transform } from "class-transformer";
import { isBoolean, isString } from "class-validator";

export function IsBooleanConverter() {
  return Transform(
    ({ value }) => {
      if (isBoolean(value)) return value;
      if (isString(value) && ["true", "false"].includes(value)) return value === "true";
      return parseInt(value) === 1;
    },
    { toClassOnly: true },
  );
}
