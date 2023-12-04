import {
  registerDecorator,
  ValidationOptions,
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { isString } from "@worksolutions/utils";

export function IsSorting(sortingKeys: string[], validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      constraints: [sortingKeys],
      options: validationOptions,
      validator: IsSortingValidator,
    });
  };
}

@ValidatorConstraint({ name: "IsSorting" })
class IsSortingValidator implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    const sortingNames: string[] = args.constraints[0];

    if (value === undefined) return true;

    if (!isString(value)) return false;

    if (sortingNames.includes(value[0] === "-" ? value.slice(1) : value)) return true;

    return false;
  }
}
