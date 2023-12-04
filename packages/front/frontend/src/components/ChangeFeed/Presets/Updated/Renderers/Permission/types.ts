import { PermissionRole } from "@app/shared-enums";

export interface PermissionRendererUser {
  role: PermissionRole;
  canEditEditorPermissions?: boolean | null;
  canEditReaderPermissions?: boolean | null;
}

export interface PermissionRendererValue {
  userId: string;
  from: PermissionRendererUser | null;
  to: PermissionRendererUser | null;
}
