import { makeTransformableObject } from "@app/kit";
import type { INestApplication } from "@nestjs/common";
import {
  ArgumentsHost,
  CallHandler,
  Catch,
  ExceptionFilter,
  ExecutionContext,
  HttpException,
  Injectable,
  Logger,
  NestInterceptor,
  ValidationPipe,
} from "@nestjs/common";
import { classToPlain } from "class-transformer";
import { map } from "rxjs/operators";
import type { Response } from "express";
import { EntityNotFoundError } from "typeorm";

import { BaseControllerResponse, ServiceError } from "libs";

import { BaseExpressRequest } from "../../types";
import { SentryRequestService } from "../../modules/sentry";

export function initializeSerializers(app: INestApplication) {
  app.useGlobalPipes(new ClassValidatorPipe());
  app.useGlobalInterceptors(new SerializerResponseInterceptor());
  app.useGlobalFilters(new GlobalExceptionFilter(app));

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
  constructor(private app: INestApplication) {}

  private getSentry() {
    return this.app.resolve(SentryRequestService);
  }

  catch(exception: unknown, host: ArgumentsHost) {
    const http = host.switchToHttp();
    const request = http.getRequest<BaseExpressRequest<{ userId: string } | undefined>>();
    const response = http.getResponse<Response>();

    this.getSentry().then((sentry) => sentry.error(request, exception as Error));

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
