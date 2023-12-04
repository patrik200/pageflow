import { makeTransformableObject } from "@app/kit";
import {
  ArgumentsHost,
  CallHandler,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  INestApplication,
  Injectable,
  Logger,
  NestInterceptor,
  ValidationPipe,
} from "@nestjs/common";
import { classToPlain } from "class-transformer";
import { map } from "rxjs/operators";
import type { Response } from "express";
import { EntityNotFoundError } from "typeorm";
import { config } from "@app/core-config";

import { BaseControllerResponse, ServiceError } from "libs";

export function initializeSerializers(app: INestApplication) {
  app.useGlobalPipes(new ClassValidatorPipe());
  app.useGlobalInterceptors(new SerializerResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter());

  Logger.log("Serializers initialized", "Bootstrap");
}

@Injectable()
class ClassValidatorPipe extends ValidationPipe {
  constructor() {
    super({
      transform: true,
      transformerPackage: {
        classToPlain,
        plainToClass: (Class: any, plain: any) => makeTransformableObject(Class, () => plain),
      },
    });
  }
}

@Injectable()
class SerializerResponseInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler) {
    return next.handle().pipe(
      map((response) => {
        if (BaseControllerResponse.isControllerResponse(response)) return response.response();
        return response;
      }),
    );
  }
}

@Catch()
class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const response = host.switchToHttp().getResponse<Response>();
    if (!config.productionEnv) console.log(exception);

    if (ServiceError.isServiceError(exception)) {
      const serializedException = exception.serializeToHttp();
      response.status(serializedException.getStatus()).json(serializedException.getResponse());
      return;
    }

    if (exception instanceof EntityNotFoundError) {
      response.status(404).json({ status: 404, message: "Не найдено" });
      return;
    }

    if (exception instanceof HttpException) {
      response.status(exception.getStatus()).json(exception.getResponse());
      return;
    }

    response.status(500).json({ statusCode: 500, message: "Internal server error" });
  }
}
