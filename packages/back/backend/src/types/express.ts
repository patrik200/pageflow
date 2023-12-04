import type { BaseExpressRequest as BackKitBaseExpressRequest } from "@app/back-kit";
import { UserRole } from "@app/shared-enums";

export interface AuthUserEntity {
  userId: string;
  clientId: string;
  clientSubscriptionActive: boolean;
  role: UserRole;
  clientReadOnlyMode: boolean;
}

export type BaseExpressRequest = BackKitBaseExpressRequest<AuthUserEntity>;
