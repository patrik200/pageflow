import { ServiceError, TypeormUpdateEntity } from "@app/back-kit";
import { PermissionRole, UserRole } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { PermissionEntity } from "entities/Permission";

import { getCurrentUser } from "modules/auth";

import { PermissionIdentifier } from "./access";

export interface EditPermissionInterface {
  role?: PermissionRole;
  canEditEditorPermissions?: boolean;
  canEditReaderPermissions?: boolean;
}

@Injectable()
export class EditPermissionService {
  constructor(@InjectRepository(PermissionEntity) private permissionRepository: Repository<PermissionEntity>) {}

  @Transactional()
  async editPermissionOrFail(identifier: PermissionIdentifier & { userId: string }, data: EditPermissionInterface) {
    const [currentUserPermission, permissionToEdit] = await Promise.all([
      this.permissionRepository.findOne({
        where: {
          entityType: identifier.entityType,
          entityId: identifier.entityId,
          user: { id: getCurrentUser().userId },
        },
      }),
      this.permissionRepository.findOneOrFail({
        where: { entityType: identifier.entityType, entityId: identifier.entityId, user: { id: identifier.userId } },
      }),
    ]);

    this.validateToEditPermission(currentUserPermission, permissionToEdit, data);

    const updateOptions: TypeormUpdateEntity<PermissionEntity> = {};

    if (data.role) updateOptions.role = data.role;

    Object.assign(updateOptions, this.getPermissionModifiers(data));

    await this.permissionRepository.update({ id: permissionToEdit.id }, updateOptions);
  }

  private getPermissionModifiers({
    role,
    canEditReaderPermissions,
    canEditEditorPermissions,
  }: EditPermissionInterface) {
    if (role === PermissionRole.OWNER) return { canEditEditorPermissions: null, canEditReaderPermissions: null };

    if (role === PermissionRole.EDITOR)
      return {
        canEditEditorPermissions: canEditEditorPermissions === undefined ? undefined : canEditEditorPermissions,
        canEditReaderPermissions: null,
      };

    if (role === PermissionRole.READER)
      return {
        canEditReaderPermissions: canEditReaderPermissions === undefined ? undefined : canEditReaderPermissions,
        canEditEditorPermissions: null,
      };

    throw new Error("Unknown state");
  }

  private validateToEditPermission(
    currentUserPermission: PermissionEntity | null,
    permissionToEdit: PermissionEntity,
    newPermission: EditPermissionInterface,
  ) {
    if (getCurrentUser().role === UserRole.ADMIN) return;
    if (!currentUserPermission) throw new ServiceError("permission", "Нет доступа");

    if (permissionToEdit.role === PermissionRole.OWNER)
      throw new ServiceError("permission", "Невозможно изменить роль владельца");

    if (newPermission.role === PermissionRole.OWNER)
      throw new ServiceError("permission", "Невозможно выдать роль владельца");

    if (currentUserPermission.role === PermissionRole.OWNER) return;

    if (newPermission.role === PermissionRole.EDITOR) {
      if (currentUserPermission.role === PermissionRole.EDITOR && currentUserPermission.canEditEditorPermissions)
        return;
      throw new ServiceError("permission", "У вас недостаточно прав для выдачи роли");
    }

    if (newPermission.role === PermissionRole.READER) {
      if (currentUserPermission.role === PermissionRole.EDITOR) return;

      if (currentUserPermission.role === PermissionRole.READER && currentUserPermission.canEditReaderPermissions)
        return;
    }
  }
}
