import { isString, isNil } from "@worksolutions/utils";

export function parseNum(num: any, ifNaN?: number) {
  const number = parseFloat(num);
  if (!isNaN(number)) return number;

  if (isNil(ifNaN)) throw new Error(`${num} is NaN and default value is not provider`);

  return ifNaN;
}

export function parseBool(bool: any, ifBadValue?: boolean) {
  if (!isString(bool) || !["true", "false"].includes(bool)) {
    if (isNil(ifBadValue)) throw new Error(`${bool} is incorrect value and default value is not provider`);
    return ifBadValue;
  }

  return bool === "true";
}
