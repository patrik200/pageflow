import { ValidationArguments } from "class-validator";
import { isString, isNil } from "@worksolutions/utils";

export function createClassValidatorErrorMessage({
  code,
  message = "Invalid value",
}: { code?: number | string; message?: string | ((validationArguments: ValidationArguments) => string) } = {}) {
  return function (validationArguments: ValidationArguments) {
    const resultMessage = isString(message) ? message : message(validationArguments);
    if (isNil(code)) return `${validationArguments.property};; ${resultMessage}`;
    return `${code};; ${resultMessage}`;
  };
}
