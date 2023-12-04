import { isArray } from "@worksolutions/utils";
import { AppRequestError } from "@app/kit";

type ResultErrorsType = string[];

const errorKeyAndValueSeparator = ";; ";

export function parseServerErrorCodeAndMessages(errors: ResultErrorsType, keysMatcher: Record<string, string> = {}) {
  const results: { field: string; message: string }[] = [];

  function parseMessageAndAddResult(error: string) {
    const [field, message] = error.split(errorKeyAndValueSeparator);
    if (!message) return;
    results.push({ field: keysMatcher[field] || field, message });
  }

  errors.forEach(parseMessageAndAddResult);
  if (Object.keys(results).length === 0) return false;
  return results;
}

export function parseServerError(rawError: any, keysMatcher: Record<string, string> = {}) {
  if (!AppRequestError.isRequestError(rawError)) return false;
  const serverErrors = rawError.data.response?.data?.message;
  if (!serverErrors) return false;
  const resultError: ResultErrorsType | undefined = isArray(serverErrors) ? serverErrors : undefined;
  if (!resultError) return false;
  return parseServerErrorCodeAndMessages(resultError, keysMatcher);
}

export type ParseServerErrorResult = ReturnType<typeof parseServerError>;

export function isParseServerErrorResult(arg: any): arg is ParseServerErrorResult {
  if (arg === false) return true;
  if (isArray(arg)) return true;
  return false;
}
