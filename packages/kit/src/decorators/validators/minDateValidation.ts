import {
  registerDecorator,
  ValidationArguments,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";
import { is } from "@worksolutions/utils";

export function MinDateValidation(property: string, validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      constraints: [property],
      validator: MinDateValidationConstraint,
    });
  };
}

@ValidatorConstraint({ name: "minDateValidationConstraint" })
export class MinDateValidationConstraint implements ValidatorConstraintInterface {
  validate(value: any, args: ValidationArguments) {
    if (!is(Date, value)) return true;

    const [minimalPropertyName] = args.constraints;
    const minimalValue = (args.object as any)[minimalPropertyName];
    if (!is(Date, minimalValue)) return true;

    return +(minimalValue as Date) <= +(value as Date);
  }
}
