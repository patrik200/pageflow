import { ArgumentsHost, ExecutionContext } from "@nestjs/common";

import { BaseExpressRequest } from "../types";

export function getRequestFromExecutionContext<RESPONSE_EXPRESS_REQUEST extends BaseExpressRequest<unknown>>(
  context: ExecutionContext | ArgumentsHost,
): RESPONSE_EXPRESS_REQUEST {
  return context.getType() === "http" ? context.switchToHttp().getRequest() : context.switchToWs().getClient();
}
