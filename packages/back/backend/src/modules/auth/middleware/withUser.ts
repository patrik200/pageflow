import { createParamDecorator, ExecutionContext } from "@nestjs/common";
import { getRequestFromExecutionContext } from "@app/back-kit";

import { BaseExpressRequest } from "types/express";

export const withUserEntity = createParamDecorator(
  async (data: any, context: ExecutionContext) => getRequestFromExecutionContext<BaseExpressRequest>(context).user,
);
