import {
  CanActivate,
  ExecutionContext,
  Injectable,
  SetMetadata,
  UseGuards,
  createParamDecorator,
} from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Socket } from "socket.io";
import { applyDecorators, matchStringsWithParams } from "@app/kit";
import { GatewayMetadata } from "@nestjs/websockets";
import { config } from "@app/core-config";

import { localhostCorsConfig } from "bootstrap/localhostCorsConfig";

@Injectable()
class WithSocketConnectionUrlGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext) {
    const handler = context.getHandler();
    const client = context.switchToWs().getClient() as Socket;
    const connectionUrl = client.handshake.query.connectionUrl as string;

    const matcher = this.reflector.get<ReturnType<typeof matchStringsWithParams>>("matchReference", handler);
    const urlParams = matcher.match(connectionUrl);
    if (!urlParams) return false;
    (client as any).connectionUrlParams = urlParams;
    return true;
  }
}

export function withSocketConnectionUrl(matchReference: string): MethodDecorator {
  return applyDecorators(
    SetMetadata("matchReference", matchStringsWithParams(matchReference)),
    UseGuards(WithSocketConnectionUrlGuard),
  );
}

export const withSocketConnectionUrlParams = createParamDecorator(async function (data: any, ctx: ExecutionContext) {
  const { connectionUrlParams } = ctx.switchToWs().getClient();
  return connectionUrlParams || {};
});

export function createWebSocketGatewayParams(namespace: string): GatewayMetadata {
  return {
    cors: config.productionEnv ? undefined : localhostCorsConfig,
    namespace,
    transports: ["websocket"],
  };
}
