import { CanActivate, ExecutionContext, Injectable, SetMetadata, UseGuards } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { AuthGuard } from "@nestjs/passport";
import { getRequestFromExecutionContext } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";
import { applyDecorators } from "@app/kit";

import { BaseExpressRequest } from "types/express";

import { currentUserStorage } from "../asyncLocalStorage";

@Injectable()
class WithAuthorizedGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  private getRoles(context: ExecutionContext) {
    return [...this.reflector.get<UserRole[]>("roles", context.getHandler()), UserRole.ADMIN];
  }

  async canActivate(context: ExecutionContext) {
    const request = getRequestFromExecutionContext<BaseExpressRequest>(context);

    if (!this.getRoles(context).includes(request.user.role)) return false;

    const processAsGet = this.reflector.get<boolean>("processAsGet", context.getHandler());

    if (!request.user.clientSubscriptionActive) {
      if (request.method !== "GET" && !processAsGet) return false;
    }

    if (request.user.clientReadOnlyMode) {
      if (request.method !== "GET" && !processAsGet) return false;
    }

    const userStore = currentUserStorage.getStore();
    if (userStore) {
      userStore.userId = request.user.userId;
      userStore.role = request.user.role;
      userStore.clientId = request.user.clientId;
      userStore.clientSubscriptionActive = request.user.clientSubscriptionActive;
      userStore.clientReadOnlyMode = request.user.clientReadOnlyMode;
    }

    return true;
  }
}

export function withUserAuthorized(roles: UserRole[], options?: { processAsGet?: boolean }): MethodDecorator {
  const guards = UseGuards(AuthGuard("jwt"), WithAuthorizedGuard);
  return applyDecorators(
    SetMetadata("roles", roles),
    SetMetadata("processAsGet", options?.processAsGet ?? false),
    guards,
  );
}
