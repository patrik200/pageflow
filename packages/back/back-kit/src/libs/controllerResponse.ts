import { Constructable } from "typedi";
import { validateSync, ValidationError } from "class-validator";
import { baseEntityCommonPlainObjectOptions, makeTransformableObject, PaginatedFindResult } from "@app/kit";
import { classToPlain } from "class-transformer";
import { HttpException, HttpStatus, Logger } from "@nestjs/common";
import chalk from "chalk";

export class BaseControllerResponse {
  static isControllerResponse(arg: any): arg is BaseControllerResponse {
    return arg instanceof BaseControllerResponse;
  }

  constructor(private Serializer: Constructable<{}>) {}

  protected createSerializer(data: Object) {
    const serializer = makeTransformableObject(this.Serializer, () => data);
    const errors = validateSync(serializer);
    return { serializer, errors };
  }

  protected get name() {
    return this.Serializer.name;
  }

  protected toPlainObject(serializer: Object) {
    return classToPlain(serializer, baseEntityCommonPlainObjectOptions);
  }

  protected beautifyErrors(errors: ValidationError[]) {
    return chalk.whiteBright(JSON.stringify(errors, null, 2));
  }

  response() {
    throw new Error("Method not implemented");
  }
}

export class ControllerResponse extends BaseControllerResponse {
  constructor(Serializer: Constructable<{}>, private result: Object) {
    super(Serializer);
  }

  response() {
    const { serializer, errors } = this.createSerializer(this.result);
    if (errors.length === 0) return this.toPlainObject(serializer);
    Logger.log(
      `Bad serialize {${this.name}}: ${chalk.whiteBright(this.beautifyErrors(errors))}`,
      "Controller serialization",
    );
    throw new HttpException("Invalid server response", HttpStatus.INTERNAL_SERVER_ERROR);
  }
}

export class ControllerPaginatedResponse extends BaseControllerResponse {
  constructor(Serializer: Constructable<{}>, private paginatedResult: PaginatedFindResult<Object>) {
    super(Serializer);
  }

  response() {
    return {
      items: this.paginatedResult.items.map((item, index) => {
        const { serializer, errors } = this.createSerializer(item);
        if (errors.length === 0) return this.toPlainObject(serializer);
        Logger.log(
          `Bad serialize {${this.name}}: index №[${index}]: ${this.beautifyErrors(errors)}`,
          "Controller serialization",
        );
        throw new HttpException("Invalid server response", HttpStatus.INTERNAL_SERVER_ERROR);
      }),
      pagination: this.paginatedResult.pagination.plainObject,
    };
  }
}
