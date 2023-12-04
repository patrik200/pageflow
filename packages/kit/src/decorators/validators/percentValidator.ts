import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { isFunction } from "@worksolutions/utils";

type AllowEmpty = boolean | ((entity: any) => boolean);

export function withPercentValidation(
  allowEmpty: AllowEmpty,
  validationOptions: ValidationOptions = { message: "Invalid" },
  max?: number,
) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [{ allowEmpty, max }],
      validator: PercentValidationConstraint,
    });
  };
}

@ValidatorConstraint({ name: "withPercentValidation" })
export class PercentValidationConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    const { allowEmpty, max = 100 } = args.constraints[0] as { allowEmpty: AllowEmpty; max?: number };
    if (value === "") return isFunction(allowEmpty) ? allowEmpty(args.object) : allowEmpty;
    const number = parseFloat(value);
    if (Number.isNaN(number)) return false;
    if (number < 0 || number > max) return false;
    return true;
  }
}
