import { ServiceError } from "@app/back-kit";
import { PermissionRole, UserRole } from "@app/shared-enums";
import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Transactional } from "typeorm-transactional";

import { PermissionEntity } from "entities/Permission";

import { getCurrentUser } from "modules/auth";

import { PermissionIdentifier } from "./access";

@Injectable()
export class DeletePermissionService {
  constructor(@InjectRepository(PermissionEntity) private permissionRepository: Repository<PermissionEntity>) {}

  @Transactional()
  async deletePermissionOrFail(identifier: PermissionIdentifier & { userId: string }) {
    const currentUser = getCurrentUser();
    const deletablePermission = await this.permissionRepository.findOne({
      where: {
        entityType: identifier.entityType,
        entityId: identifier.entityId,
        user: { id: identifier.userId },
        client: { id: currentUser.clientId },
      },
    });

    await this.validateToDeleteOnePermission(identifier, deletablePermission);

    await this.permissionRepository.delete({
      entityId: identifier.entityId,
      entityType: identifier.entityType,
      user: { id: identifier.userId },
      client: { id: currentUser.clientId },
    });
  }

  @Transactional()
  async deleteAllPermissionsOrFail(identifier: PermissionIdentifier) {
    await this.permissionRepository.delete({
      entityId: identifier.entityId,
      entityType: identifier.entityType,
      client: { id: getCurrentUser().clientId },
    });
  }

  private async validateToDeleteOnePermission(
    identifier: PermissionIdentifier,
    deletablePermission: PermissionEntity | null,
  ) {
    const currentUser = getCurrentUser();

    if (currentUser.role === UserRole.ADMIN) return;

    if (!deletablePermission) throw new ServiceError("permission", "У вас недостаточно прав для удаления роли");

    if (deletablePermission.role === PermissionRole.OWNER)
      throw new ServiceError("permission", "Невозможно удалить владельца");

    const currentUserPermission = await this.permissionRepository.findOneOrFail({
      where: {
        entityType: identifier.entityType,
        entityId: identifier.entityId,
        user: { id: currentUser.userId },
      },
      relations: { user: true },
    });

    if (deletablePermission.role === PermissionRole.EDITOR) {
      if (currentUserPermission.role === PermissionRole.OWNER) return;
      if (currentUserPermission.role === PermissionRole.EDITOR && currentUserPermission.canEditEditorPermissions)
        return;
      throw new ServiceError("permission", "У вас недостаточно прав для удаления роли");
    }

    if (deletablePermission.role === PermissionRole.READER) {
      if ([PermissionRole.OWNER, PermissionRole.EDITOR].includes(currentUserPermission.role)) return;
      if (currentUserPermission.role === PermissionRole.READER) {
        if (currentUserPermission.canEditReaderPermissions) return;
        if (currentUserPermission.user.id === currentUser.userId) return;
      }
      throw new ServiceError("permission", "У вас недостаточно прав для удаления роли");
    }
  }
}
