import { Transform } from "class-transformer";
import { isNil } from "@worksolutions/utils";

function getValue(targetValue: any, defaultValue: any) {
  return isNil(targetValue) ? defaultValue : targetValue;
}

export function withDefaultValue(defaultValue: any): PropertyDecorator {
  return Transform((target) => getValue(target.value, defaultValue));
}

export function withDefaultValueFunc(getDefaultValue: () => any): PropertyDecorator {
  return Transform((target) => getValue(target.value, getDefaultValue()));
}
