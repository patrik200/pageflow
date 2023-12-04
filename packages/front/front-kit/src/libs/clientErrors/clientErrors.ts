import type { TranslationQuery } from "next-translate";

import type { TranslationKey } from "nextjs/translations";

const STATIC_AND_DYNAMIC_TEXT_SEPARATOR = "|";
const DIFFERENT_DYNAMIC_FIELDS_SEPARATOR = ";;";

const allAvailableCommonValidation = new Set<string>();

export function getErrorMessageWithCommonIntl(
  error: string | undefined,
  t: (translationKey: TranslationKey, translationQuery?: TranslationQuery | undefined) => string,
) {
  if (!error) return undefined;

  const [errorName, payloadKeyValueStrings] = error.split(STATIC_AND_DYNAMIC_TEXT_SEPARATOR);
  if (!allAvailableCommonValidation.has(errorName)) return errorName;
  if (!payloadKeyValueStrings) return t({ scope: "common:validator", name: errorName });

  const payload: Record<string, string | number> = {};
  payloadKeyValueStrings.split(DIFFERENT_DYNAMIC_FIELDS_SEPARATOR).forEach((payloadKeyValueString) => {
    const [key, value] = payloadKeyValueString.split(":");
    payload[key] = value;
  });

  return t({ scope: "common:validator", name: errorName }, payload);
}

export function createCustomValidationError(name: string, errorArguments: string[] = []) {
  allAvailableCommonValidation.add(name);
  if (arguments.length === 0) return name;
  return `${name}${STATIC_AND_DYNAMIC_TEXT_SEPARATOR}${errorArguments.join(DIFFERENT_DYNAMIC_FIELDS_SEPARATOR)}`;
}

export function replaceDynamicFieldsInCustomValidationError(
  validation: string,
  fields: Record<string, string | number>,
) {
  const [errorMessage, dynamicFieldsString] = validation.split(STATIC_AND_DYNAMIC_TEXT_SEPARATOR);
  if (!dynamicFieldsString) return errorMessage;
  let result = errorMessage + STATIC_AND_DYNAMIC_TEXT_SEPARATOR;
  result += dynamicFieldsString
    .split(DIFFERENT_DYNAMIC_FIELDS_SEPARATOR)
    .map((dynamicFieldString) => dynamicFieldString + ":" + (fields[dynamicFieldString] || ""))
    .join(DIFFERENT_DYNAMIC_FIELDS_SEPARATOR);
  return result;
}
