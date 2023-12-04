import { HttpException } from "@nestjs/common";

export class ServiceError extends Error {
  static throwFabric(code: string, message: string, httpStatus?: number) {
    return () => {
      throw new ServiceError(code, message, httpStatus);
    };
  }

  static isServiceError(arg: any): arg is ServiceError {
    return arg instanceof ServiceError;
  }

  constructor(public code: string, message: string, public httpStatus?: number) {
    super(message);
  }

  serializeToHttp(httpStatus = 400) {
    const statusCode = this.httpStatus ?? httpStatus;
    return new HttpException({ statusCode, message: [`${this.code};; ${this.message}`] }, statusCode);
  }
}
