import {
  registerDecorator,
  ValidationOptions,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from "class-validator";

export function IsBuffer(validationOptions?: ValidationOptions) {
  return (object: any, propertyName: string) => {
    registerDecorator({
      target: object.constructor,
      propertyName,
      options: validationOptions,
      validator: IsBufferValidator,
    });
  };
}

@ValidatorConstraint({ name: "IsBuffer" })
class IsBufferValidator implements ValidatorConstraintInterface {
  validate(value: any) {
    return Buffer.isBuffer(value);
  }
}
