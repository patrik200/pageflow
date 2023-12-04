import chalk from "chalk";
import { validateSync, ValidationError } from "class-validator";

const CLASS_VALIDATOR_META_PROPERTY = "CLASS_VALIDATOR_META_PROPERTY";

export class PropertyClassValidationException extends Error {
  constructor(public error: ValidationError) {
    super(`${chalk.red("Property validation error: ")} ${chalk.redBright(error.toString(true))}`);
  }
}

export const withPropertyClassValidator: MethodDecorator = (target, propertyKey, descriptor) => {
  const classValidatorMetaProperty = Reflect.getMetadata(CLASS_VALIDATOR_META_PROPERTY, target, propertyKey) || [];
  const originalFunction = descriptor.value! as any;
  descriptor!.value = function (this: any, ...args: any[]) {
    const newArgs = [...args];
    classValidatorMetaProperty.forEach(({ ClassValidator, parameterIndex }: any) => {
      const resultArg = Object.assign(new ClassValidator(), newArgs[parameterIndex]);
      const errors = validateSync(resultArg);
      if (errors.length !== 0) throw new PropertyClassValidationException(errors[0]);
    });
    return originalFunction.apply(this, newArgs);
  } as any;
  return descriptor;
};

export const propertyClassValidator: ParameterDecorator = (target, propertyKey, parameterIndex) => {
  const classValidatorMetaProperty = Reflect.getMetadata(CLASS_VALIDATOR_META_PROPERTY, target, propertyKey) || [];
  const ClassValidator = Reflect.getMetadata("design:paramtypes", target, propertyKey)[parameterIndex];
  classValidatorMetaProperty.push({ ClassValidator, parameterIndex });
  Reflect.defineMetadata(CLASS_VALIDATOR_META_PROPERTY, classValidatorMetaProperty, target, propertyKey);
};
