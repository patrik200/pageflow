import { isString } from "@worksolutions/utils";
import { matchStringsWithParams } from "@app/kit";

function isAllowedField<FIELD extends string>(field: FIELD, allowedFields: FIELD[]) {
  if (allowedFields.includes(field as FIELD)) return true;
  const convertedAllowedFields = allowedFields.map(matchStringsWithParams);
  return !!convertedAllowedFields.find((allowedField) => allowedField.match(field));
}

export function parseServerErrorMessages<FIELD extends string>(
  errors: string | false | { field: string; message: string }[],
  allowedFields: FIELD[],
  {
    unexpectedError,
    stringError,
    unknownFieldError,
    fieldError,
  }: {
    unexpectedError: () => void;
    stringError: (error: string) => void;
    unknownFieldError?: (message: string, field: string) => void;
    fieldError?: (field: FIELD, message: string) => void;
  },
  keysMatcher: Record<string, FIELD> = {},
) {
  if (errors === false) {
    unexpectedError();
    return;
  }

  if (isString(errors)) {
    stringError(errors);
    return;
  }

  const resultErrors: { field: FIELD; message: string }[] = [];

  for (const rawError of errors) {
    const error = { ...rawError, field: keysMatcher[rawError.field] || rawError.field };
    if (isAllowedField(error.field, allowedFields)) {
      resultErrors.push(error as { field: FIELD; message: string });
      continue;
    }

    if (unknownFieldError) unknownFieldError(error.message, error.field);
    if (stringError) stringError(error.message);
  }

  if (fieldError) {
    resultErrors.forEach(({ message, field }) => fieldError(field, message));
    return;
  }

  resultErrors.forEach(({ message, field }) => stringError(`[${field}]: ${message}`));
}
