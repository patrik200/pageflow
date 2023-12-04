import { isBoolean, isString, registerDecorator, ValidationArguments, ValidationOptions } from "class-validator";
import { isNumber } from "@worksolutions/utils";

function parseDays(days: any) {
  if (days === null) return null;
  if (isNumber(days)) return days;
  if (!isString(days)) throw new Error("Invalid date: " + days);
  if (days === "") return null;
  const daysNumber = parseInt(days);
  if (Number.isNaN(daysNumber)) throw new Error("Invalid date: " + days);
  return daysNumber;
}

export function ValidateBusiness_userFlow_deadlineDaysIncludeWeekends(validationOptions?: ValidationOptions) {
  return function (object: Object, propertyName: string) {
    registerDecorator({
      name: "ValidateBusiness_userFlow_deadlineDaysIncludeWeekends",
      target: object.constructor,
      propertyName: propertyName,
      options: validationOptions,
      validator: {
        validate(deadlineDaysIncludeWeekends: any, { object }: ValidationArguments) {
          if (!isBoolean(deadlineDaysIncludeWeekends))
            throw new TypeError(`Invalid "deadlineDaysIncludeWeekends": ${deadlineDaysIncludeWeekends}`);

          const deadlineDaysAmount = parseDays((object as Record<string, any>)["deadlineDaysAmount"]);
          return deadlineDaysAmount === null ? !deadlineDaysIncludeWeekends : true;
        },
      },
    });
  };
}
